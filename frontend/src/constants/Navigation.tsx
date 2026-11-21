import Feed from "../pages/Feed";
import Login from "../pages/Login";
import MyPosts from "../pages/MyPosts";

export const BACKEND_BASE_PATH =
    import.meta.env.VITE_BACKEND_BASE_PATH || "http://localhost:8080";

export const PATHS: {
    link: string;
    label: string;
    element?: JSX.Element;
}[] = [
    {
        link: "/",
        label: "Feed",
        element: <Feed />,
    },
    {
        link: "/login",
        label: "Login",
        element: <Login />,
    },
    {
        link: "/my-posts",
        label: "My Posts",
        element: <MyPosts />,
    },
];
