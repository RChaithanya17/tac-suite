import mongoose, { Document, Schema } from "mongoose";

export interface IStudentWorksSettings extends Document {
  heading: string;
  description: string;
  buttonText: string;
  portfolioUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const studentWorksSettingsSchema = new Schema<IStudentWorksSettings>(
  {
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
    portfolioUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const StudentWorksSettings =
  mongoose.models.StudentWorksSettings ||
  mongoose.model<IStudentWorksSettings>(
    "StudentWorksSettings",
    studentWorksSettingsSchema
  );

export default StudentWorksSettings;