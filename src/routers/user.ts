import express from "express";
import { User } from "../models/user.js";

export const userRouter = express.Router();

userRouter.use(express.json());

userRouter.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save()
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
      user = await User.findById(userID);
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
    const user = await User.findByIdAndUpdate({ userID }, req.body, {
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

/**
 * Delete para eliminar un track en específico mediante query
 */
userRouter.delete("/users", async (req, res) => {
  const name = req.query.name;

  try {
    const user = await User.findOneAndDelete({ name });
    if (!user) {
      return res.status(404).send();
    }
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Delete para eliminar un track en específico mediante ID
 */
userRouter.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    return res.send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});