import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
				<h2 className="title font-bold mb-6 text-center">AmongStuds</h2>
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
					<button className="hover:bg-gray-600 w-full p-2">
						<p className="text-black">Sign up</p>
					</button>
					{message && <p className="text-sm text-white">{message}</p>}
				</form>
			</div>
		</div>
	);
}
