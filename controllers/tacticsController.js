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

      const currentPage = query.page ? parseInt(query.page, 10) - 1 : 0;

      const itemsPerPage = 2;
      const itemsOffset = itemsPerPage * currentPage;

      const tactics = await Tactic.aggregate([
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $limit: itemsPerPage + itemsOffset },
        { $skip: itemsOffset },
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

      console.log(tactics);

      const countTactics = await Tactic.countDocuments(match);

      const pageInfo = {
        items: countTactics,
        pages: Math.ceil(countTactics / itemsPerPage),
      };

      return res.json({
        tactics,
        pageInfo,
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
      const { sub, role } = req.user;

      const inputTacticData = req.body;
      const inputTacticId = new mongoose.Types.ObjectId(inputTacticData.id);
      const inputTacticAuthorId = inputTacticData.userId;

      const tactic = await Tactic.findOne({
        _id: inputTacticId,
        userId: new mongoose.Types.ObjectId(inputTacticAuthorId),
      }).lean();

      if (!tactic) {
        return res.status(400).json({
          message: 'There was a problem with finding edited tactic',
        });
      }

      if (sub !== inputTacticAuthorId && role !== 'admin') {
        return res.status(400).json({
          message: `You don't have permission for this action`,
        });
      }

      delete inputTacticData.userName;
      delete inputTacticData.userId;
      delete inputTacticData.id;

      const savedTactic = await Tactic.findOneAndUpdate(
        {
          _id: inputTacticId,
          userId: new mongoose.Types.ObjectId(inputTacticAuthorId),
        },
        inputTacticData,
        {
          new: true,
        },
      );

      if (!savedTactic) {
        return res.status(400).json({
          message: 'There was a problem with saving tactic',
        });
      }

      const { id } = savedTactic;

      const tacticInfo = {
        id,
      };

      return res.json({
        message: 'Tactic updated!',
        tacticInfo,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'There was a problem with editing tactic',
      });
    }
  },

  async delete(req, res) {
    try {
      const { sub, role } = req.user;

      const { id } = req.params;

      const tactic = await Tactic.findOne({
        _id: id,
      })
        .lean()
        .select('_id userId');

      if (!tactic) {
        return res.status(400).json({
          message: 'There was a problem with finding tactic',
        });
      }

      // results.userId.equals(AnotherMongoDocument._id

      if (sub !== tactic.userId.toString() && role !== 'admin') {
        return res.status(400).json({
          message: `You don't have permission for this action`,
        });
      }

      const deletedItem = await Tactic.deleteOne({
        _id: id,
      });

      if (!deletedItem) {
        return res.status(400).json({
          message: 'There was a problem with deleting tactic',
        });
      }

      return res.json({
        message: 'Tactic deleted!',
      });
    } catch (error) {
      return res.status(400).json({
        message: 'There was a problem with deleting tactic',
      });
    }
  },
};
