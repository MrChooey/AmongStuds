import {
	doc,
	getDoc,
	collection,
	addDoc,
	onSnapshot,
	query,
	orderBy,
	serverTimestamp,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import ForumHeader from "../components/ForumHeader";

export default function PostDetail() {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");

	useEffect(() => {
		const fetchPost = async () => {
			const docRef = doc(db, "posts", id);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) setPost(docSnap.data());
		};

		const commentsRef = collection(db, "posts", id, "comments");
		const q = query(commentsRef, orderBy("createdAt", "asc"));

		const unsubscribe = onSnapshot(q, (snapshot) => {
			setComments(
				snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
			);
		});

		fetchPost();
		return () => unsubscribe();
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
			setNewComment("");
		} catch (err) {
			console.error("Error posting comment:", err);
		}
	};

	if (!post) return <div className="text-white p-4">Loading post...</div>;

	return (
		<div
			className="min-h-screen bg-cover bg-center text-white"
			style={{ backgroundImage: "url('/bg.png')" }}
		>
			{/* Sticky Full-Width Header */}
			<ForumHeader />

			{/* Centered Content Container */}
			<div className="flex flex-col justify-between max-w-3xl w-full h-[calc(100vh-4rem)] mx-auto bg-black bg-opacity-70 p-6">
				{/* Post Content */}
				<div className="mb-4">
					<h1 className="text-3xl font-bold mb-2">{post?.title}</h1>
					<p className="mb-4">{post?.content}</p>
				</div>

				{/* Scrollable Comments */}
				<h2 className="text-xl font-semibold p-2">Comments</h2>
				<div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-1">
					{comments.map((c) => (
						<div key={c.id} className="p-3 bg-[#444] rounded">
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
					className="sticky bottom-0 bg-[#1a1a1a] bg-opacity-90 p-4 rounded-t"
				>
					<textarea
						className="w-full p-3 rounded bg-[#5B5C5D] text-white"
						placeholder="Write a comment..."
						rows="2"
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
					/>
					<button
						type="submit"
						className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
					>
						Comment
					</button>
				</form>
			</div>
		</div>
	);
}
