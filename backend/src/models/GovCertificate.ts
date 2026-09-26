import mongoose, { Document, Schema } from "mongoose";

export interface IGovCertificate extends Document {
  src: string;
  label: string;
  sub: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const govCertificateSchema = new Schema<IGovCertificate>(
  {
    src: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    sub: {
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

const GovCertificate =
  mongoose.models.GovCertificate ||
  mongoose.model<IGovCertificate>(
    "GovCertificate",
    govCertificateSchema
  );

export default GovCertificate;