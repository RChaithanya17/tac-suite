import mongoose, { Document, Schema } from "mongoose";

export interface IIndustry extends Document {
  id: string;
  title: string;
  image: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const industrySchema = new Schema<IIndustry>(
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

    image: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Industry =
  mongoose.models.Industry ||
  mongoose.model<IIndustry>("Industry", industrySchema);

export default Industry;