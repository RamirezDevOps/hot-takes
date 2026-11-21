import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import admin from "firebase-admin";
import { existsSync } from "fs";
import { resolve } from "path";

const localCredentials = resolve(
    process.cwd(),
    "../firebase-service-account.json",
);
if (
    !process.env.GOOGLE_APPLICATION_CREDENTIALS &&
    existsSync(localCredentials)
) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = localCredentials;
}
admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();
const app: Express = express();
app.use(cors());
app.use(express.json());

type AuthRequest = Request & { user?: admin.auth.DecodedIdToken };

async function authenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) {
    const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
    if (!token) {
        res.status(401).json({ message: "Sign in to continue." });
        return;
    }
    try {
        req.user = await admin.auth().verifyIdToken(token);
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired sign-in." });
    }
}

app.get("/takes", async (_req, res) => {
    try {
        const snapshot = await db.collection("takes").get();
        res.json(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Could not load takes." });
    }
});

app.post("/takes", authenticate, async (req: AuthRequest, res) => {
    const text = req.body?.text;
    if (typeof text !== "string" || !text.trim()) {
        res.status(400).json({ message: "Post text is required." });
        return;
    }
    try {
        const take = {
            text: text.trim(),
            author: req.user!.name || req.user!.email || "User",
            authorId: req.user!.uid,
            agreeVotes: 0,
            disagreeVotes: 0,
            createdAt: new Date().toISOString(),
        };
        const ref = db.collection("takes").doc();
        await ref.set(take);
        res.status(201).json({ ...take, id: ref.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Could not create take." });
    }
});

app.put("/takes/:id", authenticate, async (req: AuthRequest, res) => {
    const { vote, text } = req.body || {};
    if (
        vote !== "agree" &&
        vote !== "disagree" &&
        (typeof text !== "string" || !text.trim())
    ) {
        res.status(400).json({
            message: "Provide a vote or nonempty post text.",
        });
        return;
    }
    const ref = db.collection("takes").doc(req.params.id);
    try {
        const doc = await ref.get();
        if (!doc.exists) {
            res.status(404).json({ message: "Take not found." });
            return;
        }
        const take = doc.data()!;
        if (vote === "agree") {
            take.agreeVotes += 1;
            await ref.update({ agreeVotes: take.agreeVotes });
        } else if (vote === "disagree") {
            take.disagreeVotes += 1;
            await ref.update({ disagreeVotes: take.disagreeVotes });
        } else {
            if (take.authorId !== req.user!.uid) {
                res.status(403).json({
                    message: "You can only edit your own posts.",
                });
                return;
            }
            take.text = text.trim();
            await ref.update({ text: take.text });
        }
        res.json({ ...take, id: doc.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Could not update take." });
    }
});

app.delete("/takes/:id", authenticate, async (req: AuthRequest, res) => {
    const ref = db.collection("takes").doc(req.params.id);
    try {
        const doc = await ref.get();
        if (!doc.exists) {
            res.status(404).json({ message: "Take not found." });
            return;
        }
        if (doc.data()!.authorId !== req.user!.uid) {
            res.status(403).json({
                message: "You can only delete your own posts.",
            });
            return;
        }
        await ref.delete();
        res.json({ message: "Take deleted." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Could not delete take." });
    }
});

app.listen(Number(process.env.PORT) || 8080, "0.0.0.0", () => {
    console.log("Backend listening on port " + (process.env.PORT || 8080));
});
