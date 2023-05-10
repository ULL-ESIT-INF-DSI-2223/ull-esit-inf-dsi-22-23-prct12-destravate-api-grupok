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

/**
 * Get para todos los challenges
 */
challengeRouter.get('/challenges', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

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
challengeRouter.get('/challenges/:id', async (req, res) => {
  const challenge = await Challenge.findOne({ ID: req.params.id });
  if (!challenge) {
    res.status(404).send();
  }
  res.send(challenge);
});
