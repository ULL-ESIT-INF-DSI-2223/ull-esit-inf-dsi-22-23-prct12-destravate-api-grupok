import express from 'express';
import { Track } from '../models/track.js';

export const trackRouter = express.Router(); 

trackRouter.use(express.json());

trackRouter.post('/tracks', async (req, res) => {
  const track = new Track(req.body);

  try {
    await track.save()
    res.status(201).send(track);
  } catch(err) {
    res.status(400).send(err);
  }
});

/**
 * Get para todos los tracks
 */
trackRouter.get('/tracks', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

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
 * Get para un track en específico
 */
trackRouter.get('/tracks/:id', async (req, res) => {
  const track = await Track.findOne({ ID: req.params.id });
  if (!track) {
    res.status(404).send();
  }
  res.send(track);
});


/**
 * Patch para actualizar un track en específico mediante ID
 */
trackRouter.patch('/tracks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'startCoordinates', 'endCoordinates', 'length', 'grade', 'users', 'activities', 'rating'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    res.status(400).send({ error: 'Invalid updates' });
  }

  if (updates.length === 0) {
    res.status(400).send({ error: 'No updates' });
  }

  try {
    const track = await Track.findOneAndUpdate({ ID: req.params.id }, req.body, { new: true, runValidators: true });
    if (!track) {
      res.status(404).send();
    }
    res.send(track);
  } catch (error) {
    res.status(400).send(error);
  }
});





