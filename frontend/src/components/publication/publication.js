import { Link } from "react-router-dom"
import "./publication.css"
import { useState } from "react"
import { ApiService } from "../services/ApiService"

export function Publication(props) {
    const { author, content, img, likes, id, isliked, author_id } = props
    const [counter, setCounter] = useState(likes)
    const [liked, setLiked] = useState(isliked)


    if (props.content === undefined) {
        return null;
    } else if (counter === undefined) {
        setCounter(likes)
    }

    const Like = async (id) => {
        ApiService(`posts/${id}/like/`, {method: "POST", headers: {"Content-Type": "application/json",}});
    }

    const Dislike = async (id) => {
        ApiService(`posts/${id}/dislike/`, {method: "POST"});
    }

    return (
        <div className="publications">
            <div className="upper_row">
                <img src={img} alt="" />
                <Link className="Link" to={`/profile/${author_id}`} style={{ textDecoration: 'none', color: 'black' }}>
                    <h3>{author}</h3>
                </Link>
            </div>
            <p>{content}</p>
            <div className="buttons">
                <button className={`thumb-up${liked === 1 ? ' active' : ''}`}
                    onClick={async () => {
                        if (liked === 0) {
                            Like(id);
                            setCounter(counter + 1)
                            setLiked(1);
                        } else if (liked === 1) {
                            Like(id);
                            setCounter(counter - 1)
                            setLiked(0);
                        } else if (liked === -1) {
                            Like(id);
                            setCounter(counter + 2)
                            setLiked(1);
                        }
                    }}>
                </button>
                <button className={`thumb-down${liked === -1 ? ' active' : ''}`}
                    onClick={() => {
                        if (liked === 0) {
                            Dislike(id);
                            setCounter(counter - 1)
                            setLiked(-1);
                        } else if (liked === 1) {
                            Dislike(id);
                            setCounter(counter - 2)
                            setLiked(-1);
                        } else if (liked === -1) {
                            Dislike(id);
                            setCounter(counter + 1)
                            setLiked(0);
                        }
                    }}>
                </button>
                <span>{counter}</span>
                <Link to={`/post/${id}`} className="link_to_comments">
                    <button className="comments" />
                </Link>
            </div>
        </div >
    )
}
