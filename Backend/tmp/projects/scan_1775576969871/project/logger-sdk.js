const express = require("express");
const app = express();

app.use(express.json());

// Dummy database
let users = [
    { id: 1, name: "Nikhil", email: "nikhil@test.com" },
    { id: 2, name: "Rahul", email: "rahul@test.com" }
];

// ❌ No authentication
app.get("/users", (req, res) => {
    res.send(users); // anyone can access all users
});

// ❌ IDOR vulnerability + no validation
app.get("/users/:id", (req, res) => {
    let id = req.params.id;

    let user = users.find(u => u.id == id);
    res.send(user);
});

// ❌ Login without validation
app.post("/login", (req, res) => {
    let { email, password } = req.body;

    // ❌ No password check
    let user = users.find(u => u.email == email);

    if (user) {
        res.send("Login Successful"); // ❌ no session/token
    } else {
        res.send("User not found");
    }
});

// ❌ Admin endpoint exposed
app.get("/admin/config", (req, res) => {
    res.send({
        db_password: "123456",
        api_key: "SECRET_KEY"
    });
});

// ❌ Business logic flaw
app.post("/orders", (req, res) => {
    let { quantity } = req.body;

    // ❌ No validation (negative allowed)
    res.send(`Order placed with quantity: ${quantity}`);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
