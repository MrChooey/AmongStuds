import { Link } from "react-router-dom";
import {
	doc,
	updateDoc,
	increment,
	runTransaction,
	deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";

export default function PostCard({ post, disableLink = false, userRole = 0 }) {
	const shortId = post.user_id?.slice(0, 6) || "Anon";

	const ts = post.createdAt;
	const date = ts ? ts.toDate() : null;

	// Format date
	const formattedDate = date
		? date.toLocaleString(undefined, {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
		  })
		: "";

	// Handle like/dislike
	const handleLike = async (e) => {
		e.stopPropagation();
		e.preventDefault();

		const userId = auth.currentUser?.uid;
		if (!userId) return;

		const postRef = doc(db, "posts", post.id);

		await runTransaction(db, async (tx) => {
			const snap = await tx.get(postRef);
			const data = snap.data();
			const likers = data.likers || {};
			const dislikers = data.dislikers || {};

			const updates = {};

			const alreadyLiked = !!likers[userId];
			const alreadyDisliked = !!dislikers[userId];

			if (alreadyLiked) {
				// Unlike
				updates[`likers.${userId}`] = false;
				updates.likes = increment(-1);
			} else {
				// Like
				updates[`likers.${userId}`] = true;
				updates.likes = increment(1);

				if (alreadyDisliked) {
					updates[`dislikers.${userId}`] = false;
				}
			}

			tx.update(postRef, updates);
		});
	};

	const handleDislike = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		const userId = auth.currentUser?.uid;
		if (!userId) return;

		const postRef = doc(db, "posts", post.id);

		await runTransaction(db, async (tx) => {
			const snap = await tx.get(postRef);
			const data = snap.data();
			const dislikers = data.dislikers || {};
			const likers = data.likers || {};

			const alreadyDisliked = !!dislikers[userId];
			const alreadyLiked = !!likers[userId];

			const updates = {};

			if (alreadyDisliked) {
				// Undo dislike
				updates[`dislikers.${userId}`] = false;
			} else {
				// Add dislike
				updates[`dislikers.${userId}`] = true;

				// Also undo like
				if (alreadyLiked) {
					updates[`likers.${userId}`] = false;
					updates.likes = increment(-1);
				}
			}

			if (Object.keys(updates).length > 0) {
				tx.update(postRef, updates);
			}
		});
	};

	const handleReport = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		const userId = auth.currentUser?.uid;
		if (!userId) return;

		const postRef = doc(db, "posts", post.id);
		await updateDoc(postRef, {
			[`reporters.${userId}`]: true,
		});
		alert("Post reported. Thank you!");
	};

	const handleDelete = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		const confirmDelete = window.confirm(
			"Are you sure you want to delete this post?"
		);
		if (!confirmDelete) return;

		try {
			await deleteDoc(doc(db, "posts", post.id));
			console.log("Post deleted successfully.");
		} catch (err) {
			console.error("Failed to delete post:", err);
		}
	};

	const userId = auth.currentUser?.uid;
	const liked = !!(post.likers && userId && post.likers[userId]);
	const disliked = !!(post.dislikers && userId && post.dislikers[userId]);
	const isAdmin = userRole === 1;
	const canDelete = isAdmin;

	const CardContent = (
		<div className="bg-[#262d34] p-5 rounded shadow-md">
			<div className="text-sm text-gray-400 mb-2">
				Anonymous {shortId} &nbsp;&nbsp;&nbsp;&nbsp; {formattedDate}
			</div>

			<h3 className="text-lg font-semibold text-white mb-2">
				{post.title}
			</h3>

			<div className="flex gap-2 mb-2">
				{post.tags?.map((tag, i) => (
					<span
						key={i}
						className="bg-[#2c353d] text-[#c5d0e6] text-sm px-2 py-1 rounded-full"
					>
						{tag}
					</span>
				))}
			</div>

			<p className="text-sm text-gray-300">{post.content}</p>

			<div className="flex justify-between items-center mt-4 text-sm text-gray-400">
				<div className="flex gap-1">
					<button
						onClick={handleLike}
						className="cursor-pointer px-2 py-1 rounded hover:bg-gray-700 duration-300"
					>
						{liked ? "👍 Unlike" : "👍 Like"}
					</button>
					<button
						onClick={handleDislike}
						className="cursor-pointer px-2 py-1 rounded hover:bg-gray-700 duration-300"
					>
						{disliked ? "👎 Undo Dislike" : "👎 Dislike"}
					</button>
					{canDelete ? (
						<button
							onClick={handleDelete}
							className="cursor-pointer px-2 py-1 rounded hover:bg-red-600 text-red-400 duration-300"
						>
							🗑 Delete
						</button>
					) : (
						<button
							onClick={handleReport}
							className="cursor-pointer px-2 py-1 rounded hover:bg-gray-700 duration-300"
						>
							🚩 Report
						</button>
					)}
				</div>
				<div>
					{post.likes ?? 0} Likes &nbsp;•&nbsp;{" "}
					{post.commentCount ?? 0} comments
				</div>
			</div>
		</div>
	);

	return disableLink ? (
		CardContent
	) : (
		<Link to={`/post/${post.id}`} className="block">
			{CardContent}
		</Link>
	);
}
