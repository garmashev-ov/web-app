import "./main.css"
import { useState, useEffect } from "react"
import { Publication } from "../publication/publication"
import { ApiService } from "../services/ApiService"


export function Main(props) {
    const [posts, setPosts] = useState()
    useEffect(() => {
        (async () => {
            const data = await ApiService("posts");
            setPosts(data);
            console.log("data", data)
            console.log("posts", posts);
        })()
    }, [])

    return (
        <main>
            {posts?.map((item) => (
                <Publication
                    key={item.id}
                    author={item["author"].username}
                    author_id={item["author"].id}
                    content={item["content"]}
                    img={item["author"].avatar}
                    likes={parseInt(item["likes_cnt"])}
                    id={item["id"]}
                    isliked={item.is_liked}
                />
            ))}
        </main>
    );
}

