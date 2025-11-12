import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function BlogView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API}/api/blogs/${id}-public`);
      if (res.ok) setPost(await res.json());
    })();
  }, [id]);

  if (!post)
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;

  return (
    <article className="mx-auto max-w-3xl mt-24 px-4">
      <button onClick={() => navigate(-1)} className="mb-4 border p-2 rounded">
        ← Back
      </button>
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-500 text-sm">
        {new Date(post.createdAt).toLocaleString()}
      </p>
      <div
        className="mt-6 prose"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
