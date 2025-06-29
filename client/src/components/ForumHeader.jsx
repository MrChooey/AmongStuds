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
			<div className="relative w-3/8 mr-20 text-gray-400 focus-within:text-gray-200">
				<input
					type="text"
					placeholder="Search..."
					className="w-full bg-[#2c353d] text-white px-4 py-2 rounded focus:outline-none"
				/>
				<img
					src="/search-icon.svg"
					className="w-5 h-5 absolute inset-y-0 right-3 m-auto pointer-events-none"
				/>
			</div>
			<div className="flex items-center gap-2">
				{/* <img
					src="/profile.png"
					alt="Profile"
					className="w-8 h-8 rounded-full"
				/> */}
				<span>Max</span>
				<span className="mr-5">▼</span>
				<button
					onClick={handleLogout}
					className="cursor-pointer px-4 py-2 font-semibold text-white bg-gray-700 hover:bg-[#313b4b] duration-200 rounded"
				>
					Log out
				</button>
			</div>
		</header>
	);
}
