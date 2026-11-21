import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../auth";

const Login = () => {
    const { user, loading } = useAuth();
    const [error, setError] = useState("");
    const changeSession = async () => {
        setError("");
        try {
            if (user) await signOut(auth);
            else await signInWithPopup(auth, new GoogleAuthProvider());
        } catch {
            setError(
                "Could not change sign-in. Check your Firebase setup and try again.",
            );
        }
    };
    return (
        <main className="login-page">
            <h1>Welcome to Hot Takes</h1>

            <p>
                {user
                    ? `Signed in as ${user.displayName || user.email}`
                    : "Sign in to share your opinions and vote on other takes."}
            </p>

            <button type="button" disabled={loading} onClick={changeSession}>
                {user ? "Sign out" : "Sign in with Google"}
            </button>

            {error && <p role="alert">{error}</p>}
        </main>
    );
};
export default Login;
