import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
	const { user } = useAuth();
	const navigate = useNavigate();
	useEffect(() => {
		if (user) navigate("/forum");
	}, [user]);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	const handleSignup = async (e) => {
		e.preventDefault();
		try {
			const userCred = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			await setDoc(doc(db, "users", userCred.user.uid), {
				email,
				status: "pending",
				createdAt: new Date(),
			});
			setMessage("Account created! Awaiting admin approval.");
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
					Sign up
				</h2>
				<form onSubmit={handleSignup} className="space-y-4">
					<input
						type="email"
						placeholder="Email"
						className="w-full form-bg px-4 py-2 rounded"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Password"
						className="w-full form-bg px-4 py-2 rounded"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<button className="bg-gray-300 hover:bg-gray-500 duration-150 rounded w-full p-2 my-5">
						<p className="text-black font-semibold">Sign up</p>
					</button>
					{message && <p className="text-sm text-white">{message}</p>}
				</form>
				<p className="text-center text-sm text-white mt-4">
					Already have an account?{" "}
					<Link
						to="/login"
						c
						lassName="text-white hover:underline"
						style={{ color: "inherit" }}
					>
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}
