import { db, casesTable, documentsTable, findingsTable, courtSessionsTable, courtRoundsTable, motionsTable, categoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

const DEMO_CASE_NUMBER = "DEMO-2018CF000847";

export async function seedCategories(): Promise<void> {
  const STANDARD_CATEGORIES: { name: string; badgeLabel: string; description: string; color: string }[] = [
    { name: "Miranda/5th Amendment", badgeLabel: "Miranda", description: "Violations of Miranda rights and Fifth Amendment self-incrimination protections", color: "red" },
    { name: "Brady/Giglio", badgeLabel: "Brady", description: "Suppression of exculpatory or impeachment evidence by the prosecution", color: "orange" },
    { name: "IAC — Trial Counsel", badgeLabel: "IAC Trial", description: "Ineffective assistance of trial counsel under Strickland v. Washington", color: "yellow" },
    { name: "IAC — Appellate Counsel", badgeLabel: "IAC Appeal", description: "Ineffective assistance of appellate counsel", color: "yellow" },
    { name: "Prosecutorial Misconduct", badgeLabel: "Pros. Misconduct", description: "Improper conduct by the prosecution during trial or investigation", color: "red" },
    { name: "4th Amendment", badgeLabel: "4th Amend.", description: "Unlawful searches and seizures in violation of the Fourth Amendment", color: "blue" },
    { name: "Confrontation Clause", badgeLabel: "Confrontation", description: "Violations of the Sixth Amendment right to confront witnesses", color: "blue" },
    { name: "Jury Instructions", badgeLabel: "Jury Instr.", description: "Erroneous or misleading jury instructions affecting the verdict", color: "purple" },
    { name: "Chain of Custody", badgeLabel: "Chain of Custody", description: "Breaks or irregularities in evidence chain of custody", color: "gray" },
    { name: "Eyewitness Identification", badgeLabel: "Eyewitness ID", description: "Unreliable or improperly obtained eyewitness identifications", color: "orange" },
    { name: "Coerced Confession", badgeLabel: "Coerced Conf.", description: "Confessions obtained through coercion, duress, or improper inducement", color: "red" },
    { name: "Sentencing Error", badgeLabel: "Sentencing", description: "Legal errors in sentencing, including improper enhancements or calculations", color: "purple" },
    { name: "Jury Selection/Batson", badgeLabel: "Batson", description: "Discriminatory use of peremptory challenges under Batson v. Kentucky", color: "teal" },
    { name: "Forensic/Scientific Evidence", badgeLabel: "Forensic", description: "Issues with forensic or scientific evidence reliability and admissibility", color: "green" },
    { name: "Newly Discovered Evidence", badgeLabel: "New Evidence", description: "Evidence discovered after trial that could affect the verdict", color: "green" },
    { name: "Actual Innocence", badgeLabel: "Actual Innocence", description: "Claims of factual innocence supported by new or overlooked evidence", color: "green" },
    { name: "Double Jeopardy", badgeLabel: "Double Jeopardy", description: "Prosecution or punishment in violation of double jeopardy protections", color: "blue" },
    { name: "Speedy Trial", badgeLabel: "Speedy Trial", description: "Violations of the Sixth Amendment right to a speedy trial", color: "blue" },
    { name: "Government Informant", badgeLabel: "Informant", description: "Issues with undisclosed or unreliable government informants", color: "orange" },
    { name: "Due Process", badgeLabel: "Due Process", description: "Violations of procedural or substantive due process rights", color: "blue" },
    { name: "Expert Witness", badgeLabel: "Expert Witness", description: "Improper admission or exclusion of expert witness testimony", color: "gray" },
    { name: "Cumulative Error", badgeLabel: "Cumulative Error", description: "Prejudice resulting from the cumulative effect of multiple trial errors", color: "purple" },
    { name: "Plea Voluntariness", badgeLabel: "Plea", description: "Challenges to the knowing or voluntary nature of a guilty plea", color: "yellow" },
    { name: "Conflict of Interest", badgeLabel: "Conflict", description: "Defense counsel operating under an actual or potential conflict of interest", color: "red" },
  ];

  try {
    const existing = await db
      .select({ name: categoriesTable.name })
      .from(categoriesTable);

    const existingNames = existing.map((r) => r.name.toLowerCase());
    const toInsert = STANDARD_CATEGORIES.filter((cat) => !existingNames.includes(cat.name.toLowerCase()));

    if (toInsert.length === 0) {
      logger.info("All standard categories already exist");
      return;
    }

    await db.insert(categoriesTable).values(toInsert);
    logger.info({ count: toInsert.length }, "Seeded standard categories");
  } catch (err) {
    logger.error({ err }, "Failed to seed categories");
  }
}

export async function seedDemoCase(): Promise<void> {
  try {
    const existing = await db
      .select({ id: casesTable.id })
      .from(casesTable)
      .where(eq(casesTable.caseNumber, DEMO_CASE_NUMBER))
      .limit(1);

    if (existing.length > 0) {
      logger.info({ caseId: existing[0].id }, "Demo case already exists");
      return;
    }

    logger.info("Seeding demo case...");

    await db.transaction(async (tx) => {
      const [demoCase] = await tx
        .insert(casesTable)
        .values({
          userId: 1,
          title: "State v. Marcus Johnson — DEMO",
          defendantName: "Marcus Deon Johnson",
          caseNumber: DEMO_CASE_NUMBER,
          jurisdiction: "Milwaukee County Circuit Court, State of Wisconsin",
          notes: "DEMO CASE — Pre-loaded example showing CaseLight's full analysis capabilities.",
          hasAnalysis: false,
          hasMotion: false,
        })
        .returning();

      const [demoDoc] = await tx
        .insert(documentsTable)
        .values({
          caseId: demoCase.id,
          title: "Trial Transcript — Day 3",
          documentType: "transcript",
          content: "STATE OF WISCONSIN CIRCUIT COURT — MILWAUKEE COUNTY...",
          status: "pending",
        })
        .returning();

      logger.info({ caseId: demoCase.id }, "Demo case seeded successfully");
    });
  } catch (err) {
    logger.error({ err }, "Failed to seed demo case");
  }
}

export async function getDemoCaseId(): Promise<number | null> {
  try {
    const rows = await db
      .select({ id: casesTable.id })
      .from(casesTable)
      .where(eq(casesTable.caseNumber, DEMO_CASE_NUMBER))
      .limit(1);
    return rows[0]?.id ?? null;
  } catch (err) {
    logger.error({ err }, "Failed to get demo case ID");
    return null;
  }
}
