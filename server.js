import express from "express";
import bcrypt from "bcrypt-nodejs";
//import { json } from "express/lib/response"; //not sure where this coam from --> delete

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = 3000;
const database = {
  users: [
    {
      id: "123",
      name: "john",
      email: "john@email.com",
      password: "spud",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "sally",
      email: "sally@email.com",
      password: "peas",
      entries: 0,
      joined: new Date(),
    },
  ],
};

//ROUTES

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.email === email && user.password === password) {
      found = true;
      return res.json("success!");
    }
  });
  if (!found) res.status(400).json("error loggin in");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  database.users.push({
    id: (+database.users.at(-1).id + 1).toString(),
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users.at(-1)); // same as database.users[database.users.length-1]
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json("profile not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json("profile not found");
  }
});

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
