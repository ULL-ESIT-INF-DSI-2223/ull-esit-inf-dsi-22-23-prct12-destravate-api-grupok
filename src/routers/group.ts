import express from "express";
import { Group } from "../models/group.js";
import { User } from "../models/user.js";

export const groupRouter = express.Router();

/**
 * El body de las peticiones se parsea a JSON por defecto
 */
groupRouter.use(express.json());

/**
 * Post para crear un grupo, los datos se pasan en el body
 */
groupRouter.post("/groups", async (req, res) => {
  const group = new Group(req.body);
  try {
    // actualizar los grupos de los usuarios que forman parte del grupo
    for (const userID of group.members) {
      await User.findByIdAndUpdate(userID, { $push: { groups: group._id }}, { new: true, runValidators: true, });
    }
    await group.save();
    res.status(201).send(group);
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * Get para todos los grupos o para un grupo en específico mediante nombre usando query
 */
groupRouter.get("/groups", async (req, res) => {
  const filter = req.query.name ? { name: req.query.name.toString() } : {};

  try {
    const groups = await Group.find(filter).populate(
      { path: "members", select: "name"}
    ).populate(
      { path: "favouriteTracks", select: "name"}
    );

    if (groups.length !== 0) {
      return res.send(groups);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Get para un grupo en específico mediante ID
 */
groupRouter.get("/groups/:id", async (req, res) => {
  const groupID = req.params.id;
  try {
    const group = await Group.findById(groupID).populate(
      { path: "members", select: "name"}
    ).populate(
      { path: "favouriteTracks", select: "name"}
    );
    
    if (!group) {
      return res.status(404).send();
    }
    return res.send(group);
  } catch (err) {
    return res.status(500).send();
  }
});

/**
 * Patch para actualizar un grupo en específico mediante el nombre usando query
 */
groupRouter.patch("/groups", async (req, res) => {
  //actualizar un usaurio por su nombre
  const name = req.query.name;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "members",
    "groupStatistics",
    "userClasification",
    "favouriteTracks",
    "tracksHistory",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const group = await Group.findOneAndUpdate({ name }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!group) {
      return res.status(404).send();
    }
    // si en el body se ha cambiado members, actualizar los grupos de los usuarios
    if (updates.includes("members")) {
      await User.updateMany({ groups: group._id },{ $pull: { groups: group._id }});
      for(const userID of req.body.members) {
        await User.findByIdAndUpdate({ userID }, { $push: { groups: group._id }}, { new: true, runValidators: true, });
      }
    }
    return res.status(200).send(group);
  } catch (err) {
    return res.status(400).send(err);
  }
});

/**
 * Patch para actualizar un grupo en específico mediante ID
 */
groupRouter.patch("/groups/:id", async (req, res) => {
  //actualizar un usaurio por su id
  const groupID = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "members",
    "groupStatistics",
    "userClasification",
    "favouriteTracks",
    "tracksHistory",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const group = await Group.findByIdAndUpdate(groupID , req.body, { 
      new: true, 
      runValidators: true, 
    });
    if (!group) {
      return res.status(404).send();
    }
    // si en el body se ha cambiado members, actualizar los grupos de los usuarios
    if (updates.includes("members")) {
      await User.updateMany({ groups: group._id },{ $pull: { groups: group._id }});
      for(const userID of req.body.members) {
        await User.findByIdAndUpdate({ userID }, { $push: { groups: group._id }}, { new: true, runValidators: true, });
      }
    }
    return res.status(200).send(group);
  } catch (err) {
    return res.status(400).send(err);
  }
});

/**
 * Delete para eliminar un grupo en específico mediante nombre usando query
 */
groupRouter.delete("/groups", async (req, res) => {
  const name = req.query.name;

  try {
    const group = await Group.findOneAndDelete({ name });
    if (!group) {
      return res.status(404).send();
    }
    return res.status(200).send(group);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Delete para eliminar un grupo en específico mediante ID
 */
groupRouter.delete("/groups/:id", async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).send();
    }

    return res.send(group);
  } catch (error) {
    return res.status(500).send(error);
  }
});