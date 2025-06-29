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
		<header className="flex items-center justify-between bg-[#262d34] p-4 rounded mb-16">
			<div className="flex items-center gap-2">
				<img src="/AMONGSTUD_LOGO.png" alt="Logo" className="w-8 h-8" />
				<h1 className="text-green-400 font-bold text-3xl">
					AmongStuds
				</h1>
			</div>
			<input
				type="text"
				placeholder="Search..."
				className="bg-[#2c353d] text-white w-2/6 px-4 py-2 rounded w-1/2 mr-20"
			/>
			<div className="flex items-center gap-2">
				{/* <img
					src="/profile.png"
					alt="Profile"
					className="w-8 h-8 rounded-full"
				/> */}
				<span>Max</span>
				<span className="mr-5">▼</span>
				<button onClick={handleLogout}>Logout</button>
			</div>
		</header>
	);
}
