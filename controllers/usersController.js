import User from '../models/User';

export default {
  async findAll(req, res) {
    try {
      const users = await User.find().lean().select('_id login email role');

      return res.json({
        users,
      });
    } catch (err) {
      return res.status(400).json({
        message: 'There was a problem getting the users',
      });
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findOne({
        _id: id,
      })
        .lean()
        .select('_id login email role');

      return res.json({
        user,
      });
    } catch (err) {
      return res.status(400).json({
        message: 'There was a problem',
      });
    }
  },
};
