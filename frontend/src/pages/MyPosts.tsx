import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Take } from "@full-stack/types";
import { api } from "../api";
import { useAuth } from "../auth";

const MyPosts = () => {
    const { user, loading: authLoading } = useAuth();
    const [posts, setPosts] = useState<Take[]>([]);
    const [text, setText] = useState("");
    const [editing, setEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setPosts([]);
        setText("");
        setEditing(null);
        setError("");
        if (!user) return;
        let active = true;
        setLoading(true);
        api("/takes")
            .then((data: Take[]) => {
                if (active)
                    setPosts(data.filter((post) => post.authorId === user.uid));
            })
            .catch(() => {
                if (active) setError("Could not load posts.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [user]);

    const savePost = async () => {
        setSaving(true);
        setError("");
        try {
            const post: Take = await api(
                editing ? `/takes/${editing}` : "/takes",
                {
                    method: editing ? "PUT" : "POST",
                    body: JSON.stringify({ text }),
                },
            );
            setPosts((current) =>
                editing
                    ? current.map((item) => (item.id === post.id ? post : item))
                    : [post, ...current],
            );
            setText("");
            setEditing(null);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Could not save post.",
            );
        } finally {
            setSaving(false);
        }
    };

    const deletePost = async (id: string) => {
        setError("");
        try {
            await api(`/takes/${id}`, { method: "DELETE" });
            setPosts((current) => current.filter((post) => post.id !== id));
            if (editing === id) {
                setEditing(null);
                setText("");
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Could not delete post.",
            );
        }
    };

    if (authLoading) return <main className="my-posts-page">Loading...</main>;
    if (!user)
        return (
            <main className="my-posts-page">
                <h1>My Posts</h1>

                <p>
                    <Link to="/login">Sign in</Link> to manage your posts.
                </p>
            </main>
        );
    return (
        <main className="my-posts-page">
            <h1>My Posts</h1>

            <p>Create a new take and manage the opinions you have shared.</p>

            <h2>{editing ? "Edit Post" : "Create a Post"}</h2>

            <form
                className="post-form"
                onSubmit={(event) => {
                    event.preventDefault();
                    void savePost();
                }}
            >
                <label htmlFor="post-text">Your take</label>

                <textarea
                    id="post-text"
                    rows={4}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    disabled={saving}
                    required
                />

                <button type="submit" disabled={saving || !text.trim()}>
                    {saving ? "Saving..." : editing ? "Save changes" : "Post"}
                </button>

                {editing && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditing(null);
                            setText("");
                        }}
                    >
                        Cancel edit
                    </button>
                )}
            </form>

            {error && <p role="alert">{error}</p>}
            <h2>Your Posts</h2>

            {loading && <p>Loading posts...</p>}
            {!loading && !error && posts.length === 0 && (
                <p>No posts yet. Share your first take!</p>
            )}
            {posts.map((post) => (
                <article key={post.id} className="take-card">
                    <h3>{post.text}</h3>

                    <p>
                        Agree: {post.agreeVotes} | Disagree:{" "}
                        {post.disagreeVotes}
                    </p>

                    <div className="post-actions">
                        <button
                            type="button"
                            onClick={() => {
                                setEditing(post.id);
                                setText(post.text);
                            }}
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={() => void deletePost(post.id)}
                        >
                            Delete
                        </button>
                    </div>
                </article>
            ))}
        </main>
    );
};
export default MyPosts;
