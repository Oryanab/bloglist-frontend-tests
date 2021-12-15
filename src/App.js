import React, { useState, useEffect, useRef } from "react";
import blogService from "./services/helpers";
import Blog from "./components/Blog";
import ToggleBlog from "./components/ShowBlog";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAddTicket, setShowAddTicket] = useState("none");
  const [showBlogs, setShowBlogs] = useState("none");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const titleRef = useRef("");
  const authorRef = useRef("");
  const urlRef = useRef("");
  const likesRef = useRef(0);

  useEffect(() => {}, [showAddTicket]);
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
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login" type="submit">
        login
      </button>
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

  function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  const currentConnected = () => (
    <div>
      <h3>{getCookie("name")} is logged in</h3>
      <button
        id="logout-button"
        onClick={(e) => {
          deleteAllCookies();
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );

  const blogForm = () => (
    <form style={{ display: showAddTicket }}>
      <label htmlFor="title">title</label>
      <input id="title-input" ref={titleRef} type="text" name="title" />
      <br />

      <label htmlFor="author">author</label>
      <input id="author-input" ref={authorRef} type="text" name="author" />
      <br />

      <label htmlFor="url">url</label>
      <input id="url-input" ref={urlRef} type="text" name="url" />
      <br />

      <label htmlFor="likes">likes</label>
      <input id="likes-input" ref={likesRef} type="number" name="likes" />
      <br />

      <button
        onClick={(event) => {
          event.preventDefault();
          console.log(getCookie("token"));
          console.log(getBlogObject(event));
          blogService.addBlog(getBlogObject(event), getCookie("token"));
          titleRef.current.value = "";
          authorRef.current.value = "";
          urlRef.current.value = "";
          likesRef.current.value = "";
          setShowAddTicket("none");
        }}
        type="submit"
      >
        Add Blog
      </button>
    </form>
  );

  const toggleForm = () => (
    <button
      id="toggleForm"
      onClick={(e) => {
        e.preventDefault();
        setShowAddTicket(showAddTicket === "none" ? "block" : "none");
      }}
    >
      {showAddTicket === "none" ? "show Form" : "hide Form"}
    </button>
  );

  return (
    <div>
      {user === null && loginForm()}
      {user !== null && currentConnected()}
      {user !== null && blogForm()}
      {user !== null && toggleForm()}

      <h2>blogs</h2>
      <ToggleBlog showBlogs={showBlogs} setShowBlogs={setShowBlogs} />
      <div className="blogs-div" style={{ display: showBlogs }}>
        {blogs.map((blog) => (
          <Blog key={blog["_id"]} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default App;
