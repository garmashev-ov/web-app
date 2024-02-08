import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./create.css"
import { ApiService } from "../services/ApiService";


export function Create() {
    const [error, setError] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();
    const maxLength = 1000;

    const post = async (content) => {
        ApiService("posts/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { 
                    'content': `${content}`,
                }),
        })
        navigate("/");
    }


    return (
        <div className="create_post">
            <h1>Create new post</h1>
            <form>
                <textarea id="content" type="text" placeholder="Write new post..." value={content} required onChange={(e) => setContent(e.target.value)}/>
                <br />
                <button
                    type="submit"
                    onClick={(event) => {
                        event.preventDefault();
                        if (!window.localStorage.getItem("access")) {
                            setError("login to create a post");
                            return;
                        }
                        if (content.length > 1000) {
                            setError(`post is too big, maximum length is ${maxLength}, your message is ${content.length}`)
                        } else {
                            setError("");
                            post(content);
                            setContent("");
                        }
                    }}>
                    Create
                </button>
                <div style={{"color" : "red"}} >{error}</div>
            </form>
        </div>
    )
}