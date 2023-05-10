import express from "express";
import { User } from "../models/user.js";

export const userRouter = express.Router();

userRouter.use(express.json());

userRouter.post("/users", async (req, res) => {
  try {
    const lastUser = await User.findOne({}, {}, { sort: { userID: -1 } });
    const lastUserID = lastUser ? lastUser.userID : 0;

    const user = new User({
      userID: lastUserID + 1,
      ...req.body,
    });

    await user.save();
    return res.status(201).send(user);
  } catch (err) {
    return res.status(400).send(err);
  }
});

userRouter.get("/users", async (req, res) => {
  const { name } = req.query;
  try {
    let users;
    if (name) {
      // Find all users that match the name
      users = await User.find({ name });
    } else {
      // Find all users
      users = await User.find();
    }
    return res.status(200).send(users);
  } catch (err) {
    return res.status(500).send();
  }
});

userRouter.get("/users/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    let user;
    if (userID) {
      // Find a user by userID
      user = await User.findOne({ userID });
    }
    if (!user) {
      return res.status(404).send();
    }
    return res.send(user);
  } catch (err) {
    return res.status(500).send();
  }
});

userRouter.patch("/users", async (req, res) => {
  //actualizar un usaurio por su nombre
  const name = req.query.name;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "activities",
    "friends",
    "groups",
    "favoriteTracks",
    "activeChallenges",
    "tracksHistory",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const user = await User.findOneAndUpdate({ name }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send(err);
  }
});

userRouter.patch("/users/:id", async (req, res) => {
  //actualizar un usaurio por su id
  const userID = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "activities",
    "friends",
    "groups",
    "favoriteTracks",
    "activeChallenges",
    "tracksHistory",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const user = await User.findOneAndUpdate({ userID }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send(err);
  }
});
