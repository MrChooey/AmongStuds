import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";

export default function CreatePost({ onPostCreated }) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = useState([]);
	const [tagInput, setTagInput] = useState("");
	const [loading, setLoading] = useState(false);

	const handleAddTag = () => {
		const tag = tagInput.trim().toLowerCase();
		if (tag && !tags.includes(tag)) {
			setTags([...tags, tag]);
			setTagInput("");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim() || !content.trim()) return;

		setLoading(true);
		try {
			const currentUser = auth.currentUser;
			await addDoc(collection(db, "posts"), {
				title,
				content,
				tags,
				createdAt: serverTimestamp(),
				likers: {},
				dislikers: {},
				likes: 0,
				comments: [],
				user_id: currentUser.uid,
				reporters: {},
			});
			setTitle("");
			setContent("");
			setTags([]);
			onPostCreated?.();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col bg-[#262d34] p-4 rounded space-y-2"
		>
			<input
				type="text"
				placeholder="Title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				className="w-full px-3 py-2 rounded bg-[#2c353d] text-[#858ead] focus:outline-none"
				required
			/>

			<textarea
				placeholder="What's on your mind?"
				value={content}
				onChange={(e) => setContent(e.target.value)}
				rows={2}
				className="w-full px-3 py-2 rounded bg-[#2c353d] text-[#858ead] focus:outline-none"
				required
			/>

			<div className="flex flex-wrap gap-2 items-center">
				{tags.map((t) => (
					<span
						key={t}
						className="bg-green-500 hover:bg-green-600 duration-150 text-white px-2 py-1 rounded-full text-sm"
					>
						{t}{" "}
						<button
							type="button"
							onClick={() =>
								setTags(tags.filter((tag) => tag !== t))
							}
							className="cursor-pointer"
						>
							×
						</button>
					</span>
				))}
				<input
					type="text"
					placeholder="Add tag"
					className="px-3 py-2 rounded bg-[#2c353d] text-[#858ead] focus:outline-none"
					value={tagInput}
					onChange={(e) => setTagInput(e.target.value)}
					onKeyDown={(e) =>
						e.key === "Enter"
							? (e.preventDefault(), handleAddTag())
							: null
					}
				/>
				<button
					type="button"
					onClick={handleAddTag}
					className="bg-green-500 px-3 py-1 font-semibold rounded cursor-pointer text-white hover:bg-green-600 duration-200 disabled:opacity-50"
				>
					Add
				</button>
			</div>

			<button
				type="submit"
				disabled={loading}
				className="self-end bg-green-500 hover:bg-green-600 duration-200 px-4 py-2 font-semibold text-white rounded disabled:opacity-50"
			>
				{loading ? "Posting..." : "Create Post"}
			</button>
		</form>
	);
}
