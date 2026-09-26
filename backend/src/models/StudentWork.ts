import mongoose, { Document, Schema } from "mongoose";

export interface IStudentWork extends Document {
  image: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const studentWorkSchema = new Schema<IStudentWork>(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const StudentWork = mongoose.model<IStudentWork>(
  "StudentWork",
  studentWorkSchema
);

export default StudentWork;