import { Router } from "express";
import { z } from "zod/v4";
import { db, casesTable, findingsTable, reliefPathwaysTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { anthropic } from "../lib/anthropic";
import { logger } from "../lib/logger";

const VALID_STATUSES = ["Completed", "Pending", "Available", "Blocked"] as const;

const stepUpdateSchema = z.object({
  step: z.number().int().min(1).max(6),
  status: z.enum(VALID_STATUSES).optional(),
  completedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").nullable().optional(),
  notes: z.string().nullable().optional(),
});

const putBodySchema = z.object({
  stepUpdates: z.array(stepUpdateSchema).optional(),
  aedpaDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").optional(),
  aedpaTolled: z.boolean().optional(),
});

const router = Router({ mergeParams: true });

type SupportedState = "WI" | "IL" | "MN" | "IN" | "IA" | "MI" | "OH";

type LadderRung = {
  step: number;
  court: string;
  description: string;
};

type ReliefOption = {
  option: string;
  body: string;
  description: string;
  eligibilityNote: string;
};

type StateData = {
  name: string;
  circuit: string;
  ladder: LadderRung[];
  executiveOptions: ReliefOption[];
  administrativeOptions: ReliefOption[];
  ladderPromptInstructions: string;
  executivePromptInstructions: string;
  administrativePromptInstructions: string;
};

const STATE_DATA: Record<SupportedState, StateData> = {
  WI: {
    name: "Wisconsin",
    circuit: "7th Circuit",
    ladder: [
      { step: 1, court: "WI Circuit Court", description: "Trial court — direct post-conviction motion, plea withdrawal, or new trial motion" },
      { step: 2, court: "WI Court of Appeals", description: "Intermediate appellate court — direct appeal or § 974.06 appeal" },
      { step: 3, court: "WI Supreme Court", description: "Discretionary review — petition for review (PDR)" },
      { step: 4, court: "U.S. District Court (E.D. or W.D. Wis.)", description: "Federal habeas under 28 U.S.C. § 2254 — requires exhaustion of state remedies" },
      { step: 5, court: "7th Circuit Court of Appeals", description: "Federal appellate review — requires certificate of appealability (COA)" },
      { step: 6, court: "U.S. Supreme Court", description: "Certiorari — discretionary; only for federal constitutional questions" },
    ],
    executiveOptions: [
      {
        option: "Governor's Pardon",
        body: "Wisconsin Pardon Advisory Board / Governor of Wisconsin",
        description: "A pardon forgives the conviction and restores civil rights. Applicants must complete their sentence (including supervision), wait five years post-discharge, and submit a formal application to the Pardon Advisory Board, which makes recommendations to the Governor. The Governor has sole discretion to grant or deny.",
        eligibilityNote: "Must have completed entire sentence including supervision; minimum five-year waiting period post-discharge required.",
      },
      {
        option: "Sentence Commutation",
        body: "Governor of Wisconsin",
        description: "Commutation reduces an existing sentence without removing the conviction. Applicants may apply directly to the Governor's office. There is no formal board review requirement, though the Governor may consult with the Department of Corrections. Applications must demonstrate compelling circumstances such as rehabilitation, terminal illness, or manifest injustice.",
        eligibilityNote: "No statutory waiting period; Governor has broad discretion to grant, modify, or deny.",
      },
      {
        option: "Wisconsin Parole Commission",
        body: "Wisconsin Parole Commission",
        description: "For prisoners sentenced before December 31, 1999 (indeterminate sentencing), the Parole Commission has jurisdiction to grant discretionary parole. Prisoners are reviewed based on rehabilitation progress, institutional behavior, community support, and risk assessment. Post-1999 sentences use the Truth-in-Sentencing system and are not eligible for parole.",
        eligibilityNote: "Applies only to pre-January 1, 2000 convictions sentenced under indeterminate sentencing law.",
      },
    ],
    administrativeOptions: [
      {
        option: "Program Review Committee (PRC) Earned Release",
        body: "Wisconsin Department of Corrections — Program Review Committee",
        description: "The PRC Earned Release Program allows eligible prisoners to earn early release by completing approved substance abuse treatment programs. After completing the program, the prisoner appears before the PRC, which may recommend early release to the sentencing court. The court retains discretion to approve or deny.",
        eligibilityNote: "Eligible for prisoners whose offense involved alcohol or controlled substance use; serious violent offenders may be excluded.",
      },
      {
        option: "Challenge Incarceration Program (CIP)",
        body: "Wisconsin Department of Corrections",
        description: "CIP is an intensive boot camp-style program combining physical training, substance abuse education, and life skills. Successful completion may result in early release. Participants must be nominated by the sentencing judge or parole board and meet eligibility criteria. The program is typically 6 months.",
        eligibilityNote: "Eligibility determined by sentencing court nomination and DOC screening; excludes certain violent and sex offenders.",
      },
      {
        option: "Wisconsin Risk Reduction Program (WRRP)",
        body: "Wisconsin Department of Corrections",
        description: "WRRP offers cognitive-behavioral programs, vocational training, and educational programming to reduce recidivism risk. Completion of WRRP may positively influence parole decisions, earned release eligibility, and reduce assigned risk scores. Participation is voluntary but documented in institutional records reviewed by the PRC.",
        eligibilityNote: "Available to most incarcerated individuals; participation documented in institutional file used for earned release and parole reviews.",
      },
    ],
    ladderPromptInstructions: "Assess each of the 6 Wisconsin ladder steps (WI Circuit Court → WI Court of Appeals → WI Supreme Court → U.S. District Court (E.D./W.D. Wis.) → 7th Circuit → SCOTUS). If the jurisdiction or findings suggest certain steps have been completed (e.g., direct appeal was taken), mark them Completed. If the next logical step is available, mark it Available. Steps that cannot be reached yet are Pending. Steps that are blocked due to procedural default or other bars are Blocked.",
    executivePromptInstructions: "Always include the three Wisconsin executive options: (a) Governor's Pardon via WI Pardon Advisory Board, (b) Sentence Commutation via Governor, (c) WI Parole Commission (for pre-1999 convictions only). Describe each accurately.",
    administrativePromptInstructions: "Always include the three Wisconsin administrative options: (a) Program Review Committee Earned Release, (b) Challenge Incarceration Program (CIP), (c) Wisconsin Risk Reduction Program (WRRP). Describe each accurately.",
  },

  IL: {
    name: "Illinois",
    circuit: "7th Circuit",
    ladder: [
      { step: 1, court: "IL Circuit Court", description: "Trial court — post-conviction petition under 725 ILCS 5/122-1 et seq. (Post-Conviction Hearing Act), or motion for new trial" },
      { step: 2, court: "IL Appellate Court", description: "Intermediate appellate court — direct appeal or appeal from post-conviction denial" },
      { step: 3, court: "IL Supreme Court", description: "Discretionary review — petition for leave to appeal (PLA)" },
      { step: 4, court: "U.S. District Court (N.D./C.D./S.D. Ill.)", description: "Federal habeas under 28 U.S.C. § 2254 — requires full exhaustion of Illinois state remedies" },
      { step: 5, court: "7th Circuit Court of Appeals", description: "Federal appellate review — requires certificate of appealability (COA)" },
      { step: 6, court: "U.S. Supreme Court", description: "Certiorari — discretionary; only for federal constitutional questions" },
    ],
    executiveOptions: [
      {
        option: "Governor's Pardon",
        body: "Illinois Prisoner Review Board / Governor of Illinois",
        description: "An Illinois pardon forgives the offense and may restore civil rights. Applicants file with the Illinois Prisoner Review Board, which conducts a public hearing and forwards a recommendation to the Governor. The Governor has sole discretion to grant or deny. A 'pardon with innocence' finding removes conviction records from public view.",
        eligibilityNote: "No mandatory waiting period; Board considers rehabilitation, circumstances of offense, and post-release conduct. Typically sought after release.",
      },
      {
        option: "Sentence Commutation",
        body: "Governor of Illinois / Illinois Prisoner Review Board",
        description: "Commutation reduces an active sentence without removing the underlying conviction. The Illinois Prisoner Review Board reviews commutation petitions and forwards recommendations to the Governor. Applications typically require demonstration of extraordinary rehabilitation, terminal illness, or a compelling manifest-injustice claim.",
        eligibilityNote: "May be sought while incarcerated; Governor has broad discretion; Board recommendation is advisory only.",
      },
      {
        option: "Illinois Court of Claims — Wrongful Conviction",
        body: "Illinois Court of Claims",
        description: "Illinois law (735 ILCS 5/2-702) allows a person who was wrongfully convicted and imprisoned to seek a certificate of innocence from the circuit court and then file for compensation in the Court of Claims. A successful claim may yield up to $199,150 (or more in some cases) plus attorney fees and may restore certain civil rights.",
        eligibilityNote: "Requires proving actual innocence by a preponderance of the evidence; not available for those who contributed to wrongful conviction by false confession or perjury.",
      },
    ],
    administrativeOptions: [
      {
        option: "Illinois Meritorious Good Time (MGT) Credit",
        body: "Illinois Department of Corrections",
        description: "The Illinois DOC may award Meritorious Good Time credits to incarcerated individuals who participate in programming, education, or vocational training. MGT credit can reduce the mandatory supervised release (MSR) date. Eligibility and credit amounts are determined by facility staff and DOC policy.",
        eligibilityNote: "Excludes certain Class X and violent felons; credits are administrative and subject to DOC discretion.",
      },
      {
        option: "Electronic Detention / Electronic Home Monitoring",
        body: "Illinois Department of Corrections / Sentencing Court",
        description: "Illinois allows certain offenders to serve the final portion of their sentence on electronic monitoring (EM) or electronic home detention. The IDOC may initiate a petition to the sentencing court or the court may impose EM as part of the original sentence. EM is particularly available for non-violent offenders within the last year of their sentence.",
        eligibilityNote: "Excludes sex offenders, certain violent felons, and those with EM violations; sentencing court must approve.",
      },
      {
        option: "Work Release / Day Release (Minimum Security)",
        body: "Illinois Department of Corrections",
        description: "Illinois DOC minimum-security facilities may place eligible incarcerated individuals on work release or day release programs, allowing them to leave the facility for employment while serving their sentence. Successful participation builds a record of rehabilitation and may accelerate consideration for supervised release.",
        eligibilityNote: "Requires placement at minimum-security facility, satisfactory institutional conduct, and IDOC approval; not available to all offense types.",
      },
    ],
    ladderPromptInstructions: "Assess each of the 6 Illinois ladder steps (IL Circuit Court → IL Appellate Court → IL Supreme Court → U.S. District Court (N.D./C.D./S.D. Ill.) → 7th Circuit → SCOTUS). Illinois post-conviction petitions are governed by the Post-Conviction Hearing Act (725 ILCS 5/122-1 et seq.). Mark steps Completed if the findings or record show prior proceedings. Mark the next available step Available. Pending steps cannot be reached yet. Blocked steps have procedural bars.",
    executivePromptInstructions: "Include three Illinois executive options: (a) Governor's Pardon via the Illinois Prisoner Review Board, (b) Sentence Commutation via the Illinois Prisoner Review Board and Governor, (c) Illinois Court of Claims wrongful conviction compensation under 735 ILCS 5/2-702. Describe each accurately for Illinois.",
    administrativePromptInstructions: "Include three Illinois administrative options: (a) Meritorious Good Time (MGT) credit from IDOC, (b) Electronic Home Monitoring / Electronic Detention, (c) Work Release / Day Release program. Describe each accurately for Illinois.",
  },

  MN: {
    name: "Minnesota",
    circuit: "8th Circuit",
    ladder: [
      { step: 1, court: "MN District Court", description: "Trial court — post-conviction petition under Minn. Stat. § 590.01 et seq. (Post-Conviction Relief Act)" },
      { step: 2, court: "MN Court of Appeals", description: "Intermediate appellate court — direct appeal or post-conviction appeal" },
      { step: 3, court: "MN Supreme Court", description: "Discretionary review — petition for further review" },
      { step: 4, court: "U.S. District Court (D. Minn.)", description: "Federal habeas under 28 U.S.C. § 2254 — requires full exhaustion of Minnesota state remedies" },
      { step: 5, court: "8th Circuit Court of Appeals", description: "Federal appellate review — requires certificate of appealability (COA)" },
      { step: 6, court: "U.S. Supreme Court", description: "Certiorari — discretionary; only for federal constitutional questions" },
    ],
    executiveOptions: [
      {
        option: "Governor's Pardon / Board of Pardons",
        body: "Minnesota Board of Pardons",
        description: "Minnesota's Board of Pardons consists of the Governor, the Attorney General, and the Chief Justice of the Supreme Court. Applications are filed with the Board's executive director. The Board may grant a full pardon, pardon extraordinary (which seals the conviction), or a pardon that restores specific civil rights. Hearings are public and applicants may appear in person.",
        eligibilityNote: "Must be discharged from sentence, including supervision, for the required waiting period (varies by offense); serious violent offenders face heightened scrutiny.",
      },
      {
        option: "Sentence Commutation",
        body: "Minnesota Board of Pardons",
        description: "The Minnesota Board of Pardons has authority to commute sentences, including reducing a life sentence to a term of years, making an individual eligible for supervised release. Commutation petitions must demonstrate compelling rehabilitation, manifest injustice, or changed circumstances. The Board reviews all three-member approval is required.",
        eligibilityNote: "May be sought while incarcerated; unanimous vote of all three Board members required to grant commutation.",
      },
    ],
    administrativeOptions: [
      {
        option: "Supervised Release (Parole)",
        body: "Minnesota Department of Corrections — Supervised Release Unit",
        description: "Minnesota operates a supervised release system (replacing traditional parole) where most prisoners are released to community supervision after serving a portion of their sentence. The Commissioner of Corrections and the Risk Assessment Unit determine the supervised release date based on offense, institutional behavior, programming completion, and risk scores.",
        eligibilityNote: "Supervised release is automatic for most offenders at the statutory release date; revocation and extension are possible for serious violations.",
      },
      {
        option: "Challenge Incarceration Program (CIP)",
        body: "Minnesota Department of Corrections",
        description: "Minnesota's CIP (boot camp program) provides intensive 6-month programming including physical fitness, cognitive behavioral therapy, and substance abuse treatment. Successful completion results in early release to supervised release. Participants must be nominated by the facility and approved by the Commissioner of Corrections.",
        eligibilityNote: "Not available to sex offenders or certain violent offenders; DOC nomination required; must meet risk and programming criteria.",
      },
      {
        option: "Work Release / Transitional Release",
        body: "Minnesota Department of Corrections",
        description: "Eligible incarcerated individuals may be placed on work release or at a transitional facility for the final portion of their sentence. Work release allows employment in the community while residing at a correctional facility or halfway house. Transitional release programs support reentry and reduce recidivism.",
        eligibilityNote: "Available to offenders nearing their supervised release date; excludes certain offense types; DOC approval required based on institutional conduct and risk assessment.",
      },
    ],
    ladderPromptInstructions: "Assess each of the 6 Minnesota ladder steps (MN District Court → MN Court of Appeals → MN Supreme Court → U.S. District Court (D. Minn.) → 8th Circuit Court of Appeals → SCOTUS). Minnesota post-conviction petitions are governed by the Post-Conviction Relief Act (Minn. Stat. § 590.01). Mark steps Completed if prior proceedings are evident. Mark the next available step Available. Pending steps cannot yet be reached. Blocked steps have procedural bars.",
    executivePromptInstructions: "Include two Minnesota executive options: (a) Governor's Pardon and Pardon Extraordinary via the Minnesota Board of Pardons (Governor + AG + Chief Justice), (b) Sentence Commutation via the Board of Pardons (unanimous vote required). Describe each accurately for Minnesota.",
    administrativePromptInstructions: "Include three Minnesota administrative options: (a) Supervised Release (parole equivalent) from MN DOC, (b) Challenge Incarceration Program (CIP boot camp), (c) Work Release / Transitional Release. Describe each accurately for Minnesota.",
  },

  IN: {
    name: "Indiana",
    circuit: "7th Circuit",
    ladder: [
      { step: 1, court: "IN Trial Court", description: "Trial court — post-conviction petition under Indiana Post-Conviction Rule 1 (P-C.R. 1), or motion to correct erroneous sentence" },
      { step: 2, court: "IN Court of Appeals", description: "Intermediate appellate court — direct appeal or appeal from post-conviction denial" },
      { step: 3, court: "IN Supreme Court", description: "Discretionary transfer — petition to transfer (P-T.R.)" },
      { step: 4, court: "U.S. District Court (N.D. or S.D. Ind.)", description: "Federal habeas under 28 U.S.C. § 2254 — requires full exhaustion of Indiana state remedies" },
      { step: 5, court: "7th Circuit Court of Appeals", description: "Federal appellate review — requires certificate of appealability (COA)" },
      { step: 6, court: "U.S. Supreme Court", description: "Certiorari — discretionary; only for federal constitutional questions" },
    ],
    executiveOptions: [
      {
        option: "Governor's Pardon",
        body: "Indiana Governor / Indiana Parole Board",
        description: "An Indiana pardon forgives the offense and may restore civil rights. The Indiana Parole Board investigates pardon applications and forwards a recommendation to the Governor. The Governor has sole authority to grant or deny. A pardon does not automatically expunge the conviction record but supports subsequent expungement petitions under Indiana's Second Chance Law.",
        eligibilityNote: "No mandatory waiting period; typically sought post-release; Board considers rehabilitation, offense circumstances, and community impact.",
      },
      {
        option: "Sentence Commutation",
        body: "Indiana Governor / Indiana Parole Board",
        description: "Commutation reduces an active sentence without removing the underlying conviction. The Indiana Parole Board reviews commutation petitions and forwards a recommendation to the Governor. Applications must demonstrate extraordinary rehabilitation, terminal illness, or compelling manifest-injustice circumstances.",
        eligibilityNote: "May be sought while incarcerated; Governor has broad discretion; Parole Board recommendation is advisory only.",
      },
      {
        option: "Expungement under Indiana Second Chance Law",
        body: "Indiana Trial Court",
        description: "Indiana's Second Chance Law (Ind. Code § 35-38-9) allows eligible individuals to petition the trial court to expunge certain arrest records, convictions, and related records. Felony D/Level 6 convictions may be expunged after 8 years; higher-level felonies require 10 years. A pardon may shorten the waiting period and support the petition.",
        eligibilityNote: "Not available for certain violent felonies, sex offenses, or offenses with victim injury; waiting periods and eligibility vary by offense level.",
      },
    ],
    administrativeOptions: [
      {
        option: "Credit Time / Educational Credit",
        body: "Indiana Department of Correction",
        description: "Indiana awards credit time that reduces a sentence based on the offense class and conduct. Educational credit time is available for earning a GED, high school diploma, or postsecondary degree while incarcerated. Credit time accrual rates depend on the credit class assigned by IDOC and can significantly shorten the time served.",
        eligibilityNote: "Excludes certain violent and sex offenders from enhanced credit time; credit class determined at sentencing and may be reduced for disciplinary violations.",
      },
      {
        option: "Parole / Supervised Release",
        body: "Indiana Parole Board",
        description: "The Indiana Parole Board has authority to grant discretionary parole for offenders serving sentences imposed before July 1, 1977, and for certain categories of offenders under newer statutes. Most post-1977 offenders serve a fixed term and are released to a period of mandatory supervised release (MSR), monitored by IDOC parole officers.",
        eligibilityNote: "Discretionary parole is limited to pre-1977 sentences or specific statutory categories; MSR applies automatically upon release for most current offenders.",
      },
      {
        option: "Work Release / Community Transition Program",
        body: "Indiana Department of Correction",
        description: "Indiana's Community Transition Program (CTP) allows eligible offenders to transition to community supervision 365 days before their release date, residing in a community corrections facility or on home detention with electronic monitoring. The program emphasizes employment, family reintegration, and reduced recidivism.",
        eligibilityNote: "Excludes sex offenders, certain violent felons, and those with escape or detainer holds; IDOC determines eligibility based on risk assessment and institutional conduct.",
      },
    ],
    ladderPromptInstructions: "Assess each of the 6 Indiana ladder steps (IN Trial Court → IN Court of Appeals → IN Supreme Court → U.S. District Court (N.D. or S.D. Ind.) → 7th Circuit → SCOTUS). Indiana post-conviction petitions are governed by Post-Conviction Rule 1 (P-C.R. 1). Mark steps Completed if prior proceedings are evident in the record. Mark the next available step Available. Pending steps cannot yet be reached. Blocked steps have procedural bars.",
    executivePromptInstructions: "Include three Indiana executive options: (a) Governor's Pardon via the Indiana Parole Board, (b) Sentence Commutation via the Indiana Parole Board and Governor, (c) Expungement under Indiana's Second Chance Law (Ind. Code § 35-38-9). Describe each accurately for Indiana.",
    administrativePromptInstructions: "Include three Indiana administrative options: (a) Credit Time and Educational Credit from IDOC, (b) Parole / Mandatory Supervised Release via the Indiana Parole Board, (c) Work Release / Community Transition Program (CTP). Describe each accurately for Indiana.",
  },

  IA: {
    name: "Iowa",
    circuit: "8th Circuit",
    ladder: [
      { step: 1, court: "IA District Court", description: "Trial court — application for post-conviction relief under Iowa Code § 822.2 (Iowa Post-Conviction Relief Act)" },
      { step: 2, court: "IA Court of Appeals", description: "Intermediate appellate court — direct appeal or appeal from post-conviction denial; assignment by Iowa Supreme Court" },
      { step: 3, court: "IA Supreme Court", description: "Discretionary review — application for further review" },
      { step: 4, court: "U.S. District Court (N.D. or S.D. Iowa)", description: "Federal habeas under 28 U.S.C. § 2254 — requires full exhaustion of Iowa state remedies" },
      { step: 5, court: "8th Circuit Court of Appeals", description: "Federal appellate review — requires certificate of appealability (COA)" },
      { step: 6, court: "U.S. Supreme Court", description: "Certiorari — discretionary; only for federal constitutional questions" },
    ],
    executiveOptions: [
      {
        option: "Governor's Pardon / Clemency",
        body: "Iowa Governor / Iowa Board of Parole",
        description: "The Iowa Governor has sole authority to grant pardons, commutations, reprieves, and remissions of fines and forfeitures. The Iowa Board of Parole investigates clemency applications and forwards a recommendation. A pardon forgives the offense and restores certain civil rights including the right to vote, which is automatically restored upon completion of sentence in Iowa.",
        eligibilityNote: "No mandatory waiting period post-discharge; Board considers rehabilitation, offense circumstances, and victim impact; Governor retains full discretion.",
      },
      {
        option: "Sentence Commutation",
        body: "Iowa Governor / Iowa Board of Parole",
        description: "Commutation reduces an active sentence without removing the conviction. The Iowa Board of Parole reviews commutation petitions and submits a recommendation to the Governor. Applications must demonstrate extraordinary rehabilitation, terminal illness, or manifest injustice. Commutation of a life sentence to a term of years makes the individual eligible for parole consideration.",
        eligibilityNote: "May be sought while incarcerated; Governor has broad discretion; Board recommendation is advisory; life sentences require specific finding of changed circumstances.",
      },
      {
        option: "Felony Conviction Set-Aside / Expungement",
        body: "Iowa District Court",
        description: "Iowa allows expungement of certain criminal records, particularly for dismissed charges, deferred judgments, and some misdemeanor convictions. Iowa Code § 901C.2 permits expungement of felony convictions under limited circumstances. A set-aside under Iowa Code § 907.9 may be available for probationers who successfully complete supervision, removing some collateral consequences.",
        eligibilityNote: "Felony expungement is narrowly available; deferred judgment set-aside requires successful completion of probation; sex offenses and violent felonies are generally excluded.",
      },
    ],
    administrativeOptions: [
      {
        option: "Parole",
        body: "Iowa Board of Parole",
        description: "The Iowa Board of Parole reviews eligible incarcerated individuals and may grant parole based on rehabilitation, risk assessment, release plan, and victim impact. Parole hearings are conducted in person or by video. The Board sets supervision conditions and may revoke parole for violations. Iowa uses a risk-needs-responsivity model for parole decisions.",
        eligibilityNote: "Certain violent offenders must serve a mandatory minimum before parole eligibility; sex offenders face additional registration and supervision requirements upon release.",
      },
      {
        option: "Work Release / Residential Facility",
        body: "Iowa Department of Corrections",
        description: "Iowa DOC may transfer eligible offenders to residential correctional facilities (RCFs) or work release centers for the final portion of their sentence. Residents may leave the facility for employment, education, or treatment while residing under supervision. Successful participation supports parole consideration and community reintegration.",
        eligibilityNote: "Excludes certain violent and sex offenders; DOC risk assessment and facility bed availability determine eligibility; institutional conduct record is reviewed.",
      },
      {
        option: "Earned Time / Good Time Credit",
        body: "Iowa Department of Corrections",
        description: "Iowa awards earned time credits that reduce an offender's sentence based on participation in programming, education, and positive institutional conduct. Credits are tracked by the IDOC and applied toward the parole eligibility date. Disciplinary violations may result in forfeiture of earned credits.",
        eligibilityNote: "Most offenders are eligible for earned time; rates and caps vary by offense; certain mandatory-minimum sentences limit the effect of earned time credits.",
      },
    ],
    ladderPromptInstructions: "Assess each of the 6 Iowa ladder steps (IA District Court → IA Court of Appeals → IA Supreme Court → U.S. District Court (N.D. or S.D. Iowa) → 8th Circuit Court of Appeals → SCOTUS). Iowa post-conviction relief is governed by Iowa Code § 822 (Post-Conviction Relief Act). Mark steps Completed if prior proceedings are evident in the record. Mark the next available step Available. Pending steps cannot yet be reached. Blocked steps have procedural bars.",
    executivePromptInstructions: "Include three Iowa executive options: (a) Governor's Pardon via the Iowa Board of Parole, (b) Sentence Commutation via the Iowa Board of Parole and Governor, (c) Felony set-aside or expungement under Iowa Code § 901C.2 / § 907.9. Describe each accurately for Iowa.",
    administrativePromptInstructions: "Include three Iowa administrative options: (a) Parole from the Iowa Board of Parole, (b) Work Release / Residential Correctional Facility placement, (c) Earned Time / Good Time credit from Iowa DOC. Describe each accurately for Iowa.",
  },

  MI: {
    name: "Michigan",
    circuit: "6th Circuit",
    ladder: [
      { step: 1, court: "MI Circuit Court", description: "Trial court — Motion for Relief from Judgment under MCR 6.500 et seq., or motion for new trial under MCL 770.9a" },
      { step: 2, court: "MI Court of Appeals", description: "Intermediate appellate court — direct appeal or delayed application for leave to appeal from post-conviction denial" },
      { step: 3, court: "MI Supreme Court", description: "Discretionary review — application for leave to appeal" },
      { step: 4, court: "U.S. District Court (E.D. or W.D. Mich.)", description: "Federal habeas under 28 U.S.C. § 2254 — requires full exhaustion of Michigan state remedies" },
      { step: 5, court: "6th Circuit Court of Appeals", description: "Federal appellate review — requires certificate of appealability (COA)" },
      { step: 6, court: "U.S. Supreme Court", description: "Certiorari — discretionary; only for federal constitutional questions" },
    ],
    executiveOptions: [
      {
        option: "Governor's Pardon",
        body: "Michigan Parole Board / Governor of Michigan",
        description: "A Michigan pardon forgives the offense and may restore civil rights including the right to possess firearms. The Michigan Parole Board investigates pardon applications and forwards a recommendation to the Governor. The Governor has sole authority to grant or deny. A pardon supports subsequent record expungement under Michigan's Clean Slate Law.",
        eligibilityNote: "No mandatory waiting period post-release; Parole Board considers rehabilitation, offense circumstances, and community impact; typically sought post-release.",
      },
      {
        option: "Sentence Commutation",
        body: "Michigan Parole Board / Governor of Michigan",
        description: "Commutation reduces an active sentence without removing the underlying conviction. The Michigan Parole Board reviews commutation petitions and forwards a recommendation to the Governor. Applications must show extraordinary rehabilitation, terminal illness, or a compelling manifest-injustice claim. Commutation of a life sentence makes the individual immediately eligible for parole board review.",
        eligibilityNote: "May be sought while incarcerated; Governor has broad discretion; Parole Board recommendation is advisory only.",
      },
      {
        option: "Expungement under Michigan Clean Slate Law",
        body: "Michigan Circuit Court",
        description: "Michigan's Clean Slate Law (2020) significantly expanded expungement eligibility. Most felony convictions may be expunged after 7 years from sentence completion; multiple felonies may be expunged under the 'three felony' rule. Certain serious violent offenses, life-maximum offenses, and criminal sexual conduct charges are excluded. Automatic expungement applies to some misdemeanors after 7 years.",
        eligibilityNote: "Excludes crimes with life maximum sentences, criminal sexual conduct (most CSC offenses), DUI/OWI with injury/death, and certain weapons offenses; waiting period runs from sentence completion.",
      },
    ],
    administrativeOptions: [
      {
        option: "Good Time / Disciplinary Credits",
        body: "Michigan Department of Corrections",
        description: "Michigan prisoners earn disciplinary credits that reduce the minimum sentence based on good institutional behavior and programming participation. The Michigan Parole Board considers accumulated disciplinary credit and programming completion when making parole decisions. Misconduct tickets can result in loss of previously earned credits.",
        eligibilityNote: "Available to most prisoners; disciplinary credit accrual rates and caps vary by offense and sentence type; life prisoners require Board approval before parole consideration.",
      },
      {
        option: "Parole (Michigan Parole Board)",
        body: "Michigan Parole Board",
        description: "The Michigan Parole Board has authority to grant parole after a prisoner serves the minimum sentence. The Board conducts annual reviews using a risk/needs assessment, institutional conduct record, programming completion, and community support. Victims may submit statements. Life prisoners require the Governor's approval for parole.",
        eligibilityNote: "Parole eligibility begins at minimum sentence completion; life prisoners require Governor's approval; sex offenders face additional assessment requirements.",
      },
      {
        option: "Special Alternative Incarceration (SAI) / Boot Camp",
        body: "Michigan Department of Corrections",
        description: "Michigan's SAI program (boot camp) provides intensive 90-day programming including physical training, substance abuse education, and cognitive behavioral therapy. Successful completion results in placement on supervised release. The program is available to eligible offenders as an alternative to a portion of their sentence.",
        eligibilityNote: "Not available for serious violent offenders, sex offenders, or those with lengthy prior records; court recommendation or MDOC nomination required.",
      },
    ],
    ladderPromptInstructions: "Assess each of the 6 Michigan ladder steps (MI Circuit Court → MI Court of Appeals → MI Supreme Court → U.S. District Court (E.D. or W.D. Mich.) → 6th Circuit Court of Appeals → SCOTUS). Michigan post-conviction relief uses the Motion for Relief from Judgment (MCR 6.500 et seq.). Mark steps Completed if prior proceedings are evident in the record. Mark the next available step Available. Pending steps cannot yet be reached. Blocked steps have procedural bars.",
    executivePromptInstructions: "Include three Michigan executive options: (a) Governor's Pardon via the Michigan Parole Board, (b) Sentence Commutation via the Michigan Parole Board and Governor, (c) Expungement under Michigan's Clean Slate Law. Describe each accurately for Michigan.",
    administrativePromptInstructions: "Include three Michigan administrative options: (a) Good Time / Disciplinary Credits from MDOC, (b) Parole via the Michigan Parole Board (Governor approval required for life sentences), (c) Special Alternative Incarceration (SAI) boot camp program. Describe each accurately for Michigan.",
  },

  OH: {
    name: "Ohio",
    circuit: "6th Circuit",
    ladder: [
      { step: 1, court: "OH Common Pleas Court", description: "Trial court — petition for post-conviction relief under Ohio Revised Code § 2953.21; or motion for new trial under Crim.R. 33" },
      { step: 2, court: "OH Court of Appeals", description: "Intermediate appellate court — direct appeal or appeal from post-conviction denial; Ohio has 12 numbered appellate districts" },
      { step: 3, court: "OH Supreme Court", description: "Discretionary review — memorandum in support of jurisdiction" },
      { step: 4, court: "U.S. District Court (N.D. or S.D. Ohio)", description: "Federal habeas under 28 U.S.C. § 2254 — requires full exhaustion of Ohio state remedies" },
      { step: 5, court: "6th Circuit Court of Appeals", description: "Federal appellate review — requires certificate of appealability (COA)" },
      { step: 6, court: "U.S. Supreme Court", description: "Certiorari — discretionary; only for federal constitutional questions" },
    ],
    executiveOptions: [
      {
        option: "Governor's Pardon / Clemency",
        body: "Ohio Adult Parole Authority / Governor of Ohio",
        description: "An Ohio pardon forgives the offense and may restore civil rights. The Ohio Adult Parole Authority (APA) investigates clemency applications and conducts a hearing, then forwards a recommendation to the Governor. The Governor has sole authority to grant or deny. A pardon supports subsequent expungement or sealing of the record under Ohio Revised Code § 2953.32.",
        eligibilityNote: "Typically sought post-release; APA considers rehabilitation, offense circumstances, victim impact, and community support; no mandatory waiting period.",
      },
      {
        option: "Sentence Commutation",
        body: "Ohio Adult Parole Authority / Governor of Ohio",
        description: "Commutation reduces an active sentence without removing the conviction. The APA reviews commutation petitions and forwards a recommendation to the Governor. Applications must demonstrate extraordinary rehabilitation, terminal illness, or compelling manifest-injustice circumstances. Commutation of a life sentence to a term of years creates parole eligibility.",
        eligibilityNote: "May be sought while incarcerated; Governor has broad discretion; APA recommendation is advisory; death sentence commutation historically requires specific grounds.",
      },
      {
        option: "Expungement / Sealing of Record (ORC § 2953.32)",
        body: "Ohio Common Pleas Court",
        description: "Ohio allows sealing of conviction records under ORC § 2953.32 after mandatory waiting periods (1 year for misdemeanors; 3 years for most felonies from final discharge). The 2023 expansion (H.B. 420) added additional offense tiers and reduced some waiting periods. A sealed record is not expunged but is hidden from public view. A pardon may reduce the waiting period.",
        eligibilityNote: "Excludes most violent felonies (F1/F2 offenses), sexual offenses, felonies with mandatory prison terms, and certain other categories; court has discretion to deny even eligible petitions.",
      },
    ],
    administrativeOptions: [
      {
        option: "Good Behavior Time / Earned Credit",
        body: "Ohio Department of Rehabilitation and Correction",
        description: "Ohio prisoners earn good-behavior days (5 days per month under ORC § 2967.193) and may earn additional days through educational programming, vocational training, and other approved activities. Earned credit reduces the stated prison term and accelerates parole eligibility or release date. Serious misconduct can result in forfeiture of earned days.",
        eligibilityNote: "Most prisoners are eligible; credit rates and caps vary by offense and sentence type; certain mandatory sentences limit the effect of earned credit.",
      },
      {
        option: "Parole (Ohio Parole Board / APA)",
        body: "Ohio Adult Parole Authority",
        description: "The Ohio APA Parole Board has authority to grant parole to eligible prisoners serving indeterminate sentences. The Board conducts hearings using risk/needs assessments, institutional conduct, programming completion, and victim input. Prisoners sentenced on or after July 1, 1996, are subject to determinate sentencing (Senate Bill 2) and serve definite terms without discretionary parole.",
        eligibilityNote: "Discretionary parole applies to pre-SB2 (pre-July 1, 1996) sentences; post-SB2 offenders serve fixed terms with post-release control (PRC) rather than discretionary parole.",
      },
      {
        option: "Transitional Control / Work Release",
        body: "Ohio Department of Rehabilitation and Correction",
        description: "Ohio's Transitional Control (TC) program allows eligible prisoners to serve the last 180 days of their sentence in the community under electronic monitoring, residing at an approved address. Work release permits prisoners to leave the facility for employment while serving the final portion of their sentence at a minimum-security institution or community-based correctional facility.",
        eligibilityNote: "Excludes certain violent offenders and sex offenders; ODRC risk assessment and victim notification requirements apply; APA approval required for TC.",
      },
    ],
    ladderPromptInstructions: "Assess each of the 6 Ohio ladder steps (OH Common Pleas Court → OH Court of Appeals → OH Supreme Court → U.S. District Court (N.D. or S.D. Ohio) → 6th Circuit Court of Appeals → SCOTUS). Ohio post-conviction relief is governed by ORC § 2953.21 (petition) and § 2953.23 (untimely petitions with new DNA or newly discovered evidence). Mark steps Completed if prior proceedings are evident. Mark the next available step Available. Pending steps cannot yet be reached. Blocked steps have procedural bars.",
    executivePromptInstructions: "Include three Ohio executive options: (a) Governor's Pardon via the Ohio Adult Parole Authority, (b) Sentence Commutation via the APA and Governor, (c) Expungement / Sealing of Record under ORC § 2953.32. Describe each accurately for Ohio.",
    administrativePromptInstructions: "Include three Ohio administrative options: (a) Good Behavior Time / Earned Credit from ODRC (ORC § 2967.193), (b) Parole via the Ohio Adult Parole Authority (applies to pre-SB2 indeterminate sentences), (c) Transitional Control / Work Release from ODRC. Describe each accurately for Ohio.",
  },
};

const SUPPORTED_STATES = Object.keys(STATE_DATA) as SupportedState[];

function detectJurisdiction(jurisdiction: string | null): SupportedState | null {
  if (!jurisdiction) return null;
  const lower = jurisdiction.toLowerCase().trim();

  if (
    lower.includes("wisconsin") ||
    lower === "wi" || lower === "wis" || lower === "wis." ||
    lower.startsWith("wi ") || lower.startsWith("wis ") || lower.startsWith("wis.") ||
    lower.includes(", wi") || lower.includes(" wi,") ||
    lower.includes("(wi)") || lower.includes("(wis)")
  ) return "WI";

  if (
    lower.includes("illinois") ||
    lower === "il" || lower === "ill" || lower === "ill." ||
    lower.startsWith("il ") || lower.startsWith("ill ") ||
    lower.includes(", il") || lower.includes(" il,") ||
    lower.includes("(il)") || lower.includes("(ill)") ||
    lower.includes("cook county") || lower.includes("chicago")
  ) return "IL";

  if (
    lower.includes("minnesota") ||
    lower === "mn" ||
    lower.startsWith("mn ") || lower.includes(", mn") || lower.includes(" mn,") ||
    lower.includes("(mn)") ||
    lower.includes("minneapolis") || lower.includes("st. paul") || lower.includes("saint paul")
  ) return "MN";

  if (
    lower.includes("indiana") ||
    lower === "in" || lower === "ind" || lower === "ind." ||
    lower.startsWith("ind ") || lower.startsWith("ind.") ||
    lower.includes(", in") || lower.includes(" in,") ||
    lower.includes("(in)") || lower.includes("(ind)") ||
    lower.includes("indianapolis")
  ) return "IN";

  if (
    lower.includes("iowa") ||
    lower === "ia" ||
    lower.startsWith("ia ") || lower.includes(", ia") || lower.includes(" ia,") ||
    lower.includes("(ia)") ||
    lower.includes("des moines")
  ) return "IA";

  if (
    lower.includes("michigan") ||
    lower === "mi" || lower === "mich" || lower === "mich." ||
    lower.startsWith("mich ") || lower.startsWith("mich.") ||
    lower.includes(", mi") || lower.includes(" mi,") ||
    lower.includes("(mi)") || lower.includes("(mich)") ||
    lower.includes("detroit") || lower.includes("grand rapids")
  ) return "MI";

  if (
    lower.includes("ohio") ||
    lower === "oh" ||
    lower.startsWith("oh ") || lower.includes(", oh") || lower.includes(" oh,") ||
    lower.includes("(oh)") ||
    lower.includes("columbus") || lower.includes("cleveland") || lower.includes("cincinnati")
  ) return "OH";

  return null;
}

function sanitizeLadderStatus(status: string | undefined): "Completed" | "Pending" | "Available" | "Blocked" {
  if (status === "Completed" || status === "Pending" || status === "Available" || status === "Blocked") {
    return status;
  }
  return "Pending";
}

function calculateAedpaDeadline(caseCreatedAt: Date): { deadline: string; isEstimate: boolean } {
  const convictionFinalDate = new Date(caseCreatedAt);
  convictionFinalDate.setDate(convictionFinalDate.getDate() + 20);
  const deadline = new Date(convictionFinalDate);
  deadline.setDate(deadline.getDate() + 365);
  return {
    deadline: deadline.toISOString().split("T")[0],
    isEstimate: true,
  };
}

function buildReliefPrompt(params: {
  caseTitle: string;
  jurisdiction: string | null;
  caseNumber: string | null;
  state: SupportedState;
  findings: {
    issueTitle: string;
    legalAnalysis: string;
    proceduralStatus: string | null;
  }[];
}): string {
  const sd = STATE_DATA[params.state];
  const findingsText = params.findings
    .map(
      (f, i) =>
        `FINDING ${i + 1}: ${f.issueTitle}\nLegal Analysis: ${f.legalAnalysis.slice(0, 600)}\nProcedural Status: ${f.proceduralStatus ?? "Unknown"}`,
    )
    .join("\n\n");

  return `You are a senior post-conviction appellate analyst. Analyze this ${sd.name} criminal case for post-conviction relief pathways.

CASE: ${params.caseTitle}
JURISDICTION: ${params.jurisdiction ?? `${sd.name} (assumed)`}
STATE: ${sd.name} (${sd.circuit})
CASE NUMBER: ${params.caseNumber ?? "Unknown"}

FINDINGS FROM RECORD:
${findingsText || "No findings extracted yet."}

TASK: Analyze the case and return a single JSON object with EXACTLY these keys:

{
  "ladderStatus": [
    {
      "step": <integer 1-6>,
      "court": "<court name>",
      "status": "Completed | Pending | Available | Blocked",
      "notes": "<1-2 sentence note on status or what is needed at this step, or null>"
    }
  ],
  "federalReadyClaims": [
    {
      "issueTitle": "<title of the finding>",
      "amendment": "<5th | 6th | 14th | Other>",
      "readyReason": "<one sentence explaining why this claim is federal-ready>"
    }
  ],
  "martinezApplies": <true | false>,
  "martinezReason": "<1-2 sentences explaining why Martinez v. Ryan (2012) does or does not apply to this case>",
  "executiveOptions": [
    {
      "option": "<option name>",
      "body": "<the body or official that handles this>",
      "description": "<2-3 sentences on the process, eligibility, and how to apply>",
      "eligibilityNote": "<any specific eligibility requirement or restriction>"
    }
  ],
  "administrativeOptions": [
    {
      "option": "<option name>",
      "body": "<administering body>",
      "description": "<2-3 sentences on what this is, eligibility criteria, and how to apply>",
      "eligibilityNote": "<any specific eligibility requirement or restriction>"
    }
  ]
}

INSTRUCTIONS:
1. For ladderStatus: ${sd.ladderPromptInstructions}
2. For federalReadyClaims: Only include findings that (a) explicitly mention or implicate the 5th, 6th, or 14th Amendment in the legal analysis AND (b) have proceduralStatus = "Preserved". If no findings meet this standard, return an empty array.
3. For martinezApplies: Martinez v. Ryan (2012) allows cause to excuse procedural default of IAC claims where post-conviction counsel was also ineffective. This applies if there are IAC claims that were defaulted AND post-conviction counsel likely failed to raise them. If no IAC-type claims exist, return false.
4. For executiveOptions: ${sd.executivePromptInstructions}
5. For administrativeOptions: ${sd.administrativePromptInstructions}

Return ONLY valid JSON. No commentary. No markdown fences. Begin with { and end with }.`;
}

async function generateAndPersistPathway(
  caseId: number,
  existingCase: { title: string; jurisdiction: string | null; caseNumber: string | null; createdAt: Date },
  state: SupportedState,
  preserveTolled?: boolean,
): Promise<{ pathway: Record<string, unknown>; martinezReason: string | null; isEstimate: boolean } | { error: string }> {
  const sd = STATE_DATA[state];

  const findings = await db
    .select({
      issueTitle: findingsTable.issueTitle,
      legalAnalysis: findingsTable.legalAnalysis,
      proceduralStatus: findingsTable.proceduralStatus,
    })
    .from(findingsTable)
    .where(eq(findingsTable.caseId, caseId));

  const { deadline, isEstimate } = calculateAedpaDeadline(existingCase.createdAt);

  const prompt = buildReliefPrompt({
    caseTitle: existingCase.title,
    jurisdiction: existingCase.jurisdiction,
    caseNumber: existingCase.caseNumber,
    state,
    findings,
  });

  const message = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = message.content[0]?.type === "text" ? message.content[0].text : "{}";
  let cleaned = rawText.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
  const objStart = cleaned.indexOf("{");
  const objEnd = cleaned.lastIndexOf("}");
  if (objStart !== -1 && objEnd !== -1 && objEnd > objStart) {
    cleaned = cleaned.slice(objStart, objEnd + 1);
  }

  let parsed: {
    ladderStatus?: unknown[];
    federalReadyClaims?: unknown[];
    martinezApplies?: boolean;
    martinezReason?: string;
    executiveOptions?: unknown[];
    administrativeOptions?: unknown[];
  };

  try {
    parsed = JSON.parse(cleaned);
  } catch (parseErr) {
    logger.error({ parseErr, caseId, state }, "Failed to parse relief pathway response");
    return { error: "Failed to parse AI response. Please try again." };
  }

  const ladderWithDefaults = sd.ladder.map((rung) => {
    const ai = (parsed.ladderStatus ?? []).find(
      (s: unknown) => (s as { step?: number }).step === rung.step,
    ) as { status?: string; notes?: string } | undefined;
    return {
      step: rung.step,
      court: rung.court,
      description: rung.description,
      status: sanitizeLadderStatus(ai?.status),
      completedAt: null as string | null,
      notes: ai?.notes ?? null,
    };
  });

  const rawFederalClaims = Array.isArray(parsed.federalReadyClaims) ? parsed.federalReadyClaims : [];
  const preservedTitles = new Set(
    findings
      .filter((f) => typeof f.proceduralStatus === "string" && f.proceduralStatus.toLowerCase().includes("preserved"))
      .map((f) => f.issueTitle?.toLowerCase().trim()),
  );

  const CONSTITUTIONAL_AMENDMENTS = ["5th", "6th", "14th", "fifth", "sixth", "fourteenth"];
  const federalReadyClaims = rawFederalClaims.filter((claim: unknown) => {
    const c = claim as { amendment?: string; issueTitle?: string };
    const amendmentText = (c.amendment ?? "").toLowerCase();
    const hasValidAmendment = CONSTITUTIONAL_AMENDMENTS.some((a) => amendmentText.includes(a));
    const titleLower = (c.issueTitle ?? "").toLowerCase().trim();
    const isPreserved = preservedTitles.has(titleLower);
    return hasValidAmendment && isPreserved;
  });

  const executiveOptions = Array.isArray(parsed.executiveOptions) && parsed.executiveOptions.length > 0
    ? parsed.executiveOptions
    : sd.executiveOptions;

  const administrativeOptions = Array.isArray(parsed.administrativeOptions) && parsed.administrativeOptions.length > 0
    ? parsed.administrativeOptions
    : sd.administrativeOptions;

  const martinezReason = parsed.martinezReason ?? null;
  const tolledValue = preserveTolled ?? false;

  const [created] = await db
    .insert(reliefPathwaysTable)
    .values({
      caseId,
      jurisdiction: existingCase.jurisdiction ?? sd.name,
      ladderStatus: ladderWithDefaults as object,
      aedpaDeadline: deadline,
      aedpaTolled: tolledValue,
      aedpaIsEstimate: isEstimate,
      federalReadyClaims: federalReadyClaims as object,
      martinezApplies: parsed.martinezApplies ?? false,
      martinezReason,
      executiveOptions: executiveOptions as object,
      administrativeOptions: administrativeOptions as object,
    })
    .onConflictDoUpdate({
      target: reliefPathwaysTable.caseId,
      set: {
        jurisdiction: existingCase.jurisdiction ?? sd.name,
        ladderStatus: ladderWithDefaults as object,
        aedpaDeadline: deadline,
        aedpaTolled: tolledValue,
        aedpaIsEstimate: isEstimate,
        federalReadyClaims: federalReadyClaims as object,
        martinezApplies: parsed.martinezApplies ?? false,
        martinezReason,
        executiveOptions: executiveOptions as object,
        administrativeOptions: administrativeOptions as object,
        updatedAt: new Date(),
      },
    })
    .returning();

  return { pathway: created as unknown as Record<string, unknown>, martinezReason, isEstimate };
}

function unsupportedJurisdictionResponse(jurisdiction: string | null) {
  return {
    error: "Unsupported jurisdiction",
    message: `Relief Pathway Engine currently supports Wisconsin (WI), Illinois (IL), and Minnesota (MN). Detected jurisdiction: "${jurisdiction ?? "unknown"}". Additional states are planned for future releases.`,
    supportedStates: SUPPORTED_STATES,
  };
}

router.get("/cases/:caseId/relief-pathway", async (req, res) => {
  const caseId = Number(req.params.caseId);

  if (isNaN(caseId)) {
    res.status(400).json({ error: "Invalid case ID" });
    return;
  }

  const [existingCase] = await db
    .select()
    .from(casesTable)
    .where(eq(casesTable.id, caseId));

  if (!existingCase) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  const state = detectJurisdiction(existingCase.jurisdiction);
  if (!state) {
    res.status(422).json(unsupportedJurisdictionResponse(existingCase.jurisdiction));
    return;
  }

  const [existing] = await db
    .select()
    .from(reliefPathwaysTable)
    .where(eq(reliefPathwaysTable.caseId, caseId));

  if (existing) {
    res.json({ ...existing, aedpaIsEstimate: existing.aedpaIsEstimate ?? true, martinezReason: existing.martinezReason ?? null, detectedState: state });
    return;
  }

  try {
    const result = await generateAndPersistPathway(caseId, existingCase, state);
    if ("error" in result) {
      res.status(500).json({ error: result.error });
      return;
    }
    res.json({ ...result.pathway, aedpaIsEstimate: result.isEstimate, martinezReason: result.martinezReason, detectedState: state });
  } catch (err) {
    logger.error({ err, caseId, state }, "Relief pathway generation failed");
    const status = (err as { status?: number })?.status;
    let message = "Failed to generate relief pathway. Please try again.";
    if (status === 429) message = "Rate limit reached. Please wait a moment and try again.";
    else if (status === 401) message = "API key is invalid or missing.";
    res.status(500).json({ error: message });
  }
});

router.post("/cases/:caseId/relief-pathway/regenerate", async (req, res) => {
  const caseId = Number(req.params.caseId);

  if (isNaN(caseId)) {
    res.status(400).json({ error: "Invalid case ID" });
    return;
  }

  const [existingCase] = await db
    .select()
    .from(casesTable)
    .where(eq(casesTable.id, caseId));

  if (!existingCase) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  const state = detectJurisdiction(existingCase.jurisdiction);
  if (!state) {
    res.status(422).json(unsupportedJurisdictionResponse(existingCase.jurisdiction));
    return;
  }

  const [existing] = await db
    .select({ aedpaTolled: reliefPathwaysTable.aedpaTolled })
    .from(reliefPathwaysTable)
    .where(eq(reliefPathwaysTable.caseId, caseId));

  try {
    const result = await generateAndPersistPathway(caseId, existingCase, state, existing?.aedpaTolled ?? false);
    if ("error" in result) {
      res.status(500).json({ error: result.error });
      return;
    }
    res.json({ ...result.pathway, aedpaIsEstimate: result.isEstimate, martinezReason: result.martinezReason, detectedState: state });
  } catch (err) {
    logger.error({ err, caseId, state }, "Relief pathway regeneration failed");
    res.status(500).json({ error: "Failed to regenerate relief pathway. Please try again." });
  }
});

router.put("/cases/:caseId/relief-pathway", async (req, res) => {
  const caseId = Number(req.params.caseId);

  if (isNaN(caseId)) {
    res.status(400).json({ error: "Invalid case ID" });
    return;
  }

  const parsed = putBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error.flatten() });
    return;
  }

  const [[existingCase], [existing]] = await Promise.all([
    db.select({ jurisdiction: casesTable.jurisdiction }).from(casesTable).where(eq(casesTable.id, caseId)),
    db.select().from(reliefPathwaysTable).where(eq(reliefPathwaysTable.caseId, caseId)),
  ]);

  if (!existing) {
    res.status(404).json({ error: "No relief pathway found for this case" });
    return;
  }

  const detectedState = detectJurisdiction(existingCase?.jurisdiction ?? null);

  const { stepUpdates, aedpaDeadline, aedpaTolled } = parsed.data;
  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if (stepUpdates !== undefined && stepUpdates.length > 0) {
    const currentLadder = (existing.ladderStatus ?? []) as {
      step: number;
      court: string;
      description: string;
      status: string;
      completedAt: string | null;
      notes: string | null;
    }[];

    const mergedLadder = currentLadder.map((rung) => {
      const patch = stepUpdates.find((u) => u.step === rung.step);
      if (!patch) return rung;
      return {
        ...rung,
        ...(patch.status !== undefined ? { status: patch.status } : {}),
        ...(patch.completedAt !== undefined ? { completedAt: patch.completedAt } : {}),
        ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
      };
    });
    updateData.ladderStatus = mergedLadder;
  }

  if (aedpaDeadline !== undefined) {
    updateData.aedpaDeadline = aedpaDeadline;
    updateData.aedpaIsEstimate = false;
  }
  if (aedpaTolled !== undefined) updateData.aedpaTolled = aedpaTolled;

  const [updated] = await db
    .update(reliefPathwaysTable)
    .set(updateData)
    .where(eq(reliefPathwaysTable.caseId, caseId))
    .returning();

  res.json({ ...updated, detectedState });
});

export default router;
