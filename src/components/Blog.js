import React, { useRef, useState } from "react";
import blogService from "../services/helpers";
const Blog = ({ blog }) => {
  const [id, setId] = useState(blog["_id"]);
  return (
    <div>
      {blog.title} {blog.author}
      <button
        id={id}
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
