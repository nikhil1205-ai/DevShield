import express from "express";
import fs from "fs";
import path from "path";
import axios from "axios";
import session from "express-session";

const app = express();

app.use(express.json());

app.use(
  session({
    secret: "sessionsecret123",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false } 
  })
);


app.get("/read-file", (req, res) => {
  const file = req.query.file;

  const filePath = path.join(__dirname, "uploads", file);

  const content = fs.readFileSync(filePath, "utf-8");
  res.send(content);
});


app.get("/fetch", async (req, res) => {
  const { url } = req.query;

  const response = await axios.get(url);
  res.send(response.data);
});


app.post("/deserialize", (req, res) => {
  const { data } = req.body;


  const obj = JSON.parse(data);
  res.json(obj);
});


app.post("/user/update", (req, res) => {
  const user = {
    username: "test",
    role: "user"
  };

  Object.assign(user, req.body);

  res.json(user);
});


app.get("/redirect", (req, res) => {
  const { next } = req.query;


  res.redirect(next);
});


app.post("/payment", (req, res) => {
  console.log("💳 Payment data:", req.body); 
});


app.get("/debug", (req, res) => {
  res.json({
    env: process.env,
    memory: process.memoryUsage()
  });
});

app.listen(3001, () => {
  console.log("❌ Insecure server running on port 3001");
});
