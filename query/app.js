const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const PORT = process.env.PORT || 8004;

app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", async (req, res) => {
  return res.json(posts);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  return res.json({ message: "Success" });
});

app.listen(PORT, async () => {
  try {
    console.log(`Server is on port ${PORT}`);
    const res = await axios.get("http://localhost:8003/events");
    for (let event of res.data) {
      console.log("processing event: ", event.type);
      handleEvent(event.type, event.data);
    }
  } catch (err) {
    console.log(err);
  }
});
