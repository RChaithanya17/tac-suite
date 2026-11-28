import mongoose, { Document, Schema } from "mongoose";

export interface IStudentWork extends Document {
  image: string;
  text: string;
  // Optional display priority: 1 shows first. Posters without one follow,
  // newest first.
  priority?: number | null;
  // Optional end position: posters with one are shown last (1 first of the
  // end group). Ignored when priority is set.
  endOrder?: number | null;
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
    priority: {
      type: Number,
      min: 1,
      default: null,
    },
    endOrder: {
      type: Number,
      min: 1,
      default: null,
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