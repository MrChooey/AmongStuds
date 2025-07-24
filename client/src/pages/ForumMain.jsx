import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import ForumHeader from "../components/ForumHeader.jsx";
import CreatePost from "../components/CreatePost.jsx";
import PostCard from "../components/PostCard.jsx";
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function ForumMain() {
	const [posts, setPosts] = useState([]);
	const [userRole, setUserRole] = useState(0);

	const fetchPosts = async () => {
		const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
		onSnapshot(q, (snap) => {
			setPosts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
		});
	};

	useEffect(() => {
		fetchPosts();

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
	}, []);

	console.log("👮 User role is", userRole);

	console.log("🔍 ForumMain rendered");

	return (
		<div className="min-h-screen bg-[#1e252b] text-white">
			<ForumHeader />
			<div className="max-w-3xl mx-auto flex flex-col gap-6">
				<CreatePost onPostCreated={fetchPosts} />
				{posts.map((post) => (
					<PostCard key={post.id} post={post} userRole={userRole} />
				))}
			</div>
		</div>
	);
}
