import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ quiet: true });

const checkDb = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      serverSelectionTimeoutMS: 15000,
    });

    const db = mongoose.connection.db!;
    const collections = (await db.listCollections().toArray()).map((c) => c.name);
    const admins = await db.collection("admins").find({}, { projection: { email: 1 } }).toArray();

    console.log("Connected. Database:", mongoose.connection.name);
    console.log("Collections:", collections.join(", ") || "(none)");
    console.log("Admins:", admins.map((a) => a.email).join(", ") || "(none)");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Connection failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

checkDb();
