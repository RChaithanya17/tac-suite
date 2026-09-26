import mongoose, { Document, Schema } from "mongoose";

export interface IPartner {
  name: string;
}

export interface IPartners extends Document {
  heading: string;
  partners: IPartner[];
  createdAt: Date;
  updatedAt: Date;
}

const partnerSchema = new Schema<IPartner>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const partnersSchema = new Schema<IPartners>(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    partners: {
      type: [partnerSchema],
      required: true,
      validate: {
        validator: (value: IPartner[]) => value.length > 0,
        message: "At least one partner is required.",
      },
    },
  },
  { timestamps: true }
);

const Partners =
  mongoose.models.Partners ||
  mongoose.model<IPartners>("Partners", partnersSchema);

export default Partners;