import express from 'express';
import { Challenge } from '../models/challenge.js';

export const challengeRouter = express.Router(); 

challengeRouter.use(express.json());

challengeRouter.post('/challenges', async (req, res) => {
  const challenge = new Challenge(req.body);
  
  try {
    await challenge.save()
    res.status(201).send(challenge);
  } catch(err) {
    res.status(400).send(err);
  }
});
