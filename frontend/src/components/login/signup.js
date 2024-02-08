import { useState } from "react";
import "./signup.css";
import { ApiService } from "../services/ApiService";
import { useNavigate } from "react-router-dom";

export function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("username", username);
        formData.append("avatar", avatar);
        formData.append("email", email);
        formData.append("password", password);

        const response = await ApiService("users/", {
            method: "POST",
            body: formData,
        })
        
        if (Math.floor(response.status / 100) !== 2) {
            setError(JSON.stringify(response))
        } else {
            navigate("/login")
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
                <label className="login-label">
                    Email:
                    <input
                        type="email"
                        className="login-input"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </label>
                <br />
                <label className="login-label">
                    Avatar:
                    <input
                        type="file"
                        className="login-input"
                        onChange={(e) => {setAvatar(e.target.files[0])}}
                    />
                </label>
                <br />

                <button type="submit" className="login-button">
                    Signup
                </button>
            </form>
            <span style={{ color: 'red' }}>{error}</span>
        </div>
    );
}
