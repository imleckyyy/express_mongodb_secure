import mongoose from 'mongoose';

const { Schema } = mongoose;

const tacticModel = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true },
    formationId: { type: Number, required: true },
    defenseStyle: { type: Number, required: true },
    defenseWidth: { type: Number, required: true },
    defenseDepth: { type: Number, required: true },
    offenseStyle: { type: Number, required: true },
    offenseWidth: { type: Number, required: true },
    corners: { type: Number, required: true },
    freeKicks: { type: Number, required: true },
    offensePlayersInBox: { type: Number, required: true },
    positions: { type: String, required: true },
    tags: { type: String },
    description: { type: String },
    redditUrl: { type: String },
    squadUrl: { type: String },
    guideUrl: { type: String },
  },
  { timestamps: true },
);

tacticModel.index({ tags: 'text' });

export default mongoose.model('tactic', tacticModel);
