import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const API = import.meta.env.VITE_API_URL;

export default function BlogAdmin() {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: "", contentHtml: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("blog_admin_token");

  // ✅ Fetch all blogs
  const loadBlogs = async () => {
    const endpoint = token ? "/api/blogs" : "/api/blogs-public";
    const res = await fetch(`${API}${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    setBlogs(data);
  };

  useEffect(() => {
    loadBlogs();
  }, [token]);

  // ✅ Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/api/blog/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("blog_admin_token", data.token);
      window.location.reload();
    } else setError(data.error || "Login failed");
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("blog_admin_token");
    window.location.reload();
  };

  // ✅ Upload Image (append to editor)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      setForm({
        ...form,
        contentHtml:
          form.contentHtml + `<img src="${data.url}" alt="blog image" />`,
      });
    } else alert(data.error);
  };

  // ✅ Add or Update Blog
  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId ? `/api/blogs/${editingId}` : "/api/blogs";

    const res = await fetch(`${API}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ title: "", contentHtml: "" });
      setEditingId(null);
      loadBlogs();
    } else alert("Failed to save blog");
  };

  // ✅ Edit
  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setForm({ title: blog.title, contentHtml: blog.contentHtml });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this blog?")) return;
    const res = await fetch(`${API}/api/blogs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) loadBlogs();
    else alert("Failed to delete blog");
  };

  // ✅ Login Page (Public View)
  if (!token)
    return (
      <div className="text-center mt-16 px-4">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center space-y-3"
        >
          <input
            className="border p-2 rounded w-64 text-center"
            placeholder="Enter passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Login
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        {/* ✅ Show public blogs */}
        <div className="mt-10 max-w-4xl mx-auto text-left">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Public Blogs
          </h3>
          <div className="space-y-6">
            {blogs.map((b) => (
              <div
                key={b.id}
                className="border rounded-lg p-6 shadow-sm hover:shadow-md bg-white transition"
              >
                <h4 className="text-lg font-semibold mb-2 text-gray-900">
                  {b.title}
                </h4>

                {/* ✅ Preview half of content */}
                <div
                  className="text-gray-700 prose prose-sm max-w-none overflow-hidden relative"
                  dangerouslySetInnerHTML={{
                    __html:
                      b.contentHtml.slice(
                        0,
                        Math.min(b.contentHtml.length / 2, 600)
                      ) + "...",
                  }}
                />

                {/* ✅ Footer */}
                <div className="flex justify-between items-center mt-4">
                  <p className="text-xs text-gray-500">
                    {new Date(b.createdAt).toLocaleString()}
                  </p>
                  <button
                    onClick={() => navigate(`/blog/${b.id}`)}
                    className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  // ✅ Admin Panel (After Login)
  return (
    <div className="mt-12 space-y-6 px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {editingId ? "Edit Blog" : "Manage Blogs"}
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* ✅ Blog Form */}
      <form onSubmit={handleSubmitBlog} className="space-y-3">
        <input
          type="text"
          placeholder="Blog Title"
          className="border p-2 w-full rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <ReactQuill
          theme="snow"
          placeholder="Write your blog here..."
          value={form.contentHtml}
          onChange={(content) => setForm({ ...form, contentHtml: content })}
          className="bg-white rounded"
          style={{ height: "250px", marginBottom: "40px" }}
        />

        <input type="file" onChange={handleImageUpload} />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          {editingId ? "Update Blog" : "Add Blog"}
        </button>
      </form>

      {/* ✅ Blog List (Admin Mode) */}
      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-3">Existing Blogs:</h3>
        <ul className="space-y-3">
          {blogs.map((b) => (
            <li
              key={b.id}
              className="border rounded p-3 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition"
            >
              <div>
                <h4 className="font-medium">{b.title}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(b.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/blog/${b.id}`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(b)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
