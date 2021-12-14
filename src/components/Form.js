import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function Form({ createBlog }) {
  const [blogs, setBlogs] = useState([]);
  const titleRef = useRef("");
  const authorRef = useRef("");
  const urlRef = useRef("");
  const likesRef = useRef(0);

  const addBlog = async (blogObject, userAuth) => {
    const response = await axios.post(baseUrl, blogObject, {
      headers: {
        Authorization: "Bearer " + userAuth,
        "Content-Type": " application/json",
      },
    });
    return response.data;
  };
  const getBlogObject = (event) => {
    const blogObject = {
      title: titleRef.current.value,
      author: authorRef.current.value,
      url: urlRef.current.value,
      likes: likesRef.current.value,
    };
    return blogObject;
  };

  const addNote = (event) => {
    event.preventDefault();
    createBlog({
      title: titleRef.current.value,
      author: authorRef.current.value,
      url: urlRef.current.value,
      likes: likesRef.current.value,
    });
  };

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  return (
    <form onSubmit={(e) => addNote(e)} className="form">
      <label htmlFor="title">title</label>
      <input id="titleRef" ref={titleRef} type="text" name="title" />
      <br />

      <label htmlFor="author">author</label>
      <input id="authorRef" ref={authorRef} type="text" name="author" />
      <br />

      <label htmlFor="url">url</label>
      <input id="urlRef" ref={urlRef} type="text" name="url" />
      <br />

      <label htmlFor="likes">likes</label>
      <input id="likesRef" ref={likesRef} type="number" name="likes" />
      <br />

      <button
        onClick={(event) => {
          event.preventDefault();
          addBlog(getBlogObject(event), getCookie("token"));
        }}
        type="submit"
      >
        Add Blog
      </button>
    </form>
  );
}

module.exports = { Form };
