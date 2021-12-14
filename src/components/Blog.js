import React, { useRef, useState } from "react";
import blogService from "../services/helpers";
const Blog = ({ blog }) => {
  const [id, setId] = useState(blog["_id"]);
  const [likes, setLikes] = useState(0);
  const LikeButton = useRef(null);
  const [likeWord, setLikesWord] = useState("Like");

  const ClickedLike = (event) => {
    event.preventDefault();
    if (likeWord === "Like") {
      setLikesWord("Unlike");
      // setLikes(likes++);
    } else {
      setLikesWord("Like");
      // setLikes(likes--);
    }
  };
  return (
    <div className="blog">
      <p>
        Title: <span>{blog.title}</span>
      </p>
      <br />
      <p>
        Author: <span>{blog.author}</span>
      </p>
      <br />
      <p>
        Blog: <span>{blog.url}</span>
      </p>
      <br />
      <p>
        Likes: <span>{likes.url}</span>
      </p>
      <button id="LikesP" onClick={(event) => ClickedLike(event)} id="like">
        {likeWord}
      </button>
      <br />
      <button
        id={id}
        ref={LikeButton}
        onClick={(e) => {
          e.preventDefault();
          blogService.removeBlog(id);
        }}
      >
        remove
      </button>
    </div>
  );
};

export default Blog;
