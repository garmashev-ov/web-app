import { useState } from "react";
import "./login-page.css";
import { ApiService } from "../services/ApiService";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await ApiService("token/", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        });

        if ("access" in response) {
            window.localStorage.setItem('access', response.access);
            window.localStorage.setItem('refresh', response.refresh);
            setError("you are logged in");
            navigate("/");
            window.location.reload();
        } else {
            setError("wrong username or password");
        }

    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <label className="login-label">
                    Username:
                    <input
                        type="text"
                        className="login-input"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </label>
                <br />
                <label className="login-label">
                    Password:
                    <input
                        type="password"
                        className="login-input"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </label>
                <br />
                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
            <span>{error}</span>
        </div>
    );
}
