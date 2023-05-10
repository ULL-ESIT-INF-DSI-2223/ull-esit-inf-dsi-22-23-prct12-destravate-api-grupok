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
  const tracks = await Track.find({});
  res.send(tracks);
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


