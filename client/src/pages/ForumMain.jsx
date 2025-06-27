import ForumHeader from "../components/ForumHeader.jsx";
import CreatePost from "../components/CreatePost.jsx";
import PostCard from "../components/PostCard.jsx";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase.js";

export default function ForumMain() {
	const [posts, setPosts] = useState([]);

	const fetchPosts = async () => {
		const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
		const querySnap = await getDocs(q);
		setPosts(querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	return (
		<div className="min-h-screen bg-[#1e1e2f] text-white px-4 py-6">
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
