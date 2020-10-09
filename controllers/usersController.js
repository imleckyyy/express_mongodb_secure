import User from '../models/User';
import Tactic from '../models/Tactic';

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
      const { login } = req.params;
      const user = await User.findOne({
        login,
      })
        .lean()
        .select(
          '_id login twitchName youTubeName redditName futbinName futheadName futwizName isVerified',
        );

      if (!user) {
        return res.status(400).json({
          message: 'User not found',
        });
      }

      const itemsLimit = 10;
      const tactics = await Tactic.find({
        userId: user._id,
      })
        .sort({ createdAt: -1 })
        .limit(itemsLimit + 1)
        .lean()
        .select('_id formationId defenseStyle offenseStyle tags userId createdAt');

      const hasMoreTactics = tactics.length > itemsLimit;
      const slicedTactics = hasMoreTactics ? tactics.slice(0, -1) : tactics;

      const tacticsWithUserInfo = slicedTactics.map((item) => {
        return {
          ...item,
          userinfo: {
            _id: user._id,
            login: user.login,
          },
        };
      });

      return res.json({
        user,
        tactics: [...tacticsWithUserInfo],
        hasMoreTactics,
      });
    } catch (err) {
      return res.status(400).json({
        message: 'There was a problem',
      });
    }
  },
};
