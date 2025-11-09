import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = "https://upendraportfolio.onrender.com"; // change to your backend URL

export default function BlogView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        // ✅ correct endpoint
        const res = await fetch(`${API}/api/blogs/${id}-public`);
        if (res.ok) {
          setPost(await res.json());
        } else {
          console.error("Blog not found");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    })();
  }, [id]);

  if (!post)
    return (
      <div className="pt-32 px-6 text-center text-[var(--text-muted)]">
        Loading…
      </div>
    );

  return (
    <article className="mx-auto max-w-3xl pt-28 px-6 text-[var(--text)]">
      {/* ✅ Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 rounded-lg px-4 py-2 border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text)] hover:bg-[var(--bg-3)] transition"
      >
        ← Back
      </button>

      {/* ✅ Blog Title */}
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-sm text-[var(--text-muted)]">
        {new Date(post.createdAt).toLocaleString()}
      </p>

      {/* ✅ Blog Content */}
      <div
        className="mt-6 leading-relaxed prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
