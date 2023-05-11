import express from "express";
import { User } from "../models/user.js";
import { Group } from "../models/group.js";
import { Challenge } from "../models/challenge.js";
import { Track } from "../models/track.js";

export const userRouter = express.Router();

/**
 * El body de las peticiones se parsea a JSON por defecto
 */
userRouter.use(express.json());

/**
 * Post para crear un usuario
 */
userRouter.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    // actualizar los grupos de los que forme parte el usuario
    for (const groupID of user.groups) {
      await Group.findByIdAndUpdate(groupID, { $push: { members: user._id }});
    }
    // actualizar los usuarios de los challenge que tiene activos
    for (const challengeID of user.activeChallenges) {
      await Challenge.findByIdAndUpdate(challengeID, { $push: { users: user._id }});
    }
    await user.save()
    return res.status(201).send(user);
  } catch (err) {
    return res.status(400).send(err);
  }
});

/**
 * Get para todos los usuarios o para un usuario en específico mediante nombre usando query
 */
userRouter.get("/users", async (req, res) => {
  const name = req.query.name;
  try {
    let users;
    if (name) {
      // Find all users that match the name
      users = await User.find({ name }).populate(
        { path: "friends", select: "name"}
      ).populate(
        { path: "groups", select: "name"}
      ).populate(
        { path: "activeChallenges", select: "name"}
      ).populate(
        { path: "favouriteTracks", select: "name"}
      ).populate(
        { path: "tracksHistory.track", select: "name"}
      );
    } else {
      // Find all users
      users = await User.find().populate({ path: "friends", select: "name"}
      ).populate(
        { path: "groups", select: "name"}
      ).populate(
        { path: "activeChallenges", select: "name"}
      ).populate(
        { path: "favouriteTracks", select: "name"}
      ).populate(
        { path: "tracksHistory.track", select: "name"}
      );
    }
    return res.status(200).send(users);
  } catch (err) {
    return res.status(500).send(err);
  }
});

/**
 * Get para un usuario en específico mediante ID
 */
userRouter.get("/users/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    const user = await User.findById(userID).populate(
      { path: "friends", select: "name"}
    ).populate(
      { path: "groups", select: "name"}
    ).populate(
      { path: "activeChallenges", select: "name"}
    ).populate(
      { path: "favouriteTracks", select: "name"}
    );
    if (!user) {
      return res.status(404).send();
    }
    return res.send(user);
  } catch (err) {
    return res.status(500).send();
  }
});

/**
 * Patch para actualizar un usuario en específico mediante query y los datos en el body
 */
userRouter.patch("/users", async (req, res) => {
  //actualizar un usaurio por su nombre
  const name = req.query.name;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "activities",
    "friends",
    "groups",
    "favouriteTracks",
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
    // recorrer updates y actualizar las demas cosas en cada caso
    for (const update of updates) {
      switch (update) {
        case "groups":
          // borrar de los grupos en los que es participante
          await Group.updateMany({ members: user._id },{ $pull: { members: user._id }});
          for(const groupID of req.body.groups) {
            await Group.findByIdAndUpdate(groupID, { $push: { members: user._id }});
          }
        break;
        case "activeChallenges":
          // borrar de los challenge en los que es participante
          await Challenge.updateMany({ users: user._id },{ $pull: { users: user._id }});
          for(const challengeID of req.body.activeChallenges) {
            await Challenge.findByIdAndUpdate(challengeID, { $push: { users: user._id }});
          }
        break;
        case "tracksHistory":
          // borrar de los tracks en los que es participante
          await Track.updateMany({ users: user._id },{ $pull: { users: user._id }});
          for(const track of req.body.tracksHistory) {
            const trackID = track.track;
            await Track.findByIdAndUpdate(trackID, { $push: { users: user._id }});
          }
        break;
        default:
        break;
      }
    }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send(err);
  }
});

/**
 * Patch para actualizar un usuario en específico mediante ID y los datos en el body
 */
userRouter.patch("/users/:id", async (req, res) => {
  //actualizar un usaurio por su id
  const userID = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "activities",
    "friends",
    "groups",
    "favouriteTracks",
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
    const user = await User.findByIdAndUpdate(
      { userID }, 
      req.body, 
      { new: true, runValidators: true, }
    );
    if (!user) {
      return res.status(404).send();
    }
    // recorrer updates y actualizar las demas cosas en cada caso
    for (const update of updates) {
      switch (update) {
        case "groups":
          // borrar de los grupos en los que es participante
          await Group.updateMany({ members: user._id },{ $pull: { members: user._id }});
          for(const groupID of req.body.groups) {
            await Group.findByIdAndUpdate(groupID, { $push: { members: user._id }});
          }
        break;
        case "activeChallenges":
          // borrar de los challenge en los que es participante
          await Challenge.updateMany({ users: user._id },{ $pull: { users: user._id }});
          for(const challengeID of req.body.activeChallenges) {
            await Challenge.findByIdAndUpdate(challengeID, { $push: { users: user._id }});
          }
        break;
        case "tracksHistory":
          // borrar de los tracks en los que es participante
          await Track.updateMany({ users: user._id },{ $pull: { users: user._id }});
          for(const track of req.body.tracksHistory) {
            const trackID = track.track;
            await Track.findByIdAndUpdate(trackID, { $push: { users: user._id }});
          }
        break;
        default:
        break;
      }
    }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send(err);
  }
});

/**
 * Delete para eliminar un usuario en específico mediante query
 */
userRouter.delete("/users", async (req, res) => {
  const name = req.query.name;

  try {
    const user = await User.findOne({ name });
    //const user = await User.findOneAndDelete({ name });
    if (!user) {
      return res.status(404).send();
    }
    // borrar de la lista de amigos de los demás usuarios
    await User.updateMany({ friends: user._id },{ $pull: { friends: user._id }});
    // borrar de los grupos en los que es participante
    await Group.updateMany({ members: user._id },{ $pull: { members: user._id }});
    // borrar de los retos en los que es participante
    await Challenge.updateMany({ users: user._id },{ $pull: { users: user._id }});
    // borrar de las rutas  que ha realizado
    await Track.updateMany({ users: user._id },{ $pull: { users: user._id }});

    await User.findOneAndDelete({ name });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Delete para eliminar un usuario en específico mediante ID
 */
userRouter.delete("/users/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    const user = await User.findById(userID);
    //const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    // borrar de la lista de amigos de los demás usuarios
    await User.updateMany({ friends: user._id },{ $pull: { friends: user._id }});
    // borrar de los grupos en los que es participante
    await Group.updateMany({ members: user._id },{ $pull: { members: user._id }});
    // borrar de los retos en los que es participante
    await Challenge.updateMany({ users: user._id },{ $pull: { users: user._id }});
    // borrar de las rutas  que ha realizado
    await Track.updateMany({ users: user._id },{ $pull: { users: user._id }});
    
    await User.findByIdAndDelete(userID);
    return res.send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});