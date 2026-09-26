import mongoose, { Document, Schema } from "mongoose";

export interface IChallengeStep {
  num: string;
  title: string;
  desc: string;
}

export interface IChallenge extends Document {
  eyebrow: string;
  heading: string;
  description: string;
  buttonText: string;
  steps: IChallengeStep[];
  createdAt: Date;
  updatedAt: Date;
}

const challengeStepSchema = new Schema<IChallengeStep>(
  {
    num: {
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
  },
  { _id: false }
);

const challengeSchema = new Schema<IChallenge>(
  {
    eyebrow: {
      type: String,
      required: true,
      trim: true,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    buttonText: {
      type: String,
      required: true,
      trim: true,
    },
    steps: {
      type: [challengeStepSchema],
      required: true,
      validate: {
        validator: (value: IChallengeStep[]) => value.length > 0,
        message: "At least one challenge step is required.",
      },
    },
  },
  { timestamps: true }
);

const Challenge =
  mongoose.models.Challenge ||
  mongoose.model<IChallenge>("Challenge", challengeSchema);

export default Challenge;