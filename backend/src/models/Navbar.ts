import mongoose, { Document, Schema } from "mongoose";

export interface INavbarLink {
  label: string;
  href: string;
}

export interface INavbar extends Document {
  announcement: string;
  navigationLinks: INavbarLink[];
  createdAt: Date;
  updatedAt: Date;
}

const navbarLinkSchema = new Schema<INavbarLink>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    href: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const navbarSchema = new Schema<INavbar>(
  {
    announcement: {
      type: String,
      required: true,
      trim: true,
    },

    navigationLinks: {
      type: [navbarLinkSchema],
      required: true,
      validate: {
        validator: (value: INavbarLink[]) => value.length > 0,
        message: "At least one navigation link is required.",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Navbar =
  mongoose.models.Navbar ||
  mongoose.model<INavbar>("Navbar", navbarSchema);

export default Navbar;