import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Publication } from "../publication/publication";
import "./profile.css"
import { ApiService } from "../services/ApiService";


export function Profile() {
    const [currentUserId, setCurrentUserId] = useState();
    let profileId = parseInt(useParams().id)
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subCnt, setSubCnt] = useState(0);

    if ((profileId === undefined || isNaN(profileId)) && (currentUserId === undefined || isNaN(currentUserId)) && !window.localStorage.getItem("access")) {
        profileId = 1;
    }

    useEffect(() => {
        const fetchData = async () => {
            const currentUserData = await ApiService("current-user/");
            setCurrentUserId(currentUserData.id)
            let profileData = null;
            if (profileId) {
                profileData = await ApiService(`profile/${profileId}/`);
            } else {
                profileData = await ApiService(`profile/${currentUserData.id}/`);
            }
            setUser(profileData);
            setPosts(profileData.posts);
            setIsSubscribed(profileData.is_subscribed);
            setSubCnt(profileData.subscribers_cnt); 
        };
        fetchData();
    }, []);


    const handleDelete = async (postId) => {
        ApiService(`posts/${postId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        setPosts(posts.filter(post => post.id !== postId));
    };

    const [editingPostId, setEditingPostId] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    const handleSaveEdit = async (postId, newContent) => {
        ApiService(`posts/${postId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: newContent,
            }),
        });

        setPosts(posts.map(post => (post.id === postId ? { ...post, content: newContent } : post)));
        setEditingPostId(null);
    };

    const subscribe = async () => {
        ApiService(`profile/${profileId}/subscribe/`, { method: "POST" });
        if (isSubscribed) {
            setSubCnt(subCnt - 1);
        } else {
            setSubCnt(subCnt + 1);
        }
        setIsSubscribed(!isSubscribed);
    }

    return (
        <div className="profile">
            <div className="head">
                <img src={user.avatar} alt=""></img>
                <h1>{user.username}</h1>
                <div className="subscribe">
                    <button onClick={subscribe}>{isSubscribed ? "unsubscribe" : "subscribe"}</button>
                    <p>subscribers: {subCnt}</p>
                </div>
            </div>
            <div>
                {posts?.map((item) => (
                    <div className="profilePublication" key={item.id}>
                        <Publication
                            key={item.id}
                            author={item["author"].username}
                            author_id={item["author"].id}
                            content={item["content"]}
                            img={item["author"].avatar}
                            likes={parseInt(item["likes_cnt"])}
                            id={item["id"]}
                            isliked={item["is_liked"]}
                        />
                        {editingPostId === item.id ? (
                            <div className="edit_form">
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                />
                                <br />
                                <button onClick={() => handleSaveEdit(item.id, editedContent)}>Save</button>
                                <button onClick={() => setEditingPostId(null)}>Cancel</button>
                            </div>

                        ) :
                            (<div className="post_buttons">
                                {currentUserId === parseInt(user.id) && (
                                    <>
                                        <button
                                            postId={item.id}
                                            onClick={() => handleDelete(item.id)}>
                                            delete post
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingPostId(item.id);
                                                setEditedContent(item.content);
                                            }}>
                                            edit
                                        </button>
                                    </>)}
                            </div>)}
                    </div>
                ))}
            </div>
        </div >
    )
}