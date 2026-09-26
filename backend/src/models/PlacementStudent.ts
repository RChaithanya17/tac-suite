import mongoose, { Document, Schema } from "mongoose";

export interface IPlacementStudent extends Document {
  photo: string;
  name: string;
  company: string;
  role: string;
  skills: string[];
  lpa?: string;
  section: "top" | "bottom";
  createdAt: Date;
  updatedAt: Date;
}

const placementStudentSchema = new Schema<IPlacementStudent>(
  {
    photo: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    skills: {
      type: [String],
      required: true,
      default: [],
    },

    lpa: {
      type: String,
      trim: true,
    },

    section: {
      type: String,
      enum: ["top", "bottom"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PlacementStudent = mongoose.model<IPlacementStudent>(
  "PlacementStudent",
  placementStudentSchema
);

export default PlacementStudent;