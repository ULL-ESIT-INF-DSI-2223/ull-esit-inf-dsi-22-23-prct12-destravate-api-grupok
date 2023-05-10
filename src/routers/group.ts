import express from 'express';
import { Group } from '../models/group.js';

export const groupRouter = express.Router(); 

groupRouter.use(express.json());

groupRouter.post('/groups', async (req, res) => {
  const group = new Group(req.body);
  
  try {
    await group.save()
    res.status(201).send(group);
  } catch(err) {
    res.status(400).send(err);
  }
});
