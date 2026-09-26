import mongoose, { Document, Schema } from "mongoose";

export interface ITutor extends Document {
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const tutorSchema = new Schema<ITutor>(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tutor = mongoose.model<ITutor>("Tutor", tutorSchema);

export default Tutor;