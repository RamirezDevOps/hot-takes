import { useEffect, useState } from "react";
import { Take } from "@full-stack/types";
import { api } from "../api";
import { useAuth } from "../auth";
import { Link } from "react-router-dom";

const getControversyScore = (take: Take) => {
    const total = take.agreeVotes + take.disagreeVotes;
    const smaller = Math.min(take.agreeVotes, take.disagreeVotes);
    const larger = Math.max(take.agreeVotes, take.disagreeVotes);

    if (larger === 0) {
        return 0;
    }
    return total ** (smaller / larger);
};

const Feed = () => {
    const { user } = useAuth();
    const [takes, setTakes] = useState<Take[]>([]);
    const [sortBy, setSortBy] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api("/takes")
            .then((data: Take[]) => {
                setTakes(data);
                setLoading(false);
            })
            .catch(() => {
                setError(
                    "Could not load takes. Check that the backend is running.",
                );
                setLoading(false);
            });
    }, []);

    const vote = (id: string, choice: string) => {
        setError("");
        api(`/takes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vote: choice }),
        })
            .then((updatedTake: Take) => {
                setTakes((currentTakes) =>
                    currentTakes.map((take) =>
                        take.id === updatedTake.id ? updatedTake : take,
                    ),
                );
            })
            .catch(() => setError("Could not record vote. Please try again."));
    };

    const sortedTakes = [...takes].sort((a, b) => {
        if (sortBy === "voted") {
            return (
                b.agreeVotes +
                b.disagreeVotes -
                (a.agreeVotes + a.disagreeVotes)
            );
        }
        if (sortBy === "controversial") {
            return getControversyScore(b) - getControversyScore(a);
        }
        return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });

    return (
        <main className="feed-page">
            <h1>Hot Takes</h1>

            <p>Share your opinions. See who agrees.</p>

            {!user && (
                <p>
                    <Link to="/login">Sign in</Link> to vote.
                </p>
            )}

            <div className="feed-sort">
                <label htmlFor="sort">Sort by</label>

                <select
                    id="sort"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                >
                    <option value="newest">Newest</option>

                    <option value="voted">Most Voted</option>

                    <option value="controversial">Most Controversial</option>
                </select>
            </div>

            {loading && <p>Loading takes...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && takes.length === 0 && <p>No takes yet.</p>}

            {sortedTakes.map((take) => (
                <article key={take.id} className="take-card">
                    <p className="take-author">Posted by {take.author}</p>

                    <h2>{take.text}</h2>

                    <div className="take-votes">
                        <button
                            type="button"
                            disabled={!user}
                            onClick={() => vote(take.id, "agree")}
                        >
                            Agree ({take.agreeVotes})
                        </button>

                        <button
                            type="button"
                            disabled={!user}
                            onClick={() => vote(take.id, "disagree")}
                        >
                            Disagree ({take.disagreeVotes})
                        </button>
                    </div>
                </article>
            ))}
        </main>
    );
};

export default Feed;
