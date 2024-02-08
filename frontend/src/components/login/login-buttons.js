import { useState } from "react"
import "./login-buttons.css"
import { Link } from "react-router-dom"

export function LoginButtons() {
    const [text, setText] = useState(window.localStorage.getItem("access") ? "Logout" : "Login")

    return (
        <div className="login_buttons">
            <Link className="link" to="/login">
                <button
                    onClick={
                        () => {
                            window.localStorage.removeItem("access");
                            window.localStorage.removeItem("refresh");
                            setText("Login")
                        }}>
                    {text}
                </button>
            </Link>
            <Link className="link" to="/signup"><button>Sign up</button></Link>
        </div>
    )
}