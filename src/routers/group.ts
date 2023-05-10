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

/**
 * Get para todos los grupos especificos
 */
groupRouter.get('/groups', async (req, res) => {
    const filter = req.query.name?{name: req.query.name.toString()}:{};
  
    try {
      const groups = await Group.find(filter);
  
      if (groups.length !== 0) {
        return res.send(groups);
      }
      return res.status(404).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  });
  
  /**
   * Get para un group en específico
   */
  groupRouter.get('/groups/:id', async (req, res) => {
    const group = await Group.findOne({ ID: req.params.id });
    if (!group) {
      res.status(404).send();
    }
    res.send(group);
  });
