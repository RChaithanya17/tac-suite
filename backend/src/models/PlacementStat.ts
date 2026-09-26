import mongoose, { Document, Schema } from "mongoose";

export interface IPlacementStat extends Document {
  value: string;
  label: string;
  highlight?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const placementStatSchema = new Schema<IPlacementStat>(
  {
    value: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    highlight: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PlacementStat = mongoose.model<IPlacementStat>(
  "PlacementStat",
  placementStatSchema
);

export default PlacementStat;