import express from "express";
import mysql from "mysql2";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();

app.use(express.json());

// ❌ INSECURE CORS (allows anyone)
app.use(cors({ origin: "*" }));

/* ❌ Hardcoded DB credentials (also duplicated from .env) */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "supersecret123",
  database: "testdb"
});

/* ❌ Weak JWT secret */
const JWT_SECRET = "myjwtsecretkey";

/* ===============================
   ❌ SQL INJECTION VULNERABILITY
================================ */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // ❌ Direct string concatenation
  const query = `
    SELECT * FROM users 
    WHERE username = '${username}' 
    AND password = '${password}'
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length > 0) {
      // ❌ Insecure JWT creation
      const token = jwt.sign(
        { user: username },
        JWT_SECRET
      );

      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid login" });
    }
  });
});

/* ===============================
   ❌ REMOTE CODE EXECUTION (RCE)
================================ */
app.post("/run", (req, res) => {
  const { code } = req.body;

  // ❌ NEVER use eval
  const result = eval(code);

  res.json({ result });
});

/* ===============================
   ❌ HARDCODED ADMIN BACKDOOR
================================ */
app.get("/admin", (req, res) => {
  if (req.query.key === "admin123") {
    res.send("Welcome Admin!");
  } else {
    res.status(403).send("Forbidden");
  }
});

app.listen(3000, () => {
  console.log("❌ Insecure app running on port 3000");
});
