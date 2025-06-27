import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ForumHeader() {
	const navigate = useNavigate();
	const handleLogout = async () => {
		try {
			await signOut(auth);
			navigate("/login");
		} catch (err) {
			console.error("Logout failed:", err);
		}
	};
	return (
		<header className="flex items-center justify-between bg-[#2a2a3c] p-4 rounded mb-4">
			<h1 className="text-green-400 font-bold text-xl">AmongStuds</h1>
			<input
				type="text"
				placeholder="Search..."
				className="bg-[#1e1e2f] text-white p-2 rounded w-1/2"
			/>
			<div className="flex items-center gap-2">
				<img
					src="/profile.png"
					alt="Profile"
					className="w-8 h-8 rounded-full"
				/>
				<span>Max</span>
				<span>▼</span>
			</div>
			<div className="flex items-center gap-2">
				<img src="/profile.png" className="w-8 h-8 rounded-full" />
				<span>Max</span>
				<button onClick={handleLogout}>Logout</button>
			</div>
		</header>
	);
}
