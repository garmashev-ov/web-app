import { useState } from 'react';
import { ApiService } from '../services/ApiService';

function CommentForm(props) {
    const { id, comments = [], setAllComments } = props;
    const [comment_content, setComment] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!window.localStorage.getItem("access")) {
            setComment("login to comment a post");
            return;
        }
        const newComment = {
            "post": `${id}`,
            "content": `${comment_content}`,
        };
        let currentUser = await ApiService("current-user/");
        currentUser = await ApiService(`users/${currentUser.id}`);
        setAllComments([...comments, { author: { username: currentUser.username, avatar: currentUser.avatar }, content: comment_content }] )
        setComment("");
        ApiService("comments/", {
            method: "POST",
            body: JSON.stringify(newComment),
            headers: {
                "Content-Type": "application/json",
            }
        });
    };

    return (
        <div>
            <form className="comment_form"
                onSubmit={handleSubmit}>
                <textarea id="new_comment"
                    rows="4"
                    placeholder="Add a comment..."
                    value={comment_content}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
                <button type="submit">Add Comment</button>
            </form>
        </div>
    );
}

export default CommentForm;
