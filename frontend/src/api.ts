import { auth } from "./firebase";
import { BACKEND_BASE_PATH } from "./constants/Navigation";

export async function api(path: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers);
    if (options.body) headers.set("Content-Type", "application/json");
    if (auth.currentUser)
        headers.set(
            "Authorization",
            `Bearer ${await auth.currentUser.getIdToken()}`,
        );
    const response = await fetch(`${BACKEND_BASE_PATH}${path}`, {
        ...options,
        headers,
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || "Request failed.");
    }
    return response.json();
}
