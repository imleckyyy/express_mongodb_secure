import mongoose from 'mongoose';
import Tactic from '../models/Tactic';

export default {
  async findAll(req, res) {
    try {
      const { query } = req;

      const match = {};
      if (query.userId) match.userId = new mongoose.Types.ObjectId(query.userId);
      if (query.formationId) match.formationId = Number(query.formationId);
      if (query.text) match.$text = { $search: query.text };

      const tactics = await Tactic.aggregate([
        { $match: match },
        // { "$sort": { "date": -1 } },
        // { "$limit": 20 },
        {
          $lookup: {
            localField: 'userId',
            from: 'users',
            foreignField: '_id',
            as: 'userinfo',
          },
        },
        { $unwind: '$userinfo' },
        {
          $project: {
            _id: 1,
            formationId: 1,
            defenseStyle: 1,
            offenseStyle: 1,
            tags: 1,
            createdAt: 1,
            userId: 1,
            'userinfo._id': 1,
            'userinfo.login': 1,
          },
        },
      ]);

      return res.json({
        tactics,
      });
    } catch (err) {
      return res.status(400).json({
        message: 'There was a problem getting the tactics',
      });
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const objectId = new mongoose.Types.ObjectId(id);

      const tactic = await Tactic.aggregate([
        {
          $match: {
            _id: objectId,
          },
        },
        {
          $lookup: {
            localField: 'userId',
            from: 'users',
            foreignField: '_id',
            as: 'userinfo',
          },
        },
        {
          $unwind: '$userinfo',
        },
        {
          $project: {
            _id: 1,
            formationId: 1,
            defenseStyle: 1,
            defenseWidth: 1,
            defenseDepth: 1,
            offenseStyle: 1,
            offenseWidth: 1,
            corners: 1,
            freeKicks: 1,
            offensePlayersInBox: 1,
            positions: 1,
            redditUrl: 1,
            squadUrl: 1,
            guideUrl: 1,
            description: 1,
            tags: 1,
            createdAt: 1,
            userId: 1,
            'userinfo._id': 1,
            'userinfo.login': 1,
          },
        },
      ]);

      if (!tactic.length) {
        return res.status(400).json({
          message: 'There was a problem',
        });
      }

      return res.json({
        tactic,
      });
    } catch (err) {
      return res.status(400).json({
        message: 'There was a problem',
      });
    }
  },

  async create(req, res) {
    try {
      const { sub } = req.user;

      const tacticData = {
        ...req.body,
        userId: sub,
        createdAt: new Date().getTime(),
      };

      const newTactic = new Tactic(tacticData);
      const savedTactic = await newTactic.save();

      if (!savedTactic) {
        return res.status(400).json({
          message: 'There was a problem creating new tactic',
        });
      }

      const { id } = savedTactic;

      const tacticInfo = {
        id,
      };

      return res.json({
        message: 'Tactic created!',
        tacticInfo,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'There was a problem creating new tactic',
      });
    }
  },

  async update(req, res) {
    try {
      const { sub } = req.user;

      const inputTacticId = req.body.meta.id;

      // find tactic

      // tactic = { ...req.body }

      // tactic.save()

      const tacticData = {
        ...req.body,
        userId: sub,
        createdAt: new Date().getTime(),
      };

      const newTactic = new Tactic(tacticData);
      const savedTactic = await newTactic.save();

      if (!savedTactic) {
        return res.status(400).json({
          message: 'There was a problem creating new tactic',
        });
      }

      const { id } = savedTactic;

      const tacticInfo = {
        id,
      };

      return res.json({
        message: 'Tactic created!',
        tacticInfo,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'There was a problem creating new tactic',
      });
    }
  },
};
