import dotenv from "dotenv";
import mongoose from "mongoose";
import StudentWork from "../models/StudentWork.js";

dotenv.config();

const studentWorks = [
  { image: "/works/kobbari-matta.webp", text: "KOBBARI MATTA POSTER" },
  { image: "/works/jailer-2.webp", text: "JAILER 2 POSTER" },
  { image: "/works/dragon-full.webp", text: "DRAGON POSTER" },
  { image: "/works/vettuvam-full.webp", text: "VETTUVAM POSTER" },
  { image: "/works/dada-full.webp", text: "DADA POSTER" },
  { image: "/works/salaar-full.webp", text: "SALAAR POSTER" },
  { image: "/works/satyam-sundaram-full.webp", text: "SATYAM SUNDARAM POSTER" },
  { image: "/works/king-100-full.webp", text: "KING 100 POSTER" },
  { image: "/works/mothish-optimized.webp", text: "PEDDI  POSTER" },
  { image: "/works/nike-from-jpeg.webp", text: "NIKE  POSTER" },
  { image: " /works/biker-optimized.webp", text: "BIKER  POSTER" },
  { image: "/works/Vedam.webp", text: "VEDAM  POSTER" },
  { image: "/works/arjun-optimized.webp", text: "ARJUN REDDY POSTER" },
  { image: "/works/BMW-optimized.webp", text: "BMW POSTER" },
  { image: "/works/PARADISE-optimized.webp", text: "PARADISE POSTER" },
  { image: "/works/DASARA-optimized.webp", text: "DASARA POSTER" },
  { image: "/works/ISLAND-optimized.webp", text: "ISLAND POSTER" },
  { image: "/works/NK-optimized.webp", text: "NUVVE KAVALI POSTER" },
  { image: "/works/NIKE-optimized.webp", text: "NIKE POSTER" },
  { image: "/works/PORSCHE-optimized.webp", text: "PORSCHE POSTER" },
  { image: "/works/JAGUAR-optimized.webp", text: "JAGUAR POSTER" },
  { image: "/works//works/FOOD-optimized.webp", text: "FOOD POSTER 2" },
  { image: "/works/KAADHAL-optimized.webp", text: "KAADHAL POSTER" },
  { image: "/works/GTR-optimized.webp", text: "PORSCHE GTR POSTER" },
  { image: "/works/FOOD1-optimized.webp", text: "FOOD POSTER 1" },
  {
    image: " /works/baahubali-eternal-war.webp",
    text: "BAAHUBALI POSTER",
  },
  { image: "/works/irumudi-2.webp", text: "IRUMUDI POSTER" },
  { image: "/works/rao-bahadur-1.webp", text: "RAO BAHADUR POSTER" },
  { image: "/works/dc.webp", text: "DC POSTER" },
  { image: "/works/panja.webp", text: "PANJA POSTER" },
  // Photoshop ZIP additions
  { image: "/works/ps-pallichattambi-1.webp", text: "PALLICHATTAMBI POSTER" },
  { image: "/works/ps-avengers-doomsday-2.webp", text: "AVENGERS DOOMSDAY POSTER" },
  { image: "/works/ps-the-batman-3.webp", text: "THE BATMAN POSTER" },
  { image: "/works/ps-dc-4.webp", text: "DC POSTER" },
  { image: "/works/ps-the-paradise-5.webp", text: "THE PARADISE POSTER" },
  { image: "/works/ps-dacoit-6-full.webp", text: "DACOIT POSTER" },
  { image: "/works/ps-hanuman-jayanthi-7.webp", text: "HANUMAN JAYANTHI POSTER" },
  { image: "/works/ps-spirit-8.webp", text: "SPIRIT POSTER" },
  { image: "/works/ps-jailer-2-9.webp", text: "JAILER 2 POSTER" },
  { image: "/works/ps-rk-x-kh-10.webp", text: "RK X KH POSTER" },
  { image: "/works/ps-karuppu-11.webp", text: "KARUPPU POSTER" },
  { image: "/works/ps-dc-13.webp", text: "DC POSTER" },
  { image: "/works/ps-sony-headphones-14.webp", text: "SONY HEADPHONES POSTER" },
  { image: "/works/ps-the-paradise-teaser-15.webp", text: "THE PARADISE TEASER POSTER" },
  { image: "/works/ps-chicken-dum-biryani-16.webp", text: "CHICKEN DUM BIRYANI POSTER" },
  { image: "/works/ps-the-brew-cafe-17-full.webp", text: "THE BREW CAFE POSTER" },
  { image: "/works/ps-rk-catering-18.webp", text: "RK CATERING POSTER" },
  { image: "/works/ps-strawberry-ice-cream-19.webp", text: "STRAWBERRY ICE CREAM POSTER" },
  { image: "/works/ps-juice-corner-20.webp", text: "JUICE CORNER POSTER" },
  { image: "/works/ps-pizza-21.webp", text: "PIZZA POSTER" },
  { image: "/works/ps-salon-22.webp", text: "SALON POSTER" },
  { image: "/works/ps-skin-serum-23.webp", text: "SKIN SERUM POSTER" },
  { image: "/works/ps-tokvue-new-arrival-24.webp", text: "TOKVUE NEW ARRIVAL POSTER" },
  { image: "/works/ps-spider-man-25.webp", text: "SPIDER-MAN POSTER" },
  { image: "/works/ps-baahubali-the-epic-26-full.webp", text: "BAAHUBALI THE EPIC POSTER" },
  { image: "/works/ps-the-paradise-27.webp", text: "THE PARADISE POSTER" },
  { image: "/works/ps-pawan-kalyan-28.webp", text: "PAWAN KALYAN POSTER" },
  { image: "/works/ps-the-paradise-29.webp", text: "THE PARADISE POSTER" },
  { image: "/works/ps-the-paradise-30.webp", text: "THE PARADISE POSTER" },
  { image: "/works/ps-starbucks-31.webp", text: "STARBUCKS POSTER" },
  { image: "/works/ps-peddi-33.webp", text: "PEDDI POSTER" },
  { image: "/works/ps-darling-34.webp", text: "DARLING POSTER" },
  { image: "/works/ps-sunrisers-hyderabad-36.webp", text: "SUNRISERS HYDERABAD POSTER" },
  { image: "/works/ps-spicy-chicken-biryani-37.webp", text: "SPICY CHICKEN BIRYANI POSTER" },
  { image: "/works/ps-spider-man-38.webp", text: "SPIDER-MAN POSTER" },
  { image: "/works/ps-toxic-39.webp", text: "TOXIC POSTER" },
  { image: "/works/ps-peddi-40.webp", text: "PEDDI POSTER" },
  { image: "/works/ps-the-paradise-41.webp", text: "THE PARADISE POSTER" },
  { image: "/works/ps-the-rajasaab-42-full.webp", text: "THE RAJASAAB POSTER" },
  { image: "/works/ps-baahubali-43-full.webp", text: "BAAHUBALI POSTER" },
  { image: "/works/ps-the-paradise-44.webp", text: "THE PARADISE POSTER" },
  { image: "/works/ps-varanasi-45-full.webp", text: "VARANASI POSTER" },
  { image: "/works/ps-peddi-46.webp", text: "PEDDI POSTER" },
  { image: "/works/ps-spider-man-47-full.webp", text: "SPIDER-MAN POSTER" },
  { image: "/works/ps-spider-noir-48.webp", text: "SPIDER-NOIR POSTER" },
  { image: "/works/ps-narcos-mexico-49.webp", text: "NARCOS MEXICO POSTER" },
  { image: "/works/ps-avengers-doomsday-50.webp", text: "AVENGERS DOOMSDAY POSTER" },
  { image: "/works/ps-electrical-services-51.webp", text: "ELECTRICAL SERVICES POSTER" },
  { image: "/works/ps-f1-the-movie-52.webp", text: "F1 THE MOVIE POSTER" },
  { image: "/works/ps-flower-shop-53.webp", text: "FLOWER SHOP POSTER" },
  { image: "/works/ps-tanishq-54.webp", text: "TANISHQ POSTER" },
  { image: "/works/ps-fitness-55.webp", text: "FITNESS POSTER" },
  { image: "/works/ps-train-hard-56.webp", text: "TRAIN HARD POSTER" },
  { image: "/works/ps-gym-57.webp", text: "GYM POSTER" },
  { image: "/works/ps-shape-your-body-58-full.webp", text: "SHAPE YOUR BODY POSTER" },
  { image: "/works/ps-cocktail-59.webp", text: "COCKTAIL POSTER" },
  { image: "/works/ps-denim-fusion-60.webp", text: "DENIM FUSION POSTER" },
  { image: "/works/ps-biryani-61.webp", text: "BIRYANI POSTER" },
  { image: "/works/ps-lenin-62.webp", text: "LENIN POSTER" },
  { image: "/works/ps-vogue-63-full.webp", text: "VOGUE POSTER" },
  { image: "/works/ps-photo-manipulation-64-full.webp", text: "PHOTO MANIPULATION POSTER" },
  { image: "/works/ps-photo-manipulation-65-full.webp", text: "PHOTO MANIPULATION POSTER" },
  { image: "/works/ps-money-heist-66.webp", text: "MONEY HEIST POSTER" },
  { image: "/works/ps-hit-67.webp", text: "HIT POSTER" },
  { image: "/works/ps-toxic-68.webp", text: "TOXIC POSTER" },
  { image: "/works/ps-anirudh-live-69-full.webp", text: "ANIRUDH LIVE POSTER" },
  { image: "/works/ps-the-odyssey-70.webp", text: "THE ODYSSEY POSTER" },
  { image: "/works/ps-wild-stone-71.webp", text: "WILD STONE POSTER" },
  { image: "/works/ps-villain-perfume-72.webp", text: "VILLAIN PERFUME POSTER" },
  { image: "/works/ps-pet-care-73.webp", text: "PET CARE POSTER" },
  { image: "/works/ps-pet-shop-74.webp", text: "PET SHOP POSTER" },
  { image: "/works/ps-photography-75.webp", text: "PHOTOGRAPHY POSTER" },
  { image: "/works/ps-podcast-studio-76.webp", text: "PODCAST STUDIO POSTER" },
  { image: "/works/ps-porsche-gt3-rs-77.webp", text: "PORSCHE GT3 RS POSTER" },
  { image: "/works/ps-porsche-911-78.webp", text: "PORSCHE 911 POSTER" },
  { image: "/works/ps-rao-bahadur-79.webp", text: "RAO BAHADUR POSTER" },
  { image: "/works/ps-chicken-biryani-80.webp", text: "CHICKEN BIRYANI POSTER" },
  { image: "/works/ps-samosa-81.webp", text: "SAMOSA POSTER" },
  { image: "/works/ps-bmw-m1000rr-82.webp", text: "BMW M1000RR POSTER" },
  { image: "/works/ps-glow-serum-83.webp", text: "GLOW SERUM POSTER" },
  { image: "/works/ps-spa-84.webp", text: "SPA POSTER" },
  { image: "/works/ps-spider-man-85.webp", text: "SPIDER-MAN POSTER" },
  { image: "/works/ps-england-jersey-86.webp", text: "ENGLAND JERSEY POSTER" },
  { image: "/works/ps-smart-bazaar-87.webp", text: "SMART BAZAAR POSTER" },
  { image: "/works/ps-tac-88.webp", text: "TAC POSTER" },
  { image: "/works/ps-vaazha-ii-89-full.webp", text: "VAAZHA II POSTER" },
  { image: "/works/ps-organic-vegetables-90.webp", text: "ORGANIC VEGETABLES POSTER" },
  { image: "/works/ps-watch-91.webp", text: "WATCH POSTER" },
  { image: "/works/ps-fashion-92.webp", text: "FASHION POSTER" },
  { image: "/works/ps-yoga-93.webp", text: "YOGA POSTER" },
  { image: "/works/ps-raw-talks-94-full.webp", text: "RAW TALKS POSTER" },
  { image: "/works/ps-ielts-coaching-95.webp", text: "IELTS COACHING POSTER" },
  { image: "/works/ps-live-music-96.webp", text: "LIVE MUSIC POSTER" },
  { image: "/works/ps-dance-class-97.webp", text: "DANCE CLASS POSTER" },
  { image: "/works/ps-healthcare-98.webp", text: "HEALTHCARE POSTER" },
  { image: "/works/ps-baahubali-trailer-99-full.webp", text: "BAAHUBALI TRAILER POSTER" },
  { image: "/works/ps-the-odyssey-100.webp", text: "THE ODYSSEY POSTER" },
  { image: "/works/ps-stranger-things-101-full.webp", text: "STRANGER THINGS POSTER" },
  { image: "/works/ps-spider-man-102.webp", text: "SPIDER-MAN POSTER" },
  { image: "/works/ps-premium-biryani-103.webp", text: "PREMIUM BIRYANI POSTER" },
  { image: "/works/ps-with-love-104.webp", text: "WITH LOVE POSTER" },
];

const seedStudentWorks = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is missing from backend/.env");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected.");

    const existingCount = await StudentWork.countDocuments();

    if (existingCount > 0) {
      console.log(
        `Student Works already contain ${existingCount} records.`
      );
      console.log("Seed cancelled to prevent duplicate records.");

      await mongoose.disconnect();
      return;
    }

    await StudentWork.insertMany(studentWorks);

    console.log(
      `Student Works seeded successfully: ${studentWorks.length} records.`
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error("Failed to seed Student Works:", error);

    await mongoose.disconnect();

    process.exit(1);
  }
};

seedStudentWorks();