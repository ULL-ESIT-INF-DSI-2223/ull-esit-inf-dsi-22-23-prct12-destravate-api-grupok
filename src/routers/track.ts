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
