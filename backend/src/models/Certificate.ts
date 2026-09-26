import mongoose, { Document, Schema } from "mongoose";

export interface ICertificateFeature {
  title: string;
  desc: string;
}

export interface ICertificate extends Document {
  heading: string;
  description: string;

  issuerName: string;
  certificateSubtitle: string;
  certificateDescription: string;

  issuedBy: string;
  recognition: string;
  status: string;

  certificateImage: string;

  badgeText: string;

  features: ICertificateFeature[];

  packageText: string;
  packageDescription: string;

  createdAt: Date;
  updatedAt: Date;
}

const certificateFeatureSchema = new Schema<ICertificateFeature>(
  {
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
  {
    _id: false,
  }
);

const certificateSchema = new Schema<ICertificate>(
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

    issuerName: {
      type: String,
      required: true,
      trim: true,
    },

    certificateSubtitle: {
      type: String,
      required: true,
      trim: true,
    },

    certificateDescription: {
      type: String,
      required: true,
      trim: true,
    },

    issuedBy: {
      type: String,
      required: true,
      trim: true,
    },

    recognition: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      required: true,
      trim: true,
    },

    certificateImage: {
      type: String,
      required: true,
      trim: true,
    },

    badgeText: {
      type: String,
      required: true,
      trim: true,
    },

    features: {
      type: [certificateFeatureSchema],
      required: true,
      validate: {
        validator: (value: ICertificateFeature[]) => value.length > 0,
        message: "At least one certificate feature is required",
      },
    },

    packageText: {
      type: String,
      required: true,
      trim: true,
    },

    packageDescription: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Certificate =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>("Certificate", certificateSchema);

export default Certificate;