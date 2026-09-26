import mongoose, { Document, Schema } from "mongoose";

export interface IPlacementSection extends Document {
  eyebrow: string;
  heading: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const placementSectionSchema =
  new Schema<IPlacementSection>(
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
    },
    {
      timestamps: true,
    }
  );

const PlacementSection =
  mongoose.models.PlacementSection ||
  mongoose.model<IPlacementSection>(
    "PlacementSection",
    placementSectionSchema
  );

export default PlacementSection;