const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 8003;

app.use(express.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);
  axios.post("http://localhost:8001/events", event).catch((err) => {
    console.log(err);
  });
  axios.post("http://localhost:8002/events", event).catch((err) => {
    console.log(err);
  });
  axios.post("http://localhost:8004/events", event).catch((err) => {
    console.log(err);
  });
  axios.post("http://localhost:8005/events", event).catch((err) => {
    console.log(err);
  });
  return res.json({ status: "ok" });
});

app.get('/events', async (req, res) => {
  return res.json(events);
})

app.listen(PORT, () => {
  console.log(`Server runs on port ${PORT}`);
});
