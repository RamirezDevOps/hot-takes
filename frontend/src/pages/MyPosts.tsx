import { useEffect, useState } from "react";
import { Take } from "@full-stack/types";
import { BACKEND_BASE_PATH } from "../constants/Navigation";

const MyPosts = () => {
    const [myPosts, setMyPosts] = useState<Take[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${BACKEND_BASE_PATH}/takes`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Could not load posts.");
                }
                return res.json();
            })
            .then((data: Take[]) => {
                setMyPosts(data.filter((post) => post.author === "Alex"));
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load posts. Check that the backend is running.");
                setLoading(false);
            });
    }, []);

    const createPost = () => {
        setError("");
        setSaving(true);
        fetch(`${BACKEND_BASE_PATH}/takes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Could not create post.");
                }
                return res.json();
            })
            .then((post: Take) => {
                setMyPosts((currentPosts) => [post, ...currentPosts]);
                setText("");
                setSaving(false);
            })
            .catch(() => {
                setError("Could not create post. Please try again.");
                setSaving(false);
            });
    };

    const deletePost = (id: string) => {
        setError("");
        fetch(`${BACKEND_BASE_PATH}/takes/${id}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Could not delete post.");
                }
                setMyPosts((currentPosts) => currentPosts.filter((post) => post.id !== id));
            })
            .catch(() => setError("Could not delete post. Please try again."));
    };

    return (
        <main className='my-posts-page'>
            <h1>My Posts</h1>
            <p>Create a new take and manage the opinions you have shared.</p>
            <p>Demo user: Alex. Posts reset when the backend restarts.</p>

            <h2>Create a Post</h2>
            <form className='post-form' onSubmit={(event) => {
                event.preventDefault();
                createPost();
            }}>
                <label htmlFor='post-text'>Your take</label>
                <textarea
                    id='post-text'
                    name='text'
                    rows={4}
                    placeholder='What is your hot take?'
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    disabled={saving}
                    required
                />
                <button type='submit' disabled={saving || text.trim() === ""}>
                    {saving ? "Posting..." : "Post"}
                </button>
            </form>

            {error && <p>{error}</p>}
            <h2>Your Posts</h2>
            {loading && <p>Loading posts...</p>}
            {!loading && !error && myPosts.length === 0 && <p>No posts yet. Share your first take!</p>}
            {myPosts.map((post) => (
                <article key={post.id} className='take-card'>
                    <h3>{post.text}</h3>
                    <p>Agree: {post.agreeVotes} | Disagree: {post.disagreeVotes}</p>
                    <div className='post-actions'>
                        <button type='button' disabled title='Editing is coming soon'>Edit</button>
                        <button type='button' onClick={() => deletePost(post.id)}>Delete</button>
                    </div>
                </article>
            ))}
        </main>
    );
};

export default MyPosts;
