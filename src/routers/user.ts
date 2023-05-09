import express from 'express';
import { User } from '../models/user.js';

export const userRouter = express.Router(); 

userRouter.use(express.json());

userRouter.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save()
    res.status(201).send(user);
  } catch(err) {
    res.status(400).send(err);
  }
});


  