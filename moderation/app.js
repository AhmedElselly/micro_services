const express = require("express");
const app = express();
const axios = require("axios");
const PORT = process.env.PORT || 8005;

app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "Rejected" : "Approved";
    await axios
      .post("http://localhost:8003/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.listen(PORT, () => {
  console.log(`Server is on port ${PORT}`);
});
