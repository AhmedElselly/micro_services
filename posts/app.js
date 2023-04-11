const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 8001;
const { randomBytes } = require("crypto");

app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  return res.json(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };
  await axios.post("http://localhost:8003/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  }).catch(err => {
    console.log(err)
  });
  return res.json(posts[id]);
});

app.post('/events', async (req, res) => {
  console.log('recieved event', req.body);
  return res.json({message: 'Post recieved'});
})

app.listen(PORT, () => {
  console.log(`Server is on port ${PORT}`);
});
