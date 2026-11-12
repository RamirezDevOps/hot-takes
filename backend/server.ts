import express, { Express } from "express";
import cors from "cors";
import { Take } from "@full-stack/types";

const app: Express = express();

const hostname = "0.0.0.0";
const port = 8080;

app.use(cors());
app.use(express.json());

let takes: Take[] = [
    {
        id: "1",
        text: "Pineapple belongs on pizza.",
        author: "Alex",
        agreeVotes: 50,
        disagreeVotes: 50,
        createdAt: "2026-11-12T18:00:00Z",
    },
    {
        id: "2",
        text: "Recorded lectures should be available for every class.",
        author: "Sam",
        agreeVotes: 90,
        disagreeVotes: 10,
        createdAt: "2026-11-12T17:00:00Z",
    },
    {
        id: "3",
        text: "Winter is the best season in Ithaca.",
        author: "Jordan",
        agreeVotes: 5,
        disagreeVotes: 3,
        createdAt: "2026-11-12T16:00:00Z",
    },
];

let nextId = 4;

app.get("/takes", (req, res) => {
    res.json(takes);
});

app.post("/takes", (req, res) => {
    const { text } = req.body;
    if (typeof text !== "string" || text.trim() === "") {
        res.status(400).json({ message: "Post text is required." });
        return;
    }

    const take: Take = {
        id: String(nextId++),
        text: text.trim(),
        author: "Alex",
        agreeVotes: 0,
        disagreeVotes: 0,
        createdAt: new Date().toISOString(),
    };
    takes.push(take);
    res.status(201).json(take);
});

app.put("/takes/:id", (req, res) => {
    const take = takes.find((take) => take.id === req.params.id);
    if (!take) {
        res.status(404).json({ message: "Take not found." });
        return;
    }

    if (req.body.vote === "agree") {
        take.agreeVotes += 1;
    } else if (req.body.vote === "disagree") {
        take.disagreeVotes += 1;
    } else if (typeof req.body.text === "string" && req.body.text.trim() !== "") {
        take.text = req.body.text.trim();
    } else {
        res.status(400).json({ message: "Provide a vote or nonempty post text." });
        return;
    }
    res.json(take);
});

app.delete("/takes/:id", (req, res) => {
    const take = takes.find((take) => take.id === req.params.id);
    if (!take) {
        res.status(404).json({ message: "Take not found." });
        return;
    }

    takes = takes.filter((take) => take.id !== req.params.id);
    res.json({ message: "Take deleted." });
});

app.listen(port, hostname, () => {
    console.log("Listening on http://localhost:8080");
});
