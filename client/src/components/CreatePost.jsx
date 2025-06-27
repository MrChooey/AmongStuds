import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed
import { auth } from "../firebase"; // adjust path if needed

export default function CreatePost({ onPostCreated }) {
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!content.trim()) return;

		setLoading(true);
		try {
			const currentUser = auth.currentUser;
			await addDoc(collection(db, "posts"), {
				content,
				createdAt: serverTimestamp(),
				likes: 0,
				comments: [],
				tags: ["general"], // make this dynamic later
				user_id: currentUser.uid,
			});

			setContent("");
			onPostCreated?.();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="bg-[#242424] p-4 rounded mb-6">
			<textarea
				placeholder="Let's share what’s going on your mind..."
				className="w-full p-3 rounded bg-[#5B5C5D] text-white"
				value={content}
				onChange={(e) => setContent(e.target.value)}
				rows={3}
			/>
			<div className="flex justify-between items-center mt-2">
				<span className="text-sm text-gray-400">{message}</span>
				<button
					type="submit"
					disabled={loading}
					className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
				>
					{loading ? "Posting..." : "Create Post"}
				</button>
			</div>
		</form>
	);
}
