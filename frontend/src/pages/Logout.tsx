import { useEffect } from "react";

const Logout = () => {
    useEffect(() => {
        const token = localStorage.getItem("authToken");

        fetch("http://127.0.0.1:8000/api/logout/", {
            method: "POST",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then(() => {
            localStorage.removeItem("authToken");  // ✅ Remove token
            alert("Logged out successfully!");
            window.location.href = "/login";  // Redirect to login
        })
        .catch(error => console.error("Logout error:", error));
    }, []);

    return <h2>Logging out...</h2>;
};

export default Logout;
