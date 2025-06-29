import { Link } from "react-router-dom";
import { doc, updateDoc, arrayUnion, arrayRemove, increment, runTransaction } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";

export default function PostCard({ post }) {
	const shortId = post.user_id.slice(0, 6);

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
		if (!userId) return; // Optionally handle unauthenticated users

		const postRef = doc(db, "posts", post.id);

		await runTransaction(db, async (tx) => {
			const snap = await tx.get(postRef);
			const likers = snap.data().likers || {};

			if (likers[userId]) {
				tx.update(postRef, {
					[`likers.${userId}`]: false,
					likes: increment(-1),
				});
			} else {
				tx.update(postRef, {
					[`likers.${userId}`]: true,
					likes: increment(1),
				});
			}
		});
	};

	const handleDislike = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		const postRef = doc(db, "posts", post.id);
		await updateDoc(postRef, { likes: increment(-1) });
	};

	const userId = auth.currentUser?.uid;
	const liked = !!(post.likers && userId && post.likers[userId]);

	return (
		<Link to={`/post/${post.id}`} className="block">
			<div className="bg-[#262d34] p-4 rounded shadow-md">
				<div className="text-sm text-gray-400 mb-2">
					Anonymous {shortId} &nbsp;&nbsp;&nbsp;&nbsp; {formattedDate}
				</div>

				<h3 className="text-lg font-semibold mb-2">{post.title}</h3>
				<div className="flex gap-2 mb-2">
					{post.tags?.map((tag, i) => (
						<span
							key={i}
							className="bg-gray-700 text-sm px-2 py-1 rounded-full"
						>
							{tag}
						</span>
					))}
				</div>
				<p className="text-sm text-gray-300">{post.content}</p>
				<div className="flex justify-between items-center mt-4 text-sm text-gray-400">
					<div className="flex gap-1">
						<button onClick={handleLike} className="cursor-pointer px-2 py-1 rounded hover:bg-gray-700 duration-300">
							{liked ? "👍 Unlike" : "👍 Like"}
						</button>
						<button onClick={handleDislike} className="cursor-pointer px-2 py-1 rounded hover:bg-gray-700 duration-300">
							👎 Dislike
						</button>
					</div>
					<div>
						{post.likes ?? 0} Likes &nbsp;•&nbsp;{" "}
						{post.comments?.length ?? 0} comments
					</div>
				</div>
			</div>
		</Link>
	);
}
