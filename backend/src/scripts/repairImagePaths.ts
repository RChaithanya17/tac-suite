/**
 * One-time repair for broken image paths stored in MongoDB.
 *
 *   1. PlacementStudent.photo  "/students/N.webp" -> "/students/N.png"
 *      for the 27 records listed in EXPECTED_PLACEMENTS
 *   2. StudentWork.image       "/works/PORSCHE.webp" -> "/works/PORSCHE-optimized.webp"
 *      for the single "PORSCHE POSTER" record
 *   3. GovCertificate.src      "/<name>.webp" -> "/<name>.png"
 *      for the 3 records listed in EXPECTED_CERTIFICATES
 *
 * Dry run (default, zero writes):  npx tsx src/scripts/repairImagePaths.ts
 * Apply changes:                   npx tsx src/scripts/repairImagePaths.ts --apply
 *
 * Run from the backend/ directory so dotenv finds backend/.env.
 *
 * The script is resumable: every expected record is classified as BROKEN
 * (needs the fix) or REPAIRED (already holds the exact target value). Writes
 * happen only when every expected record is in one of those two states and
 * nothing else in the collections looks like it is in scope. After a partial
 * run, re-running fixes only the records still BROKEN.
 */
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import PlacementStudent from "../models/PlacementStudent.js";
import StudentWork from "../models/StudentWork.js";
import GovCertificate from "../models/GovCertificate.js";

dotenv.config({ quiet: true });

const APPLY = process.argv.includes("--apply");

const PUBLIC_DIR = path.resolve(__dirname, "../../../public");
const PLACEMENT_PHOTO_PATTERN = /^\/students\/(\d+)\.webp$/;

// The 27 placement records confirmed broken via GET /api/placements/students.
// Each is identified by name + section (unique together) and the photo number
// it must keep. Records 9, 19 and 29 use "-optimized.webp" files and are not
// listed, so they can never be touched.
const EXPECTED_PLACEMENTS: { name: string; section: "top" | "bottom"; n: number }[] = [
  { name: "Vijay Kumar", section: "top", n: 1 },
  { name: "Upendra", section: "top", n: 2 },
  { name: "Supriya", section: "top", n: 3 },
  { name: "Shanmukh", section: "top", n: 4 },
  { name: "Sandeep", section: "top", n: 5 },
  { name: "Sahil", section: "top", n: 6 },
  { name: "Sagar", section: "top", n: 7 },
  { name: "Manish", section: "top", n: 8 },
  { name: "Karthik", section: "top", n: 10 },
  { name: "Jeevan", section: "top", n: 11 },
  { name: "Gowtham", section: "top", n: 25 },
  { name: "Kundhan", section: "top", n: 26 },
  { name: "Navaneeth", section: "top", n: 28 },
  { name: "Vishnu", section: "top", n: 30 },
  { name: "Vijay Daniel", section: "bottom", n: 12 },
  { name: "Balu", section: "bottom", n: 13 },
  { name: "Anirudh", section: "bottom", n: 14 },
  { name: "Anand", section: "bottom", n: 15 },
  { name: "Arjun", section: "bottom", n: 16 },
  { name: "Karthik", section: "bottom", n: 17 },
  { name: "Rohit", section: "bottom", n: 18 },
  { name: "Durgesh", section: "bottom", n: 20 },
  { name: "Emmanuel", section: "bottom", n: 21 },
  { name: "Hemanth", section: "bottom", n: 22 },
  { name: "Lokesh", section: "bottom", n: 23 },
  { name: "Siri", section: "bottom", n: 24 },
  { name: "Virajitha", section: "bottom", n: 27 },
];

const EXPECTED_PLACEMENT_SCOPE = 27;

const PORSCHE_TEXT = "PORSCHE POSTER";
const PORSCHE_OLD = "/works/PORSCHE.webp";
const PORSCHE_NEW = "/works/PORSCHE-optimized.webp";

// The 3 Government Certificate records confirmed broken via
// GET /api/gov-certificates. label and order are checked as well as _id so a
// reused or reordered record is reported instead of being changed.
const EXPECTED_CERTIFICATES: {
  id: string;
  label: string;
  order: number;
  before: string;
  after: string;
}[] = [
  { id: "6ab24a6730c84721d6e42ecf", label: "MSME Registered", order: 1, before: "/dpiit.webp", after: "/dpiit.png" },
  { id: "6ab24a6730c84721d6e42ed0", label: "TAC Certified", order: 2, before: "/001.webp", after: "/001.png" },
  { id: "6ab24a6730c84721d6e42ed1", label: "DPIIT Recognised", order: 3, before: "/msme.webp", after: "/msme.png" },
];

const EXPECTED_CERTIFICATE_SCOPE = 3;

type PlannedChange = {
  id: string;
  label: string;
  before: string;
  after: string;
};

type Plan = {
  broken: PlannedChange[];
  repaired: PlannedChange[];
  problems: string[];
};

type ApplyResult = {
  updated: PlannedChange[];
  conflicts: PlannedChange[];
  failed: { change: PlannedChange; error: string }[];
};

const publicFileExists = (urlPath: string): boolean =>
  fs.existsSync(path.join(PUBLIC_DIR, urlPath));

// Strip anything that looks like a connection string from error output.
const redact = (message: string): string =>
  message.replace(/mongodb(\+srv)?:\/\/\S+/gi, "mongodb://[redacted]");

const errorMessage = (error: unknown): string =>
  redact(error instanceof Error ? error.message : String(error));

const planPlacementChanges = async (): Promise<Plan> => {
  const plan: Plan = { broken: [], repaired: [], problems: [] };

  if (EXPECTED_PLACEMENTS.length !== EXPECTED_PLACEMENT_SCOPE) {
    plan.problems.push(
      `Manifest lists ${EXPECTED_PLACEMENTS.length} records, expected ${EXPECTED_PLACEMENT_SCOPE}`
    );
    return plan;
  }

  const students = await PlacementStudent.find({}, { photo: 1, name: 1, section: 1 })
    .sort({ createdAt: 1 })
    .lean();

  const claimedIds = new Set<string>();

  for (const expected of EXPECTED_PLACEMENTS) {
    const label = `${expected.name} [${expected.section}]`;
    const brokenPath = `/students/${expected.n}.webp`;
    const fixedPath = `/students/${expected.n}.png`;

    const matches = students.filter(
      (s) => s.name === expected.name && s.section === expected.section
    );

    if (matches.length !== 1) {
      plan.problems.push(`${label}: expected exactly 1 record, found ${matches.length}`);
      continue;
    }

    const student = matches[0];
    const id = String(student._id);
    claimedIds.add(id);

    if (!publicFileExists(fixedPath)) {
      plan.problems.push(`${label}: target file public${fixedPath} does not exist`);
      continue;
    }

    const change = { id, label, before: brokenPath, after: fixedPath };

    if (student.photo === fixedPath) {
      plan.repaired.push(change);
    } else if (student.photo === brokenPath) {
      if (publicFileExists(brokenPath)) {
        plan.problems.push(`${label}: public${brokenPath} now exists, fix is no longer needed`);
      } else {
        plan.broken.push(change);
      }
    } else {
      plan.problems.push(
        `${label}: photo is "${student.photo}", expected "${brokenPath}" or "${fixedPath}"`
      );
    }
  }

  // Any other record with a "/students/N.webp" path is outside the confirmed
  // scope, which means the data differs from what this script was written for.
  for (const student of students) {
    if (!claimedIds.has(String(student._id)) && PLACEMENT_PHOTO_PATTERN.test(student.photo)) {
      plan.problems.push(
        `${student.name} [${student.section}]: unexpected "${student.photo}" outside the 27-record scope`
      );
    }
  }

  return plan;
};

const planPorscheChange = async (): Promise<Plan> => {
  const plan: Plan = { broken: [], repaired: [], problems: [] };

  // Every record with this text, whatever its image, so duplicates and
  // unexpected paths are caught instead of silently ignored.
  const porscheRecords = await StudentWork.find({ text: PORSCHE_TEXT }, { image: 1, text: 1 }).lean();
  const otherOldPathCount = await StudentWork.countDocuments({
    image: PORSCHE_OLD,
    text: { $ne: PORSCHE_TEXT },
  });

  if (otherOldPathCount > 0) {
    plan.problems.push(`${otherOldPathCount} other record(s) use ${PORSCHE_OLD} with different text`);
  }

  if (!publicFileExists(PORSCHE_NEW)) {
    plan.problems.push(`Target file public${PORSCHE_NEW} does not exist`);
  }

  if (porscheRecords.length !== 1) {
    const found = porscheRecords.map((w) => `${String(w._id)} (${w.image})`).join(", ");
    plan.problems.push(
      `Expected exactly 1 "${PORSCHE_TEXT}" record, found ${porscheRecords.length}` +
        (found ? `: ${found}` : "")
    );
    return plan;
  }

  const [work] = porscheRecords;
  const change = { id: String(work._id), label: work.text, before: PORSCHE_OLD, after: PORSCHE_NEW };

  if (work.image === PORSCHE_OLD) {
    if (publicFileExists(PORSCHE_OLD)) {
      plan.problems.push(`public${PORSCHE_OLD} now exists, fix is no longer needed`);
    } else {
      plan.broken.push(change);
    }
  } else if (work.image === PORSCHE_NEW) {
    plan.repaired.push(change);
  } else {
    plan.problems.push(
      `${change.id} ${PORSCHE_TEXT}: image is "${work.image}", expected "${PORSCHE_OLD}" or "${PORSCHE_NEW}"`
    );
  }

  return plan;
};

const planCertificateChanges = async (): Promise<Plan> => {
  const plan: Plan = { broken: [], repaired: [], problems: [] };

  if (EXPECTED_CERTIFICATES.length !== EXPECTED_CERTIFICATE_SCOPE) {
    plan.problems.push(
      `Manifest lists ${EXPECTED_CERTIFICATES.length} certificates, expected ${EXPECTED_CERTIFICATE_SCOPE}`
    );
    return plan;
  }

  const records = await GovCertificate.find(
    { _id: { $in: EXPECTED_CERTIFICATES.map((c) => c.id) } },
    { src: 1, label: 1, order: 1 }
  ).lean();

  for (const expected of EXPECTED_CERTIFICATES) {
    const label = `${expected.label} (${expected.id})`;
    const matches = records.filter((r) => String(r._id) === expected.id);

    if (matches.length !== 1) {
      plan.problems.push(`${label}: expected exactly 1 record, found ${matches.length}`);
      continue;
    }

    const record = matches[0];

    if (record.label !== expected.label || record.order !== expected.order) {
      plan.problems.push(
        `${label}: identity mismatch, found label "${record.label}" order ${record.order}, ` +
          `expected "${expected.label}" order ${expected.order}`
      );
      continue;
    }

    if (!publicFileExists(expected.after)) {
      plan.problems.push(`${label}: target file public${expected.after} does not exist`);
      continue;
    }

    const change = { id: expected.id, label, before: expected.before, after: expected.after };

    if (record.src === expected.after) {
      plan.repaired.push(change);
    } else if (record.src === expected.before) {
      if (publicFileExists(expected.before)) {
        plan.problems.push(`${label}: public${expected.before} now exists, fix is no longer needed`);
      } else {
        plan.broken.push(change);
      }
    } else {
      plan.problems.push(
        `${label}: src is "${record.src}", expected "${expected.before}" or "${expected.after}"`
      );
    }
  }

  // Other records still using one of the broken paths are outside the
  // confirmed scope, which means the data differs from what this script expects.
  const otherBroken = await GovCertificate.countDocuments({
    _id: { $nin: EXPECTED_CERTIFICATES.map((c) => c.id) },
    src: { $in: EXPECTED_CERTIFICATES.map((c) => c.before) },
  });

  if (otherBroken > 0) {
    plan.problems.push(`${otherBroken} other certificate record(s) use one of the broken .webp paths`);
  }

  return plan;
};

const printPlan = (title: string, plan: Plan): void => {
  console.log(
    `\n${title}: ${plan.broken.length} to fix, ${plan.repaired.length} already repaired, ` +
      `${plan.problems.length} problem(s)`
  );

  for (const change of plan.broken) {
    console.log(`  FIX       ${change.id}  ${change.label}\n            ${change.before}  ->  ${change.after}`);
  }

  for (const change of plan.repaired) {
    console.log(`  ALREADY REPAIRED  ${change.id}  ${change.label}  (${change.after})`);
  }

  for (const problem of plan.problems) {
    console.log(`  PROBLEM   ${problem}`);
  }
};

const applyChanges = async (
  model: typeof PlacementStudent | typeof StudentWork | typeof GovCertificate,
  field: "photo" | "image" | "src",
  changes: PlannedChange[]
): Promise<ApplyResult> => {
  const result: ApplyResult = { updated: [], conflicts: [], failed: [] };

  for (const change of changes) {
    try {
      // The filter includes the old value, so a record edited since the plan
      // was built is left alone instead of being overwritten.
      const outcome = await (model as typeof PlacementStudent).updateOne(
        { _id: change.id, [field]: change.before },
        { $set: { [field]: change.after } },
        { timestamps: false }
      );

      if (outcome.modifiedCount === 1) {
        result.updated.push(change);
        console.log(`  UPDATED   ${change.id}  ${change.label}: ${change.after}`);
      } else {
        result.conflicts.push(change);
        console.log(`  CONFLICT  ${change.id}  ${change.label}: record changed or not found, not updated`);
      }
    } catch (error) {
      const message = errorMessage(error);
      result.failed.push({ change, error: message });
      console.log(`  FAILED    ${change.id}  ${change.label}: ${message}`);
    }
  }

  return result;
};

const printApplyResult = (title: string, planned: number, result: ApplyResult): void => {
  console.log(
    `  ${title}: ${result.updated.length}/${planned} updated, ` +
      `${result.conflicts.length} conflict(s), ${result.failed.length} failed`
  );

  for (const change of result.updated) {
    console.log(`    UPDATED   ${change.id}  ${change.before} -> ${change.after}`);
  }

  for (const change of result.conflicts) {
    console.log(`    CONFLICT  ${change.id}  ${change.label}`);
  }

  for (const { change, error } of result.failed) {
    console.log(`    FAILED    ${change.id}  ${change.label}: ${error}`);
  }
};

const repairImagePaths = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error("MONGODB_URI is missing from backend/.env");
  }

  if (!fs.existsSync(PUBLIC_DIR)) {
    throw new Error(`Public directory not found: ${PUBLIC_DIR}`);
  }

  console.log(`Mode: ${APPLY ? "APPLY (writes enabled)" : "DRY RUN (no writes)"}`);
  console.log(`Public directory: ${PUBLIC_DIR}`);

  await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 15000 });
  console.log(`Connected. Database: ${mongoose.connection.name}`);

  const placementPlan = await planPlacementChanges();
  const porschePlan = await planPorscheChange();
  const certificatePlan = await planCertificateChanges();

  printPlan("Placement photos", placementPlan);
  printPlan("PORSCHE image", porschePlan);
  printPlan("Government certificates", certificatePlan);

  const placementScope = placementPlan.broken.length + placementPlan.repaired.length;
  const porscheScope = porschePlan.broken.length + porschePlan.repaired.length;
  const certificateScope = certificatePlan.broken.length + certificatePlan.repaired.length;
  const problems = [
    ...placementPlan.problems,
    ...porschePlan.problems,
    ...certificatePlan.problems,
  ];

  if (placementScope !== EXPECTED_PLACEMENT_SCOPE) {
    problems.push(`Placement scope is ${placementScope}, expected ${EXPECTED_PLACEMENT_SCOPE}`);
  }

  if (porscheScope !== 1) {
    problems.push(`PORSCHE scope is ${porscheScope}, expected 1`);
  }

  if (certificateScope !== EXPECTED_CERTIFICATE_SCOPE) {
    problems.push(`Certificate scope is ${certificateScope}, expected ${EXPECTED_CERTIFICATE_SCOPE}`);
  }

  console.log(
    `\nScope: ${placementScope}/${EXPECTED_PLACEMENT_SCOPE} placement, ${porscheScope}/1 PORSCHE, ` +
      `${certificateScope}/${EXPECTED_CERTIFICATE_SCOPE} certificate. ` +
      `Remaining to fix: ${placementPlan.broken.length} placement, ${porschePlan.broken.length} PORSCHE, ` +
      `${certificatePlan.broken.length} certificate.`
  );

  if (problems.length > 0) {
    const message = `Plan is not safe: ${problems.length} problem(s) listed above. No records were changed.`;

    if (!APPLY) {
      console.log(`WARNING: ${message} --apply would abort.`);
      process.exitCode = 1;
      return;
    }

    throw new Error(message);
  }

  if (
    placementPlan.broken.length === 0 &&
    porschePlan.broken.length === 0 &&
    certificatePlan.broken.length === 0
  ) {
    console.log("Everything is already repaired. No records were changed.");
    return;
  }

  if (!APPLY) {
    console.log("Plan verified. Dry run complete: no records were changed.");
    return;
  }

  console.log("\nApplying placement photo fixes...");
  const placementResult = await applyChanges(PlacementStudent, "photo", placementPlan.broken);

  console.log("\nApplying PORSCHE image fix...");
  const porscheResult = await applyChanges(StudentWork, "image", porschePlan.broken);

  console.log("\nApplying government certificate fixes...");
  const certificateResult = await applyChanges(GovCertificate, "src", certificatePlan.broken);

  console.log("\nSummary");
  printApplyResult("Placement records", placementPlan.broken.length, placementResult);
  printApplyResult("Student Works records", porschePlan.broken.length, porscheResult);
  printApplyResult("Government certificate records", certificatePlan.broken.length, certificateResult);

  const incomplete =
    placementResult.conflicts.length + placementResult.failed.length +
    porscheResult.conflicts.length + porscheResult.failed.length +
    certificateResult.conflicts.length + certificateResult.failed.length;

  if (incomplete > 0) {
    console.log(
      `\nREPAIR INCOMPLETE: ${incomplete} record(s) not updated. ` +
        "Run the dry run again to see what remains."
    );
    process.exitCode = 1;
  } else {
    console.log("\nRepair complete: every planned record was updated.");
  }
};

repairImagePaths()
  .catch((error) => {
    console.error(`\nRepair failed: ${errorMessage(error)}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error(`Disconnect failed: ${errorMessage(error)}`);
      process.exitCode = 1;
    }
  });
