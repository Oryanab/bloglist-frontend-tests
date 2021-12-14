import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/helpers";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const titleRef = useRef("");
  const authorRef = useRef("");
  const urlRef = useRef("");
  const likesRef = useRef(0);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await blogService
        .login({
          username,
          password,
        })
        .then((result) => {
          console.log(result);
          handleLocalStorage(result);
        });
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const getBlogObject = (event) => {
    const blogObject = {
      title: titleRef.current.value,
      author: authorRef.current.value,
      url: urlRef.current.value,
      likes: likesRef.current.value,
    };
    return blogObject;
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

  const handleLocalStorage = (token) => {
    let date = new Date();
    let inFiveMinutes = date.setTime(date.getTime() + 5 * 60 * 1000);
    document.cookie = `username=${token.username}; expires=${inFiveMinutes}`;
    document.cookie = `token=${token.token}; expires=${inFiveMinutes}`;
    document.cookie = `name=${token.name}; expires=${inFiveMinutes}`;
  };

  const blogForm = () => (
    <form>
      <label htmlFor="title">title</label>
      <input ref={titleRef} type="text" name="title" />
      <br />

      <label htmlFor="author">author</label>
      <input ref={authorRef} type="text" name="author" />
      <br />

      <label htmlFor="url">url</label>
      <input ref={urlRef} type="text" name="url" />
      <br />

      <label htmlFor="likes">likes</label>
      <input ref={likesRef} type="number" name="likes" />
      <br />

      <button
        onClick={(event) => {
          event.preventDefault();
          console.log(getCookie("token"));
          console.log(getBlogObject(event));
          blogService.addBlog(getBlogObject(event), getCookie("token"));
        }}
        type="submit"
      >
        Add Blog
      </button>
    </form>
  );

  return (
    <div>
      {user === null && loginForm()}
      {user !== null && blogForm()}
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
