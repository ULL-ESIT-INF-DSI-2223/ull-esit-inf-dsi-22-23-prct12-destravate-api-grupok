import express from "express";
import { Track } from "../models/track.js";

export const trackRouter = express.Router();

trackRouter.use(express.json());

trackRouter.post("/tracks", async (req, res) => {
  const track = new Track(req.body);

  try {
    await track.save();
    return res.status(201).send(track);
  } catch (err) {
    return res.status(400).send(err);
  }
});

/**
 * Get para todos los tracks
 */
trackRouter.get("/tracks", async (req, res) => {
  const filter = req.query.name ? { name: req.query.name.toString() } : {};

  try {
    const tracks = await Track.find(filter);

    if (tracks.length !== 0) {
      return res.send(tracks);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Get para un track en específico mediante ID
 */
trackRouter.get("/tracks/:id", async (req, res) => {
  const track = await Track.findOne({ ID: req.params.id });
  if (!track) {
    return res.status(404).send();
  }
  return res.send(track);
});

/**
 * Patch para actualizar un track en específico mediante query
 */
trackRouter.patch("/tracks", async (req, res) => {
  //actualizar un usaurio por su nombre
  const name = req.query.name;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "startCoordinates",
    "endCoordinates",
    "length",
    "grade",
    "users",
    "activities",
    "rating",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const track = await Track.findOneAndUpdate({ name }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!track) {
      return res.status(404).send();
    }
    return res.status(200).send(track);
  } catch (err) {
    return res.status(400).send(err);
  }
});

/**
 * Patch para actualizar un track en específico mediante ID
 */
trackRouter.patch("/tracks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "startCoordinates",
    "endCoordinates",
    "length",
    "grade",
    "users",
    "activities",
    "rating",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  if (updates.length === 0) {
    return res.status(400).send({ error: "No updates" });
  }

  try {
    const track = await Track.findOneAndUpdate(
      { ID: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!track) {
      return res.status(404).send();
    }
    return res.send(track);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Delete para eliminar un track en específico mediante query
 */
trackRouter.delete("/tracks", async (req, res) => {
  const name = req.query.name;

  try {
    const track = await Track.findOneAndDelete({ name });
    if (!track) {
      return res.status(404).send();
    }
    return res.status(200).send(track);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Delete para eliminar un track en específico mediante ID
 */
trackRouter.delete("/tracks/:id", async (req, res) => {
  try {
    const track = await Track.findOneAndDelete({ ID: req.params.id });
    if (!track) {
      return res.status(404).send();
    }
    return res.send(track);
  } catch (error) {
    return res.status(500).send(error);
  }
});
