import { useParams } from "react-router-dom"
import { Publication } from "../publication/publication";
import { useState, useEffect } from "react";
import CommentForm from './comment-form';
import "./publication-page.css"
import { ApiService } from "../services/ApiService";
import { Link } from "react-router-dom";

export function PublicationPage(props) {
    const id = useParams().id;

    const [post, setPost] = useState()
    const [comments, setComments] = useState()
    useEffect(() => {
        (async () => {
            const data = await ApiService(`posts/${id}`);
            setPost(data);
            setComments(data.comments)
            console.log(comments)
        })()
    }, [])


    return (
        <main>
            {post && (
                <Publication
                    author={post?.author?.username}
                    author_id={post?.author?.id}
                    content={post?.content}
                    img={post?.author?.avatar}
                    likes={post?.likes_cnt}
                    isliked={post?.is_liked}
                    id={post?.id}
                />
            )}
            <div className="comments_block">
                {
                    (comments?.map((comm) =>
                        <div className="comment">
                            <div className="upper_row">
                                <img src={comm.author.avatar} alt="" />
                                <Link className="Link" style={{ textDecoration: 'none', color: 'black' }}>
                                    <h3>{comm["author"].username}</h3>
                                </Link>
                            </div>
                            <p>{comm["content"]}</p>
                        </div >
                    ))
                }
            </div>
            <CommentForm id={id} comments={comments} setAllComments={setComments} />
        </main>
    )
}