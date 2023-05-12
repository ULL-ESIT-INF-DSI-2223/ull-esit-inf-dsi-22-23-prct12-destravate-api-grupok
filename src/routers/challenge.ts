import express from "express";
import { Challenge } from "../models/challenge.js";
import { User } from "../models/user.js";

export const challengeRouter = express.Router();

/**
 * El body de las peticiones se parsea a JSON por defecto
 */
challengeRouter.use(express.json());

/**
 * Post para crear un challenge, Los datos se pasan en el body
 */
challengeRouter.post("/challenges", async (req, res) => {
  const challenge = new Challenge(req.body);

  try {
    // actualizar los usuarios de los que forme parte el challenge
    for (const userID of challenge.users) {
      await User.findByIdAndUpdate(userID, { $push: { activeChallenges: challenge._id }}, { new: true, runValidators: true, });
    }
    await challenge.save();
    res.status(201).send(challenge);
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * Get para todos los challenges o para un challenge en específico mediante nombre usando query
 */
challengeRouter.get("/challenges", async (req, res) => {
  const filter = req.query.name ? { name: req.query.name.toString() } : {};

  try {
    const challenges = await Challenge.find(filter).populate(
      { path: "users", select: "name"}
    ).populate(
      { path: "tracks", select: "name"}
    );

    if (challenges.length !== 0) {
      return res.send(challenges);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Get para un challenge en específico mediante ID
 */
challengeRouter.get("/challenges/:id", async (req, res) => {
  const challengeID = req.params.id;
  try {
    const challenge = await Challenge.findById(challengeID).populate(
      { path: "users", select: "name"}
    ).populate(
      { path: "tracks", select: "name"}
    );

    if (!challenge) {
      return res.status(404).send();
    }
    return res.send(challenge);
  } catch (err) {
    return res.status(500).send();
  }
});

/**
 * Patch para actualizar un challenge en específico mediante nombre usando query
 */
challengeRouter.patch("/challenges", async (req, res) => {
  //actualizar un usaurio por su nombre
  const name = req.query.name;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "activities",
    "tracks",
    "users",
    "length",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const challenge = await Challenge.findOneAndUpdate({ name }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!challenge) {
      return res.status(404).send();
    }
    // si se actualiza la lista de usuarios, actualizar los usuarios de los que forma parte el challenge
    if (updates.includes("users")) {
      await User.updateMany({ activeChallenges: challenge._id }, { $pull: { activeChallenges: challenge._id }});
      for (const userID of challenge.users) {
        await User.findByIdAndUpdate(userID, { $push: { activeChallenges: challenge._id }}, { new: true, runValidators: true, });
      }
    }
    return res.status(200).send(challenge);
  } catch (err) {
    return res.status(400).send(err);
  }
});

/**
 * Patch para actualizar un challenge en específico mediante ID
 */
challengeRouter.patch("/challenges/:id", async (req, res) => {
  //actualizar un usaurio por su id
  const challengeID = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "activities",
    "tracks",
    "users",
    "length",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const challenge = await Challenge.findByIdAndUpdate(challengeID, req.body, {
      new: true,
      runValidators: true,
    });
    if (!challenge) {
      return res.status(404).send();
    }
    // si se actualiza la lista de usuarios, actualizar los usuarios de los que forma parte el challenge
    if (updates.includes("users")) {
      await User.updateMany({ activeChallenges: challenge._id }, { $pull: { activeChallenges: challenge._id }});
      for (const userID of challenge.users) {
        await User.findByIdAndUpdate(userID, { $push: { activeChallenges: challenge._id }}, { new: true, runValidators: true, });
      }
    }
    return res.status(200).send(challenge);
  } catch (err) {
    return res.status(400).send(err);
  }
});

/**
 * Delete para eliminar un track en específico mediante nombre usando query
 */
challengeRouter.delete("/challenges", async (req, res) => {
  const name = req.query.name;
  try {
    const challenge = await Challenge.findOne({ name });
    if (!challenge) {
      return res.status(404).send();
    }
    // actualizar los usuarios de los que forma parte el challenge
    await User.updateMany({ activeChallenges: challenge._id }, { $pull: { activeChallenges: challenge._id }});
    await Challenge.findOneAndDelete({ name });
    return res.status(200).send(challenge);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Delete para eliminar un track en específico mediante ID
 */
challengeRouter.delete("/challenges/:id", async (req, res) => {
  const challengeID = req.params.id;
  try {
    const challenge = await Challenge.findById(challengeID);
    if (!challenge) {
      return res.status(404).send();
    }
    // actualizar los usuarios de los que forma parte el challenge
    await User.updateMany({ activeChallenges: challenge._id }, { $pull: { activeChallenges: challenge._id }});
    await Challenge.findByIdAndDelete(challengeID);
    return res.send(challenge);
  } catch (error) {
    return res.status(500).send(error);
  }
});
