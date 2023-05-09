import express from 'express';
import { User } from '../models/user.js';

export const userRouter = express.Router(); 

userRouter.use(express.json());

userRouter.post('/users', (req, res) => {
  const user = new User(req.body);
  user.save().then(() => {
    res.status(201).send(user);
  }).catch((err) => {
    res.status(400).send(err);
  });
});


  