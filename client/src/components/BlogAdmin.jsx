import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:4000";

export default function BlogAdmin() {
  const [token, setToken]   = useState(localStorage.getItem("blogToken") || "");
  const [passcode, setPass] = useState("");
  const [showAuth, setAuth] = useState(false);

  const [blogs, setBlogs]   = useState([]);
  const [expanded, setExp]  = useState([]);

  // editor modal state
  const [showForm, setFormOpen] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [title, setTitle]       = useState("");
  const editorRef = useRef(null);
  const fileRef   = useRef(null);

  const headers = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  async function fetchBlogs() {
    const url = token ? `${API}/api/blogs` : `${API}/api/blogs-public`;
    const res = await fetch(url, { headers });
    const data = await res.json();
    setBlogs(Array.isArray(data) ? data : []);
  }

  useEffect(() => { fetchBlogs(); }, [token]);

  // Auth
  async function handleLogin() {
    if (!passcode.trim()) return;
    const res = await fetch(`${API}/api/blog/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    const data = await res.json();
    if (data?.token) {
      localStorage.setItem("blogToken", data.token);
      setToken(data.token);
      setPass("");
      setAuth(false);
    }
  }
  function handleLogout() { localStorage.removeItem("blogToken"); setToken(""); }

  // Editor open/close
  function openEditor(existing = null) {
    if (!token) return setAuth(true);
    setEditId(existing?.id || null);
    setTitle(existing?.title || "");
    setFormOpen(true);
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = existing?.contentHtml || "";
        placeCaretAtEnd(editorRef.current);
      }
    }, 0);
  }
  function closeEditor() {
    setFormOpen(false);
    setEditId(null);
    setTitle("");
    if (editorRef.current) editorRef.current.innerHTML = "";
  }

  // Editor helpers
  function exec(cmd, value = null) { document.execCommand(cmd, false, value); editorRef.current?.focus(); }
  function placeCaretAtEnd(el) {
    el.focus();
    const r = document.createRange();
    r.selectNodeContents(el); r.collapse(false);
    const s = window.getSelection();
    s.removeAllRanges(); s.addRange(r);
  }
  function insertHtmlAtCursor(html) {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const frag = document.createDocumentFragment();
    let node, last;
    // eslint-disable-next-line no-cond-assign
    while ((node = temp.firstChild)) last = frag.appendChild(node);
    range.insertNode(frag);
    if (last) {
      range.setStartAfter(last); range.setEndAfter(last);
      sel.removeAllRanges(); sel.addRange(range);
    }
  }
  async function uploadImageAndInsert(file) {
    if (!file || !token) return;
    const fd = new FormData(); fd.append("image", file);
    const res = await fetch(`${API}/api/upload`, { method: "POST", headers, body: fd });
    const data = await res.json();
    if (data?.url) {
      insertHtmlAtCursor(
        `<img src="${data.url}" alt="" style="max-width:100%;height:auto;border-radius:12px;margin:12px 0;" />`
      );
    }
  }

  // CRUD
  async function saveBlog() {
    const contentHtml = editorRef.current?.innerHTML || "";
    if (!title.trim() || !contentHtml.trim()) return;
    const method = editId ? "PUT" : "POST";
    const url    = editId ? `${API}/api/blogs/${editId}` : `${API}/api/blogs`;
    const res = await fetch(url, {
      method,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), contentHtml }),
    });
    if (res.ok) { closeEditor(); fetchBlogs(); }
  }
  async function deleteBlog(id) {
    if (!token) return setAuth(true);
    await fetch(`${API}/api/blogs/${id}`, { method: "DELETE", headers });
    fetchBlogs();
  }

  return (
    <section className="min-h-[40vh] pt-6 md:pt-10 text-white">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[var(--text)]">Blogs</h2>
        <div className="flex gap-3">
          {token && (
            <button onClick={handleLogout} className="rounded-lg bg-red-500 px-4 py-2 hover:bg-red-600">
              Logout
            </button>
          )}
          <button onClick={() => openEditor()} className="rounded-lg bg-green-500 px-4 py-2 hover:bg-green-600">
            + New Blog
          </button>
        </div>
      </div>

      {/* Empty state */}
     {blogs.length === 0 && (
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-2)] p-8 text-center">
    <p className="text-lg text-[var(--text)] font-semibold">No blogs yet.</p>
    <p className="text-[var(--text-muted)]">Log in and create one to get started.</p>
  </div>
)}


      {/* List */}
      <div className="w-full">
        {blogs.map((b) => {
          const isOpen = expanded.includes(b.id);
          const date = b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "";
          return (
            <div key={b.id} className="mb-6 rounded-[20px] bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between text-sm text-gray-300">
                <span>📝 {b.title}</span>
                <span>{date}</span>
              </div>

              <p className="text-white">
                {isOpen || (b.preview || "").length < 200 ? b.preview : `${b.preview}...`}
              </p>

              {(b.preview || "").length >= 200 && (
                <button
                  onClick={() =>
                    setExp((prev) => (prev.includes(b.id) ? prev.filter((x) => x !== b.id) : [...prev, b.id]))
                  }
                  className="mt-2 text-sm text-blue-300"
                >
                  {isOpen ? "Show Less" : "Read More..."}
                </button>
              )}

              <div className="mt-4 flex gap-3">
                <Link
                  to={`/blog/${b.id}`}
                  className="rounded-lg bg-slate-500/60 px-3 py-1 hover:bg-slate-500"
                >
                  View
                </Link>
                {token && (
                  <>
                    <button
                      onClick={async () => {
                        const res = await fetch(`${API}/api/blogs/${b.id}-public`);
                        const full = await res.json();
                        openEditor({ id: full.id, title: full.title, contentHtml: full.contentHtml });
                      }}
                      className="rounded-lg bg-blue-500 px-3 py-1 hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBlog(b.id)}
                      className="rounded-lg bg-red-500 px-3 py-1 hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={closeEditor}>
          <div
            className="w-[720px] max-w-[92vw] rounded-2xl border border-white/20 bg-[#111827]/90 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3 text-lg font-bold">{editId ? "Edit Blog" : "New Blog"}</h3>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title..."
              className="mb-3 w-full rounded-lg bg-white/10 p-2 text-white outline-none"
            />

            <div className="mb-2 flex flex-wrap gap-2">
              <ToolbarButton onClick={() => exec("bold")} label="Bold" />
              <ToolbarButton onClick={() => exec("italic")} label="Italic" />
              <ToolbarButton onClick={() => exec("underline")} label="Underline" />
              <ToolbarButton onClick={() => exec("formatBlock", "<h1>")} label="H1" />
              <ToolbarButton onClick={() => exec("formatBlock", "<h2>")} label="H2" />
              <ToolbarButton onClick={() => exec("insertUnorderedList")} label="• List" />
              <ToolbarButton onClick={() => exec("insertOrderedList")} label="1. List" />
              <ToolbarButton onClick={() => {
                const url = prompt("Enter link URL");
                if (url) exec("createLink", url);
              }} label="Link" />
              <ToolbarButton onClick={() => fileRef.current?.click()} label="Image" />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  uploadImageAndInsert(f);
                }}
              />
            </div>

            <div
              ref={editorRef}
              contentEditable
              className="min-h-[220px] max-h-[55vh] overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-3 outline-none"
              onClick={() => editorRef.current && editorRef.current.focus()}
            />

            <div className="mt-4 flex justify-between">
              <button onClick={closeEditor} className="rounded-lg bg-gray-600 px-4 py-2 hover:bg-gray-700">Cancel</button>
              <button onClick={saveBlog} className="rounded-lg bg-green-500 px-4 py-2 hover:bg-green-600">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={() => setAuth(false)}>
          <div className="w-[360px] rounded-2xl border border-white/20 bg-[#111827]/90 p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-3 text-lg font-bold">Enter Admin Passcode</h3>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="mb-4 w-full rounded-lg bg-white/10 p-2 text-white outline-none"
              placeholder="••••••"
            />
            <div className="flex justify-between">
              <button onClick={() => setAuth(false)} className="rounded-lg bg-gray-600 px-4 py-2 hover:bg-gray-700">Cancel</button>
              <button onClick={handleLogin} className="rounded-lg bg-purple-500 px-4 py-2 hover:bg-purple-600">Login</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ToolbarButton({ onClick, label }) {
  return (
    <button type="button" onClick={onClick} className="rounded-md bg-white/10 px-3 py-1 text-sm hover:bg-white/20">
      {label}
    </button>
  );
}
