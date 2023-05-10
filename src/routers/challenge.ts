import express from "express";
import { Challenge } from "../models/challenge.js";

export const challengeRouter = express.Router();

challengeRouter.use(express.json());

/**
 * Get para todos los challenges
 */
challengeRouter.post("/challenges", async (req, res) => {
  const challenge = new Challenge(req.body);

  try {
    await challenge.save();
    res.status(201).send(challenge);
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * Get para todos los challenges
 */
challengeRouter.get("/challenges", async (req, res) => {
  const filter = req.query.name ? { name: req.query.name.toString() } : {};

  try {
    const challenges = await Challenge.find(filter);

    if (challenges.length !== 0) {
      return res.send(challenges);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Get para un challenge en específico
 */
challengeRouter.get("/challenges/:id", async (req, res) => {
  const challengeID = req.params.id;
  try {
    const challenge = await Challenge.findById(challengeID);
    if (!challenge) {
      return res.status(404).send();
    }
    return res.send(challenge);
  } catch (err) {
    return res.status(500).send();
  }
});

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
    return res.status(200).send(challenge);
  } catch (err) {
    return res.status(400).send(err);
  }
});

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
    const challenge = await Challenge.findByIdAndUpdate({ challengeID }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!challenge) {
      return res.status(404).send();
    }
    return res.status(200).send(challenge);
  } catch (err) {
    return res.status(400).send(err);
  }
});

/**
 * Delete para eliminar un track en específico mediante query
 */
challengeRouter.delete("/challenges", async (req, res) => {
  const name = req.query.name;

  try {
    const challenge = await Challenge.findOneAndDelete({ name });
    if (!challenge) {
      return res.status(404).send();
    }
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
    const challenge = await Challenge.findByIdAndDelete(challengeID);
    if (!challenge) {
      return res.status(404).send();
    }
    return res.send(challenge);
  } catch (error) {
    return res.status(500).send(error);
  }
});
