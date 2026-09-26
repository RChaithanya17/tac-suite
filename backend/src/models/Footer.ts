import mongoose, { Document, Schema } from "mongoose";

export interface IFooterLink {
  label: string;
  href: string;
}

export interface IFooterSocialLink {
  label: string;
  href: string;
}

export interface IFooterContact {
  addressLines: string[];
  phone: string;
  phoneHref: string;
  admissionsEmail: string;
  admissionsEmailHref: string;
}

export interface IFooterBadge {
  label: string;
}

export interface IFooter extends Document {
  socialLinks: IFooterSocialLink[];
  footerContact: IFooterContact;
  courseAboutLinks: IFooterLink[];
  legalLinks: IFooterLink[];
  footerBadges: IFooterBadge[];
  copyright: string;
  marketingStatement: string;
  createdAt: Date;
  updatedAt: Date;
}

const footerLinkSchema = new Schema<IFooterLink>(
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

const footerSocialLinkSchema = new Schema<IFooterSocialLink>(
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

const footerContactSchema = new Schema<IFooterContact>(
  {
    addressLines: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: "At least one address line is required",
      },
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    phoneHref: {
      type: String,
      required: true,
      trim: true,
    },

    admissionsEmail: {
      type: String,
      required: true,
      trim: true,
    },

    admissionsEmailHref: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const footerBadgeSchema = new Schema<IFooterBadge>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const footerSchema = new Schema<IFooter>(
  {
    socialLinks: {
      type: [footerSocialLinkSchema],
      required: true,
    },

    footerContact: {
      type: footerContactSchema,
      required: true,
    },

    courseAboutLinks: {
      type: [footerLinkSchema],
      required: true,
    },

    legalLinks: {
      type: [footerLinkSchema],
      required: true,
    },

    footerBadges: {
      type: [footerBadgeSchema],
      required: true,
    },

    copyright: {
      type: String,
      required: true,
      trim: true,
    },

    marketingStatement: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Footer =
  mongoose.models.Footer ||
  mongoose.model<IFooter>("Footer", footerSchema);

export default Footer;