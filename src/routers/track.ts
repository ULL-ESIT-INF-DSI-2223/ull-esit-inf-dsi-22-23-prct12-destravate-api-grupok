import express from "express";
import { Track } from "../models/track.js";

/**
 * Se exporta el router para poder ser usado en app.ts
 */
export const trackRouter = express.Router();

/**
 * El body de las peticiones se parsea a JSON por defecto
 */
trackRouter.use(express.json());

/**
 * Post para crear un track con los datos en el body
 */
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
 * Get para todos los tracks o para un track en específico mediante nombre usando query
 */
trackRouter.get("/tracks", async (req, res) => {
  const filter = req.query.name ? { name: req.query.name.toString() } : {};

  try {
    const tracks = await Track.find(filter).populate({
      path: "users",
      select: "name",
    });

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
  const trackID = req.params.id;
  try {
    const track = await Track.findById(trackID).populate({
      path: "users",
      select: "name",
    });
    if (!track) {
      return res.status(404).send();
    }
    return res.send(track);
  } catch (err) {
    return res.status(500).send();
  }
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
    "activity",
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
 * Patch para actualizar un track en específico mediante ID y los datos en el body
 */
trackRouter.patch("/tracks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const trackID = req.params.id;
  const allowedUpdates = [
    "name",
    "startCoordinates",
    "endCoordinates",
    "length",
    "grade",
    "users",
    "activity",
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
    const track = await Track.findByIdAndUpdate(trackID, req.body, {
      new: true,
      runValidators: true,
    });
    if (!track) {
      return res.status(404).send();
    }
    return res.send(track);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Delete para eliminar un track en específico mediante el nombre usando query
 */
trackRouter.delete("/tracks", async (req, res) => {
  const name = req.query.name;

  try {
    const track = await Track.findOne({ name });
    if (!track) {
      return res.status(404).send();
    }
    // No funciona el find
    //await User.updateMany({ "tracksHistory.track": {} }, { $pull: { tracksHistory: { track: track._id, date: "1987-09-28" }} });
    //await Group.updateMany({ tracksHistory: { track: track._id, date: {}  } }, { $pull: { tracksHistory: { track: track._id, date: {}  }} });

    await Track.findOneAndDelete({ name });
    return res.status(200).send(track);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Delete para eliminar un track en específico mediante ID
 */
trackRouter.delete("/tracks/:id", async (req, res) => {
  const trackID = req.params.id;
  try {
    const track = await Track.findByIdAndDelete(trackID);
    if (!track) {
      return res.status(404).send();
    }
    return res.send(track);
  } catch (error) {
    return res.status(500).send(error);
  }
});
