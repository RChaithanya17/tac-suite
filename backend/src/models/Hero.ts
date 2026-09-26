import mongoose, { Document, Schema } from "mongoose";

export interface IHeroStripItem {
  label: string;
  color: string;
  icon: string;
  order: number;
}

export interface IHeroStat {
  val: string;
  label: string;
  order: number;
}

export interface IHero extends Document {
  eyebrow: string;
  heading: string;
  highlight: string;
  outlineText: string;
  description: string;
  ctaText: string;
  videoUrl: string;
  topStripItems: IHeroStripItem[];
  bottomStripItems: IHeroStripItem[];
  stats: IHeroStat[];
  createdAt: Date;
  updatedAt: Date;
}

const heroStripItemSchema = new Schema<IHeroStripItem>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const heroStatSchema = new Schema<IHeroStat>(
  {
    val: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const heroSchema = new Schema<IHero>(
  {
    eyebrow: {
      type: String,
      required: true,
      trim: true,
    },

    heading: {
      type: String,
      required: true,
      trim: true,
    },

    highlight: {
      type: String,
      required: true,
      trim: true,
    },

    outlineText: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    ctaText: {
      type: String,
      required: true,
      trim: true,
    },

    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    topStripItems: {
      type: [heroStripItemSchema],
      required: true,
      default: [],
    },

    bottomStripItems: {
      type: [heroStripItemSchema],
      required: true,
      default: [],
    },

    stats: {
      type: [heroStatSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Hero =
  mongoose.models.Hero ||
  mongoose.model<IHero>("Hero", heroSchema);

export default Hero;