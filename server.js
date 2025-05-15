const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/submit", (req, res) => {
  const msg = req.body.message;
  const data = JSON.parse(fs.readFileSync("messages.json", "utf8") || "[]");
  data.push({ message: msg, time: new Date().toISOString() });
  fs.writeFileSync("messages.json", JSON.stringify(data, null, 2));
  res.json({ success: true });
});

app.get("/inbox", (req, res) => {
  const messages = JSON.parse(fs.readFileSync("messages.json", "utf8") || "[]");
  let html = `
    <html><head><title>Inbox</title>
    <style>
      body { font-family: sans-serif; background: #f4f4f4; padding: 2rem; }
      .msg { background: #fff; margin-bottom: 1rem; padding: 1rem; border-radius: 8px; box-shadow: 0 0 5px #ccc; }
    </style></head><body><h2>Messages</h2>`;
  messages.reverse().forEach(m => {
    html += `<div class="msg"><p>${m.message}</p><small>${new Date(m.time).toLocaleString()}</small></div>`;
  });
  html += "</body></html>";
  res.send(html);
});

app.listen(PORT, () => console.log("Running on port " + PORT));
