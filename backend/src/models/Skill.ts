import mongoose, { Document, Schema } from "mongoose";
export interface ISkill extends Document {
  id: string;
  title: string;
  subtitle?: string;
  desc: string;
  icon: string;
  tags: string[];
  stat?: string;
  track?: string;
  lessons?: string[];
  aiLesson?: string;
  order: number;
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
    subtitle: {
      type: String,
      trim: true,
      default: "",
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
      trim: true,
      default: "",
    },
    track: {
      type: String,
      trim: true,
      default: "",
    },
    lessons: {
      type: [String],
      default: [],
    },
    aiLesson: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const Skill = mongoose.model<ISkill>("Skill", skillSchema);
export default Skill;
