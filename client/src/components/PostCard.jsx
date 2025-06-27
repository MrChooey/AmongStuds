import { Link } from "react-router-dom";
export default function PostCard({ post }) {
	return (
		<Link to={`/post/${post.id}`} className="block">
			<div className="bg-[#2a2a3c] p-4 rounded shadow-md">
				<h3 className="text-lg font-semibold mb-2">{post.title}</h3>
				<div className="flex gap-2 mb-2">
					{post.tags?.map((tag, i) => (
						<span
							key={i}
							className="bg-gray-700 text-sm px-2 py-1 rounded-full"
						>
							{tag}
						</span>
					))}
				</div>
				<p className="text-sm text-gray-300">{post.content}</p>
				<div className="flex justify-between items-center mt-4 text-sm text-gray-400">
					<div className="flex gap-4">
						<span>👍 Like</span>
						<span>👎 Dislike</span>
					</div>
					<div>
						{post.likes ?? 0} Likes &nbsp;•&nbsp;{" "}
						{post.comments?.length ?? 0} comments
					</div>
				</div>
			</div>
		</Link>
	);
}
