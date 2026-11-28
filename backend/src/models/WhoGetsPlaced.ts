import mongoose, { Document, Schema } from "mongoose";

/* Content for the "Who gets placed - and where?" section (single document).
 * Text fields may wrap words in **double asterisks** to show them in bold. */

export interface IWhoGetsPlacedSector {
  count: string;
  label: string;
  color: string;
}

export interface IWhoGetsPlaced extends Document {
  eyebrow: string;
  heading: string;
  movieLabel: string;
  logo: string;
  logoAlt: string;
  movieParagraphs: string[];
  sectorsEyebrow: string;
  companiesHeading: string;
  sectors: IWhoGetsPlacedSector[];
  callout: string;
  createdAt: Date;
  updatedAt: Date;
}

const sectorSchema = new Schema<IWhoGetsPlacedSector>(
  {
    count: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const whoGetsPlacedSchema = new Schema<IWhoGetsPlaced>(
  {
    eyebrow: { type: String, required: true, trim: true },
    heading: { type: String, required: true, trim: true },
    movieLabel: { type: String, required: true, trim: true },
    logo: { type: String, default: "", trim: true },
    logoAlt: { type: String, default: "", trim: true },
    movieParagraphs: { type: [String], default: [] },
    sectorsEyebrow: { type: String, required: true, trim: true },
    companiesHeading: { type: String, required: true, trim: true },
    sectors: { type: [sectorSchema], default: [] },
    callout: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

const WhoGetsPlaced =
  mongoose.models.WhoGetsPlaced ||
  mongoose.model<IWhoGetsPlaced>("WhoGetsPlaced", whoGetsPlacedSchema);

export default WhoGetsPlaced;
