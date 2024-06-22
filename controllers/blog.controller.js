import { Blog } from "../models/blog.model.js";

const createBlog = async (req, res) => {
  const { title, description, content } = req.body;
  const { username } = req.user;

  const blog = await Blog.create({
    title,
    description,
    content,
    creator: username,
  });

  res.status(201).json(blog);
};

const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find({});
  res.status(200).json(blogs);
};

const getUserBlogs = async (req, res) => {
  const { username } = req.params;
  const blogs = await Blog.find({ creator: username });
  if (!blogs) {
    return res.status(404).json({ errors: [{ msg: "Couldnt find the blog" }] });
  }
  res.status(200).json(blogs);
};

export { createBlog, getAllBlogs, getUserBlogs };
