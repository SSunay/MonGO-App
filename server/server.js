const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const dotenv = require("dotenv");

dotenv.config();

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
  },
  { timestamps: true }
);

const Users = mongoose.model("users", userSchema);

app.use(cors());
app.use(bodyParser.json());
// const port = 8000;

//// GET ALL DATA
app.get("/Users", (req, res) => {
  Users.find({}, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      res.status(500).json({ message: err });
    }
  });
});

//// GET USERS BY ID
app.get("/Users/:id", (req, res) => {
  const { id } = req.params;
  Users.findById(id, (err, doc) => {
    if (!err) {
      if (doc) {
        res.send(doc);
        res.status(200);
      } else {
        res.status(404).json({ message: "not found" });
      }
    } else {
      res.status(500).json({ message: err });
    }
  });
});

//// DELETE USERS
app.delete("/Users/:id", (req, res) => {
  const { id } = req.params;

  Users.findByIdAndDelete(id, (err) => {
    if (!err) {
      res.send("deleted");
    } else {
      res.status(404).json({ message: err });
    }
  });
});

//// POST NEW USERS
app.post("/Users", (req, res) => {
  let user = new Users({
    name: req.body.name,
    lastName: req.body.lastName,
    age: req.body.age,
  });
  user.save();
  res.send({ message: "success..." });
});


/// ENV PART FOR SECURITY
const PORT = process.env;
const DB = process.env.DB_URL.replace("<password>", process.env.PASSWORD);
//////


mongoose.connect(DB, (err) => {
  if (!err) {
    console.log("DB connected");
    app.listen(PORT, () =>
      console.log(`Example app listening on port ${PORT}!`)
    );
  }
});
