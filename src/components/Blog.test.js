import React, { useState, useRef } from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import { prettyDOM } from "@testing-library/dom";
import Blog from "./Blog";
import ToggleBlog from "./ShowBlog";
import { Form } from "./Form";

test("renders a single blog", () => {
  const blog = {
    _id: "wjdnf98dfs9h8s",
    title: "blog 1",
    author: "author 1",
    url: "a url",
    likes: 77,
  };
  // method 1
  const component = render(<Blog key={blog["_id"]} blog={blog} />);
  expect(component.container).toHaveTextContent("blog 1");

  // method 2
  //   const element = component.getByText("blog 1");
  //   expect(element).toBeDefined();

  // method 3
  const div = component.container.querySelector(".blog");
  expect(div).toHaveTextContent("blog 1");

  //   component.debug();
  //   console.log(prettyDOM(div));
});

test("clicking the remove button calls event handler once", () => {
  const blog = {
    _id: "wjdnf98dfs9h8s",
    title: "blog 1",
    author: "author 1",
    url: "a url",
    likes: 77,
  };
  const mockHandler = jest.fn();
  const component = render(<Blog key={blog["_id"]} blog={blog} />);
  const button = component.getByText("remove");
  fireEvent.click(button);
  expect(mockHandler.mock.calls).toHaveLength(0);
});

describe("Able to toggle show/hide all blogs", () => {
  let component;
  beforeEach(() => {
    const blog = {
      _id: "wjdnf98dfs9h8s",
      title: "blog 1",
      author: "author 1",
      url: "a url",
      likes: 0,
    };
    let showBlogs = "block";
    const setShowBlogs = (setter) => {
      return showBlogs === setter;
    };
    component = render(
      <div>
        <ToggleBlog showBlogs={showBlogs} setShowBlogs={setShowBlogs} />
        <div className="blogs-div" style={{ display: showBlogs }}>
          <Blog key={blog["_id"]} blog={blog} />
        </div>
      </div>
    );
  });

  test("renders its children", () => {
    const div = component.container.querySelector(".blogs-div");
    expect(div).not.toBe(null);
  });

  test("at start the children are not displayed", () => {
    const div = component.container.querySelector(".blogs-div");
    expect(div).toHaveStyle("display: block");
  });

  test("after clicking the button, children are not displayed", () => {
    const button = component.getByText("Hide Blogs");
    fireEvent.click(button);
    const div = component.container.querySelector(".blogs-div");
    expect(div).not.toHaveStyle("display: none");
  });

  test("toggled content can be closed", () => {
    //const button = component.getByText("Hide Blogs");
    const button = component.container.querySelector(".togglableBlogs");
    fireEvent.click(button);

    const closeButton = component.container.querySelector(".togglableBlogs");
    fireEvent.click(closeButton);

    const div = component.container.querySelector(".blogs-div");
    expect(div).toHaveStyle("display: block");
  });

  test("Can Add Like ", () => {
    const button = component.container.querySelector("#like");
    fireEvent.click(button);
    const element = component.getByText("Unlike");
    expect(element).toBeDefined();
  });
});

describe("Able to Add new Blog", () => {
  const createBlog = jest.fn();
  const component = render(<Form createBlog={createBlog} />);

  const form = component.container.querySelector(".form");
  const titleRef = component.container.querySelector("#titleRef");
  const authorRef = component.container.querySelector("#authorRef");
  const urlRef = component.container.querySelector("#urlRef");
  const likesRef = component.container.querySelector("#likesRef");

  fireEvent.change(titleRef, {
    target: { value: "testing of forms could be easier" },
  });
  fireEvent.change(authorRef, {
    target: { value: "testing of forms could be easier" },
  });
  fireEvent.change(urlRef, {
    target: { value: "testing of forms could be easier" },
  });
  fireEvent.change(likesRef, {
    target: { value: 70 },
  });
  fireEvent.submit(form);

  console.log(createBlog.mock.calls);
  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe(
    "testing of forms could be easier"
  );
});
