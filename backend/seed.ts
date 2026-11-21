import admin from "firebase-admin";
import { resolve } from "path";

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = resolve(
        process.cwd(),
        "../firebase-service-account.json",
    );
}

admin.initializeApp({ credential: admin.credential.applicationDefault() });

const db = admin.firestore();

const seedTakes = [
    {
        id: "seed-pizza",
        text: "Pineapple belongs on pizza.",
        agreeVotes: 12,
        disagreeVotes: 10,
    },
    {
        id: "seed-lectures",
        text: "Recorded lectures should be available for every class.",
        agreeVotes: 18,
        disagreeVotes: 4,
    },
    {
        id: "seed-winter",
        text: "Winter is the best season in Ithaca.",
        agreeVotes: 6,
        disagreeVotes: 15,
    },
    {
        id: "seed-breakfast",
        text: "Breakfast food is better for dinner.",
        agreeVotes: 11,
        disagreeVotes: 7,
    },
];

async function seed() {
    for (const take of seedTakes) {
        const ref = db.collection("takes").doc(take.id);
        const existing = await ref.get();

        if (!existing.exists) {
            await ref.set({
                text: take.text,
                author: "Hot Takes",
                authorId: "seed-data",
                agreeVotes: take.agreeVotes,
                disagreeVotes: take.disagreeVotes,
                createdAt: new Date().toISOString(),
            });
            console.log(`Added: ${take.text}`);
        } else {
            console.log(`Already exists: ${take.text}`);
        }
    }
}

seed().catch((error) => {
    console.error("Could not add seed data:", error);
    process.exitCode = 1;
});
