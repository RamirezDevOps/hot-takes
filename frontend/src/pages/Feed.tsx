import { useEffect, useState } from "react";
import { Take } from "@full-stack/types";
import { BACKEND_BASE_PATH } from "../constants/Navigation";

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
    const [takes, setTakes] = useState<Take[]>([]);
    const [sortBy, setSortBy] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${BACKEND_BASE_PATH}/takes`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Could not load takes.");
                }
                return res.json();
            })
            .then((data: Take[]) => {
                setTakes(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load takes. Check that the backend is running.");
                setLoading(false);
            });
    }, []);

    const vote = (id: string, choice: string) => {
        setError("");
        fetch(`${BACKEND_BASE_PATH}/takes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vote: choice }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Could not record vote.");
                }
                return res.json();
            })
            .then((updatedTake: Take) => {
                setTakes((currentTakes) => currentTakes.map((take) => (
                    take.id === updatedTake.id ? updatedTake : take
                )));
            })
            .catch(() => setError("Could not record vote. Please try again."));
    };

    const sortedTakes = [...takes].sort((a, b) => {
        if (sortBy === "voted") {
            return (b.agreeVotes + b.disagreeVotes) - (a.agreeVotes + a.disagreeVotes);
        }
        if (sortBy === "controversial") {
            return getControversyScore(b) - getControversyScore(a);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <main className='feed-page'>
            <h1>Hot Takes</h1>
            <p>Share your opinions. See who agrees.</p>

            <div className='feed-sort'>
                <label htmlFor='sort'>Sort by</label>
                <select id='sort' value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                    <option value='newest'>Newest</option>
                    <option value='voted'>Most Voted</option>
                    <option value='controversial'>Most Controversial</option>
                </select>
            </div>

            {loading && <p>Loading takes...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && takes.length === 0 && <p>No takes yet.</p>}

            {sortedTakes.map((take) => (
                <article key={take.id} className='take-card'>
                    <p className='take-author'>Posted by {take.author}</p>
                    <h2>{take.text}</h2>
                    <div className='take-votes'>
                        <button type='button' onClick={() => vote(take.id, "agree")}>
                            Agree ({take.agreeVotes})
                        </button>
                        <button type='button' onClick={() => vote(take.id, "disagree")}>
                            Disagree ({take.disagreeVotes})
                        </button>
                    </div>
                </article>
            ))}
        </main>
    );
};

export default Feed;
