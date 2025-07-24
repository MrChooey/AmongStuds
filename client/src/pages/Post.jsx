import {
	doc,
	getDoc,
	collection,
	addDoc,
	onSnapshot,
	query,
	orderBy,
	serverTimestamp,
	updateDoc,
	increment,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import ForumHeader from "../components/ForumHeader";
import PostCard from "../components/PostCard";

export default function PostDetail() {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [userRole, setUserRole] = useState(0);

	useEffect(() => {
		const postRef = doc(db, "posts", id);
		const unsubscribePost = onSnapshot(postRef, (docSnap) => {
			if (docSnap.exists()) {
				setPost({ id: docSnap.id, ...docSnap.data() });
			}
		});

		const commentsRef = collection(db, "posts", id, "comments");
		const q = query(commentsRef, orderBy("createdAt", "asc"));

		const unsubscribeComments = onSnapshot(q, (snapshot) => {
			setComments(
				snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
			);
		});

		const fetchUserRole = async () => {
			const user = auth.currentUser;
			if (!user) return;

			try {
				const docRef = doc(db, "users", user.uid);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const data = docSnap.data();
					setUserRole(data.role || 0);
				}
			} catch (err) {
				console.error("Failed to fetch user role:", err);
			}
		};

		fetchUserRole();

		return () => {
			unsubscribePost();
			unsubscribeComments();
		};
	}, [id]);

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		try {
			const commentRef = collection(db, "posts", id, "comments");
			await addDoc(commentRef, {
				text: newComment,
				user_id: auth.currentUser.uid,
				createdAt: serverTimestamp(),
			});

			// ✅ Increment comment count in the post document
			const postRef = doc(db, "posts", id);
			await updateDoc(postRef, {
				commentCount: increment(1),
			});

			setNewComment("");
		} catch (err) {
			console.error("Error posting comment:", err);
		}
	};

	if (!post) return <div className="text-white p-4">Loading post...</div>;

	return (
		<div className="min-h-screen bg-cover bg-center bg-[#1e252b] text-white">
			{/* Sticky Full-Width Header */}
			<ForumHeader />

			{/* Reused PostCard without link */}
			<div className="max-w-3xl mx-auto my-6">
				<PostCard post={post} userRole={userRole} disableLink />
			</div>

			{/* Centered Content Container */}
			<div className="flex flex-col justify-between max-w-3xl w-full mx-auto bg-[#262d34] bg-opacity-70 p-6">
				{/* Scrollable Comments */}
				<h2 className="text-xl font-semibold p-2">Comments</h2>
				<div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-1">
					{comments.map((c) => (
						<div key={c.id} className="p-3 bg-[#2c353d] rounded">
							<p>{c.text}</p>
							<p className="text-sm text-gray-400 mt-1">
								by {c.user_id}
							</p>
						</div>
					))}
				</div>

				{/* Sticky Form */}
				<form
					onSubmit={handleCommentSubmit}
					className="sticky bottom-0 border border-[#2c353d] bg-[#262d34] rounded-xl p-4"
				>
					<textarea
						className="w-full p-3 rounded bg-[#2c353d] text-white focus:outline-none"
						placeholder="Write a comment..."
						rows="2"
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
					/>
					<button
						type="submit"
						className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full transition duration-200"
					>
						Comment
					</button>
				</form>
			</div>
		</div>
	);
}
