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

userRouter.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send();
  }
});

userRouter.get('/users/:id', async (req, res) => {
  const userID = req.params.id;
  try {
    let user;
    if (userID) {
      // Find a user by userID
      user = await User.findOne({ userID });
    } 
    if (!user) {
      res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    res.status(500).send();
  }
});
  