import React from "react";

const ToggleBlog = ({ showBlogs, setShowBlogs }) => (
  <button
    className="togglableBlogs"
    onClick={(e) => {
      e.preventDefault();
      setShowBlogs(showBlogs === "block" ? "none" : "block");
    }}
  >
    {showBlogs === "block" ? "Hide Blogs" : "Show Blogs"}
  </button>
);

export default ToggleBlog;
