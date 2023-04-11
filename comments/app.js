const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 8002;
const { randomBytes } = require("crypto");

app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:postId/comments", (req, res) => {
  return res.json(commentsByPostId[req.params.postId] || []);
});

app.post("/posts/:postId/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentsByPostId[req.params.postId] || [];
  comments.push({ id: commentId, content, status: "Pending" });
  commentsByPostId[req.params.postId] = comments;
  await axios.post("http://localhost:8003/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.postId,
      status: "Pending",
    },
  }).catch(err => {
    console.log(err)
  });
  return res.json(comments);
});

app.post("/events", async (req, res) => {
  console.log("recieved event: ", req.body);
  const { type, data } = req.body;
  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;
    await axios.post("http://localhost:8003/events", {
      type: "CommentUpdated",
      data: {
        id,
        status,
        postId,
        content,
      },
    }).catch(err => {
      console.log(err)
    });
  }
  return res.json({ message: "Post recieved" });
});

app.listen(PORT, () => {
  console.log(`Server is on port ${PORT}`);
});
