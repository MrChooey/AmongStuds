import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
	const { user } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (user) navigate("/forum");
	}, [user]);
	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const userCred = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const userRef = doc(db, "users", userCred.user.uid);
			const userSnap = await getDoc(userRef);

			if (!userSnap.exists()) {
				setMessage("User record not found.");
				return;
			}

			const { status } = userSnap.data();
			if (status !== "active") {
				setMessage(`Account is ${status}.`);
				return;
			}

			setMessage("Login successful! ");
			navigate("/forum", { replace: true });
		} catch (err) {
			setMessage(err.message);
		}
	};

	return (
		<div
			className="h-screen bg-cover bg-center flex items-center justify-center"
			style={{ backgroundImage: "url('/bg.png')" }}
		>
			<div
				className="bg-white bg-opacity-90 p-8 rounded shadow-md w-full max-w-md mx-4"
				style={{ backgroundColor: "#262D34" }}
			>
				<div className="flex flex-row items-center justify-center gap-3 mb-6">
					<img
						src="/AMONGSTUD_LOGO.png"
						alt="Logo"
						className="w-12 h-12"
					/>
					<h2 className="title font-bold">AmongStuds</h2>
				</div>
				<h2 className="text-2xl text-white font-bold mb-6 text-center">
					Login
				</h2>
				<form onSubmit={handleLogin} className="space-y-4">
					<input
						type="email"
						placeholder="Email"
						className="w-full px-4 py-2 form-bg"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Password"
						className="w-full px-4 py-2 form-bg"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<button className="bg-gray-300 hover:bg-gray-500 duration-150 rounded w-full p-2 my-5">
						<p className="text-black font-semibold">LOGIN</p>
					</button>
					{message && (
						<p className="login_btn text-sm text-center text-white">
							{message}
						</p>
					)}
				</form>
				<p className="text-center text-sm text-white mt-4">
					Don't have an account?{" "}
					<Link
						to="/signup"
						className="font-bold text-white hover:underline"
						style={{ color: "inherit" }}
					>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
