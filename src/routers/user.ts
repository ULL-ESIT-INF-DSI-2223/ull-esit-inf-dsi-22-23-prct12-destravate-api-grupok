import express from 'express';
import './db/mongoose.js';
import { User } from '../models/user.js';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/users', (req, res) => {
  const user = new User(req.body);
  user.save().then(() => {
    res.status(201).send(user);
  }).catch((err) => {
    res.status(400).send(err);
  });
});


  