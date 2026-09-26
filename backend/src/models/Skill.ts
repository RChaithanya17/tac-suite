import mongoose, { Document, Schema } from "mongoose";
export interface ISkill extends Document {
  id: string;
  title: string;
  desc: string;
  icon: string;
  tags: string[];
  stat: string;
  createdAt: Date;
  updatedAt: Date;
}
const skillSchema = new Schema<ISkill>(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      default: [],
    },
    stat: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
const Skill = mongoose.model<ISkill>("Skill", skillSchema);
export default Skill;
