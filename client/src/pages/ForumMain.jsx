import ForumHeader from "../components/ForumHeader.jsx";
import CreatePost from "../components/CreatePost.jsx";
import PostCard from "../components/PostCard.jsx";
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";

export default function ForumMain() {
	const [posts, setPosts] = useState([]);

	const fetchPosts = async () => {
		const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
		onSnapshot(q, (snap) => {
			setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
		});		
	};

	useEffect(() => {
		fetchPosts();
	}, []);

    console.log("🔍 ForumMain rendered");

	return (
		<div className="min-h-screen bg-[#1e252b] text-white">
			<ForumHeader />
			<div className="max-w-3xl mx-auto flex flex-col gap-6">
				<CreatePost onPostCreated={fetchPosts} />
				{posts.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
			</div>
		</div>
	);
}
