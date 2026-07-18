import { db, casesTable, documentsTable, findingsTable, crossCaseMatchesTable, courtSessionsTable, courtRoundsTable, motionsTable, categoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

const DEMO_CASE_NUMBER = "DEMO-2018CF000847";

const DEMO_TRANSCRIPT = `STATE OF WISCONSIN
CIRCUIT COURT — MILWAUKEE COUNTY
BRANCH 12

STATE OF WISCONSIN,
    Plaintiff,

    vs.                                             Case No. 2018CF000847

MARCUS DEON JOHNSON,
    Defendant.

TRANSCRIPT OF JURY TRIAL — DAY 3
Honorable Patricia K. Whitmore, Presiding
June 14, 2018

Appearances:
    For the State: Assistant District Attorney Rebecca Gaines
    For the Defense: Attorney Calvin Bowes
    Also Present: Court Reporter Susan Tillman

---

THE COURT: We're back on the record in the matter of State versus Marcus Johnson. Let the record reflect all parties are present. Ms. Gaines, you may call your next witness.

MS. GAINES: Thank you, Your Honor. The State calls Detective Frank Rodriguez.

DIRECT EXAMINATION BY MS. GAINES:

Page 23, Line 1
Q: Detective Rodriguez, please state your name and badge number for the record.
A: Detective Frank Rodriguez, Badge Number 4471, Milwaukee Police Department Homicide Division.

Page 23, Line 7
Q: Detective, did you have occasion to interview the defendant Marcus Johnson on November 12, 2017?
A: Yes I did.
Q: And can you describe the circumstances of that interview?
A: We brought Mr. Johnson into Interview Room B. I read him his Miranda rights from a card. He signed the waiver form. Then we talked.
Q: Did the defendant say anything during that interview?
A: Yes. He told us he wasn't anywhere near the scene.
Q: Did anything else happen during that interview?
A: At one point he asked — he said something like, "maybe I should talk to someone," but he was still talking so we kept going.
Q: And you continued the interview?
A: We did. He kept talking. Seemed fine.

Page 23, Line 25
Q: What did the defendant ultimately tell you about where he was?
A: He couldn't give a specific location.

Page 24, Line 3
Q: Detective Rodriguez, I want to ask you about the physical evidence. You recovered a handgun from the defendant's vehicle, correct?
A: That's correct. A Glock 19.
Q: When you recovered that weapon, what did you do with it?
A: I logged it into evidence.
Q: And who else handled the weapon prior to your logging it?
A: The responding officers — Patrolman Davis and Patrolman Cortez. And the forensics tech, I believe, but I'm not certain when she got to it.

Page 24, Line 14
COURT REPORTER'S NOTE: Exhibit 4 (chain of custody log) referenced but not formally admitted at this juncture.

Page 25, Line 1
Q: Detective, you also recovered eyewitness statements?
A: Yes.
Q: How many witness statements did you collect?
A: We had three witnesses.
Q: Were all three statements consistent with each other?
A: Two were, yeah.
Q: What about the third?
A: The third witness — a James Whitfield — said he wasn't sure it was the same person. Didn't feel confident. We didn't use his statement.
Q: Was that statement disclosed to defense counsel?
A: I believe that was in the file.

Page 25, Line 18
MR. BOWES: Your Honor, I'd object — I've never seen a statement from a James Whitfield in the discovery materials.
THE COURT: Ms. Gaines, has a Whitfield statement been produced?
MS. GAINES: Your Honor, we'll address that at the break.
THE COURT: We'll move on.

Page 26, Line 2
Q: Detective, you're confident in your identification of the defendant as the perpetrator?
A: I am.
Q: I have no further questions, Your Honor.

THE COURT: Cross-examination, Mr. Bowes?

Page 26, Line 9
CROSS-EXAMINATION BY MR. BOWES:

Q: Detective, you mentioned a James Whitfield statement. Can you tell me more about what Mr. Whitfield said?
A: As I said, he wasn't sure about the identification.
Q: And you have no knowledge of whether that statement was turned over to us?
A: That would be the DA's office.
Q: Fair enough. Now, you testified that Marcus Johnson said — and I'm quoting — "maybe I should talk to someone" during your interview?
A: That's what I said.
Q: That's an invocation of the right to counsel, isn't it, Detective?
A: I didn't interpret it that way. He kept talking.
Q: You kept questioning him after he said he wanted to talk to someone?
A: He wasn't firm about it. It wasn't a clear invocation.
Q: That's your judgment to make?
A: I've been doing this 17 years.

Page 26, Line 31
MR. BOWES: No further questions.
THE COURT: Redirect?
MS. GAINES: Briefly, Your Honor.

Page 27, Line 3
REDIRECT EXAMINATION BY MS. GAINES:

Q: Detective, in your 17 years of experience, was Marcus Johnson's statement consistent with guilt?
A: Without a doubt.
Q: Thank you.

THE COURT: Witness is excused. Ms. Gaines?

Page 27, Line 12
MS. GAINES: The State calls Officer Maria Martinez.

DIRECT EXAMINATION BY MS. GAINES:

Q: Officer Martinez, you were the first responding officer on scene, correct?
A: Yes, ma'am.
Q: And you observed the defendant at the scene?
A: He was stopped one block away in a silver vehicle.
Q: And you believe he was the individual who committed this robbery?
A: Yes.
Q: I have no doubt that Officer Martinez is telling the truth, ladies and gentlemen — she put her career on the line to make this identification.
MR. BOWES: Objection — vouching.
THE COURT: Sustained. Ms. Gaines, please.
MS. GAINES: I'll rephrase. Officer, you're confident in your identification?
A: Absolutely.

Page 28, Line 7
[RECESS — 12:13 P.M. to 1:47 P.M.]

Page 29, Line 1
THE COURT: We're back on the record. Mr. Bowes, call your first witness.
MR. BOWES: Defense calls Marcus Johnson.

[Defendant takes the stand]

Page 29, Line 8
DIRECT EXAMINATION BY MR. BOWES:

Q: Marcus, where were you on the night of November 12th?
A: I was with Terrence Webb at his apartment on 38th and Hampton.
Q: Did anyone else see you there?
A: Terrence's girlfriend was there. And the building manager came by around 10.
Q: And this was the same time the robbery allegedly occurred?
A: Yes sir.

Page 29, Line 18
MR. BOWES: No further questions.

[Defense counsel did not call Terrence Webb or any alibi witnesses to corroborate the defendant's testimony]

Page 30, Line 1
CLOSING ARGUMENTS:

Page 30, Line 3
MS. GAINES: Ladies and gentlemen, you've heard from the detective who looked this man in the eye and knew — knew — that he was guilty. You've heard from the officer who saw him one block away. Marcus Johnson had that gun in his car. The alibi is uncorroborated. No Terrence Webb came here to testify. Why? Because there is no Terrence Webb who can help this man.

Page 31, Line 14
MR. BOWES: Ladies and gentlemen, my client told you where he was. The state's own detective admitted he heard Marcus say he wanted to talk to someone before they continued questioning him. The evidence log shows that gun passed through three officers' hands before it was logged. And there is a witness — a James Whitfield — who told police he wasn't sure. You never heard from Mr. Whitfield because the State decided you shouldn't.

Page 32, Line 2
THE COURT: Members of the jury, you must find the defendant guilty beyond a reasonable doubt. You may consider all the evidence presented. You may also consider the fact that the defendant chose to take the stand but offered only his own uncorroborated word. The defendant's failure to produce alibi witnesses may be considered by you in evaluating his credibility. You should apply common sense.

Page 32, Line 19
[JURY DELIBERATION: 3 hours 14 minutes]

Page 33, Line 1
THE COURT: Has the jury reached a verdict?
FOREPERSON: We have, Your Honor.
THE COURT: What say you?
FOREPERSON: We, the jury, find the defendant Marcus Deon Johnson guilty of armed robbery as charged in the information.

Page 33, Line 9
THE COURT: Mr. Johnson, you are remanded to custody pending sentencing. Sentencing is set for August 3, 2018 at 9:00 a.m.

MR. BOWES: Your Honor, we'd request bail pending sentencing.
THE COURT: Denied. Court is adjourned.

[END OF TRANSCRIPT — JUNE 14, 2018]
Certified by: Susan Tillman, Court Reporter
`;

const DEMO_FINDINGS = [
  {
    issueTitle: "Miranda Violation — Interrogation Continued After Invocation of Right to Counsel",
    transcriptExcerpt: "at one point he asked — he said something like, 'maybe I should talk to someone,' but he was still talking so we kept going.",
    legalAnalysis: "Detective Rodriguez admitted on the stand that Marcus Johnson stated he 'maybe should talk to someone' during the custodial interrogation — a clear invocation of the Sixth Amendment right to counsel under Davis v. United States, 512 U.S. 452 (1994). While Davis requires the invocation to be unambiguous, the Wisconsin Supreme Court has interpreted this standard in ways that protect equivocal invocations. More critically, once any question is raised about an invocation, all interrogation must cease immediately. Rodriguez's self-serving characterization that Johnson 'wasn't firm' does not satisfy the constitutional obligation. The statement must be suppressed under Edwards v. Arizona, 451 U.S. 477 (1981).",
    pageNumber: 23,
    lineNumber: 7,
    precedentName: "Edwards v. Arizona",
    precedentCitation: "451 U.S. 477 (1981)",
    precedentType: "BINDING",
    courtRuling: "Once a suspect invokes the right to counsel, all interrogation must immediately cease and may not resume until counsel is present or the suspect reinitiates communication.",
    materialSimilarity: "Johnson's statement 'maybe I should talk to someone' during custodial interrogation mirrors the equivocal invocations courts have found sufficient to trigger the Edwards rule. Rodriguez admitted the interrogation continued after this statement with no break or clarification.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue under Davis v. United States that the invocation was not sufficiently clear and unambiguous — 'maybe I should talk to someone' is equivocal and does not trigger Edwards. State will also argue harmless error: the statement was cumulative of physical evidence and eyewitness identification.",
    breakthroughArgument: "Under Berghuis v. Thompkins, 560 U.S. 370 (2010), ambiguity questions under Davis are factual. Detective Rodriguez's own testimony — 'he kept talking, seemed fine' — shows the detective made a unilateral judgment call without pausing to clarify. Wisconsin courts have held that where any ambiguity exists the safe constitutional course is to cease questioning. The physical evidence was independently contested (chain of custody issues) and the eyewitness identification was contradicted by Whitfield — so the statement was not harmless beyond a reasonable doubt under Chapman.",
    legalVehicle: "§ 974.06 Motion",
    survivability: "Strong",
  },
  {
    issueTitle: "Brady Violation — Suppression of Exculpatory Witness Statement (James Whitfield)",
    transcriptExcerpt: "The third witness — a James Whitfield — said he wasn't sure it was the same person. Didn't feel confident. We didn't use his statement.",
    legalAnalysis: "Detective Rodriguez testified that a third witness, James Whitfield, provided a statement expressing uncertainty about the identification of Marcus Johnson as the perpetrator. Defense counsel immediately objected on the record that no Whitfield statement was ever produced in discovery. The State deflected without resolution. Under Brady v. Maryland, 373 U.S. 83 (1963), the State must disclose all exculpatory and impeachment evidence. A witness statement expressing doubt about the identification of the accused is quintessentially exculpatory. The suppression of this statement denied Johnson a fair trial and likely affected the jury's assessment of the eyewitness evidence — the State's central pillar of proof.",
    pageNumber: 25,
    lineNumber: 1,
    precedentName: "Brady v. Maryland",
    precedentCitation: "373 U.S. 83 (1963)",
    precedentType: "BINDING",
    courtRuling: "The prosecution's suppression of evidence favorable to an accused violates due process where the evidence is material either to guilt or to punishment.",
    materialSimilarity: "Whitfield's statement expressing doubt about the perpetrator's identity is directly exculpatory — it contradicts the State's theory that the identification was reliable. Detective Rodriguez admitted on cross that he deliberately set aside the statement. The State's closing argument attacked Johnson's alibi as uncorroborated while simultaneously suppressing a witness who expressed doubt.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue materiality under Strickler v. Greene — that there is no reasonable probability the result would have been different with Whitfield's statement, because two other witnesses identified Johnson and physical evidence (the gun) was recovered from his vehicle. State may also argue the statement was in the 'file' and technically available.",
    breakthroughArgument: "Under Kyles v. Whitley, 514 U.S. 419 (1995), materiality is evaluated based on the totality of the circumstances, not each item in isolation. The eyewitness identification was the State's primary evidence. Whitfield's doubt attacks that foundation directly. Combined with chain of custody questions on the weapon and the Miranda-tainted statement, there is a reasonable probability — not just possibility — of a different outcome. Detective Rodriguez's admission that the statement was intentionally withheld ('we didn't use his statement') establishes willfulness under Giglio v. United States.",
    legalVehicle: "Brady/Giglio Motion",
    survivability: "Strong",
  },
  {
    issueTitle: "Ineffective Assistance of Counsel — Failure to Investigate and Call Alibi Witnesses",
    transcriptExcerpt: "Defense counsel did not call Terrence Webb or any alibi witnesses to corroborate the defendant's testimony",
    legalAnalysis: "Marcus Johnson testified that he was with Terrence Webb and Webb's girlfriend at Webb's apartment when the robbery occurred. He also identified the building manager as an additional witness. Defense counsel Attorney Calvin Bowes called Johnson himself but made no effort to call, interview, or subpoena Terrence Webb, Webb's girlfriend, or the building manager. The State then used this failure in closing argument: 'No Terrence Webb came here to testify. Why? Because there is no Terrence Webb.' Under Strickland v. Washington, 466 U.S. 668 (1984), counsel's complete failure to investigate identified alibi witnesses — witnesses whose existence and location the defendant specifically provided — falls below the objective standard of reasonableness and constitutes deficiency. The prejudice is clear: the jury convicted based in part on an uncorroborated alibi that competent counsel would have corroborated.",
    pageNumber: 29,
    lineNumber: 18,
    precedentName: "Strickland v. Washington",
    precedentCitation: "466 U.S. 668 (1984)",
    precedentType: "BINDING",
    courtRuling: "A defendant must show counsel's performance was deficient and that deficiency prejudiced the defense — there is a reasonable probability the result would have been different but for the deficient performance.",
    materialSimilarity: "Johnson identified three specific corroborating witnesses by name and location. Bowes made no attempt to contact any of them. In Wiggins v. Smith, 539 U.S. 510 (2003), the Supreme Court held that counsel's failure to investigate is not justified by a strategic decision when counsel has not even gathered the information needed to make a strategic choice.",
    proceduralStatus: "Unclear",
    anticipatedBlock: "State will argue strategic decision — counsel may have decided Webb's testimony was too risky or that Webb would be a weak witness. Under Strickland, courts defer to strategic choices. State will also invoke Escalona-Naranjo procedural bar if this claim was not raised on direct appeal.",
    breakthroughArgument: "A 'strategic decision' requires a strategy. Bowes did not interview Webb, did not subpoena him, and left no record of any strategic analysis. Under State v. Thiel, 2003 WI 111, counsel's failure to investigate is not protected as strategy when there is no evidence of any investigation. The Escalona-Naranjo bar is overcome because appellate counsel was also ineffective for failing to raise the IAC claim — itself an IAC claim that provides sufficient reason for the procedural default.",
    legalVehicle: "§ 974.06 Motion",
    survivability: "Strong",
  },
  {
    issueTitle: "Prosecutorial Misconduct — Improper Vouching for Government Witness Credibility",
    transcriptExcerpt: "I have no doubt that Officer Martinez is telling the truth, ladies and gentlemen — she put her career on the line to make this identification.",
    legalAnalysis: "During direct examination of Officer Martinez, ADA Gaines stated directly to the jury: 'I have no doubt that Officer Martinez is telling the truth, ladies and gentlemen — she put her career on the line to make this identification.' Defense counsel objected and the court sustained the objection. However, the curative instruction was limited to a mild 'please' from the court — no instruction was given to the jury to disregard the statement. Vouching for a witness's credibility by a government attorney is a well-established form of prosecutorial misconduct that violates a defendant's right to a fair trial under United States v. Young, 470 U.S. 1 (1985). Prosecutor's personal endorsement of witness truthfulness improperly uses the government's prestige to bolster testimony.",
    pageNumber: 27,
    lineNumber: 3,
    precedentName: "United States v. Young",
    precedentCitation: "470 U.S. 1 (1985)",
    precedentType: "BINDING",
    courtRuling: "A prosecutor may not express a personal opinion as to the truth or falsity of testimony, which constitutes improper vouching that can deny the defendant a fair trial.",
    materialSimilarity: "Gaines's statement was not ambiguous argument — it was an explicit personal guarantee of the officer's truthfulness made directly to the jury during examination, a textbook example of the vouching prohibited by Young and its progeny. The trial court's failure to give a curative instruction compounds the error.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue harmless error: the court sustained the objection, the jury was aware it was improper, and the officer's identification was corroborated by other evidence. State will argue the brief comment was isolated and not part of a pattern.",
    breakthroughArgument: "Under State v. Neuser, 191 Wis. 2d 131 (Ct. App. 1995), vouching is assessed in the context of the trial as a whole. Here the identification was the central contested issue. The prosecutor's endorsement of the identifying officer's truthfulness — without a curative instruction — infected the jury's deliberations on the only genuinely disputed factual question. Combined with other errors, the cumulative prejudice exceeds harmless error.",
    legalVehicle: "Direct Appeal",
    survivability: "Moderate",
  },
  {
    issueTitle: "Unconstitutional Jury Instruction — Penalizing Defendant for Failure to Produce Alibi Witnesses",
    transcriptExcerpt: "The defendant's failure to produce alibi witnesses may be considered by you in evaluating his credibility. You should apply common sense.",
    legalAnalysis: "The trial court's jury instruction directly told the jury it could negatively evaluate Marcus Johnson's credibility based on his 'failure to produce alibi witnesses.' This instruction is constitutionally infirm on multiple grounds. First, it shifts the burden of proof — the defendant has no obligation to produce any witness; the State bears the burden of proof beyond reasonable doubt. Second, the instruction implicitly penalizes Johnson for the failures of his own defense counsel, who never attempted to contact or subpoena the alibi witnesses. Under Cage v. Louisiana, 498 U.S. 39 (1990), jury instructions that reduce the prosecution's burden of proof violate due process. The instruction operated to tell the jury: 'the defendant's word is suspect because he couldn't produce witnesses' — directly undermining the presumption of innocence.",
    pageNumber: 32,
    lineNumber: 2,
    precedentName: "Cage v. Louisiana",
    precedentCitation: "498 U.S. 39 (1990)",
    precedentType: "BINDING",
    courtRuling: "Jury instructions that effectively reduce the prosecution's burden below proof beyond a reasonable doubt violate the Due Process Clause of the Fourteenth Amendment.",
    materialSimilarity: "The instruction told the jury to use 'common sense' and consider the absence of alibi witnesses against the defendant — a direct burden-shifting instruction that made Johnson's credibility contingent on producing witnesses he had a constitutional right not to produce.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue the instruction was a proper credibility instruction, not a burden-shifting instruction, and that courts may instruct juries to evaluate all evidence including absence of corroboration. State will distinguish Cage on grounds that this instruction did not redefine reasonable doubt.",
    breakthroughArgument: "The instruction did not merely allow the jury to consider lack of corroboration — it specifically tied the defendant's credibility to his failure to produce named witnesses who he identified in his testimony. This penalizes the defendant for the acts and omissions of counsel (the IAC claim) and cannot be considered proper. Under Sullivan v. Louisiana, 508 U.S. 275 (1993), a constitutionally deficient reasonable doubt instruction is structural error not subject to harmless error analysis.",
    legalVehicle: "Direct Appeal",
    survivability: "Moderate",
  },
  {
    issueTitle: "Chain of Custody Deficiency — Unlogged Weapon Handling by Multiple Officers",
    transcriptExcerpt: "The responding officers — Patrolman Davis and Patrolman Cortez. And the forensics tech, I believe, but I'm not certain when she got to it.",
    legalAnalysis: "Detective Rodriguez testified that the firearm recovered from Johnson's vehicle was handled by at minimum three individuals — Patrolmen Davis and Cortez, and an unnamed forensics technician — before Rodriguez logged it into evidence. Rodriguez admitted uncertainty about when the forensics tech accessed the weapon ('I'm not certain when she got to it'). The chain of custody log (Exhibit 4) was referenced in testimony but never formally admitted. Under State v. Donaldson, 2002 WI App 306, the State must establish a reasonable probability that the evidence has not been altered or tampered with. Rodriguez's admitted uncertainty creates a gap in the chain. Defense counsel did not move to exclude the weapon on this basis, compounding the IAC claim.",
    pageNumber: 24,
    lineNumber: 3,
    precedentName: "State v. Donaldson",
    precedentCitation: "2002 WI App 306 (Ct. App. 2002)",
    precedentType: "BINDING",
    courtRuling: "The State must establish a reasonable probability that real evidence offered at trial has not been altered or tampered with between the time it was obtained and the time it was offered.",
    materialSimilarity: "Rodriguez could not account for the forensics technician's access to the weapon, admitted multiple officers handled it before logging, and could not confirm when the chain of custody log (Exhibit 4) was completed. The gun is the only physical evidence tying Johnson to the crime.",
    proceduralStatus: "Defaulted",
    anticipatedBlock: "State will argue defense never moved to exclude the weapon at trial, defaulting the claim. State will also argue that minor chain of custody gaps go to weight, not admissibility, and that no tampering is alleged. Strickland prejudice prong will be argued: even without the gun, eyewitness testimony supports conviction.",
    breakthroughArgument: "The procedural default is excused through the IAC of trial counsel: Bowes failed to challenge the chain of custody despite Rodriguez's on-the-stand admission of uncertainty. As an IAC claim, cause and prejudice are satisfied. On the merits, the weapon was the linchpin of the State's physical evidence — without proper foundation, its admission was an abuse of discretion that prejudiced the defense under Brecht v. Abrahamson.",
    legalVehicle: "§ 974.06 Motion",
    survivability: "Moderate",
  },
  {
    issueTitle: "Cumulative Prosecutorial and Judicial Error — Systematic Denial of Fair Trial",
    transcriptExcerpt: "we kept going [...] we didn't use his statement [...] I have no doubt that Officer Martinez is telling the truth [...] The defendant's failure to produce alibi witnesses may be considered",
    legalAnalysis: "Taken in isolation, each error in this transcript might be argued as harmless. Together, they form a complete picture of a trial that was fundamentally unfair. The interrogation continued past an invocation of counsel. The State suppressed a contradictory witness. The prosecutor vouched for the identifying officer. The trial court's instruction penalized the defendant for his counsel's failings. Counsel never investigated the alibi. The physical evidence lacked a proper foundation. Under the cumulative error doctrine, recognized in Alvarez v. Boyd, 225 F.3d 820 (7th Cir. 2000), the combined prejudicial effect of multiple errors — even if each is individually arguable as harmless — can require reversal when the errors together denied the defendant a fundamentally fair proceeding.",
    pageNumber: 1,
    lineNumber: 1,
    precedentName: "Alvarez v. Boyd",
    precedentCitation: "225 F.3d 820 (7th Cir. 2000)",
    precedentType: "PERSUASIVE",
    courtRuling: "The cumulative effect of trial errors may deny the defendant a fundamentally fair trial even if no single error independently requires reversal.",
    materialSimilarity: "Every stage of Johnson's trial was contaminated: the investigation (Miranda violation, Brady suppression), the trial (vouching, improper instruction, chain of custody), and the defense (complete failure to investigate alibi). The compounded prejudice of all these errors destroyed the integrity of the proceeding.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue cumulative error doctrine is not independently cognizable — each claim must independently satisfy its own standard, and a collection of individually harmless errors does not become reversible collectively. State will cite State v. Thiel for the proposition that cumulative error requires each error to be an actual error first.",
    breakthroughArgument: "Multiple of the errors here ARE independently reversible (Brady, Miranda), so the cumulative error argument layers on top of already-viable claims. Under United States v. Rivera, 900 F.2d 1462 (10th Cir. 1990), courts must consider the combined prejudicial impact. The systematic nature of the errors — affecting investigation, trial, and defense preparation — shows this was not a fair trial by any measure.",
    legalVehicle: "Federal Habeas § 2254",
    survivability: "Moderate",
  },
];

const DEMO_ROUNDS = [
  {
    roundNumber: 1,
    stateStrength: "MODERATE",
    defenseBurden: "Defense must demonstrate that the Miranda invocation was sufficiently clear to trigger the Edwards rule and that the resulting statement was not harmless beyond a reasonable doubt.",
    stateArgument: "Your Honor, the State will address the procedural posture before reaching the merits. Defense counsel raises a Miranda claim for the first time in post-conviction proceedings, which raises an immediate Escalona-Naranjo procedural bar — this claim was never raised on direct appeal, and no sufficient reason has been offered for that failure. The claim is forfeited.\n\nOn the merits, even if this Court entertains the Miranda argument, Davis v. United States, 512 U.S. 452 (1994), requires that a request for counsel be unambiguous. 'Maybe I should talk to someone' is a textbook equivocal statement. Detective Rodriguez, a 17-year veteran, made a reasonable, good-faith judgment that no invocation had occurred. The Supreme Court in Davis was explicit: an ambiguous statement does not require police to stop questioning.\n\nFinally, even if error occurred, it was harmless beyond a reasonable doubt under Chapman v. California. The statement obtained was that Johnson 'wasn't anywhere near the scene' — a denial he repeated from the witness stand. The statement was cumulative of his own testimony and added nothing to the State's case that the physical evidence and eyewitness identifications did not already establish.",
    courtCommentary: "Counsel, I have concerns about the procedural posture. Mr. Johnson — the record indicates this Miranda claim was not raised at trial by objection at the time the statement was admitted, nor on direct appeal. Walk me through your cause-and-prejudice argument for overcoming Escalona-Naranjo.\n\nOn the Davis question, I'm also troubled by the 'maybe I should' formulation. The Supreme Court was quite clear in Davis. However, I note that Rodriguez's own testimony raises a factual question — he acknowledged the statement, acknowledged he continued questioning, and acknowledged he made a personal judgment. Can defense speak to whether the trial court was ever asked to make a finding on this issue?\n\nFinally, on harmless error — the State argues the statement was cumulative. Is that accurate? Was any portion of that statement not covered by Johnson's own testimony?",
    defenseResponse: "Your Honor, we go directly to cause and prejudice for Escalona-Naranjo. The sufficient reason for not raising this claim on direct appeal is the ineffective assistance of appellate counsel — counsel who also failed to raise it and whose deficiency is itself an independent IAC claim. Under State v. Romero-Georgana, 2014 WI 83, IAC of appellate counsel constitutes cause sufficient to overcome Escalona-Naranjo. That independently viable claim unlocks the procedural gateway.\n\nOn Davis — the State reads Davis too broadly. Davis established a clarity requirement for ambiguous invocations, but it did not eliminate the obligation to clarify when the circumstances create ambiguity. More importantly, Wisconsin courts applying Davis look at the totality of the circumstances. Here, the detective himself acknowledged uncertainty — 'he said something like' — and chose to press on. That choice, made without clarification, cannot be insulated from constitutional review.\n\nOn harmless error under Chapman, the State is wrong that the statement was cumulative. Johnson's trial testimony denied presence at the scene, but the statement to Rodriguez included details about his location that were used to undermine his alibi at trial. Those details — extracted after the invocation — were used in closing argument against him. The error was not harmless.",
  },
  {
    roundNumber: 2,
    stateStrength: "MINIMAL",
    defenseBurden: "Defense must demonstrate materiality of the Whitfield statement under the Brady standard — that there is a reasonable probability the result would have been different had the statement been disclosed.",
    stateArgument: "Your Honor, on the Brady claim regarding the Whitfield statement, the State's position is straightforward: materiality is not established here. Under Strickler v. Greene, 527 U.S. 263 (1999), the defendant must show a reasonable probability — not merely a possibility — that disclosure would have produced a different result. The State had two additional eyewitnesses who unequivocally identified Johnson. One equivocal witness, even if fully disclosed and presented, does not undermine the strength of two consistent identifications plus the physical evidence of the firearm in Johnson's vehicle.\n\nMoreover, Detective Rodriguez testified that the Whitfield statement was 'in the file.' Defense counsel had an obligation to review the complete discovery file and request any witness statements. If the statement was not produced, the appropriate remedy was a pretrial motion to compel — not a post-conviction Brady claim.\n\nThe State also raises AEDPA deference: the state courts found no Brady violation. That determination is entitled to deference under 28 U.S.C. § 2254(d). Defense must show not merely that the state court was wrong, but that it unreasonably applied clearly established federal law.",
    courtCommentary: "I'm going to stop the State right there on the 'in the file' argument. Detective Rodriguez testified on the stand that 'we didn't use his statement' — that is not a disclosure. That is the opposite of disclosure. If the statement was deliberately set aside by the investigating detective and never produced to defense counsel, the State cannot now argue that defense had constructive knowledge of it.\n\nThe materiality question is harder. Counsel, what is the full record of the eyewitness evidence? The Whitfield statement expresses doubt — how does that interact with the other two identifications? And can you tell me whether defense counsel made any inquiry into the Whitfield statement before or during trial beyond the objection I see on the record?",
    defenseResponse: "Your Honor, the State's AEDPA argument fails because the state court did not conduct a proper Brady materiality analysis — it denied the claim in a summary order without opinion. Under Harrington v. Richter, 562 U.S. 86 (2011), a summary denial is still entitled to deference, but where the state court's analysis is facially incomplete — as it is here — the federal court conducts a more searching review.\n\nOn materiality: the Brady analysis requires looking at the suppressed evidence in the context of the entire record. The State had two consistent eyewitnesses and one equivocal one. But eyewitness identification is the most contested category of evidence in criminal law. Under Perry v. New Hampshire, 565 U.S. 228 (2012), the reliability of eyewitness evidence is precisely the kind of issue juries must weigh carefully. A third eyewitness expressing doubt does not merely reduce the State's case by one-third — it creates reasonable doubt about the reliability of the entire identification framework.\n\nDetective Rodriguez's admission — 'we didn't use his statement' — is tantamount to an admission of willful suppression under Giglio. Willful suppression is sufficient for Brady materiality without needing to quantify the precise impact.",
  },
  {
    roundNumber: 3,
    stateStrength: "MODERATE",
    defenseBurden: "Defense must show that trial counsel's failure to investigate alibi witnesses fell below an objective standard of reasonableness AND that there is a reasonable probability of a different outcome had those witnesses testified.",
    stateArgument: "Your Honor, on the IAC claim regarding alibi witnesses, the State raises three arguments. First, under Strickland, the deficiency prong requires overcoming a strong presumption of competence. We do not know why Attorney Bowes did not call Terrence Webb — we have no affidavit from Bowes, no hearing record, nothing. Defense asks this court to assume the worst about trial counsel based on a cold record. That is not how Strickland works. Under Harrington, courts must presume that an unelucidated decision reflects a strategic choice. Perhaps Bowes interviewed Webb and found him to be a bad witness. We simply do not know.\n\nSecond, on prejudice — the alibi was presented through Johnson's own testimony. The jury heard the alibi and rejected it. There is no reason to believe a corroborating witness would have changed that outcome when the jury already chose to disbelieve the defendant's version of events.\n\nThird, the Escalona-Naranjo bar applies here even more forcefully — this claim was clearly available on direct appeal.",
    courtCommentary: "On the question of why counsel did not call alibi witnesses — both sides are speculating in the absence of a Machner hearing. Counsel, why has no Machner hearing been requested or held? The record on this IAC claim is thin.\n\nOn the Strickland prejudice question, I want to hear from defense specifically on the 'why would the jury have changed its mind' question. The jury heard Johnson's alibi from his own mouth and convicted him. What does adding Webb's testimony actually change in the analysis?\n\nI'll also note for the record that the prosecutor's closing argument specifically capitalized on the absence of Webb: 'No Terrence Webb came here to testify. Why? Because there is no Terrence Webb who can help this man.' If Webb had testified, that entire closing argument — which I would characterize as substantial — disappears from the jury's deliberations.",
    defenseResponse: "Your Honor, the absence of a Machner hearing is itself attributable to the failures of postconviction counsel. We are requesting a Machner evidentiary hearing as part of this proceeding — we are not asking this Court to decide the IAC claim on the cold record alone.\n\nOn the prejudice prong — the Court has itself identified the key point. The prosecution's entire closing attack on the alibi was built on Webb's absence. 'There is no Terrence Webb who can help this man.' That is not a minor rhetorical point — it is the State's explicit argument to the jury that the alibi was fabricated. If Webb had testified, that argument never gets made, and the jury deliberates on a fundamentally different record.\n\nUnder Wiggins v. Smith, 539 U.S. 510 (2003), the failure to investigate is not strategic when counsel has no record of any investigation at all. Bowes filed no investigative notes, no subpoenas, no correspondence with Webb. Under those circumstances, Strickland's presumption of strategy has nothing to attach to. The claim survives to a Machner hearing.",
  },
  {
    roundNumber: 4,
    stateStrength: "MINIMAL",
    defenseBurden: "Defense must demonstrate that the combined effect of all errors, taken together, denied Marcus Johnson a fundamentally fair trial.",
    stateArgument: "Your Honor, in closing, the State acknowledges this was not a perfect trial. But imperfect trials are not unconstitutional trials. Each of the errors defense has raised either was properly preserved and addressed, was waived, or was harmless in the context of the overall evidence. The cumulative error doctrine, as this Court knows, does not transform a collection of individually non-reversible errors into a reversible one. Under State v. Thiel, 2003 WI 111, cumulative error analysis requires each claimed error to be an actual error — and we have contested each one. The conviction of Marcus Johnson was supported by eyewitness identification, physical evidence, and his own inability to produce corroboration. This Court should affirm.",
    courtCommentary: "I have heard four rounds of argument in this matter. I want to state for the record that several of the issues raised here are serious and troubling. The Brady question, in particular, rests on Detective Rodriguez's own testimony that he deliberately set aside the Whitfield statement. That is not a close question on the facts.\n\nI am prepared to rule. My ruling will address the Brady claim as the clearest basis for relief, with observations on the Miranda and IAC claims as independent alternative grounds. The cumulative error argument provides additional support for the conclusion I have reached.\n\nI will note that the system worked exactly as defense counsel described in their opening — the fight for the state ended at sentencing, and Marcus Johnson has been fighting uphill ever since. That does not change the law, but it does remind me of why this review function exists.",
    defenseResponse: "Your Honor, we rest on the argument. Marcus Johnson has been incarcerated for six years on a conviction built on a suppressed witness statement, a Miranda violation this Court now has the record to see clearly, and an alibi that was never properly investigated. We are asking this Court to do what the trial court could not: give him a fair proceeding. The errors here are not technical — they are foundational. The jury that convicted him never heard from James Whitfield. Never heard that his request to speak with counsel was heard and ignored. Never heard from Terrence Webb. That is not the trial the Constitution requires. We ask this Court to vacate the conviction and order a new trial.",
  },
];

const DEMO_VERDICT_SUMMARY = `After four rounds of argument in this § 974.06 postconviction proceeding, this Court finds that the conviction of Marcus Deon Johnson cannot stand.

The Brady violation is clear. Detective Rodriguez testified on the stand — under oath, in the very trial that produced this conviction — that a third eyewitness, James Whitfield, expressed doubt about the identification of the defendant, and that this statement was deliberately set aside. The State's argument that the statement was "in the file" is contradicted by the objection defense counsel raised contemporaneously, which was never resolved at trial. Under Brady v. Maryland and Kyles v. Whitley, suppression of a witness's expression of uncertainty about the central identification in a robbery trial is material. There is a reasonable probability that disclosure of the Whitfield statement would have produced a different result.

The Miranda violation is a close question on the Davis standard, but this Court notes that Detective Rodriguez himself described Johnson's statement as something he "said something like" — a description that suggests Rodriguez was uncertain about the precise words. Under those circumstances, the constitutionally safe course was to stop questioning, clarify, and secure counsel if any ambiguity existed. The failure to do so, and the continued use of that statement, is troubling.

The ineffective assistance claim requires a Machner hearing. This Court will order one. The record is devoid of any evidence that Attorney Bowes investigated, contacted, or attempted to subpoena Terrence Webb or any other alibi witness named by the defendant. The prosecutor's closing argument — which directly exploited that absence — may have been decisive. Defense is entitled to a hearing.

The jury instruction directing jurors to consider the "defendant's failure to produce alibi witnesses" as affecting his credibility is troubling and likely constitutionally infirm, but this Court need not reach it given the findings above.

RULING: The conviction of Marcus Deon Johnson is VACATED. The matter is remanded for a new trial. The State is ordered to produce all witness statements collected during the investigation. A Machner hearing on the IAC claim is scheduled within 60 days. DEFENSE WIN.`;

const DEMO_MOTION_CONTENT = `IN THE CIRCUIT COURT OF MILWAUKEE COUNTY
STATE OF WISCONSIN

STATE OF WISCONSIN,
    Plaintiff-Respondent,

    vs.                                     Case No. 2018CF000847

MARCUS DEON JOHNSON,
    Defendant-Appellant.

MOTION FOR POST-CONVICTION RELIEF
PURSUANT TO WIS. STAT. § 974.06

INTRODUCTION

Marcus Deon Johnson was convicted of armed robbery on June 14, 2018, following a trial infected by constitutional violations that individually undermine the verdict and collectively destroyed any possibility of a fair proceeding. Mr. Johnson now moves this Court for post-conviction relief on four independent grounds: (1) the State's deliberate suppression of an exculpatory eyewitness statement in violation of Brady v. Maryland; (2) the continuation of custodial interrogation after Mr. Johnson invoked his right to counsel in violation of Edwards v. Arizona; (3) the ineffective assistance of trial counsel in failing to investigate and present identified alibi witnesses; and (4) the cumulative effect of all errors, which denied Mr. Johnson the fundamentally fair trial the Constitution guarantees.

PROCEDURAL HISTORY

Mr. Johnson was charged with one count of armed robbery in Milwaukee County Circuit Court on November 28, 2017. Trial commenced on June 12, 2018, before the Honorable Patricia K. Whitmore. On June 14, 2018, the jury returned a guilty verdict after three hours of deliberation. Mr. Johnson was sentenced to fifteen years imprisonment on August 3, 2018. He filed a timely notice of direct appeal, which was decided without raising the claims now before this Court. Mr. Johnson now brings this § 974.06 motion, supported by newly discovered evidence and a showing of ineffective assistance of appellate counsel as cause for any procedural default.

STATEMENT OF FACTS

The prosecution's case rested on three pillars: eyewitness identification, a statement obtained from Mr. Johnson during custodial interrogation, and a firearm recovered from his vehicle. Each pillar is now compromised.

On November 12, 2017, Detective Frank Rodriguez brought Mr. Johnson to Interview Room B and administered Miranda warnings. During the interview, Mr. Johnson stated — in Detective Rodriguez's own words at trial — "maybe I should talk to someone." Rodriguez acknowledged this statement under oath but testified that he "didn't interpret it that way" and continued the interrogation. (Trial Tr. 23:7-25.) No break was taken. No counsel was summoned. The interrogation continued until Rodriguez had what he needed.

At trial, Detective Rodriguez testified that three witnesses provided statements. Two were consistent with the prosecution's theory. The third, a James Whitfield, "said he wasn't sure it was the same person. Didn't feel confident." (Trial Tr. 25:1.) Rodriguez testified the statement was deliberately not used. Defense counsel immediately objected on the record that no Whitfield statement had ever been produced in discovery. The Court deferred the issue; it was never resolved.

Mr. Johnson testified that on the night of the robbery he was at the apartment of Terrence Webb, corroborated by Webb's girlfriend and the building manager. Defense counsel called no alibi witnesses other than Mr. Johnson himself. The prosecutor's closing argument made explicit use of this absence: "No Terrence Webb came here to testify. Why? Because there is no Terrence Webb who can help this man." (Trial Tr. 30:3.)

The trial court's jury instruction told jurors they could consider "the defendant's failure to produce alibi witnesses" in evaluating his credibility. (Trial Tr. 32:2.) No objection was made.

LEGAL ARGUMENT

I. THE STATE'S SUPPRESSION OF THE WHITFIELD STATEMENT VIOLATED BRADY v. MARYLAND AND REQUIRES A NEW TRIAL.

The Due Process Clause of the Fourteenth Amendment prohibits the prosecution from suppressing evidence favorable to the accused where it is material to guilt or punishment. Brady v. Maryland, 373 U.S. 83, 87 (1963). The Brady duty applies to impeachment evidence as well as exculpatory evidence. Giglio v. United States, 405 U.S. 150, 154 (1972). Evidence is material under Brady if "there is a reasonable probability that, had the evidence been disclosed to the defense, the result of the proceeding would have been different." United States v. Bagley, 473 U.S. 667, 682 (1985). A "reasonable probability" is one sufficient to undermine confidence in the outcome. Kyles v. Whitley, 514 U.S. 419, 434 (1995).

The Whitfield statement is paradigmatically Brady material. Whitfield — a third witness present at or near the scene — expressed uncertainty about whether Mr. Johnson was the perpetrator. This statement directly contradicts the State's theory that the eyewitness identification was reliable and unambiguous. It was suppressed — not merely not produced, but deliberately set aside, as Detective Rodriguez admitted under oath.

The materiality standard is satisfied. Eyewitness identification was the cornerstone of the State's case. The gun was physically linked to Mr. Johnson but the chain of custody was compromised. The statement — obtained after an arguably invalid Miranda waiver — was disputed. Had the jury known that a third witness expressed doubt about the identification, confidence in the verdict is undermined. There is a reasonable probability of a different result.

II. THE CONTINUED INTERROGATION OF MR. JOHNSON AFTER HIS INVOCATION OF COUNSEL VIOLATED THE FIFTH AND SIXTH AMENDMENTS.

Once a suspect invokes the right to counsel during custodial interrogation, all questioning must immediately cease. Edwards v. Arizona, 451 U.S. 477, 484-85 (1981). A subsequent waiver of the right, obtained through continued interrogation initiated by police, is ineffective. Id. The invocation need not be a legal formulation — courts look to what a reasonable officer would understand the suspect to mean. Berghuis v. Thompkins, 560 U.S. 370, 381 (2010).

Mr. Johnson told Detective Rodriguez that he wanted "to talk to someone." Rodriguez, by his own admission, made a unilateral judgment that this was not an invocation and continued questioning. That judgment was constitutionally impermissible. The safe course under Edwards is always to stop and clarify — not to press on because the detective has 17 years of experience. The statement obtained after this invocation must be suppressed, and its admission at trial was constitutional error.

III. TRIAL COUNSEL'S COMPLETE FAILURE TO INVESTIGATE IDENTIFIED ALIBI WITNESSES CONSTITUTED INEFFECTIVE ASSISTANCE UNDER STRICKLAND.

To establish ineffective assistance of counsel, a defendant must show that counsel's performance was deficient and that the deficiency prejudiced the defense. Strickland v. Washington, 466 U.S. 668, 687 (1984). Deficiency is established when counsel's representation falls below an objective standard of reasonableness. Id. at 688. Prejudice exists where there is a reasonable probability that, but for the deficient performance, the result would have been different. Id. at 694.

Mr. Johnson identified Terrence Webb by name, provided his address, and identified two additional witnesses. Attorney Bowes made no effort to contact any of them. There are no investigative notes, no subpoenas, no correspondence in the record showing any alibi investigation. Under Wiggins v. Smith, 539 U.S. 510, 521-22 (2003), a strategic decision not to call a witness requires that counsel first gather the information needed to make a strategic choice. Where no investigation occurred, there is no strategy to defer to.

The prejudice showing is strong. The prosecution's closing argument used Webb's absence as its central attack on the alibi: "there is no Terrence Webb who can help this man." Had Webb testified, that argument disappears. The jury would have deliberated on a fundamentally different record — one in which the alibi was corroborated, not exposed as a fabrication.

IV. THE CUMULATIVE EFFECT OF THESE ERRORS DENIED MR. JOHNSON A FUNDAMENTALLY FAIR TRIAL.

Even if no individual error independently requires reversal, the cumulative effect of multiple trial errors can deny a defendant the fundamentally fair trial the Constitution guarantees. Alvarez v. Boyd, 225 F.3d 820, 824 (7th Cir. 2000); United States v. Rivera, 900 F.2d 1462, 1469-70 (10th Cir. 1990). Here, every phase of Mr. Johnson's prosecution was infected: the investigation produced a Miranda-tainted statement and a suppressed witness; the trial featured vouching by the prosecutor, a burden-shifting jury instruction, and a chain of custody gap; and the defense provided no alibi corroboration despite specific information to pursue it. This Court should consider the cumulative impact of all errors, which, taken together, make clear that Marcus Johnson never received the trial the Constitution requires.

CONCLUSION

For the foregoing reasons, Mr. Johnson respectfully requests that this Court: (1) vacate his conviction; (2) order a new trial; (3) direct the production of all witness statements collected during the investigation, including the Whitfield statement; and (4) schedule a Machner evidentiary hearing on the ineffective assistance claim within 60 days.

Respectfully submitted,

___________________________
Counsel for Marcus Deon Johnson

CERTIFICATE OF SERVICE

I hereby certify that a copy of this motion has been served upon the Milwaukee County District Attorney's Office by first-class mail on this ___ day of _________, 20__.`;

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
      .select({ name: categoriesTable.name, badgeLabel: categoriesTable.badgeLabel })
      .from(categoriesTable);

    const existingNamesLower = existing.map((r) => r.name.toLowerCase());
    const existingBadgesLower = existing.map((r) => r.badgeLabel.toLowerCase());

    const toInsert = STANDARD_CATEGORIES.filter((cat) => {
      const nameLower = cat.name.toLowerCase();
      const badgeLower = cat.badgeLabel.toLowerCase();
      const nameMatch = existingNamesLower.some((n) => n.includes(nameLower) || nameLower.includes(n));
      const badgeMatch = existingBadgesLower.some((b) => b.includes(badgeLower) || badgeLower.includes(b));
      return !nameMatch && !badgeMatch;
    });

    if (toInsert.length === 0) {
      logger.info("All standard categories already exist — skipping category seed");
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
      const caseId = existing[0].id;

      const demoDoc = await db
        .select({ id: documentsTable.id, status: documentsTable.status, findingCount: documentsTable.findingCount })
        .from(documentsTable)
        .where(eq(documentsTable.caseId, caseId))
        .limit(1)
        .then((rows) => rows[0] ?? null);

      const needsRestore =
        !demoDoc ||
        demoDoc.status === "error" ||
        demoDoc.status === "pending" ||
        (demoDoc.findingCount ?? 0) === 0;

      if (!needsRestore) {
        logger.info({ caseId }, "Demo case already exists and is healthy — skipping seed");
        return;
      }

      logger.info({ caseId }, "Demo case is corrupted — restoring findings and status...");

      await db.transaction(async (tx) => {
        let docId: number;

        if (!demoDoc) {
          const [newDoc] = await tx
            .insert(documentsTable)
            .values({
              caseId,
              title: "Trial Transcript — Day 3, June 14, 2018",
              documentType: "transcript",
              content: DEMO_TRANSCRIPT,
              status: "analyzed",
            })
            .returning();
          docId = newDoc.id;
        } else {
          docId = demoDoc.id;
          await tx
            .delete(findingsTable)
            .where(eq(findingsTable.documentId, docId));
        }

        for (const f of DEMO_FINDINGS) {
          await tx.insert(findingsTable).values({
            caseId,
            documentId: docId,
            issueTitle: f.issueTitle,
            transcriptExcerpt: f.transcriptExcerpt,
            legalAnalysis: f.legalAnalysis,
            pageNumber: f.pageNumber,
            lineNumber: f.lineNumber,
            precedentName: f.precedentName,
            precedentCitation: f.precedentCitation,
            precedentType: f.precedentType,
            courtRuling: f.courtRuling,
            materialSimilarity: f.materialSimilarity,
            proceduralStatus: f.proceduralStatus,
            anticipatedBlock: f.anticipatedBlock,
            breakthroughArgument: f.breakthroughArgument,
            legalVehicle: f.legalVehicle,
            survivability: f.survivability,
          });
        }

        await tx
          .update(documentsTable)
          .set({ status: "analyzed", findingCount: DEMO_FINDINGS.length })
          .where(eq(documentsTable.id, docId));

        await tx
          .update(casesTable)
          .set({ hasAnalysis: true })
          .where(eq(casesTable.id, caseId));
      });

      logger.info({ caseId }, "Demo case restored successfully");
      return;
    }

    logger.info("Seeding demo case...");

    await db.transaction(async (tx) => {
    const [demoCase] = await tx
      .insert(casesTable)
      .values({
        title: "State v. Marcus Johnson — DEMO",
        defendantName: "Marcus Deon Johnson",
        caseNumber: DEMO_CASE_NUMBER,
        jurisdiction: "Milwaukee County Circuit Court, State of Wisconsin",
        notes: "DEMO CASE — Pre-loaded example showing CaseLight's full analysis capabilities. This case contains realistic findings, court simulation, and motion generation based on a fictional post-conviction scenario.",
        hasAnalysis: true,
        hasMotion: true,
      })
      .returning();

    const [demoDoc] = await tx
      .insert(documentsTable)
      .values({
        caseId: demoCase.id,
        title: "Trial Transcript — Day 3, June 14, 2018",
        documentType: "transcript",
        content: DEMO_TRANSCRIPT,
        status: "analyzed",
      })
      .returning();

    for (const f of DEMO_FINDINGS) {
      await tx
        .insert(findingsTable)
        .values({
          caseId: demoCase.id,
          documentId: demoDoc.id,
          issueTitle: f.issueTitle,
          transcriptExcerpt: f.transcriptExcerpt,
          legalAnalysis: f.legalAnalysis,
          pageNumber: f.pageNumber,
          lineNumber: f.lineNumber,
          precedentName: f.precedentName,
          precedentCitation: f.precedentCitation,
          precedentType: f.precedentType,
          courtRuling: f.courtRuling,
          materialSimilarity: f.materialSimilarity,
          proceduralStatus: f.proceduralStatus,
          anticipatedBlock: f.anticipatedBlock,
          breakthroughArgument: f.breakthroughArgument,
          legalVehicle: f.legalVehicle,
          survivability: f.survivability,
        });
    }

    await tx
      .update(documentsTable)
      .set({ findingCount: DEMO_FINDINGS.length })
      .where(eq(documentsTable.id, demoDoc.id));

    const [session] = await tx
      .insert(courtSessionsTable)
      .values({
        caseId: demoCase.id,
        simulationMode: "postconviction_974",
        skepticMode: true,
        expandedRecord: false,
        pleaQuestionnaireNotes: null,
        documentIds: JSON.stringify([demoDoc.id]),
        status: "completed",
        verdictRating: "DEFENSE WIN",
        verdictSummary: DEMO_VERDICT_SUMMARY,
        defenseWon: true,
        totalRounds: 4,
      })
      .returning();

    for (const r of DEMO_ROUNDS) {
      await tx.insert(courtRoundsTable).values({
        sessionId: session.id,
        roundNumber: r.roundNumber,
        stateStrength: r.stateStrength,
        defenseBurden: r.defenseBurden,
        stateArgument: r.stateArgument,
        courtCommentary: r.courtCommentary,
        defenseResponse: r.defenseResponse,
      });
    }

    await tx.insert(motionsTable).values({
      caseId: demoCase.id,
      sessionId: session.id,
      title: "Motion for Post-Conviction Relief Pursuant to Wis. Stat. § 974.06 — State v. Marcus Johnson",
      content: DEMO_MOTION_CONTENT,
    });

    logger.info({ caseId: demoCase.id }, "Demo case seeded successfully");
    }); // end transaction
  } catch (err) {
    logger.error({ err }, "Failed to seed demo case");
  }
}

export async function getDemoCaseId(): Promise<number | null> {
  const rows = await db
    .select({ id: casesTable.id })
    .from(casesTable)
    .where(eq(casesTable.caseNumber, DEMO_CASE_NUMBER))
    .limit(1);
  return rows[0]?.id ?? null;
}

// ─────────────────────────────────────────────────────────────────
// ILLINOIS DEMO CASE
// ─────────────────────────────────────────────────────────────────

const IL_DEMO_CASE_NUMBER = "DEMO-2019CR012345";

const IL_DEMO_TRANSCRIPT = `STATE OF ILLINOIS
CIRCUIT COURT OF COOK COUNTY
CRIMINAL DIVISION — BRANCH 35

PEOPLE OF THE STATE OF ILLINOIS,
    Plaintiff,

    vs.                                         Case No. 2019CR012345

DARNELL JAMES WILLIAMS,
    Defendant.

TRANSCRIPT OF BENCH TRIAL — DAY 2
Honorable Constance M. Adeyemi, Presiding
October 22, 2019

Appearances:
    For the People: Assistant State's Attorney Philip Harte
    For the Defense: Attorney Sandra Kuczyk
    Court Reporter: Lorraine Espinoza

---

THE COURT: Back on the record. Mr. Harte, call your next witness.

MR. HARTE: People call Detective Sergeant Victor Tran.

DIRECT EXAMINATION BY MR. HARTE:

Page 41, Line 1
Q: Sergeant Tran, you obtained the search warrant for 1814 West Cermak Road on August 9, 2019?
A: I did.

Q: What was the basis for your warrant application?
A: We had a confidential informant who told us there were narcotics being stored at that address. The informant had been reliable in two prior cases.

Q: Did the informant provide a specific time window?
A: He said narcotics were present as of three days before the warrant application.

Page 41, Line 18
Q: When you executed the warrant, what did you find?
A: Approximately 214 grams of cocaine in a duffel bag in the rear bedroom, digital scales, and $4,200 in cash.

Q: Who was present in the residence?
A: Darnell Williams and a woman identified as Keisha Barton.

Q: Did you locate any lease or ownership documents?
A: We found mail addressed to Williams at that address.

Page 42, Line 7
Q: Did you separately interview Ms. Barton?
A: Yes. She stated the duffel bag belonged to her and that Williams had no knowledge of it.

Q: Did you document that statement?
A: I took notes.

Q: Was that statement produced to defense counsel in discovery?
A: I believe it was in the supplemental file.

MR. HARTE: No further questions.

CROSS-EXAMINATION BY MS. KUCZYK:

Page 42, Line 24
Q: Sergeant Tran, you said the informant told you narcotics were present three days before the warrant application?
A: Correct.

Q: That would make the informant's information at least eight days old by the time you executed the warrant.
A: Approximately, yes.

Q: You didn't update the information between the warrant application and execution?
A: We believed the location was stable.

Page 43, Line 5
Q: Regarding the Barton statement — you took notes but did not prepare a formal written report of her exculpatory statement?
A: It wasn't my obligation to write a separate report on every—
Q: She told you the drugs belonged to her, not to my client. Did you put that in the detective's report?
A: I noted it in my supplemental.

Q: Sergeant, we've reviewed all discovery materials. There is no Barton supplemental in the file we received.
A: That would be something to take up with the State's Attorney's office.

Page 43, Line 21
MS. KUCZYK: Your Honor, we renew our objection to the warrant evidence. The informant's tip was stale — eight days is insufficient for perishable contraband under People v. Tisler.
THE COURT: Noted. I'll take it under advisement. Proceed.

Page 44, Line 1
Q: Sergeant, were you aware that Keisha Barton had a prior conviction for possession with intent to deliver?
A: I learned that later.

Q: That prior conviction was known to the State's Attorney's office during this prosecution?
A: I can't speak to what the State's Attorney knew.

Q: Did you provide that information to the prosecution?
A: I provided my complete file.

Page 45, Line 3
MS. KUCZYK: No further questions.

THE COURT: Redirect?

MR. HARTE: Briefly.

REDIRECT BY MR. HARTE:

Q: Sergeant, mail addressed to Mr. Williams was found at that address?
A: Yes.

Q: And cocaine was found in the same residence?
A: Correct.

THE COURT: Witness excused. The Court is satisfied with the warrant foundation.
The Court finds the defendant guilty of possession of a controlled substance with intent to deliver.

[VERDICT: GUILTY — October 22, 2019]

THE COURT: Sentencing set for December 10, 2019.

[END OF TRANSCRIPT]
Certified by: Lorraine Espinoza, Official Court Reporter
`;

const IL_DEMO_FINDINGS = [
  {
    issueTitle: "Brady Violation — Suppression of Keisha Barton's Exculpatory Statement",
    transcriptExcerpt: "She stated the duffel bag belonged to her and that Williams had no knowledge of it. [...] There is no Barton supplemental in the file we received.",
    legalAnalysis: "Detective Tran admitted on the stand that Keisha Barton told him the duffel bag containing the cocaine belonged to her, not to Darnell Williams. Defense counsel confirmed that no Barton statement was in the discovery file. This is a textbook Brady violation: the State suppressed a witness's exculpatory statement that directly negated the possession element of the charge. Under Brady v. Maryland, 373 U.S. 83 (1963), and its Illinois counterpart (People v. Beaman, 229 Ill. 2d 56 (2008)), the prosecution has a duty to disclose all evidence favorable to the accused. Barton's statement was not merely impeachment evidence — it was direct exculpatory evidence on the most contested issue at trial. The fact that Tran noted it 'in his supplemental' but that supplemental never reached defense counsel establishes suppression regardless of intent.",
    pageNumber: 43,
    lineNumber: 5,
    precedentName: "Brady v. Maryland",
    precedentCitation: "373 U.S. 83 (1963)",
    precedentType: "BINDING",
    courtRuling: "The prosecution's suppression of evidence favorable to an accused violates due process where the evidence is material to guilt or punishment.",
    materialSimilarity: "Barton directly told police the drugs belonged to her, not Williams. The entire prosecution turned on constructive possession — who controlled the duffel bag. A witness willing to claim ownership of the contraband is the most direct exculpatory evidence possible. Its suppression almost certainly affected the bench verdict.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue the statement was in the supplemental file and constructively available to defense. State will also argue materiality: mail addressed to Williams showed his connection to the premises, so the Barton statement would not have changed the outcome.",
    breakthroughArgument: "Under People v. Beaman, Brady materiality is assessed on the totality of the suppressed evidence. A witness confessing ownership of the contraband does not merely create doubt — it destroys the possession element. The 'mail at address' evidence showed Williams lived there; it did not show he controlled the duffel bag. Barton's statement was decisive on the only disputed element.",
    legalVehicle: "725 ILCS 5/122-1 Post-Conviction Petition",
    survivability: "Strong",
  },
  {
    issueTitle: "Fourth Amendment — Stale Warrant: Informant's Tip Eight Days Old at Execution",
    transcriptExcerpt: "The informant's information was approximately eight days old by execution. We believed the location was stable.",
    legalAnalysis: "The search warrant was based on a confidential informant's tip that narcotics were present 'three days before the warrant application.' The warrant was executed five additional days after it was issued — making the informant's information at least eight days old at execution. Cocaine is a commodity that moves quickly, particularly at a distribution address. Under Illinois v. Gates, 462 U.S. 213 (1983), probable cause must be particularized and timely. Illinois courts have consistently held that informant tips about perishable contraband must be current — information eight days old is stale for narcotics that can be moved, consumed, or sold within hours. In People v. Tisler, 103 Ill. 2d 226 (1984), the Illinois Supreme Court recognized the staleness doctrine and its particular force for contraband cases.",
    pageNumber: 43,
    lineNumber: 21,
    precedentName: "People v. Tisler",
    precedentCitation: "103 Ill. 2d 226 (1984)",
    precedentType: "BINDING",
    courtRuling: "Probable cause for a search warrant based on informant information must be timely and particularized; stale information regarding perishable contraband cannot support a warrant.",
    materialSimilarity: "The sole basis for the warrant was an informant tip eight days stale. No independent corroboration refreshed the probable cause. Detective Tran's rationale — 'we believed the location was stable' — is an officer's unsupported conclusion, not a Fourth Amendment predicate.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue the informant's prior reliability and Tran's surveillance observations were sufficient to maintain probable cause through execution. State will also invoke the Leon good-faith exception — officers executing a facially valid warrant are not required to second-guess the magistrate.",
    breakthroughArgument: "Illinois courts have declined to apply Leon where the warrant affidavit itself is lacking in probable cause — if the tip was stale, the warrant was void at issuance and Leon does not apply. Tran's affidavit did not include any surveillance confirmation or other refreshing circumstances. Under People v. Stewart, 2014 IL App (1st) 120758, the good-faith exception requires an objectively reasonable basis for the warrant; an eight-day-old unrefreshed tip on cocaine fails that standard.",
    legalVehicle: "725 ILCS 5/122-1 Post-Conviction Petition",
    survivability: "Moderate",
  },
  {
    issueTitle: "Brady — Suppression of Keisha Barton's Prior Drug Conviction (Impeachment / Exculpatory)",
    transcriptExcerpt: "Were you aware that Keisha Barton had a prior conviction for possession with intent to deliver? [...] That prior conviction was known to the State's Attorney's office during this prosecution.",
    legalAnalysis: "Keisha Barton had a prior conviction for possession with intent to deliver — a conviction that both corroborates her capacity to possess the drugs found at the scene and provides powerful context for her exculpatory statement. Defense counsel's cross-examination reveals Tran was aware of this and that it was part of the investigation record, yet it was not disclosed to defense. Under Giglio v. United States, 405 U.S. 150 (1972), and its Illinois analog, prior convictions of an individual who may serve as a witness — and whose actions are directly at issue — must be disclosed. Barton's PWID record was not merely impeachment material; it was substantive evidence that she had the knowledge, intent, and capacity to possess the contraband she claimed as her own.",
    pageNumber: 44,
    lineNumber: 1,
    precedentName: "Giglio v. United States",
    precedentCitation: "405 U.S. 150 (1972)",
    precedentType: "BINDING",
    courtRuling: "The prosecution must disclose evidence affecting the credibility of prosecution witnesses, including prior convictions, under the Brady/Giglio framework.",
    materialSimilarity: "Barton's prior PWID conviction makes her claimed ownership of the cocaine far more credible and is direct Brady/Giglio material. Combined with her exculpatory statement, the two pieces of suppressed evidence together paint a complete picture the jury/bench never saw.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue Barton was not called as a witness, so the impeachment rule under Giglio does not technically apply. State will also argue the conviction was publicly available in court records and defense had means to discover it independently.",
    breakthroughArgument: "Brady requires disclosure of evidence material to the defense, not just evidence about trial witnesses. Barton's prior conviction was material because it established her familiarity with narcotics distribution — which made her confession credible. Under People v. Hobley, 182 Ill. 2d 404 (1998), Brady extends to suppressed evidence that would have altered the defense strategy, regardless of whether a formal witness list was involved.",
    legalVehicle: "725 ILCS 5/122-1 Post-Conviction Petition",
    survivability: "Moderate",
  },
  {
    issueTitle: "Ineffective Assistance of Counsel — Failure to Subpoena or Call Keisha Barton as a Defense Witness",
    transcriptExcerpt: "She stated the duffel bag belonged to her and that Williams had no knowledge of it.",
    legalAnalysis: "Defense counsel Sandra Kuczyk was aware, through cross-examination of Detective Tran, that Keisha Barton had made an exculpatory statement claiming the drugs belonged to her. Kuczyk did not call Barton as a defense witness, did not subpoena her, and made no record of any attempt to investigate or secure her testimony. Under Strickland v. Washington, 466 U.S. 668 (1984), as applied in Illinois post-conviction proceedings, the failure to investigate and call an available witness who has given a sworn exculpatory statement — where defense counsel had actual notice of the statement from the trial record — falls below the objective standard of reasonableness. Barton was the single most valuable defense witness in the case and counsel made no effort to produce her.",
    pageNumber: 42,
    lineNumber: 7,
    precedentName: "Strickland v. Washington",
    precedentCitation: "466 U.S. 668 (1984)",
    precedentType: "BINDING",
    courtRuling: "Counsel's failure to investigate and call an available witness whose exculpatory testimony was known to counsel constitutes deficient performance under Strickland's objective reasonableness standard.",
    materialSimilarity: "Kuczyk elicited the fact of Barton's statement on cross-examination but then failed to subpoena Barton to testify directly. In a bench trial, Barton's live testimony that the drugs were hers would have been decisive. The failure to present known, available exculpatory testimony has no strategic justification.",
    proceduralStatus: "Unclear",
    anticipatedBlock: "State will argue that calling Barton carried risk — she might recant, invoke the Fifth Amendment, or be an unreliable witness. Strickland deference to strategic choices applies. State will also invoke any applicable procedural bar under Illinois's post-conviction statute.",
    breakthroughArgument: "A Barton affidavit obtained in post-conviction proceedings can establish both that she was available and willing to testify, and that counsel never contacted her. Under People v. Orange, 168 Ill. 2d 138 (1995), IAC claims based on failure to call witnesses require an affidavit from the witness. If Barton is willing to provide one, this claim is ripe and the strategic-decision defense collapses.",
    legalVehicle: "725 ILCS 5/122-1 Post-Conviction Petition",
    survivability: "Strong",
  },
];

const IL_DEMO_ROUNDS = [
  {
    roundNumber: 1,
    stateStrength: "MODERATE",
    defenseBurden: "Defense must establish that Keisha Barton's exculpatory statement was suppressed within the meaning of Brady and that the suppression was material to the bench verdict on constructive possession.",
    stateArgument: "Your Honor, the State addresses the Brady claim regarding Ms. Barton's statement. At the outset, there is a threshold procedural issue: this claim was not raised as a post-trial motion under 725 ILCS 5/116-1 before the direct appeal, which implicates People v. Enoch forfeiture. Defense has offered no explanation for the failure to raise this claim below.\n\nOn the merits, the State's position is that materiality is not established. Under People v. Beaman, 229 Ill. 2d 56 (2008), Brady materiality requires a reasonable probability that disclosure would have produced a different result — not merely that the evidence might have helped. Detective Tran testified that mail addressed to Williams was found at the address. The court — sitting as the finder of fact in a bench trial — found that constructive possession was established by Williams's dominion and control over the premises. An uncorroborated oral statement by the co-occupant would not have overcome that finding.\n\nFinally, the State notes that Barton's statement was, according to Tran, placed in the supplemental file. If the supplemental was not produced, that is a production failure — not a suppression. Under United States v. Agurs, the inadvertent failure to produce a document that was technically in the file does not rise to constitutional Brady suppression.",
    courtCommentary: "Counsel, let me be direct. Detective Tran said two things that I find deeply troubling: first, that Barton told him the bag belonged to her — a direct exculpatory statement on the possession element; second, that he put it in a 'supplemental' that defense counsel says was never produced. The People v. Enoch forfeiture argument is noted, but ineffective assistance of post-trial counsel is a recognized cause for overcoming that bar in this proceeding.\n\nOn the Agurs distinction — I'm not persuaded. Suppression is suppression whether intentional or inadvertent when the result is that the defendant did not receive material exculpatory evidence. The question I need answered is: what is the full discovery record on the Barton statement? Can the State show any documentation that a Barton supplemental was actually transmitted to defense counsel?\n\nDefense, I also want to hear how this interacts with the IAC claim — if Barton's statement surfaced on cross-examination and defense counsel then failed to subpoena her, does that affect the Brady analysis?",
    defenseResponse: "Your Honor, the State cannot produce transmission records because no Barton supplemental was transmitted. Detective Tran's testimony on that point was: 'I noted it in my supplemental' — present tense, past act, implying it existed — but counsel's review of the complete production confirms it was absent. That is suppression under Brady v. Maryland regardless of intent, and People v. Beaman does not save it.\n\nOn materiality: Your Honor heard a bench trial in which the sole contested issue was constructive possession of the duffel bag. Keisha Barton — the co-occupant, present in the residence — told the investigating detective that the bag was hers. That statement is not cumulative or merely impeaching. It directly negates the possession element. Under People v. Hobley, 182 Ill. 2d 404 (1998), Brady materiality is assessed by whether the suppressed evidence would have altered the defense strategy or the trier of fact's analysis. Here, both are true.\n\nOn the Enoch bar — the sufficient reason for default is ineffective assistance of post-trial and appellate counsel, who failed to investigate the Barton statement despite Tran's in-court admission. Under People v. Enis, 194 Ill. 2d 361 (2000), IAC of post-trial counsel is cause to overcome Enoch forfeiture in a 725 ILCS 5/122-1 proceeding.",
  },
  {
    roundNumber: 2,
    stateStrength: "MINIMAL",
    defenseBurden: "Defense must demonstrate that the warrant affidavit was based on information too stale to establish probable cause at the time of execution, and that the Leon good-faith exception does not apply.",
    stateArgument: "Your Honor, on the staleness claim, the State's position is that People v. Tisler, 103 Ill. 2d 226 (1984), does not establish a bright-line rule based on the age of the information alone. Staleness is assessed based on the nature of the criminal activity and the type of premises involved. Illinois courts have consistently held that for suspected drug distribution operations — as opposed to one-time drug use — probable cause remains fresh longer because distribution premises tend to be ongoing and stable.\n\nDetective Tran testified that the informant had been reliable in two prior cases. The warrant application identified a residential address used for distribution, not a transient location. Eight days from tip to execution is well within the range Illinois courts have upheld for ongoing distribution operations. See People v. Kolichman, 1997 IL App (1st), where a ten-day gap was found acceptable for a narcotics distribution apartment.\n\nMoreover, the State invokes the good-faith exception of United States v. Leon, 468 U.S. 897 (1984), adopted in Illinois in People v. Stewart, 2014 IL App (1st) 120758. Officers executing a facially valid warrant that was reviewed and signed by a neutral magistrate are entitled to rely on it in good faith, even if the probable cause was later found deficient.",
    courtCommentary: "Counsel, I want to understand the factual record more precisely. What did the warrant affidavit actually say about the informant's tip? Did Tran represent to the magistrate that the information was three days old, or was that staleness only revealed at trial on cross-examination?\n\nOn People v. Tisler — I agree it is not a bright-line rule. But the analysis requires me to look at what the affidavit said about the nature of the location and why the informant's information was still credible at execution. If Tran told the magistrate the tip was recent without disclosing its age, that raises Franks v. Delaware material omission concerns that go beyond simple staleness.\n\nOn Leon: the good-faith exception does not apply where the affidavit is so lacking in indicia of probable cause that reliance is unreasonable. If the affidavit omitted the eight-day gap, Leon may not save it. Defense, what is the affidavit record?",
    defenseResponse: "Your Honor, the warrant affidavit is the linchpin of this claim. The affidavit represented to the magistrate that a reliable informant had 'recently' observed narcotics at the premises — it did not disclose that the informant's most recent observation was three days before the application, making it eight days stale at execution. Under Franks v. Delaware, 438 U.S. 154 (1978), material omissions from a warrant affidavit — including the age of the information — require a hearing and potential suppression.\n\nOn People v. Tisler's context-specific analysis: cocaine stored in a duffel bag at a residential address is not an ongoing manufacturing operation. It is a commodity that can be moved in minutes. Eight-day-old information with no corroborating surveillance, no controlled buy, and no refreshing circumstances does not satisfy probable cause for cocaine at a specific address on a specific date.\n\nOn Leon: People v. Stewart holds the good-faith exception inapplicable where the magistrate was misled about the currency of the information. Here, describing an eight-day-old tip as 'recent' is a material misrepresentation. Leon does not protect officers who obtain warrants through material omissions about the staleness of the foundational information.",
  },
  {
    roundNumber: 3,
    stateStrength: "MINIMAL",
    defenseBurden: "Defense must show that counsel's failure to subpoena or call Keisha Barton as a defense witness was objectively unreasonable under Strickland and that there is a reasonable probability the bench verdict would have been different with Barton's live testimony.",
    stateArgument: "Your Honor, on the IAC claim regarding Barton, the State raises two arguments. First, Strickland's strong presumption of competence applies. We do not know why Attorney Kuczyk did not call Barton — there is no hearing record, no affidavit from Kuczyk, nothing. Defense asks this Court to assume incompetence from a cold record. Under Harrington v. Richter, 562 U.S. 86 (2011), courts must presume that an unelucidated decision reflects a sound strategic choice. Perhaps Kuczyk investigated and learned Barton would invoke the Fifth Amendment, recant, or was hostile. We simply do not know.\n\nSecond, prejudice is not established. The case was a bench trial before an experienced judge. Even with Barton's testimony, the court had before it: mail addressed to Williams at the premises, Williams's physical presence in the residence, and the cocaine found in the same location. A co-occupant claiming the drugs are hers — particularly one with a prior PWID conviction — may have done more harm than good.\n\nThe State also notes that if Barton had testified, her prior conviction would have been explored on cross-examination, potentially raising questions about Williams's knowing association with a narcotics dealer.",
    courtCommentary: "On the question of why Kuczyk did not call Barton — the State correctly notes we lack a hearing record. However, unlike some IAC claims, this one arises on a uniquely thin record: Kuczyk elicited Barton's exculpatory statement from Detective Tran on cross-examination. She knew, as a matter of record, that Barton had told police the drugs were hers. She then rested without making any attempt to produce Barton. The record does not suggest investigation was done and a strategic decision made — it suggests the issue was simply not pursued.\n\nOn Strickland prejudice in a bench trial: I am the finder of fact. If Barton had testified that the duffel bag was hers, under oath, on the stand — I need defense to tell me what the realistic impact of that testimony would have been given the mail evidence and constructive possession doctrine.\n\nI want to know: is there an affidavit from Barton in this post-conviction record? If so, what does it say?",
    defenseResponse: "Your Honor, a post-conviction affidavit from Keisha Barton is part of this record. In it, she confirms: she was never contacted by defense counsel before or during trial; she was willing to testify at trial; the duffel bag and its contents belonged to her alone; and Williams had no knowledge of what was in the bag. She further states that she had never discussed this with Williams and that counsel could have reached her through the same address where she was present when arrested.\n\nUnder People v. Orange, 168 Ill. 2d 138 (1995), an IAC claim based on failure to call a witness requires exactly this: an affidavit establishing the witness was available and the testimony exculpatory. Barton's affidavit supplies both.\n\nOn the strategic-decision defense: under Wiggins v. Smith, 539 U.S. 510 (2003), a strategic decision requires that counsel first investigated sufficiently to make a strategic choice. Kuczyk had no record of contacting Barton, no subpoena, no investigator's notes. The presumption of strategy has nothing to attach to.\n\nOn prejudice in the bench trial: Your Honor was the finder of fact. Live testimony from the co-occupant confessing ownership of the contraband, corroborated by her prior PWID record showing knowledge and capacity, would have directly resolved the possession question in Williams's favor. The mail evidence shows Williams lived there — it does not show he controlled that particular bag. Barton's testimony would have been decisive.",
  },
];

const IL_DEMO_VERDICT_SUMMARY = `After three rounds of argument in this 725 ILCS 5/122-1 post-conviction proceeding, this Court finds that the conviction of Darnell James Williams must be vacated.

The Brady violation is the clearest ground for relief. Detective Tran admitted on the stand — in the very trial that produced this conviction — that Keisha Barton told him the duffel bag containing the cocaine belonged to her and that Williams had no knowledge of it. Defense counsel confirmed that no Barton statement or supplemental report was produced in discovery. Under Brady v. Maryland, 373 U.S. 83 (1963), as applied in Illinois under People v. Beaman, 229 Ill. 2d 56 (2008), the suppression of a co-occupant's direct exculpatory statement — confessing ownership of the contraband and negating the possession element — is paradigmatic Brady material. Materiality is satisfied: in a bench trial focused entirely on constructive possession of a single duffel bag, a witness claiming ownership of that bag would have been decisive.

The staleness of the warrant presents a serious independent ground. An informant tip eight days old at execution, with no refreshing surveillance, no controlled buy, and no affidavit disclosure of the tip's age, raises both People v. Tisler staleness concerns and Franks v. Delaware material omission concerns. The State's invocation of Leon fails because the affidavit did not accurately represent the currency of the information. This ground warrants an evidentiary hearing on the affidavit record.

The ineffective assistance claim is well-founded on the post-conviction record now before the Court. Keisha Barton's affidavit establishes that she was available, willing, and never contacted by defense counsel. Kuczyk elicited Barton's exculpatory statement from the detective on cross-examination and then rested without any apparent attempt to secure Barton's live testimony. Under Wiggins v. Smith and People v. Orange, this constitutes deficient performance with clear Strickland prejudice.

RULING: The conviction of Darnell James Williams is VACATED. The matter is remanded for further proceedings. The State is ordered to produce the complete Barton supplemental file. An evidentiary hearing on the warrant staleness issue is set within 45 days. DEFENSE WIN.`;

async function seedIlCourtSimulation(tx: Parameters<Parameters<typeof db.transaction>[0]>[0], caseId: number, docId: number): Promise<void> {
  const [session] = await tx.insert(courtSessionsTable).values({
    caseId,
    simulationMode: "postconviction_974",
    skepticMode: true,
    expandedRecord: false,
    pleaQuestionnaireNotes: null,
    documentIds: JSON.stringify([docId]),
    status: "completed",
    verdictRating: "DEFENSE WIN",
    verdictSummary: IL_DEMO_VERDICT_SUMMARY,
    defenseWon: true,
    totalRounds: IL_DEMO_ROUNDS.length,
  }).returning();
  for (const r of IL_DEMO_ROUNDS) {
    await tx.insert(courtRoundsTable).values({
      sessionId: session.id,
      roundNumber: r.roundNumber,
      stateStrength: r.stateStrength,
      defenseBurden: r.defenseBurden,
      stateArgument: r.stateArgument,
      courtCommentary: r.courtCommentary,
      defenseResponse: r.defenseResponse,
    });
  }
}

export async function seedIllinoisDemoCase(): Promise<void> {
  try {
    const existing = await db
      .select({ id: casesTable.id })
      .from(casesTable)
      .where(eq(casesTable.caseNumber, IL_DEMO_CASE_NUMBER))
      .limit(1);

    if (existing.length > 0) {
      const caseId = existing[0].id;
      const demoDoc = await db
        .select({ id: documentsTable.id, status: documentsTable.status, findingCount: documentsTable.findingCount })
        .from(documentsTable)
        .where(eq(documentsTable.caseId, caseId))
        .limit(1)
        .then((rows) => rows[0] ?? null);

      const needsRestore = !demoDoc || demoDoc.status === "error" || demoDoc.status === "pending" || (demoDoc.findingCount ?? 0) === 0;
      if (!needsRestore) {
        const existingSession = await db
          .select({ id: courtSessionsTable.id })
          .from(courtSessionsTable)
          .where(eq(courtSessionsTable.caseId, caseId))
          .limit(1)
          .then((rows) => rows[0] ?? null);
        if (!existingSession) {
          logger.info({ caseId }, "Illinois demo case missing court simulation — seeding session...");
          await db.transaction(async (tx) => {
            await seedIlCourtSimulation(tx, caseId, demoDoc!.id);
          });
          logger.info({ caseId }, "Illinois demo court simulation seeded");
        } else {
          logger.info({ caseId }, "Illinois demo case already exists and is healthy — skipping seed");
        }
        return;
      }

      logger.info({ caseId }, "Illinois demo case is corrupted — restoring...");
      await db.transaction(async (tx) => {
        let docId: number;
        if (!demoDoc) {
          const [newDoc] = await tx.insert(documentsTable).values({ caseId, title: "Bench Trial Transcript — Day 2, October 22, 2019", documentType: "transcript", content: IL_DEMO_TRANSCRIPT, status: "analyzed" }).returning();
          docId = newDoc.id;
        } else {
          docId = demoDoc.id;
          await tx.delete(findingsTable).where(eq(findingsTable.documentId, docId));
        }
        for (const f of IL_DEMO_FINDINGS) {
          await tx.insert(findingsTable).values({ caseId, documentId: docId, issueTitle: f.issueTitle, transcriptExcerpt: f.transcriptExcerpt, legalAnalysis: f.legalAnalysis, pageNumber: f.pageNumber, lineNumber: f.lineNumber, precedentName: f.precedentName, precedentCitation: f.precedentCitation, precedentType: f.precedentType, courtRuling: f.courtRuling, materialSimilarity: f.materialSimilarity, proceduralStatus: f.proceduralStatus, anticipatedBlock: f.anticipatedBlock, breakthroughArgument: f.breakthroughArgument, legalVehicle: f.legalVehicle, survivability: f.survivability });
        }
        await tx.update(documentsTable).set({ status: "analyzed", findingCount: IL_DEMO_FINDINGS.length }).where(eq(documentsTable.id, docId));
        await tx.update(casesTable).set({ hasAnalysis: true }).where(eq(casesTable.id, caseId));
        await tx.delete(courtSessionsTable).where(eq(courtSessionsTable.caseId, caseId));
        await seedIlCourtSimulation(tx, caseId, docId);
      });
      logger.info({ caseId }, "Illinois demo case restored");
      return;
    }

    logger.info("Seeding Illinois demo case...");
    await db.transaction(async (tx) => {
      const [ilCase] = await tx.insert(casesTable).values({
        title: "People v. Darnell Williams — IL DEMO",
        defendantName: "Darnell James Williams",
        caseNumber: IL_DEMO_CASE_NUMBER,
        jurisdiction: "Cook County Circuit Court, State of Illinois",
        notes: "DEMO CASE — Illinois post-conviction example showcasing the 725 ILCS 5/122-1 relief pathway, 7th Circuit federal ladder, and Illinois-specific executive relief options.",
        hasAnalysis: true,
        hasMotion: false,
      }).returning();

      const [ilDoc] = await tx.insert(documentsTable).values({
        caseId: ilCase.id,
        title: "Bench Trial Transcript — Day 2, October 22, 2019",
        documentType: "transcript",
        content: IL_DEMO_TRANSCRIPT,
        status: "analyzed",
      }).returning();

      for (const f of IL_DEMO_FINDINGS) {
        await tx.insert(findingsTable).values({ caseId: ilCase.id, documentId: ilDoc.id, issueTitle: f.issueTitle, transcriptExcerpt: f.transcriptExcerpt, legalAnalysis: f.legalAnalysis, pageNumber: f.pageNumber, lineNumber: f.lineNumber, precedentName: f.precedentName, precedentCitation: f.precedentCitation, precedentType: f.precedentType, courtRuling: f.courtRuling, materialSimilarity: f.materialSimilarity, proceduralStatus: f.proceduralStatus, anticipatedBlock: f.anticipatedBlock, breakthroughArgument: f.breakthroughArgument, legalVehicle: f.legalVehicle, survivability: f.survivability });
      }

      await tx.update(documentsTable).set({ findingCount: IL_DEMO_FINDINGS.length }).where(eq(documentsTable.id, ilDoc.id));
      await seedIlCourtSimulation(tx, ilCase.id, ilDoc.id);
      logger.info({ caseId: ilCase.id }, "Illinois demo case seeded successfully");
    });
  } catch (err) {
    logger.error({ err }, "Failed to seed Illinois demo case");
  }
}

// ─────────────────────────────────────────────────────────────────
// MINNESOTA DEMO CASE
// ─────────────────────────────────────────────────────────────────

const MN_DEMO_CASE_NUMBER = "DEMO-2020A002891";

const MN_DEMO_TRANSCRIPT = `STATE OF MINNESOTA
DISTRICT COURT
FOURTH JUDICIAL DISTRICT — HENNEPIN COUNTY

STATE OF MINNESOTA,
    Plaintiff,

    vs.                                         File No. 27-CR-20-002891

RAYMOND LEON OKAFOR,
    Defendant.

TRANSCRIPT OF JURY TRIAL — DAY 4
Honorable David L. Steinberg, Presiding
March 3, 2021

Appearances:
    For the State: Assistant County Attorney Patricia Olmstead
    For the Defense: Attorney Brian Csorba
    Court Reporter: Angela Pietrowski

---

THE COURT: Back on the record. Ms. Olmstead, call your next witness.

MS. OLMSTEAD: State calls Detective Annette Schroeder.

DIRECT EXAMINATION BY MS. OLMSTEAD:

Page 58, Line 1
Q: Detective Schroeder, you investigated the shooting death of Terrence Malone on September 15, 2020?
A: I was the lead investigator, yes.

Q: Did you develop a suspect?
A: We received a tip that Raymond Okafor had been seen in the area. We showed a photo array to two witnesses — Gwen Farris and Donald Thibodeau. Both identified Okafor.

Q: Were both identifications independent?
A: Yes. We interviewed them separately.

Page 58, Line 19
Q: Did you learn anything about a possible alibi for Mr. Okafor?
A: His girlfriend, Simone Arquette, said he was with her at her apartment from 9 p.m. until midnight. The shooting occurred at approximately 10:30 p.m.

Q: Did you investigate that alibi?
A: We spoke with Ms. Arquette once. She was the defendant's girlfriend, so we considered her potentially biased.

Page 59, Line 4
Q: Did you attempt to corroborate or disprove the alibi through any other means?
A: We felt the two eyewitness identifications were sufficient.

MR. CSORBA: Your Honor — objection. Detective Schroeder just testified that no other investigation of the alibi was conducted after a single conversation with Arquette.
THE COURT: Noted for the record. Proceed.

Page 59, Line 14
Q: Detective, in your professional judgment, were Farris and Thibodeau reliable witnesses?
A: In my experience, yes. Both were confident in their identifications.

MS. OLMSTEAD: No further questions.

CROSS-EXAMINATION BY MR. CSORBA:

Page 59, Line 22
Q: Detective, how long after the shooting were the photo arrays administered?
A: Approximately 19 days.

Q: And the photo array — was it conducted as a blind administration?
A: I administered it myself.

Q: You were the investigating detective, not a blind administrator?
A: That is correct.

Q: Are you aware that the Minnesota Eyewitness Identification Reform Act of 2020 requires blind or blinded administration?
A: I am aware of the statute.

Q: You did not comply with it?
A: The Act was new. We were transitioning protocols.

Page 60, Line 11
Q: Regarding the alibi — you said you spoke with Simone Arquette once. Did you pull any cell phone records, credit card data, or surveillance footage from her building to corroborate or contradict her account?
A: No.

Q: Did you speak with any neighbors, building staff, or other residents of her building?
A: No.

Q: You dismissed a complete alibi based on a single conversation?
A: The two eyewitnesses identified him. We moved forward on that basis.

Page 61, Line 1
Q: Detective, Gwen Farris was 68 feet away at night under sodium vapor street lighting. Correct?
A: That was the approximate distance, yes.

Q: Donald Thibodeau was intoxicated at the time of his observation — that's in your report?
A: He had been drinking. He appeared coherent.

Q: Your report says his blood alcohol was estimated at .11 based on his own account?
A: That's what the report says.

Page 62, Line 3
MR. CSORBA: Nothing further.

THE COURT: Redirect?

MS. OLMSTEAD: No, Your Honor.

THE COURT: Defense may call its first witness.

MR. CSORBA: Defense calls Simone Arquette.

Page 62, Line 12
DIRECT EXAMINATION BY MR. CSORBA:

Q: Ms. Arquette, where was Raymond Okafor on the night of September 15th?
A: He was with me. He arrived at my apartment around 8:45 and we watched TV until he fell asleep on my couch. I didn't wake him up until almost midnight.

Q: Is there anything that could corroborate this?
A: My neighbor, Mrs. Hendricks, knocked on my door around 10 to ask about a package. Raymond answered the door.

Q: Did you tell Detective Schroeder about Mrs. Hendricks?
A: Yes. She said she would follow up.

Page 62, Line 29
MS. OLMSTEAD: Your Honor, the State concedes it did not interview Mrs. Hendricks.

THE COURT: The record should so reflect.

Q: Ms. Arquette, did Detective Schroeder ever contact you after the initial interview?
A: No.

Page 63, Line 8
MR. CSORBA: Nothing further.

[Defense rested. State did not call rebuttal witnesses.]

THE COURT: Closing arguments.

Page 64, Line 1
MS. OLMSTEAD: Two witnesses put Raymond Okafor at that scene. An alibi from a girlfriend proves nothing. The jury should convict.

MR. CSORBA: The eyewitnesses were compromised — distance, darkness, a drunk observer, non-blind administration 19 days later. The alibi was corroborated by a neighbor the police never bothered to speak to. The State proved nothing beyond a reasonable doubt.

[JURY DELIBERATION: 6 hours 51 minutes]

THE COURT: Has the jury reached a verdict?
FOREPERSON: Guilty, Your Honor. Guilty of second-degree murder.

[VERDICT: GUILTY — March 3, 2021]

THE COURT: Sentencing is set for May 18, 2021.

[END OF TRANSCRIPT]
Certified by: Angela Pietrowski, Official Court Reporter
`;

const MN_DEMO_FINDINGS = [
  {
    issueTitle: "Eyewitness Identification Reform Act Violation — Non-Blind Photo Array Administration",
    transcriptExcerpt: "Are you aware that the Minnesota Eyewitness Identification Reform Act of 2020 requires blind or blinded administration? [...] I administered it myself. [...] The Act was new. We were transitioning protocols.",
    legalAnalysis: "Detective Schroeder administered the photo array herself, 19 days after the shooting, in direct violation of the Minnesota Eyewitness Identification Reform Act (Minn. Stat. § 626.8435, eff. 2020). The Act expressly requires blind or blinded administration — meaning the administrator must not know which photo depicts the suspect — to prevent unconscious suggestion. Schroeder knew the suspect, knew which photo was Okafor's, and administered the array anyway. Under State v. Henderson (N.J. 2011, adopted as persuasive authority in MN), non-compliant eyewitness procedures are presumptively suggestive and the identification must be subjected to a heightened reliability hearing. The admission of identifications obtained in violation of the Reform Act without a pretrial reliability hearing was reversible error.",
    pageNumber: 59,
    lineNumber: 22,
    precedentName: "Minn. Stat. § 626.8435",
    precedentCitation: "Minnesota Eyewitness Identification Reform Act (2020)",
    precedentType: "BINDING",
    courtRuling: "Photo array identifications must be administered by a person who does not know which member of the array is the suspect; noncompliant administration triggers a mandatory pretrial reliability hearing.",
    materialSimilarity: "Schroeder personally administered the array while she was the lead detective who had already identified Okafor as the suspect. The identifications were obtained 19 days after the event under street lighting conditions that limited reliability (68 feet, sodium vapor lights). One witness was estimated at .11 BAC at the time of observation. Without a pretrial reliability hearing, the jury never assessed whether the identifications were trustworthy.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue harmless error: two independent witnesses identified Okafor, the statute was new and officers were transitioning protocols, and the jury was free to assess witness credibility. State will also argue that the Leon-equivalent good-faith exception applies.",
    breakthroughArgument: "The Reform Act does not include a good-faith exception — it is a mandatory procedural requirement. Under State v. Ard, 2022 MN App (unreported), violation of the Act's blind-administration requirement requires suppression of the identification absent extraordinary circumstances. Here, the entirety of the State's evidence was eyewitness testimony. Suppression of the identifications eliminates the State's case.",
    legalVehicle: "Minn. Stat. § 590.01 Post-Conviction Petition",
    survivability: "Strong",
  },
  {
    issueTitle: "Brady / State Duty — Suppression of Corroborating Alibi Witness (Mrs. Hendricks)",
    transcriptExcerpt: "The State concedes it did not interview Mrs. Hendricks. [...] Ms. Arquette told Detective Schroeder about Mrs. Hendricks — she said she would follow up.",
    legalAnalysis: "Simone Arquette told Detective Schroeder during the initial alibi interview that her neighbor, Mrs. Hendricks, could corroborate Okafor's presence at the apartment on the night of the shooting — specifically that Hendricks knocked on Arquette's door at approximately 10 p.m. and Okafor answered it. Schroeder promised to follow up and did not. The State affirmatively conceded at trial that Hendricks was never interviewed. Under State v. Hunt, 615 N.W.2d 294 (Minn. 2000), the duty to disclose Brady material extends to evidence the police possess or could readily obtain. By promising to follow up on an alibi lead and then burying it, the State constructively suppressed evidence that would have corroborated the only alibi in the case.",
    pageNumber: 62,
    lineNumber: 29,
    precedentName: "Brady v. Maryland",
    precedentCitation: "373 U.S. 83 (1963) / State v. Hunt, 615 N.W.2d 294 (Minn. 2000)",
    precedentType: "BINDING",
    courtRuling: "The prosecution must disclose favorable evidence, including evidence within its constructive possession that could be obtained through reasonable investigation of leads it affirmatively received.",
    materialSimilarity: "Schroeder was directly told about Hendricks and promised to investigate. A third-party eyewitness placing the defendant at the alibi location at the time of the murder is the most significant possible exculpatory evidence. The failure to follow up and the failure to disclose Arquette's lead constitute Brady suppression.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue that Arquette testified at trial, so the jury was aware of the Hendricks lead and could evaluate its significance. State will argue there was no obligation to interview every alibi lead in a case supported by two eyewitnesses.",
    breakthroughArgument: "The State's trial concession that Hendricks was never interviewed — after Schroeder promised to follow up — is a record admission of suppression. Hendricks is now available and, in post-conviction proceedings, an affidavit from her that she saw Okafor at Arquette's door at 10 p.m. would be newly discovered evidence satisfying Minn. Stat. § 590.01, subd. 4(b)(2). Combined with the Reform Act violation on the identifications, materiality is overwhelming.",
    legalVehicle: "Minn. Stat. § 590.01 Post-Conviction Petition",
    survivability: "Strong",
  },
  {
    issueTitle: "Ineffective Assistance of Counsel — Failure to Investigate or Present Mrs. Hendricks",
    transcriptExcerpt: "My neighbor Mrs. Hendricks knocked on my door around 10 to ask about a package. Raymond answered the door. [...] Did Detective Schroeder ever contact you after the initial interview? No.",
    legalAnalysis: "Defense counsel Brian Csorba knew from Simone Arquette's direct examination that Mrs. Hendricks had been told to Detective Schroeder and never followed up. Csorba did not subpoena Hendricks, did not request a continuance to locate and call her, and rested the defense without her testimony. The record reflects that Hendricks was known to defense through Arquette's own testimony — yet counsel made no effort to produce her. Under Wiggins v. Smith, 539 U.S. 510 (2003) and Strickland, a defense attorney who elicits the existence of a corroborating alibi witness in open court and then fails to call that witness has no strategic justification for the omission. The failure to call Hendricks, whose testimony would have directly corroborated the alibi and potentially acquitted the defendant, constitutes deficient performance under any objective standard.",
    pageNumber: 62,
    lineNumber: 12,
    precedentName: "Wiggins v. Smith",
    precedentCitation: "539 U.S. 510 (2003)",
    precedentType: "BINDING",
    courtRuling: "Counsel's failure to investigate and call a witness whose existence is known and whose testimony would materially support the defense constitutes deficient performance under Strickland.",
    materialSimilarity: "Csorba elicited testimony that Hendricks existed, lived next door to Arquette, and could place Okafor at the alibi location at the time of the murder. He then rested without her. There is no trial record suggesting Csorba tried to locate Hendricks, subpoena her, or was refused a continuance for that purpose. This is a paradigmatic case of failure to follow up on a known alibi lead.",
    proceduralStatus: "Unclear",
    anticipatedBlock: "State will argue Csorba's decision not to delay trial for an uninvestigated witness was reasonable strategy — Hendricks might have been unreliable, unavailable, or harmful. State will invoke Strickland's strong presumption of competence.",
    breakthroughArgument: "A post-conviction affidavit from Hendricks confirming her availability and willingness to testify eliminates the State's strategy argument. Under State v. Zornes, 831 N.W.2d 609 (Minn. 2013), IAC claims require showing the witness was actually available and the testimony actually exculpatory — both of which can be established through affidavit in this proceeding. The jury deliberated nearly seven hours, suggesting the verdict was not a foregone conclusion; Hendricks's testimony would have been decisive.",
    legalVehicle: "Minn. Stat. § 590.01 Post-Conviction Petition",
    survivability: "Moderate",
  },
  {
    issueTitle: "Newly Discovered Evidence — Mrs. Hendricks as Alibi Corroboration Witness",
    transcriptExcerpt: "My neighbor Mrs. Hendricks knocked on my door around 10 to ask about a package. Raymond answered the door. She said she would follow up. [State concedes it never interviewed Hendricks.]",
    legalAnalysis: "Under Minn. Stat. § 590.01, subd. 4(b)(2), a post-conviction petition may be brought based on newly discovered evidence that, with reasonable diligence, could not have been presented at trial. While Hendricks's identity was mentioned at trial, her actual testimony constitutes newly discovered evidence for post-conviction purposes because the State's failure to interview her — and counsel's failure to locate her — meant her account was never presented. Under State v. Rhodes, 657 N.W.2d 823 (Minn. 2003), newly discovered evidence warrants a new trial if there is a reasonable probability that, had it been presented, the verdict would have been different. A neighbor who can place the defendant at the alibi address at the time of the murder satisfies that standard against a conviction based entirely on two compromised eyewitness identifications.",
    pageNumber: 62,
    lineNumber: 12,
    precedentName: "Minn. Stat. § 590.01, subd. 4(b)(2)",
    precedentCitation: "Minnesota Post-Conviction Relief Statute",
    precedentType: "BINDING",
    courtRuling: "A new trial may be granted on the basis of newly discovered evidence that could not have been produced at trial with reasonable diligence and that creates a reasonable probability of a different outcome.",
    materialSimilarity: "Hendricks's testimony is newly available alibi corroboration that was never presented to the jury due to a combination of police failure to investigate and defense counsel's failure to follow up. In a case where the conviction rested on two compromised eyewitness identifications, corroborated alibi testimony from a disinterested neighbor satisfies the newly discovered evidence standard.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue Hendricks was mentioned at trial and is therefore not 'newly discovered.' State will also invoke the time-bar under Minn. Stat. § 590.01, subd. 4(a), which requires petitions within two years of the time the claim could have been known.",
    breakthroughArgument: "The time-bar is equitably tolled because Hendricks's actual testimony — as opposed to her name — was not available due to the State's suppression of the lead it received from Arquette. Under State v. Hale, 2018 MN App, equitable tolling applies when the petitioner demonstrates that the State's conduct prevented timely discovery. Hendricks's identity was disclosed at trial but her testimony was not obtainable due to the Brady violation — that suppression equitably tolls the petition clock.",
    legalVehicle: "Minn. Stat. § 590.01 Post-Conviction Petition",
    survivability: "Moderate",
  },
];

const MN_DEMO_ROUNDS = [
  {
    roundNumber: 1,
    stateStrength: "WEAK",
    defenseBurden: "Defense must demonstrate that the photo array administered by Detective Schroeder violated the Minnesota Eyewitness Identification Reform Act and that the resulting identifications were the product of an impermissibly suggestive procedure requiring suppression.",
    stateArgument: "Your Honor, the State addresses the Eyewitness Identification Reform Act claim under Minn. Stat. § 626.8435. At the threshold, this claim was not raised by a pretrial suppression motion, which raises a forfeiture concern under State v. Needham. Defense counsel Csorba challenged the witnesses on cross-examination but did not move to suppress the identifications before trial, which is the prescribed procedural vehicle under the Reform Act.\n\nOn the merits, the State acknowledges that Detective Schroeder administered the array herself rather than using a blind or blinded administrator. The statute was newly effective in 2020 — Schroeder testified the department was transitioning protocols. Under the good-faith compliance framework, departments in transition have been extended some latitude by Minnesota courts.\n\nFurther, the State argues that even if the administration violated the Act, the remedy is not automatic suppression — courts retain discretion under the Act to admit identifications if they are otherwise reliable. Under the totality-of-the-circumstances reliability test derived from Neil v. Biggers, 409 U.S. 188 (1972), the identifications of Farris and Thibodeau should be evaluated on their independent indicia of reliability: both identified Okafor from a photo array, both were interviewed separately, and both were confident in their identifications.",
    courtCommentary: "Counsel, the State's procedural forfeiture argument concerns me less than the substantive question, because the post-conviction statute expressly permits claims of constitutional dimension that were not raised at trial when cause and prejudice are shown — and here, ineffective assistance of trial counsel for failing to move to suppress is the obvious cause argument.\n\nOn the good-faith transition argument: I want the State to point me to any Minnesota authority holding that a newly effective mandatory procedural statute has a grace period. The Reform Act's language is not aspirational — it says 'shall be administered.' I'm also troubled by Schroeder's testimony that she knew about the statute and administered the array anyway.\n\nOn the Neil v. Biggers reliability test: that framework applies after a finding of suggestive procedure. The Reform Act was enacted precisely because research showed that non-blind administration produces systematic suggestion even without intent. If Schroeder knew which photo was Okafor's, the question is not whether she intended to suggest — it is whether the procedure itself was unreliable. Defense?",
    defenseResponse: "Your Honor, there is no good-faith exception in Minn. Stat. § 626.8435 and the Legislature declined to include one. The statute's mandatory blind-administration requirement is unambiguous. In State v. Ard, 2022 MN App, the court applied the Act and found that violation of the blind-administration requirement requires suppression of the identification absent extraordinary circumstances — there are no extraordinary circumstances here, only departmental inertia.\n\nOn the cause-and-prejudice for overcoming procedural default: the sufficient reason is IAC of trial counsel Csorba, who failed to file a pretrial suppression motion despite knowing the array was administered by the lead detective in violation of a then-current statute. That omission is textbook deficient performance.\n\nOn Neil v. Biggers: the reliability factors actually undercut the State's identifications. Farris was 68 feet away at night under sodium vapor lighting — poor viewing conditions. Thibodeau had an estimated BAC of .11 — significantly impaired. The array was administered 19 days after the shooting — a long delay that research shows dramatically increases misidentification rates. A mandated reliability hearing would have exposed all of this. By skipping the hearing, the jury was denied the framework to assess whether these identifications were trustworthy. That is precisely the structural harm the Reform Act was designed to prevent.",
  },
  {
    roundNumber: 2,
    stateStrength: "MINIMAL",
    defenseBurden: "Defense must establish that the State's failure to investigate Mrs. Hendricks after receiving a direct lead from Simone Arquette, and the failure to disclose that lead, constituted Brady suppression material to the verdict.",
    stateArgument: "Your Honor, on the Brady claim regarding Mrs. Hendricks: the State acknowledges on the record that Hendricks was never interviewed. However, the Brady doctrine requires suppression of evidence — not merely failure to investigate a lead. Under Strickler v. Greene, 527 U.S. 263 (1999), Brady requires that the State actually possess favorable evidence and withhold it. Here, the State never obtained a statement from Hendricks. You cannot suppress what you do not have.\n\nMoreover, Hendricks's identity was not suppressed — Simone Arquette testified at trial that Hendricks knocked on the door at 10 p.m. and that Okafor answered. The jury heard that information. Defense counsel could have subpoenaed Hendricks before trial; he chose not to. The Brady doctrine does not require the State to conduct the defense's investigation for it.\n\nThe State also invokes materiality: Hendricks's testimony would have been that she saw a man answer Arquette's door at 10 p.m. Even if that man was Okafor, it does not definitively place him there at the time of the 10:30 shooting — it places him there thirty minutes prior. Two eyewitnesses put Okafor at the scene. The alibi, even fully corroborated, was not an ironclad alibi.",
    courtCommentary: "The State's 'you can't suppress what you don't have' argument has a significant hole in it. Arquette testified on the stand that she told Detective Schroeder about Hendricks and that Schroeder said she would follow up. That is an affirmative representation by a police officer that she would pursue a lead — combined with a subsequent failure to do so. Under State v. Hunt, 615 N.W.2d 294 (Minn. 2000), the Brady duty extends to evidence within the State's constructive possession — meaning evidence the police could obtain through reasonable investigation of leads they affirmatively received.\n\nThe question is whether Schroeder's promise to follow up, combined with her failure to do so, constitutes constructive suppression under Minnesota law. Counsel, what is Minnesota's framework for constructive possession of Brady material?\n\nOn materiality: the State says the shooting was at 10:30 and Hendricks saw Okafor at 10:00. Is that right? Because a witness placing the defendant at the alibi location thirty minutes before the shooting — with no means of travel identified — in a case built entirely on two compromised eyewitness identifications seems extremely significant.",
    defenseResponse: "Your Honor, Minnesota's Brady framework under State v. Hunt is clear: the State cannot avoid its disclosure duty by promising to investigate an alibi lead and then burying it. Schroeder received the Hendricks lead from Arquette directly. She promised to follow up. She did not. The State's concession at trial that Hendricks was never interviewed, following Arquette's direct testimony about the promise, establishes constructive suppression on these facts.\n\nOn materiality: the thirty-minute gap does not defeat the alibi — it strengthens it. Hendricks can place Okafor at the alibi address at 10:00 p.m. The shooting was at 10:30 p.m. The alibi location and the crime scene are not contiguous. A witness placing the defendant at a different location thirty minutes before the crime, with no evidence he had a car or any means of travel, is compelling alibi corroboration — not an alibi failure.\n\nIn a post-conviction proceeding under Minn. Stat. § 590.01, subd. 4(b)(2), a Hendricks affidavit placing Okafor at Arquette's apartment at 10 p.m. on the night of the shooting constitutes newly discovered evidence that satisfies the statute's requirements. The evidence was not 'known' at trial in any meaningful sense — Hendricks's identity was mentioned, but her actual testimony was unavailable due to the Brady violation. Under State v. Rhodes, 657 N.W.2d 823 (Minn. 2003), that is a cognizable newly discovered evidence claim with a reasonable probability of a different outcome.",
  },
  {
    roundNumber: 3,
    stateStrength: "MINIMAL",
    defenseBurden: "Defense must show that the cumulative impact of the Reform Act violation, Brady suppression, and IAC establishes entitlement to relief under Minn. Stat. § 590.01 and that the applicable time-bar is equitably tolled.",
    stateArgument: "Your Honor, even if this Court finds merit in the individual claims, the State raises the time-bar under Minn. Stat. § 590.01, subd. 4(a). Post-conviction petitions must generally be filed within two years of the expiration of the time for direct appeal or within two years of when the grounds for the petition could have been known with due diligence. The conviction became final in 2022. This petition was filed in 2024. Defense has the burden of establishing equitable tolling or a statutory exception.\n\nOn the cumulative error argument: Minnesota does not recognize a freestanding cumulative error claim. Each claim must succeed on its own merits. Courts applying Minn. Stat. § 590.01 consider each ground independently. The State urges this Court not to bootstrap individually weak claims into a reversal through aggregation.\n\nFinally, the State renews its prejudice argument across all claims. Raymond Okafor was identified by two witnesses. Even if the identifications had procedural defects, even if the alibi investigation was incomplete, and even if Hendricks's testimony were presented — this case is not a one-witness case. Two independent witnesses identified Okafor at the scene. Reversal on these grounds would require this Court to find that the combination of defects creates a reasonable probability of a different outcome. The State submits it does not.",
    courtCommentary: "I want to address the time-bar question directly. The petition is within the statutory window if equitable tolling applies. Counsel, walk me through the argument that the Brady suppression of the Hendricks lead equitably tolled the clock.\n\nOn the cumulative error question: I take the State's point that Minnesota does not have a freestanding cumulative error doctrine. But the Minn. Stat. § 590.01 analysis allows me to consider the totality of the record in evaluating whether the petitioner has demonstrated a sufficient basis for relief. That is not cumulative error — it is simply weighing the strength of multiple independent grounds.\n\nOn the two-witness argument: I have heard today that one witness was 68 feet away at night with poor lighting; one was estimated at .11 BAC; the array was administered 19 days later by the lead detective in violation of a mandatory statute; and there is an uninvestigated alibi corroboration witness who was promised follow-up by the detective and never received it. At what point does the State's case become so infirm that 'two witnesses identified him' is not a sufficient answer to the totality of the post-conviction record?",
    defenseResponse: "Your Honor, on the time-bar: the Brady suppression of the Hendricks lead equitably tolls the statute under State v. Hale, 2018 MN App. The specific facts here are that the State promised to investigate a lead and did not — a form of ongoing concealment. Raymond Okafor could not have known that Hendricks existed and was willing to testify until post-conviction counsel located her. The clock for newly discovered evidence runs from when the evidence could have been known with due diligence — and due diligence could not overcome the State's concealment of its own failure to follow up. This petition is timely.\n\nOn cumulative strength: Your Honor's question states it precisely. This is not a case with one infirmity. The State's entire evidentiary case consisted of two eyewitness identifications. Those identifications were obtained through a procedure that violated a mandatory statute designed to prevent misidentification. Neither witness had reliable viewing conditions. The alibi was corroborated by a neighbor the police never spoke to after promising to do so. Defense counsel failed to subpoena that neighbor even after eliciting her existence in open court.\n\nUnder Minn. Stat. § 590.01, relief is warranted where the petitioner demonstrates by a preponderance of the evidence that the errors entitle him to relief. We have demonstrated Brady suppression, a statutory violation, and IAC — independently and collectively. Raymond Okafor asks this Court to grant him the fair proceeding the Constitution and Minnesota law required from the beginning.",
  },
];

const MN_DEMO_VERDICT_SUMMARY = `After three rounds of argument in this Minn. Stat. § 590.01 post-conviction proceeding, this Court finds that the conviction of Raymond Leon Okafor cannot stand.

The Eyewitness Identification Reform Act violation is the most structurally significant ground for relief. Detective Schroeder administered the photo array herself — as the lead detective who had already identified Okafor as the suspect — in direct violation of Minn. Stat. § 626.8435's mandatory blind-administration requirement. The statute was in effect. Schroeder knew it. The violation was not inadvertent; she acknowledged it on cross-examination. The Reform Act was enacted precisely because non-blind administration by a knowing detective produces systematic suggestion. No pretrial reliability hearing was held. The jury evaluated two identifications without the framework Minnesota law mandates. That is a structural failure.

The Brady claim regarding Mrs. Hendricks is well-established on this record. Detective Schroeder received a direct lead from Simone Arquette — the neighbor who could place Okafor at the alibi address at 10 p.m. on the night of the shooting — and promised to follow up. She did not. The State's trial concession that Hendricks was never interviewed, combined with Arquette's testimony about the promise, constitutes constructive suppression under State v. Hunt. Hendricks's testimony is newly discovered evidence within Minn. Stat. § 590.01, subd. 4(b)(2), and a reasonable probability of a different verdict exists given that the entire State's case rested on two identifications with serious reliability defects.

The ineffective assistance claim is supported by the record: defense counsel elicited Hendricks's existence in open court and rested without subpoenaing her. Under Wiggins v. Smith and State v. Zornes, a post-conviction affidavit from Hendricks confirming availability and willingness to testify eliminates any strategic justification for the omission.

The petition is timely under equitable tolling: the Brady suppression prevented Okafor from knowing the full scope of the Hendricks lead within the statutory period.

RULING: The conviction of Raymond Leon Okafor is VACATED. The matter is remanded for a new trial. The State is ordered to produce all materials related to the Hendricks investigation and any communications with eyewitnesses Farris and Thibodeau. A Schwartz hearing on the eyewitness identification claims is set within 60 days. DEFENSE WIN.`;

async function seedMnCourtSimulation(tx: Parameters<Parameters<typeof db.transaction>[0]>[0], caseId: number, docId: number): Promise<void> {
  const [session] = await tx.insert(courtSessionsTable).values({
    caseId,
    simulationMode: "postconviction_974",
    skepticMode: true,
    expandedRecord: false,
    pleaQuestionnaireNotes: null,
    documentIds: JSON.stringify([docId]),
    status: "completed",
    verdictRating: "DEFENSE WIN",
    verdictSummary: MN_DEMO_VERDICT_SUMMARY,
    defenseWon: true,
    totalRounds: MN_DEMO_ROUNDS.length,
  }).returning();
  for (const r of MN_DEMO_ROUNDS) {
    await tx.insert(courtRoundsTable).values({
      sessionId: session.id,
      roundNumber: r.roundNumber,
      stateStrength: r.stateStrength,
      defenseBurden: r.defenseBurden,
      stateArgument: r.stateArgument,
      courtCommentary: r.courtCommentary,
      defenseResponse: r.defenseResponse,
    });
  }
}

export async function seedMinnesotaDemoCase(): Promise<void> {
  try {
    const existing = await db
      .select({ id: casesTable.id })
      .from(casesTable)
      .where(eq(casesTable.caseNumber, MN_DEMO_CASE_NUMBER))
      .limit(1);

    if (existing.length > 0) {
      const caseId = existing[0].id;
      const demoDoc = await db
        .select({ id: documentsTable.id, status: documentsTable.status, findingCount: documentsTable.findingCount })
        .from(documentsTable)
        .where(eq(documentsTable.caseId, caseId))
        .limit(1)
        .then((rows) => rows[0] ?? null);

      const needsRestore = !demoDoc || demoDoc.status === "error" || demoDoc.status === "pending" || (demoDoc.findingCount ?? 0) === 0;
      if (!needsRestore) {
        const existingSession = await db
          .select({ id: courtSessionsTable.id })
          .from(courtSessionsTable)
          .where(eq(courtSessionsTable.caseId, caseId))
          .limit(1)
          .then((rows) => rows[0] ?? null);
        if (!existingSession) {
          logger.info({ caseId }, "Minnesota demo case missing court simulation — seeding session...");
          await db.transaction(async (tx) => {
            await seedMnCourtSimulation(tx, caseId, demoDoc!.id);
          });
          logger.info({ caseId }, "Minnesota demo court simulation seeded");
        } else {
          logger.info({ caseId }, "Minnesota demo case already exists and is healthy — skipping seed");
        }
        return;
      }

      logger.info({ caseId }, "Minnesota demo case is corrupted — restoring...");
      await db.transaction(async (tx) => {
        let docId: number;
        if (!demoDoc) {
          const [newDoc] = await tx.insert(documentsTable).values({ caseId, title: "Jury Trial Transcript — Day 4, March 3, 2021", documentType: "transcript", content: MN_DEMO_TRANSCRIPT, status: "analyzed" }).returning();
          docId = newDoc.id;
        } else {
          docId = demoDoc.id;
          await tx.delete(findingsTable).where(eq(findingsTable.documentId, docId));
        }
        for (const f of MN_DEMO_FINDINGS) {
          await tx.insert(findingsTable).values({ caseId, documentId: docId, issueTitle: f.issueTitle, transcriptExcerpt: f.transcriptExcerpt, legalAnalysis: f.legalAnalysis, pageNumber: f.pageNumber, lineNumber: f.lineNumber, precedentName: f.precedentName, precedentCitation: f.precedentCitation, precedentType: f.precedentType, courtRuling: f.courtRuling, materialSimilarity: f.materialSimilarity, proceduralStatus: f.proceduralStatus, anticipatedBlock: f.anticipatedBlock, breakthroughArgument: f.breakthroughArgument, legalVehicle: f.legalVehicle, survivability: f.survivability });
        }
        await tx.update(documentsTable).set({ status: "analyzed", findingCount: MN_DEMO_FINDINGS.length }).where(eq(documentsTable.id, docId));
        await tx.update(casesTable).set({ hasAnalysis: true }).where(eq(casesTable.id, caseId));
        await tx.delete(courtSessionsTable).where(eq(courtSessionsTable.caseId, caseId));
        await seedMnCourtSimulation(tx, caseId, docId);
      });
      logger.info({ caseId }, "Minnesota demo case restored");
      return;
    }

    logger.info("Seeding Minnesota demo case...");
    await db.transaction(async (tx) => {
      const [mnCase] = await tx.insert(casesTable).values({
        title: "State v. Raymond Okafor — MN DEMO",
        defendantName: "Raymond Leon Okafor",
        caseNumber: MN_DEMO_CASE_NUMBER,
        jurisdiction: "Hennepin County District Court, State of Minnesota",
        notes: "DEMO CASE — Minnesota post-conviction example showcasing the Minn. Stat. § 590.01 relief pathway, 8th Circuit federal ladder, and Minnesota-specific executive relief options including the Board of Pardons.",
        hasAnalysis: true,
        hasMotion: false,
      }).returning();

      const [mnDoc] = await tx.insert(documentsTable).values({
        caseId: mnCase.id,
        title: "Jury Trial Transcript — Day 4, March 3, 2021",
        documentType: "transcript",
        content: MN_DEMO_TRANSCRIPT,
        status: "analyzed",
      }).returning();

      for (const f of MN_DEMO_FINDINGS) {
        await tx.insert(findingsTable).values({ caseId: mnCase.id, documentId: mnDoc.id, issueTitle: f.issueTitle, transcriptExcerpt: f.transcriptExcerpt, legalAnalysis: f.legalAnalysis, pageNumber: f.pageNumber, lineNumber: f.lineNumber, precedentName: f.precedentName, precedentCitation: f.precedentCitation, precedentType: f.precedentType, courtRuling: f.courtRuling, materialSimilarity: f.materialSimilarity, proceduralStatus: f.proceduralStatus, anticipatedBlock: f.anticipatedBlock, breakthroughArgument: f.breakthroughArgument, legalVehicle: f.legalVehicle, survivability: f.survivability });
      }

      await tx.update(documentsTable).set({ findingCount: MN_DEMO_FINDINGS.length }).where(eq(documentsTable.id, mnDoc.id));
      await seedMnCourtSimulation(tx, mnCase.id, mnDoc.id);
      logger.info({ caseId: mnCase.id }, "Minnesota demo case seeded successfully");
    });
  } catch (err) {
    logger.error({ err }, "Failed to seed Minnesota demo case");
  }
}

// ─────────────────────────────────────────────────────────────────
// MICHIGAN DEMO CASE
// ─────────────────────────────────────────────────────────────────

const MI_DEMO_CASE_NUMBER = "DEMO-MICH-2019001234";

const MI_DEMO_TRANSCRIPT = `STATE OF MICHIGAN
IN THE CIRCUIT COURT FOR WAYNE COUNTY

PEOPLE OF THE STATE OF MICHIGAN,
    Plaintiff,

    vs.                                     Case No. 19-001234-FC

MARCUS DESHAWN PORTER,
    Defendant.

TRANSCRIPT OF BENCH TRIAL — DAY 3
Honorable Sylvia R. Kowalczyk, Presiding
November 14, 2019

Appearances:
    For the People: Assistant Prosecutor Alicia Denford
    For the Defense: Attorney Kevin Mwamba
    Court Reporter: Sandra Tucciarone

---

THE COURT: Back on the record. Ms. Denford, call your next witness.

MS. DENFORD: People call Officer Thomas Greer.

DIRECT EXAMINATION BY MS. DENFORD:

Page 44, Line 1
Q: Officer Greer, on August 3rd, 2019, you conducted a traffic stop of a vehicle driven by Marcus Porter?
A: That's correct. I observed the vehicle traveling on East Jefferson Avenue.

Q: What was the basis for the stop?
A: I observed what I believed was a cracked tail light.

Q: What happened during the stop?
A: I approached the vehicle, smelled what I believed to be marijuana. I asked Mr. Porter to step out. I then conducted a search of the interior.

Q: What did you find?
A: Under the driver's seat, I found a handgun — a Glock 19 — and a digital scale. In the center console there was a plastic bag with what appeared to be crack cocaine.

Page 44, Line 19
Q: Was the firearm registered to Mr. Porter?
A: No. The firearm came back as stolen out of a 2017 residential burglary in Dearborn.

Q: Did you obtain a warrant before searching the vehicle?
A: No. The marijuana odor gave me probable cause under the automobile exception.

MS. DENFORD: Nothing further.

CROSS-EXAMINATION BY MR. MWAMBA:

Page 45, Line 3
Q: Officer Greer, you said you observed a cracked tail light. Did you photograph the tail light before making the stop?
A: No.

Q: Did you note the crack in your incident report?
A: I described the tail light as defective.

Q: Your actual report says 'equipment violation, tinted windows.' No mention of a cracked tail light?
A: I may have simplified the description.

Page 45, Line 14
Q: The dash cam footage from your vehicle — where is that footage?
A: The camera malfunctioned on that shift. There is no footage.

Q: How convenient. Was the malfunction logged?
A: I submitted a malfunction report the following day.

Page 45, Line 22
Q: Officer, have you been informed that the Wayne County Crime Lab found no marijuana residue in Mr. Porter's vehicle during their subsequent examination?
A: I'm not aware of those results.

Q: If the Crime Lab found no marijuana odor residue — no plant material, no detectable THC residue on any surface — would that affect your probable cause claim?
A: The crime lab examines things after the fact. My observation at the time was my probable cause.

Page 46, Line 9
MR. MWAMBA: Your Honor, I would at this time move to introduce Exhibit D-4, the Wayne County Crime Lab negative result report dated September 12, 2019, finding no marijuana residue in the vehicle.

MS. DENFORD: Objection — this report was not disclosed to the defense in the People's Brady disclosures.

THE COURT: Is that accurate, Ms. Denford?

MS. DENFORD: The People ... acknowledge the report was not included in the initial disclosure package. We received it from the lab directly and it was in our file.

THE COURT: The Court has serious concerns. We'll address this at the close of evidence.

Page 47, Line 1
MR. MWAMBA: Nothing further.

[Defense called two character witnesses. State offered no rebuttal.]

THE COURT: Mr. Mwamba, does the defense wish to address the suppression issue now?

MR. MWAMBA: Your Honor, we do not raise a suppression motion at this time. We rely on our challenge to the credibility of the stop and the search through cross-examination.

THE COURT: Very well. The Court will take the matter under advisement.

Page 50, Line 4
[VERDICT — November 14, 2019]

THE COURT: The Court finds Mr. Porter guilty of possession of a controlled substance with intent to deliver, felon in possession of a firearm, and receiving and concealing stolen property. Sentencing set for January 7, 2020.

[END OF TRANSCRIPT]
Certified by: Sandra Tucciarone, Official Court Reporter
`;

const MI_DEMO_FINDINGS = [
  {
    issueTitle: "Brady Violation — Suppression of Exculpatory Crime Lab Report (No Marijuana Residue)",
    transcriptExcerpt: "The People acknowledge the report was not included in the initial disclosure package. We received it from the lab directly and it was in our file. [...] The Wayne County Crime Lab found no marijuana residue in Mr. Porter's vehicle.",
    legalAnalysis: "The Wayne County Crime Lab produced a report dated September 12, 2019 — six weeks before trial — finding no marijuana residue in Porter's vehicle. The prosecution acknowledged at trial that the report was in their file and was not disclosed to the defense in Brady disclosures. Officer Greer's entire probable cause for the warrantless search rested on the claimed marijuana odor. A lab report directly contradicting the existence of any marijuana in the vehicle is squarely exculpatory material under Brady v. Maryland, 373 U.S. 83 (1963), and People v. Lester, 232 Mich. App. 262 (1998). Suppression of this report deprived the defense of the factual predicate to mount a Fourth Amendment suppression motion and deprived the fact-finder of the most direct evidence that Greer's stated probable cause did not exist.",
    pageNumber: 46,
    lineNumber: 9,
    precedentName: "Brady v. Maryland",
    precedentCitation: "373 U.S. 83 (1963) / People v. Lester, 232 Mich. App. 262 (1998)",
    precedentType: "BINDING",
    courtRuling: "The prosecution must disclose all material exculpatory evidence in its possession prior to trial; suppression of a lab report directly contradicting the officer's stated probable cause is a Brady violation requiring a new trial.",
    materialSimilarity: "The Crime Lab report was in the prosecution's file before trial, not disclosed, and directly negates the only factual basis for the warrantless search. Without the marijuana odor, there was no automobile exception probable cause. Without the search, no contraband. Without the contraband, no conviction.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue harmless error: the trial court credited Greer's in-court testimony and the lab report goes to weight, not admissibility. State may also argue that the defense received the report at trial when defense counsel displayed it as Exhibit D-4.",
    breakthroughArgument: "Disclosure at trial of a Brady item that the prosecution had for six weeks does not cure the violation — People v. Schumacher, 276 Mich. App. 165 (2007). Suppression of the report prevented pre-trial suppression motion practice. Had counsel known of the negative lab result before trial, the entire Fourth Amendment suppression motion would have been filed. The Crime Lab report is the factual predicate that unlocks the Fourth Amendment claim.",
    legalVehicle: "MCR 6.500 Motion for Relief from Judgment",
    survivability: "Strong",
  },
  {
    issueTitle: "Fourth Amendment — Warrantless Vehicle Search Without Valid Probable Cause",
    transcriptExcerpt: "I smelled what I believed to be marijuana. I asked Mr. Porter to step out. I then conducted a search of the interior. [...] The camera malfunctioned on that shift. There is no footage. [...] The Wayne County Crime Lab found no marijuana residue.",
    legalAnalysis: "Officer Greer's warrantless search of Porter's vehicle rested entirely on a claimed marijuana odor. The automobile exception to the warrant requirement permits a warrantless search only if there is probable cause — a fair probability that contraband will be found. Here, the Crime Lab report finding no marijuana residue in the vehicle directly contradicts Greer's claimed odor. The dash-cam footage that would have corroborated or refuted the claimed traffic violation was 'destroyed' due to a 'malfunction' logged the day after the stop. Under Arizona v. Gant, 556 U.S. 332 (2009), and People v. Kazmierczak, 461 Mich. 411 (2000), when the factual predicate for probable cause is negated by objective evidence, the search is unconstitutional and the fruits must be suppressed. All evidence recovered — the firearm, the scale, and the narcotics — is fruit of the poisonous tree.",
    pageNumber: 44,
    lineNumber: 19,
    precedentName: "Arizona v. Gant",
    precedentCitation: "556 U.S. 332 (2009) / People v. Kazmierczak, 461 Mich. 411 (2000)",
    precedentType: "BINDING",
    courtRuling: "Evidence recovered from a warrantless vehicle search must be suppressed if the factual predicate for probable cause — the claimed odor — is contradicted by objective laboratory evidence.",
    materialSimilarity: "The Crime Lab report showing no marijuana residue combined with the absence of dash-cam footage leaves Greer's odor claim entirely uncorroborated. Suppression would eliminate all physical evidence and require acquittal on all three counts.",
    proceduralStatus: "Defaulted",
    anticipatedBlock: "Defense counsel failed to move to suppress before trial under MCR 6.419, which is the prescribed vehicle. Post-conviction review will require showing cause (Brady suppression of the lab report) and prejudice (all physical evidence would be suppressed). State will argue that counsel strategically bypassed suppression to avoid alerting the court.",
    breakthroughArgument: "The procedural default is excused by the Brady violation itself — People v. Reed, 449 Mich. 375 (1995). Counsel could not have filed a meaningful suppression motion without knowing the Crime Lab report existed. The Brady violation is the cause for the procedural default on the Fourth Amendment claim, and the prejudice is total: suppression eliminates every item of physical evidence.",
    legalVehicle: "MCR 6.500 Motion for Relief from Judgment",
    survivability: "Strong",
  },
  {
    issueTitle: "Ineffective Assistance of Counsel — Failure to Move to Suppress After Brady Disclosure at Trial",
    transcriptExcerpt: "MR. MWAMBA: Your Honor, we do not raise a suppression motion at this time. We rely on our challenge to the credibility of the stop and the search through cross-examination.",
    legalAnalysis: "When defense counsel Kevin Mwamba received the Brady-suppressed Crime Lab report mid-trial showing no marijuana residue in the vehicle, he had an immediate obligation to move for a mistrial and/or suppression of the vehicle search. Instead, counsel announced on the record that he would 'not raise a suppression motion at this time' and would rely on cross-examination. This decision had no plausible strategic justification. The Crime Lab report directly negated the automobile exception probable cause. A suppression motion, combined with the Brady violation, would have required the court either to grant suppression or to declare a mistrial. Counsel's failure to pursue either remedy constitutes deficient performance under Strickland v. Washington, 466 U.S. 668 (1984), and People v. Pickens, 446 Mich. 298 (1994). The prejudice is obvious: all physical evidence would have been suppressed.",
    pageNumber: 47,
    lineNumber: 1,
    precedentName: "Strickland v. Washington",
    precedentCitation: "466 U.S. 668 (1984) / People v. Pickens, 446 Mich. 298 (1994)",
    precedentType: "BINDING",
    courtRuling: "Defense counsel is constitutionally required to pursue suppression when mid-trial Brady disclosure reveals that the People's probable cause is objectively contradicted; failure to do so is deficient performance with obvious prejudice.",
    materialSimilarity: "Counsel received the Brady material in open court, acknowledged its significance through introduction as Exhibit D-4, and then immediately announced no suppression motion. No reasonable defense attorney would forgo a suppression motion after receiving a lab report eliminating the prosecution's only probable cause theory.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will invoke Strickland's strong presumption of competence and argue counsel strategically chose credibility-based cross-examination over suppression to avoid alerting the bench to other weaknesses. State may argue counsel had a tactical reason not to interrupt trial.",
    breakthroughArgument: "There is no plausible tactical reason to forgo suppression after receiving mid-trial Brady material negating probable cause. Cross-examination is not a substitute for suppression — a successful suppression motion eliminates all physical evidence and requires acquittal; cross-examination merely creates doubt. Under People v. Trakhtenberg, 493 Mich. 38 (2012), courts must objectively assess whether counsel's choice was grounded in reasonable professional judgment.",
    legalVehicle: "MCR 6.500 Motion for Relief from Judgment",
    survivability: "Strong",
  },
  {
    issueTitle: "Newly Discovered Evidence — Dash-Cam Malfunction Report Inconsistencies",
    transcriptExcerpt: "The camera malfunctioned on that shift. There is no footage. [...] I submitted a malfunction report the following day.",
    legalAnalysis: "Officer Greer testified that his dash-cam malfunctioned on the night of the stop and that he submitted a malfunction report the following day. A post-conviction FOIA request to the Detroit Police Department revealed that (1) no malfunction report for Greer's unit exists for that date in the department's equipment maintenance database, (2) Greer's cruiser received routine maintenance and a camera firmware update three days before the stop, and (3) department records show the camera unit was operational the same evening Greer claims it malfunctioned, based on diagnostic pings logged to the server. Under MCR 6.508(D)(3), newly discovered evidence warrants relief from judgment when it was not discoverable at trial with reasonable diligence and when there is a reasonable probability that, but for the evidence, the outcome would have been different. The FOIA records were not in the prosecution's file and were not available to the defense at trial.",
    pageNumber: 45,
    lineNumber: 14,
    precedentName: "People v. Cress",
    precedentCitation: "664 N.W.2d 174 (Mich. 2003)",
    precedentType: "BINDING",
    courtRuling: "Newly discovered evidence warrants a new trial or evidentiary hearing when it was not discoverable at trial with due diligence and creates a reasonable probability of a different outcome.",
    materialSimilarity: "FOIA records showing no malfunction report exists and that the camera was operational during Greer's shift would directly impeach his testimony about the absence of footage, suggesting the footage may have been deliberately withheld or deleted. Combined with the Brady violation on the Crime Lab report, a pattern of evidence suppression emerges that is independently sufficient to meet the newly discovered evidence standard.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue the FOIA records are irrelevant — even if the camera was operational, it does not prove the stop was unlawful or that footage was intentionally suppressed. State may also argue the post-conviction petition is untimely under MCR 6.502(G).",
    breakthroughArgument: "Under People v. Swain, 288 Mich. App. 609 (2010), evidence of an officer's intentional destruction or suppression of potentially exculpatory footage is independently sufficient for a new trial. The FOIA records, combined with the Brady violation on the Crime Lab report, establish a systemic pattern of evidence suppression that satisfies both the newly discovered evidence standard and the due-process grounds for MCR 6.500 relief.",
    legalVehicle: "MCR 6.500 Motion for Relief from Judgment",
    survivability: "Moderate",
  },
];

export async function seedMichiganDemoCase(): Promise<void> {
  try {
    const existing = await db
      .select({ id: casesTable.id })
      .from(casesTable)
      .where(eq(casesTable.caseNumber, MI_DEMO_CASE_NUMBER))
      .limit(1);

    if (existing.length > 0) {
      const caseId = existing[0].id;
      const demoDoc = await db
        .select({ id: documentsTable.id, status: documentsTable.status, findingCount: documentsTable.findingCount })
        .from(documentsTable)
        .where(eq(documentsTable.caseId, caseId))
        .limit(1)
        .then((rows) => rows[0] ?? null);

      const needsRestore = !demoDoc || demoDoc.status === "error" || demoDoc.status === "pending" || (demoDoc.findingCount ?? 0) === 0;
      if (!needsRestore) {
        logger.info({ caseId }, "Michigan demo case already exists and is healthy — skipping seed");
        return;
      }

      logger.info({ caseId }, "Michigan demo case is corrupted — restoring...");
      await db.transaction(async (tx) => {
        let docId: number;
        if (!demoDoc) {
          const [newDoc] = await tx.insert(documentsTable).values({ caseId, title: "Bench Trial Transcript — Day 3, November 14, 2019", documentType: "transcript", content: MI_DEMO_TRANSCRIPT, status: "analyzed" }).returning();
          docId = newDoc.id;
        } else {
          docId = demoDoc.id;
          await tx.delete(findingsTable).where(eq(findingsTable.documentId, docId));
        }
        for (const f of MI_DEMO_FINDINGS) {
          await tx.insert(findingsTable).values({ caseId, documentId: docId, issueTitle: f.issueTitle, transcriptExcerpt: f.transcriptExcerpt, legalAnalysis: f.legalAnalysis, pageNumber: f.pageNumber, lineNumber: f.lineNumber, precedentName: f.precedentName, precedentCitation: f.precedentCitation, precedentType: f.precedentType, courtRuling: f.courtRuling, materialSimilarity: f.materialSimilarity, proceduralStatus: f.proceduralStatus, anticipatedBlock: f.anticipatedBlock, breakthroughArgument: f.breakthroughArgument, legalVehicle: f.legalVehicle, survivability: f.survivability });
        }
        await tx.update(documentsTable).set({ status: "analyzed", findingCount: MI_DEMO_FINDINGS.length }).where(eq(documentsTable.id, docId));
        await tx.update(casesTable).set({ hasAnalysis: true }).where(eq(casesTable.id, caseId));
      });
      logger.info({ caseId }, "Michigan demo case restored");
      return;
    }

    logger.info("Seeding Michigan demo case...");
    await db.transaction(async (tx) => {
      const [miCase] = await tx.insert(casesTable).values({
        title: "People v. Marcus Porter — MI DEMO",
        defendantName: "Marcus DeShawn Porter",
        caseNumber: MI_DEMO_CASE_NUMBER,
        jurisdiction: "Wayne County Circuit Court, State of Michigan",
        notes: "DEMO CASE — Michigan post-conviction example showcasing the MCR 6.500 Motion for Relief from Judgment, 6th Circuit federal ladder, and Michigan-specific executive relief options including Clean Slate expungement.",
        hasAnalysis: true,
        hasMotion: false,
      }).returning();

      const [miDoc] = await tx.insert(documentsTable).values({
        caseId: miCase.id,
        title: "Bench Trial Transcript — Day 3, November 14, 2019",
        documentType: "transcript",
        content: MI_DEMO_TRANSCRIPT,
        status: "analyzed",
      }).returning();

      for (const f of MI_DEMO_FINDINGS) {
        await tx.insert(findingsTable).values({ caseId: miCase.id, documentId: miDoc.id, issueTitle: f.issueTitle, transcriptExcerpt: f.transcriptExcerpt, legalAnalysis: f.legalAnalysis, pageNumber: f.pageNumber, lineNumber: f.lineNumber, precedentName: f.precedentName, precedentCitation: f.precedentCitation, precedentType: f.precedentType, courtRuling: f.courtRuling, materialSimilarity: f.materialSimilarity, proceduralStatus: f.proceduralStatus, anticipatedBlock: f.anticipatedBlock, breakthroughArgument: f.breakthroughArgument, legalVehicle: f.legalVehicle, survivability: f.survivability });
      }

      await tx.update(documentsTable).set({ findingCount: MI_DEMO_FINDINGS.length }).where(eq(documentsTable.id, miDoc.id));
      logger.info({ caseId: miCase.id }, "Michigan demo case seeded successfully");
    });
  } catch (err) {
    logger.error({ err }, "Failed to seed Michigan demo case");
  }
}

// ─────────────────────────────────────────────────────────────────
// OHIO DEMO CASE
// ─────────────────────────────────────────────────────────────────

const OH_DEMO_CASE_NUMBER = "DEMO-OHIO-2021050678";

const OH_DEMO_TRANSCRIPT = `STATE OF OHIO
IN THE COURT OF COMMON PLEAS, CUYAHOGA COUNTY

STATE OF OHIO,
    Plaintiff,

    vs.                                     Case No. CR-21-650678-A

DEMETRIUS LEON COLE,
    Defendant.

TRANSCRIPT OF JURY TRIAL — DAY 2
Honorable Robert F. Andreassen, Presiding
September 8, 2021

Appearances:
    For the State: Assistant Prosecuting Attorney Carmen Ruiz
    For the Defense: Attorney Paul Wheatley
    Court Reporter: Patricia Okonkwo

---

THE COURT: Let's go back on the record. Ms. Ruiz, call your next witness.

MS. RUIZ: State calls Detective Sergeant Harold Binns.

DIRECT EXAMINATION BY MS. RUIZ:

Page 31, Line 1
Q: Detective Binns, on February 10th, 2021, you initiated a traffic stop of a vehicle on Superior Avenue?
A: I did. The vehicle had a broken tail lamp.

Q: What happened during that stop?
A: I ran the plates — registered to a rental company, which is a common indicator. The driver was Demetrius Cole, and his companion, a man later identified as Jerome Mack, appeared nervous, kept looking in the side mirror.

Q: Did you search the vehicle?
A: I asked for consent. Mr. Cole refused. I then determined I had reasonable suspicion of criminal activity and called for a K-9 unit.

Q: And the K-9 alerted?
A: K-9 Ares alerted to the rear seat area. That gave us probable cause. We found 312 grams of fentanyl and $14,400 in cash beneath the rear seat.

Page 31, Line 22
Q: Was Mr. Mack also arrested?
A: Yes. He had a prior felony narcotics conviction. Both were charged.

Q: Did Mr. Mack eventually cooperate with the State?
A: He entered into a cooperation agreement. In exchange for a reduced sentence, he agreed to testify that Cole had full knowledge of and control over the drugs.

MS. RUIZ: Nothing further.

CROSS-EXAMINATION BY MR. WHEATLEY:

Page 32, Line 8
Q: Detective Binns, you said the rental car was a 'common indicator.' Is driving a rental car a crime?
A: No, but it is a factor in the totality —

Q: Moving on. Ares the K-9 — how long had Ares been on duty that day before the alert?
A: I'm not certain. Several hours.

Q: Are you aware of studies showing K-9 alert accuracy decreases significantly after 4–5 hours of duty?
A: I'm aware there are discussions in the literature.

Q: Ares had been on duty for 7 hours and 22 minutes when he alerted on Cole's vehicle. You have access to the K-9 duty logs, don't you?
A: Yes.

Q: And the alert was to the rear seat area — but the narcotics were under the rear seat, beneath a panel. Is it typical for K-9 to alert to a location and the contraband be concealed three layers deep?
A: Dogs can detect odors through surfaces.

Page 33, Line 1
Q: Detective, what did Jerome Mack receive for his testimony?
A: The charges were amended. He pled to a single count of possession with a sentence recommendation of 18 months rather than the mandatory 5-year minimum he faced.

Q: That's a difference of three and a half years?
A: Approximately.

Q: Were the full terms of Mr. Mack's deal disclosed to the defense before trial?
A: The cooperation agreement was disclosed.

Q: The full terms — including that the State agreed to write a letter recommending early parole consideration?
A: I'm not aware of a separate parole letter.

Page 33, Line 18
MR. WHEATLEY: Your Honor, I would ask the State to produce any communications between the prosecuting office and the Parole Board or Adult Parole Authority regarding Jerome Mack.

MS. RUIZ: The State is not aware of any such communications that were not disclosed.

THE COURT: We'll take up any discovery issues at the close of evidence.

Page 34, Line 4
MR. WHEATLEY: Nothing further.

[Defense rested without calling witnesses.]

Page 37, Line 2
[JURY INSTRUCTION — ACCOMPLICE TESTIMONY]

THE COURT: Ladies and gentlemen, you have heard testimony from Jerome Mack, who testified under a plea agreement. You should consider the testimony of an accomplice with caution and weigh it carefully. An accomplice has a personal interest in the outcome of this trial.

MR. WHEATLEY: Your Honor, the defense requests a specific instruction that the jury must be satisfied, beyond the accomplice's testimony alone, that sufficient corroborating evidence of guilt exists.

THE COURT: The standard instruction will suffice, Mr. Wheatley.

Page 37, Line 22
[VERDICT — September 8, 2021]

THE COURT: Has the jury reached a verdict?
FOREPERSON: We have. Guilty, Your Honor. Guilty on all counts.

THE COURT: Sentencing is set for October 21, 2021.

[END OF TRANSCRIPT]
Certified by: Patricia Okonkwo, Official Court Reporter
`;

const OH_DEMO_FINDINGS = [
  {
    issueTitle: "Brady Violation — Suppression of State Letter Recommending Early Parole for Cooperating Witness Mack",
    transcriptExcerpt: "Were the full terms of Mr. Mack's deal disclosed? [...] The State is not aware of any such communications [...] including that the State agreed to write a letter recommending early parole consideration? [...] I'm not aware of a separate parole letter.",
    legalAnalysis: "Jerome Mack was the State's sole witness with personal knowledge linking Cole to the narcotics. Mack's testimony was secured through a cooperation agreement reducing his exposure from a mandatory 5-year minimum to 18 months. A post-conviction public records request to the Ohio Adult Parole Authority revealed a letter on file from the Cuyahoga County Prosecutor's Office, dated January 18, 2021 — three weeks before trial — recommending early parole consideration for Mack contingent on his cooperation with the State. This letter was not disclosed to the defense. Under Brady v. Maryland, 373 U.S. 83 (1963), and Giglio v. United States, 405 U.S. 150 (1972), the prosecution must disclose all agreements or benefits provided to a cooperating witness, including informal promises that bear on the witness's credibility. A parole letter from the prosecuting office directly affects Mack's incentive to testify falsely and is material impeachment evidence that belongs in the defense's hands before trial.",
    pageNumber: 33,
    lineNumber: 1,
    precedentName: "Giglio v. United States",
    precedentCitation: "405 U.S. 150 (1972) / Brady v. Maryland, 373 U.S. 83 (1963)",
    precedentType: "BINDING",
    courtRuling: "The prosecution must disclose all benefits, agreements, and informal promises provided to cooperating witnesses whose credibility is central to the State's case; suppression of a parole recommendation letter constitutes a Brady/Giglio violation requiring a new trial.",
    materialSimilarity: "Mack was the only witness who placed Cole's knowledge and control over the narcotics. The parole letter tripled the disclosed benefit Mack received for his testimony. Had the jury known the State had personally advocated for Mack's early parole — not merely reduced charges — it would have been free to reject Mack's testimony entirely. Without Mack, the State had only the K-9 alert and circumstantial location evidence.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue the parole letter was aspirational and informal — not a binding promise — and that the cooperation agreement itself was disclosed. State will invoke harmless error: the K-9 alert and the narcotics themselves established possession.",
    breakthroughArgument: "Ohio courts apply Giglio broadly to cover informal benefits as well as formal agreements. State v. Johnston, 39 Ohio St.3d 48 (1988). A letter from the prosecutor's office to the APA is not informal — it is an official act of advocacy on Mack's behalf. Without Mack's testimony, possession with intent requires additional proof of knowledge and control, which the State could not establish from the K-9 alert and physical evidence alone.",
    legalVehicle: "Ohio Revised Code § 2953.21 Post-Conviction Petition",
    survivability: "Strong",
  },
  {
    issueTitle: "Fourth Amendment — Unlawful Pretextual Traffic Stop and Improper K-9 Expansion",
    transcriptExcerpt: "The vehicle had a broken tail lamp. [...] I ran the plates — registered to a rental company, which is a common indicator. [...] I asked for consent. Mr. Cole refused. I then determined I had reasonable suspicion of criminal activity and called for a K-9 unit.",
    legalAnalysis: "Under Rodriguez v. United States, 575 U.S. 348 (2015), once the purpose of a lawful traffic stop is completed, police may not extend the stop for a K-9 sniff without independent reasonable articulable suspicion of criminal activity. Here, Binns's proffered 'reasonable suspicion' to extend the stop and call K-9 was: (1) the vehicle was a rental, and (2) the passenger appeared nervous. Under Illinois v. Caballes, 543 U.S. 405 (2005) as limited by Rodriguez, neither of these factors — alone or in combination — constitutes the particularized, objective facts required for reasonable suspicion of criminal activity. The K-9 alert was the fruit of an unlawfully extended stop. Under the exclusionary rule, all evidence discovered as a result of the illegal extension — the narcotics and the cash — must be suppressed. Defense counsel failed to move to suppress under Ohio Crim.R. 12, waiving the argument for direct appeal without an IAC finding.",
    pageNumber: 31,
    lineNumber: 1,
    precedentName: "Rodriguez v. United States",
    precedentCitation: "575 U.S. 348 (2015) / Illinois v. Caballes, 543 U.S. 405 (2005)",
    precedentType: "BINDING",
    courtRuling: "A traffic stop may not be extended beyond the time necessary for the stop's purpose without independent reasonable articulable suspicion of criminal activity; a rental car and nervous passenger are insufficient to extend a stop for a drug K-9.",
    materialSimilarity: "The uncontroverted facts — rental car, nervous passenger — do not meet Rodriguez's particularized suspicion standard. K-9 Ares had been on duty for 7+ hours when he alerted, raising additional reliability concerns. Suppression would eliminate the narcotics and cash, and without physical evidence, only Mack's compromised testimony remains.",
    proceduralStatus: "Defaulted",
    anticipatedBlock: "Defense counsel failed to file a suppression motion under Ohio Crim.R. 12(C), which is the mandatory vehicle. Post-conviction review requires cause (IAC) and prejudice (suppression). State will invoke procedural default and argue the facts supported extension.",
    breakthroughArgument: "The failure to move to suppress is the IAC claim — Paul Wheatley cross-examined Binns on the K-9's hours and the rental car indicator but never translated that cross-examination into a suppression motion. Prejudice is clear: suppression removes all physical evidence. Under State v. Bradley, 42 Ohio St.3d 136 (1989), counsel's failure to pursue a meritorious suppression motion is deficient performance per se.",
    legalVehicle: "Ohio Revised Code § 2953.21 Post-Conviction Petition",
    survivability: "Strong",
  },
  {
    issueTitle: "Ineffective Assistance of Counsel — Failure to Request Mandatory Corroboration Instruction on Accomplice Testimony",
    transcriptExcerpt: "The defense requests a specific instruction that the jury must be satisfied, beyond the accomplice's testimony alone, that sufficient corroborating evidence of guilt exists. [...] The standard instruction will suffice, Mr. Wheatley.",
    legalAnalysis: "Ohio Revised Code § 2923.03(D) mandates that when accomplice testimony is the primary evidence of guilt, the trial court must instruct the jury that it may not rely on accomplice testimony alone and must find independent corroborating evidence. Defense counsel requested a corroboration instruction; the court denied it with the standard instruction. Counsel did not object on the record or proffer the statutory instruction. Under State v. Greer, 39 Ohio St.3d 236 (1988), failure to give the ORC § 2923.03(D) instruction when accomplice testimony is central is reversible error — the defendant need not show prejudice because the statute itself reflects the legislature's judgment that uncorroborated accomplice testimony is inherently dangerous. Mack was the sole witness with knowledge of Cole's control and intent. Without the mandatory corroboration instruction, the jury was not equipped to evaluate whether the physical evidence was independently sufficient.",
    pageNumber: 37,
    lineNumber: 2,
    precedentName: "State v. Greer",
    precedentCitation: "39 Ohio St.3d 236 (1988) / Ohio Revised Code § 2923.03(D)",
    precedentType: "BINDING",
    courtRuling: "When accomplice testimony is central to the conviction, Ohio Revised Code § 2923.03(D) requires a corroboration instruction; failure to give it is reversible error that does not require a showing of prejudice.",
    materialSimilarity: "Mack was the State's only witness on knowledge and intent. Without the corroboration instruction, the jury was never told it needed independent evidence beyond Mack's word to convict. If the corroboration instruction had been given, the jury would have been forced to determine whether the K-9 alert and physical location alone — absent knowledge testimony — were sufficient.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue the standard accomplice instruction adequately cautioned the jury, and that the corroboration requirement under § 2923.03(D) applies to conspiracy charges, not complicity. State may also argue substantial evidence corroborated Mack: the drugs were under Cole's seat.",
    breakthroughArgument: "Ohio courts have repeatedly held that § 2923.03(D) applies when one co-defendant testifies against another under a plea agreement on a charge that includes complicity elements. State v. Yarbrough, 95 Ohio St.3d 227 (2002). The narcotics were under the rear seat — a shared area of a rental car with two occupants — and without the corroboration instruction, the jury could not properly evaluate whether that location independently established Cole's knowing possession.",
    legalVehicle: "Ohio Revised Code § 2953.21 Post-Conviction Petition",
    survivability: "Moderate",
  },
  {
    issueTitle: "Newly Discovered Evidence — K-9 Duty Log Showing Ares Was Beyond Recommended Alert Threshold",
    transcriptExcerpt: "Ares had been on duty for 7 hours and 22 minutes when he alerted on Cole's vehicle. [...] Are you aware of studies showing K-9 alert accuracy decreases significantly after 4–5 hours of duty? [...] I'm aware there are discussions in the literature.",
    legalAnalysis: "Defense counsel questioned Detective Binns about K-9 Ares's duty hours at trial but had no documentary evidence. A post-conviction public records request produced Ares's complete duty logs showing 7 hours 22 minutes of active duty before the alert, and the Cleveland Police Department's own K-9 Unit Manual — which was not disclosed pre-trial — specifies that alerts after 6 hours of continuous duty are flagged for supervisory review and are presumptively unreliable without a verification protocol. The Cuyahoga County K-9 handler's certification records further show that Ares had three 'missed detection' events in his last 90-day performance review. None of these records were disclosed to the defense. Under ORC § 2953.23, newly discovered evidence warrants a hearing when there is a reasonable probability that the evidence, had it been available, would have produced a different verdict. A drug dog whose department's own manual flags alerts after 6 hours as unreliable — and who had three recent missed detections — directly undermines the sole probable cause basis for the search.",
    pageNumber: 32,
    lineNumber: 8,
    precedentName: "Florida v. Harris",
    precedentCitation: "568 U.S. 237 (2013) / Ohio Revised Code § 2953.23",
    precedentType: "BINDING",
    courtRuling: "Newly discovered K-9 performance records — including duty logs, departmental reliability standards, and recent missed-detection events — are material newly discovered evidence when they directly undermine the probable cause basis for the search and were not disclosed pre-trial.",
    materialSimilarity: "Under Florida v. Harris, courts must examine a K-9's totality-of-the-circumstances reliability, including training records, performance history, and duty conditions. The department's own manual and Ares's performance records are precisely the evidence Harris contemplates. Combined with the Brady violation on the Mack parole letter, a pattern of Brady non-disclosure emerges that independently supports § 2953.23 relief.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue the K-9 logs were public records available pre-trial through a FOIA request, and that defense counsel's failure to obtain them is not excused. State will also argue the alert was valid regardless of hours because the narcotics were actually found.",
    breakthroughArgument: "Pre-trial FOIA requests for K-9 duty logs are not standard defense practice, and the department's internal K-9 manual — which itself establishes the reliability threshold — is not a publicly indexed document. State v. Elmore, 111 Ohio St.3d 515 (2006) holds that newly discovered evidence includes undisclosed departmental standards that the prosecution possessed and which would have affected the suppression calculus. The physical discovery of narcotics does not retroactively validate an unconstitutional K-9 deployment.",
    legalVehicle: "Ohio Revised Code § 2953.23 Post-Conviction Petition (Newly Discovered Evidence)",
    survivability: "Moderate",
  },
];

export async function seedOhioDemoCase(): Promise<void> {
  try {
    const existing = await db
      .select({ id: casesTable.id })
      .from(casesTable)
      .where(eq(casesTable.caseNumber, OH_DEMO_CASE_NUMBER))
      .limit(1);

    if (existing.length > 0) {
      const caseId = existing[0].id;
      const demoDoc = await db
        .select({ id: documentsTable.id, status: documentsTable.status, findingCount: documentsTable.findingCount })
        .from(documentsTable)
        .where(eq(documentsTable.caseId, caseId))
        .limit(1)
        .then((rows) => rows[0] ?? null);

      const needsRestore = !demoDoc || demoDoc.status === "error" || demoDoc.status === "pending" || (demoDoc.findingCount ?? 0) === 0;
      if (!needsRestore) {
        logger.info({ caseId }, "Ohio demo case already exists and is healthy — skipping seed");
        return;
      }

      logger.info({ caseId }, "Ohio demo case is corrupted — restoring...");
      await db.transaction(async (tx) => {
        let docId: number;
        if (!demoDoc) {
          const [newDoc] = await tx.insert(documentsTable).values({ caseId, title: "Jury Trial Transcript — Day 2, September 8, 2021", documentType: "transcript", content: OH_DEMO_TRANSCRIPT, status: "analyzed" }).returning();
          docId = newDoc.id;
        } else {
          docId = demoDoc.id;
          await tx.delete(findingsTable).where(eq(findingsTable.documentId, docId));
        }
        for (const f of OH_DEMO_FINDINGS) {
          await tx.insert(findingsTable).values({ caseId, documentId: docId, issueTitle: f.issueTitle, transcriptExcerpt: f.transcriptExcerpt, legalAnalysis: f.legalAnalysis, pageNumber: f.pageNumber, lineNumber: f.lineNumber, precedentName: f.precedentName, precedentCitation: f.precedentCitation, precedentType: f.precedentType, courtRuling: f.courtRuling, materialSimilarity: f.materialSimilarity, proceduralStatus: f.proceduralStatus, anticipatedBlock: f.anticipatedBlock, breakthroughArgument: f.breakthroughArgument, legalVehicle: f.legalVehicle, survivability: f.survivability });
        }
        await tx.update(documentsTable).set({ status: "analyzed", findingCount: OH_DEMO_FINDINGS.length }).where(eq(documentsTable.id, docId));
        await tx.update(casesTable).set({ hasAnalysis: true }).where(eq(casesTable.id, caseId));
      });
      logger.info({ caseId }, "Ohio demo case restored");
      return;
    }

    logger.info("Seeding Ohio demo case...");
    await db.transaction(async (tx) => {
      const [ohCase] = await tx.insert(casesTable).values({
        title: "State v. Demetrius Cole — OH DEMO",
        defendantName: "Demetrius Leon Cole",
        caseNumber: OH_DEMO_CASE_NUMBER,
        jurisdiction: "Cuyahoga County Court of Common Pleas, State of Ohio",
        notes: "DEMO CASE — Ohio post-conviction example showcasing the ORC § 2953.21 post-conviction petition, 6th Circuit federal ladder, and Ohio-specific executive relief options including Adult Parole Authority review.",
        hasAnalysis: true,
        hasMotion: false,
      }).returning();

      const [ohDoc] = await tx.insert(documentsTable).values({
        caseId: ohCase.id,
        title: "Jury Trial Transcript — Day 2, September 8, 2021",
        documentType: "transcript",
        content: OH_DEMO_TRANSCRIPT,
        status: "analyzed",
      }).returning();

      for (const f of OH_DEMO_FINDINGS) {
        await tx.insert(findingsTable).values({ caseId: ohCase.id, documentId: ohDoc.id, issueTitle: f.issueTitle, transcriptExcerpt: f.transcriptExcerpt, legalAnalysis: f.legalAnalysis, pageNumber: f.pageNumber, lineNumber: f.lineNumber, precedentName: f.precedentName, precedentCitation: f.precedentCitation, precedentType: f.precedentType, courtRuling: f.courtRuling, materialSimilarity: f.materialSimilarity, proceduralStatus: f.proceduralStatus, anticipatedBlock: f.anticipatedBlock, breakthroughArgument: f.breakthroughArgument, legalVehicle: f.legalVehicle, survivability: f.survivability });
      }

      await tx.update(documentsTable).set({ findingCount: OH_DEMO_FINDINGS.length }).where(eq(documentsTable.id, ohDoc.id));
      logger.info({ caseId: ohCase.id }, "Ohio demo case seeded successfully");
    });
  } catch (err) {
    logger.error({ err }, "Failed to seed Ohio demo case");
  }
}
// ─────────────────────────────────────────────────────────────────
// INDIANA DEMO CASE
// ─────────────────────────────────────────────────────────────────

const IN_DEMO_CASE_NUMBER = "DEMO-IN-2020F000391";

const IN_DEMO_TRANSCRIPT = `STATE OF INDIANA
MARION COUNTY SUPERIOR COURT
CRIMINAL DIVISION 6

STATE OF INDIANA,
    Plaintiff,

    vs.                                             Case No. 49D06-2001-F1-000391

TERRELL DAMON MITCHELL,
    Defendant.

TRANSCRIPT OF JURY TRIAL — DAY 2
Honorable Sandra L. Pemberton, Presiding
September 8, 2020

Appearances:
    For the State: Deputy Prosecutor Kevin Atchison
    For the Defense: Attorney Marlene Houck
    Court Reporter: Barbara Delacroix

---

THE COURT: We are back on the record in State versus Terrell Mitchell. All parties present. Mr. Atchison, you may proceed.

MR. ATCHISON: Thank you, Your Honor. The State calls Detective Luis Fuentes.

DIRECT EXAMINATION BY MR. ATCHISON:

Page 18, Line 1
Q: Detective Fuentes, you were the lead investigator in this case?
A: Yes, sir. I'm assigned to the IMPD Violent Crimes Unit.

Q: Can you describe your contact with the defendant on January 14, 2020?
A: We brought Mr. Mitchell in for questioning at around 2 a.m. after responding to the shooting at 3402 North College Avenue. He had been identified by a bystander.

Q: Did you advise him of his rights?
A: I did. I read him the Miranda card at the start of the interview.

Q: Did he waive those rights?
A: Initially, yes. He signed the form and we started talking.

Page 18, Line 22
Q: At some point did the defendant say something about an attorney?
A: About forty minutes in he said something like, "I think I need a lawyer before I say more." I told him he could have one if he wanted but asked if he wanted to keep talking since he was helping himself. He shrugged and kept talking.

Q: And he did continue to talk?
A: For another twenty-two minutes, yes. He gave us his account of where he was.

Page 19, Line 8
Q: What did he tell you about his whereabouts on the night of January 13th?
A: He said he was at his cousin's place on East 38th Street. But he couldn't give us the cousin's full name or contact info right away.

Q: Did you follow up on that alibi?
A: We made one attempt to contact an individual at the address he described, but no one answered. We didn't pursue it further because the eyewitness identification was solid.

Page 19, Line 24
Q: What was the nature of that eyewitness identification?
A: A Marcus Delray witnessed the shooting from approximately thirty feet away under a parking lot light. He identified Terrell Mitchell in a photo array the next morning with high confidence. He picked him out immediately.

Page 20, Line 6
Q: No further questions.

THE COURT: Cross, Ms. Houck?

Page 20, Line 9
CROSS-EXAMINATION BY MS. HOUCK:

Q: Detective, when Mr. Mitchell said he thought he needed a lawyer, what were your exact words back to him?
A: I told him he could have one, but I also said he was helping himself by talking and asked if he wanted to continue.

Q: You told a man who just invoked the right to counsel that he was "helping himself" by continuing to speak?
A: I informed him of his options.

Q: Did you stop the interview at that point?
A: He indicated he wanted to keep talking.

Page 20, Line 22
Q: You testified that you made one attempt to verify his alibi at East 38th Street and stopped when no one answered?
A: Correct.

Q: Did you attempt to contact his cousin — a LaShonda Mitchell — on any subsequent day?
A: I don't have a record of that.

Q: Did anyone in your unit follow up on the alibi in the weeks before trial?
A: The investigation was essentially complete at the time of arrest given the eyewitness identification.

Page 21, Line 10
Q: Detective, isn't it true that LaShonda Mitchell filed a statement with the Marion County Public Defender's office six weeks before this trial stating that Terrell Mitchell was at her apartment the entire night of January 13th?
A: I became aware of that filing, yes.

Q: And you took no action to re-evaluate the eyewitness identification in light of that corroborated alibi?
A: The State had already made its charging decision.

Page 21, Line 28
MS. HOUCK: No further questions.

THE COURT: Redirect?

MR. ATCHISON: Briefly.

REDIRECT BY MR. ATCHISON:

Page 22, Line 3
Q: Detective, Marcus Delray identified Mr. Mitchell under good lighting conditions at close range, correct?
A: He did.

Q: And Mr. Mitchell's account of his whereabouts was vague and uncorroborated at the time of arrest?
A: He couldn't name or locate his cousin initially.

THE COURT: Witness excused. Call your next witness, Mr. Atchison.

MR. ATCHISON: The State calls Marcus Delray.

Page 23, Line 1
DIRECT EXAMINATION BY MR. ATCHISON:

Q: Mr. Delray, where were you on the night of January 13, 2020?
A: I was in the parking lot of the Marathon station on North College. I was getting gas.

Q: Did you see the shooting?
A: Yes. I heard an argument first and then two shots. I was maybe thirty feet away under the light pole.

Q: Did you see the shooter?
A: I saw his face when he turned after the shots. Clear as day. He looked right at me.

Q: Did you identify that person later?
A: Yes, I picked him out of a photo array the next day. It was him — the defendant.

Page 23, Line 22
Q: No further questions.

CROSS-EXAMINATION BY MS. HOUCK:

Q: Mr. Delray, how long did you see the shooter's face?
A: Maybe two, three seconds.

Q: And this was at 1:30 in the morning?
A: The parking lot light was on.

Q: Were you ever told by anyone before the photo array that police had a suspect?
A: I don't — the officer said something about it being routine.

Page 24, Line 7
Q: Did the officer administer the photo array, or was it someone else?
A: The same detective who interviewed me. Detective Fuentes.

Q: The lead detective on the case administered the photo array to the only eyewitness?
A: I guess, yes.

MS. HOUCK: Nothing further.

[JURY VERDICT: GUILTY — September 9, 2020 — Attempted Murder (Level 1 Felony)]

THE COURT: Verdict accepted. Sentencing set for November 12, 2020. Mr. Mitchell is remanded to custody.

[END OF TRANSCRIPT]
Certified by: Barbara Delacroix, Official Court Reporter
`;

const IN_DEMO_FINDINGS = [
  {
    issueTitle: "Miranda Violation — Continued Interrogation After Ambiguous Invocation of Right to Counsel",
    transcriptExcerpt: "He said something like, 'I think I need a lawyer before I say more.' I told him he could have one if he wanted but asked if he wanted to keep talking since he was helping himself.",
    legalAnalysis: "Mitchell stated 'I think I need a lawyer before I say more' — a statement that, under Davis v. United States, 512 U.S. 452 (1994), falls squarely into the zone requiring at minimum a clarifying question before interrogation continues. Rather than stop or clarify, Detective Fuentes explicitly encouraged continued questioning by telling Mitchell he was 'helping himself' by talking. The Seventh Circuit has consistently held that officers may not use persuasive tactics to overcome or undermine an invocation — even an ambiguous one — by framing continued cooperation as beneficial to the suspect. Under Edwards v. Arizona, 451 U.S. 477 (1981), once a suspect invokes the right to counsel, questioning must cease. Even accepting Davis's ambiguity rule, Fuentes had an obligation to clarify and stop; instead he applied coercive pressure. The twenty-two minutes of post-invocation statements, which included Mitchell's inability to provide his cousin's contact details immediately, were used to undermine his alibi at trial.",
    pageNumber: 18,
    lineNumber: 22,
    precedentName: "Edwards v. Arizona",
    precedentCitation: "451 U.S. 477 (1981)",
    precedentType: "BINDING",
    courtRuling: "Once a suspect requests counsel, interrogation must cease until counsel is present or the suspect reinitiates communication; police may not employ tactics designed to persuade a suspect to abandon the invocation.",
    materialSimilarity: "Fuentes did not stop questioning after Mitchell's invocation — he actively encouraged continuation by suggesting Mitchell was helping himself. The post-invocation statements included the vague alibi account that the prosecution used to undermine credibility at trial. Suppression of those twenty-two minutes of testimony would have removed the prosecution's principal tool for attacking Mitchell's alibi claim.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue Mitchell's statement was ambiguous under Davis v. United States and that Fuentes's response was a permissible clarifying question rather than continued interrogation. State will also argue that any error was harmless given the eyewitness identification by Delray.",
    breakthroughArgument: "Fuentes did not ask a clarifying question — he affirmatively told Mitchell that talking was in his best interest and then continued the interview for twenty-two minutes. Under Missouri v. Seibert, 542 U.S. 600 (2004), two-step interrogation tactics that exploit ambiguity to continue questioning after a request for counsel are unconstitutional. The harmless-error argument fails because the alibi vagueness elicited in those twenty-two minutes was central to the prosecution's narrative at trial; without it, the alibi (subsequently confirmed by LaShonda Mitchell) stands unimpeached.",
    legalVehicle: "Indiana Post-Conviction Rule 1 (P-C.R. 1) Petition",
    survivability: "Strong",
  },
  {
    issueTitle: "Ineffective Assistance of Counsel — Failure to Investigate and Present LaShonda Mitchell's Alibi Testimony",
    transcriptExcerpt: "LaShonda Mitchell filed a statement with the Marion County Public Defender's office six weeks before this trial stating that Terrell Mitchell was at her apartment the entire night of January 13th. [...] The State had already made its charging decision.",
    legalAnalysis: "Defense counsel Marlene Houck was in possession of a sworn alibi statement from LaShonda Mitchell — corroborating that the defendant was at her East 38th Street apartment the entire night of the shooting — six weeks before trial. Houck cross-examined Detective Fuentes about the statement but did not call LaShonda Mitchell as a defense witness and presented no alibi defense to the jury. Under Strickland v. Washington, 466 U.S. 668 (1984), the failure to call a known, available alibi witness whose testimony directly contradicts the prosecution's timeline is classic deficient performance. Indiana courts applying Strickland in P-C.R. 1 proceedings have consistently held that counsel's failure to present an alibi witness she was aware of — where no reasonable strategic justification exists — satisfies the deficiency prong. The prejudice prong is met because LaShonda Mitchell's testimony, combined with the identification problems in the Delray photo array, creates a reasonable probability of a different verdict.",
    pageNumber: 21,
    lineNumber: 10,
    precedentName: "Strickland v. Washington",
    precedentCitation: "466 U.S. 668 (1984)",
    precedentType: "BINDING",
    courtRuling: "Counsel's performance is deficient when it falls below an objective standard of reasonableness; prejudice is established where there is a reasonable probability that, but for counsel's deficient performance, the result of the proceeding would have been different.",
    materialSimilarity: "Houck had the alibi statement six weeks before trial. She used it only to impeach Fuentes's investigation — she never produced the alibi witness herself. LaShonda Mitchell was available, willing, and directly exculpatory. The prosecution's case rested on a single eyewitness identification made after a non-blind array administered by the lead detective. A credible alibi from a family member at a fixed address would have created significant reasonable doubt.",
    proceduralStatus: "Unclear",
    anticipatedBlock: "State will argue the decision not to call LaShonda Mitchell was a strategic one — family member alibi witnesses can be perceived as biased and may hurt more than they help. State will also argue that the jury heard the alibi theory through Houck's cross of Fuentes, so the omission was not prejudicial.",
    breakthroughArgument: "A post-conviction affidavit from LaShonda Mitchell confirming her availability and willingness to testify eliminates the strategic-choice defense. Cross-examining a detective about an alibi is not a substitute for the alibi witness — the jury never heard LaShonda Mitchell's firsthand account under oath. Under Indiana's P-C.R. 1, an affidavit from the uncalled witness is the standard vehicle for establishing IAC prejudice and Houck's failure to investigate beyond the written statement (e.g., locking in testimony before trial) independently constitutes deficiency.",
    legalVehicle: "Indiana Post-Conviction Rule 1 (P-C.R. 1) Petition",
    survivability: "Strong",
  },
  {
    issueTitle: "Fourth Amendment — Non-Blind Photo Array: Lead Detective Administered Identification Procedure",
    transcriptExcerpt: "The same detective who interviewed me. Detective Fuentes. [...] The lead detective on the case administered the photo array to the only eyewitness.",
    legalAnalysis: "Marcus Delray's identification of Terrell Mitchell was the cornerstone of the prosecution's case. The photo array was administered by Detective Fuentes — the lead detective who had already identified Mitchell as the suspect and who conducted the arrest. Courts following Perry v. New Hampshire, 565 U.S. 228 (2012), and the due process reliability framework recognize that non-blind administrator bias is one of the most documented causes of eyewitness misidentification. In a non-blind procedure, the detective knows which photograph depicts the suspect and can — even unconsciously — cue the witness through tone, pause, or body language. Fuentes also made a comment to Delray that the array was 'routine,' which courts have found suggestive. While Indiana does not yet have a mandatory blind-administration statute equivalent to Minnesota's, the Seventh Circuit has recognized that due process reliability hearings are required where the totality of circumstances surrounding identification renders it unreliable. Delray's viewing conditions — 2 a.m., thirty feet, two to three seconds — compounded by the non-blind, non-independent array creates a substantial due process claim.",
    pageNumber: 24,
    lineNumber: 7,
    precedentName: "Perry v. New Hampshire",
    precedentCitation: "565 U.S. 228 (2012)",
    precedentType: "BINDING",
    courtRuling: "The Due Process Clause requires courts to assess eyewitness identification reliability when police arranged the suggestive circumstances; courts must evaluate the totality of the circumstances including viewing conditions, administrator independence, and suggestive comments.",
    materialSimilarity: "The only witness who placed Mitchell at the scene gave a three-second identification in poor viewing conditions, through an array administered by the very detective who had already concluded Mitchell was the perpetrator. The combination of administrator knowledge, suggestive framing ('routine'), and poor observation conditions meets the threshold for a reliability challenge that trial counsel failed to pursue with an expert or a suppression motion.",
    proceduralStatus: "Unclear",
    anticipatedBlock: "State will argue Perry limits due process review to cases of police-arranged suggestiveness, and that Fuentes's administration — while non-blind — was not affirmatively suggestive. State will also argue that Delray's immediate pick was spontaneous and confidence high, satisfying the Manson v. Brathwaite reliability factors.",
    breakthroughArgument: "Fuentes's comment that the procedure was 'routine' is an affirmative suggestive act under the post-Perry framework — it minimizes the gravity of the decision, reducing the witness's deliberative scrutiny. Counsel's failure to move to suppress or retain a eyewitness identification expert constitutes IAC under Strickland because the non-blind administrator issue is settled social science and well within the scope of competent criminal defense in a Level 1 felony case. Post-conviction expert testimony on eyewitness reliability, combined with the alibi, creates cumulative grounds for relief under P-C.R. 1.",
    legalVehicle: "Indiana Post-Conviction Rule 1 (P-C.R. 1) Petition",
    survivability: "Moderate",
  },
  {
    issueTitle: "Ineffective Assistance — Failure to Move to Suppress Post-Invocation Statements",
    transcriptExcerpt: "He said something like, 'I think I need a lawyer before I say more.' I told him he could have one if he wanted but asked if he wanted to keep talking since he was helping himself. He shrugged and kept talking. For another twenty-two minutes.",
    legalAnalysis: "The trial record establishes on its face that Detective Fuentes continued interrogating Mitchell for twenty-two minutes after Mitchell stated he thought he needed a lawyer. Counsel Houck filed no motion to suppress the post-invocation statements before trial, did not raise the issue at trial, and did not preserve it for direct appeal. Under Strickland, the failure to move to suppress evidence where the suppression claim is apparent from the record and has a likelihood of success constitutes deficient performance. Indiana courts in P-C.R. 1 proceedings have held that an attorney who reviews the interrogation record and fails to identify an obvious Edwards violation renders constitutionally deficient assistance. The prejudice is clear: Fuentes's testimony about Mitchell's vague and uncertain alibi account — drawn entirely from the post-invocation twenty-two minutes — was the primary basis for the prosecution's attack on Mitchell's credibility before the jury.",
    pageNumber: 20,
    lineNumber: 22,
    precedentName: "Missouri v. Seibert",
    precedentCitation: "542 U.S. 600 (2004)",
    precedentType: "BINDING",
    courtRuling: "Two-step interrogation techniques designed to undermine Miranda protections, including tactics that exploit an ambiguous invocation to continue questioning, violate the Fifth Amendment; statements obtained by such methods must be suppressed.",
    materialSimilarity: "The post-invocation period is precisely when Mitchell's inability to immediately name or locate his cousin was elicited. That portion of Fuentes's testimony was the prosecution's single most effective tool for attacking the alibi at trial. Had counsel filed a suppression motion, the State would have had to defend Fuentes's conduct — and likely would have failed under Edwards and Seibert.",
    proceduralStatus: "Defaulted",
    anticipatedBlock: "The State will argue procedural default — the suppression issue was not raised before or during trial and is therefore waived for P-C.R. 1 review. Under Daniels v. State (Indiana), failure to raise a suppression issue before trial constitutes waiver absent cause and prejudice.",
    breakthroughArgument: "Cause for the procedural default is ineffective assistance of trial counsel — Houck's failure to identify and litigate the obvious Edwards issue is itself the P-C.R. 1 ground. Under Murray v. Carrier, 477 U.S. 478 (1986), IAC constitutes cause to overcome procedural default. The IAC claim on the suppression failure and the IAC claim on the alibi witness combine as a cumulative prejudice argument: both deficiencies flow from the same pattern of inadequate investigation, and their combined effect destroyed the defense.",
    legalVehicle: "Indiana Post-Conviction Rule 1 (P-C.R. 1) Petition",
    survivability: "Moderate",
  },
];

const IN_DEMO_ROUNDS = [
  {
    roundNumber: 1,
    stateStrength: "MODERATE",
    defenseBurden: "Defense must establish that the post-invocation interrogation violated Edwards v. Arizona and that counsel's failure to move to suppress it fell below the Strickland standard of reasonableness.",
    stateArgument: "Your Honor, the State addresses the Miranda/Edwards claim at threshold. Under Davis v. United States, 512 U.S. 452 (1994), an ambiguous request for counsel does not trigger the Edwards bright-line rule — officers may ask clarifying questions before ceasing interrogation. Mitchell's statement — 'I think I need a lawyer before I say more' — is precisely the kind of ambiguous statement Davis addresses. Detective Fuentes asked whether Mitchell wanted to continue, and Mitchell made the choice to keep talking. That is permissible clarification, not coercive continuation.\n\nOn the IAC claim: Houck's decision not to file a suppression motion reflects a strategic judgment. A suppression hearing risked drawing additional attention to the post-invocation statements, which Mitchell largely used to explain (however vaguely) his whereabouts. There was a plausible argument that those statements, taken as a whole, assisted Mitchell more than hurt him. Under Strickland's strong deference to strategic choices, this Court should not second-guess that judgment.\n\nFinally, any error was harmless. The eyewitness identification of Marcus Delray — made in adequate lighting at thirty feet, with high stated confidence — independently supports the verdict.",
    courtCommentary: "Counsel, I have some significant questions about the Davis clarifying-question doctrine as applied here. Fuentes's response was not a clarifying question — it was an affirmative encouragement to keep talking. He told Mitchell he was 'helping himself.' That is not 'do you want an attorney or not?' — that is a persuasion tactic. Under the Seventh Circuit's reading of Missouri v. Seibert, there is a meaningful distinction between clarification and inducement.\n\nOn harmless error: I'm troubled by the framing. The post-invocation twenty-two minutes produced the vague alibi account that the State used extensively to undermine Mitchell's credibility. If those statements are suppressed, the alibi picture looks materially different — especially given the LaShonda Mitchell statement Defense has flagged.\n\nI want to hear from the State specifically: what is the trial record evidence of prejudice from the eyewitness ID alone, independent of the post-invocation statements?",
    defenseResponse: "Your Honor, Fuentes's conduct goes beyond clarification. He told a man who said he needed a lawyer that he was helping himself by continuing to talk — and then interrogated him for twenty-two more minutes. That is textbook Seibert: a tactic designed to neutralize an invocation by reframing cooperation as self-beneficial. The Seventh Circuit in United States v. Lee, 413 F.3d 622 (7th Cir. 2005), recognized that officers may not use strategic encouragement to continue interrogation after an invocation.\n\nOn harmless error: the post-invocation twenty-two minutes are where Mitchell's inability to immediately produce his cousin's name and address was established. That testimony was used explicitly at closing argument to attack his alibi as fabricated. LaShonda Mitchell's statement — which Fuentes never followed up on after the initial unanswered knock — directly corroborates the alibi. Without the post-invocation vagueness, the prosecution's alibi attack collapses.\n\nOn the IAC/suppression-motion issue: the suppression claim was apparent on the face of the interrogation video. A Level 1 felony defense attorney reviewing that video and failing to file an Edwards motion is not making a strategy call — she is making an oversight. We ask the Court to find that both the underlying constitutional violation and the IAC claim are well-founded on this record.",
  },
  {
    roundNumber: 2,
    stateStrength: "WEAK",
    defenseBurden: "Defense must establish that the failure to call LaShonda Mitchell as an alibi witness satisfies both prongs of Strickland: deficient performance and a reasonable probability of a different verdict.",
    stateArgument: "Your Honor, the State turns to the alibi witness IAC claim. The decision whether to call a particular witness is quintessentially strategic. LaShonda Mitchell is Mitchell's cousin — a family member with every incentive to provide a false alibi. Juries are well aware of the potential bias of family member alibi witnesses. Defense counsel Houck made a reasonable strategic decision to highlight the alibi through cross-examination of Detective Fuentes — effectively blaming the police for not investigating the alibi — rather than risk the jury discounting or disbelieving LaShonda Mitchell's testimony on bias grounds.\n\nFurthermore, on prejudice: Marcus Delray's identification was confident and immediate. He saw the shooter face-to-face under a parking lot light at thirty feet. Even crediting LaShonda Mitchell's testimony, the jury would have had to weigh a family member's account against a disinterested eyewitness's high-confidence identification. There is no reasonable probability the verdict would have differed.",
    courtCommentary: "I find the State's strategic-choice argument unpersuasive on this record. The cross-examination of a detective is not a substitute for the alibi witness. Jurors cannot weigh what they do not hear — they heard a police officer acknowledge that someone claimed Mitchell was elsewhere; they did not hear that person testify under oath and be subjected to cross-examination. A corroborated alibi from a witness who can speak to Mitchell's presence throughout the night is categorically different from an impeachment point on cross.\n\nOn prejudice: the eyewitness identification was made through a non-blind array administered by the lead detective at 2 a.m. after a two-to-three-second observation. I do not share the State's confidence in its strength. If the alibi had been before the jury and the identification's methodological problems had been surfaced through expert testimony, the calculus changes substantially.\n\nDefense, I want you to address one specific question: does the record establish that LaShonda Mitchell was available and willing to testify at the time of trial — not just that she filed a statement with the public defender's office?",
    defenseResponse: "Your Honor, LaShonda Mitchell filed her sworn statement with the public defender's office six weeks before trial. The statement identifies her by name, address, and relationship. Post-conviction counsel has obtained an affidavit from LaShonda Mitchell confirming she was available, willing, and never contacted by trial counsel about testifying. Houck did not reach out to LaShonda Mitchell before trial — she relied on the written statement without ever speaking to the witness or assessing her as a trial witness.\n\nUnder Indiana's P-C.R. 1 framework and Strickland, the failure to interview a known alibi witness before deciding not to call her is independently deficient. The strategic-choice defense requires that counsel actually made an informed choice — here, Houck made no choice because she never evaluated the witness. She used the statement as an impeachment prop without investigating its potential as live testimony.\n\nOn prejudice: the combination of the alibi testimony, the identification methodology issues, and the suppressed post-invocation statements creates a record where no reasonable juror could feel the confidence this verdict required. We respectfully urge this Court to grant relief.",
  },
  {
    roundNumber: 3,
    stateStrength: "WEAK",
    defenseBurden: "Defense must establish cumulative prejudice from the combined IAC failures and the Miranda violation, demonstrating a reasonable probability of a different verdict under Strickland's prejudice standard.",
    stateArgument: "Your Honor, even accepting some deficiency in counsel's performance, the State submits that cumulative prejudice analysis cannot transform individually insufficient claims into a winning one. This Court must find a reasonable probability of a different verdict — not merely that things could have gone differently. Marcus Delray's identification was confident. The jury deliberated and convicted. The alibi, even presented through LaShonda Mitchell's testimony, involves a family member with obvious motive to lie. The State asks this Court to affirm the conviction.",
    courtCommentary: "I have heard three rounds of argument in this proceeding, and my assessment is as follows: the State's position grows less tenable with each round. The Miranda violation is supported by the record. The alibi-witness IAC is supported by the uncontested fact that trial counsel never interviewed LaShonda Mitchell before deciding not to call her. The photo array methodology issue, while perhaps not independently sufficient, adds force to the cumulative prejudice analysis.\n\nThis Court is not permitted under Strickland to dismiss a claim simply because a jury convicted. The question is whether confidence in the verdict is undermined by the constitutional failures. Here, I find that it is. The prosecution's case rested on a single eyewitness identification made through a non-blind array, bolstered by post-invocation statements obtained after an apparent Edwards violation. The alibi was never presented to the jury. These are not peripheral errors — they are structural failures that affected the core of the trial.\n\nI am prepared to grant relief. I invite final statements from each party.",
    defenseResponse: "Your Honor, we thank the Court for its careful review of this record. Terrell Mitchell has maintained his innocence since the night of his arrest. The constitutional violations here are not technical — they are the kind of failures that produced the most troubling category of wrongful conviction: a case where the defendant had a corroborated alibi that the jury never heard, where the sole identification was obtained through a procedure known to produce unreliable results, and where statements made after an invocation of the right to counsel were used to undermine the alibi the defendant did try to present.\n\nWe ask this Court to vacate the conviction and remand for a new trial. At a retrial with LaShonda Mitchell's testimony, with the post-invocation statements suppressed, and with proper attention to the photo array methodology, we are confident that the evidence of Terrell Mitchell's innocence will be fully presented to a jury for the first time.",
  },
];

const IN_DEMO_VERDICT_SUMMARY = `After three rounds of argument in this Indiana Post-Conviction Rule 1 proceeding, this Court finds that the conviction of Terrell Damon Mitchell cannot stand.

The Miranda/Edwards violation is well-established on this record. Detective Fuentes did not ask a clarifying question after Mitchell stated he needed a lawyer — he told Mitchell that continued cooperation would help him and then interrogated him for twenty-two additional minutes. That conduct falls outside the Davis clarification exception and within the coercive interrogation pattern condemned by Missouri v. Seibert. The statements obtained during those twenty-two minutes — specifically Mitchell's inability to immediately produce his cousin's name and contact information — were used by the prosecution at trial to portray the alibi as fabricated. Trial counsel's failure to move to suppress these statements was not a strategic choice; it was an oversight that constitutes deficient performance under Strickland.

The alibi witness IAC finding is equally clear. LaShonda Mitchell filed a sworn statement with the public defender's office six weeks before trial. Trial counsel never interviewed her, never assessed her as a trial witness, and presented no alibi defense. The decision not to call a known, available, corroborating alibi witness — made without any investigation of that witness — cannot be characterized as strategy. It is deficiency, and the prejudice is manifest: the jury convicted on a single non-blind eyewitness identification without hearing a word from the one person who could place the defendant elsewhere at the time of the crime.

The cumulative effect of these failures — post-invocation interrogation used to undermine the alibi, and the alibi witness never called — destroyed the defense. This Court has no confidence in the verdict.

RULING: The conviction of Terrell Damon Mitchell is VACATED. The matter is remanded for a new trial. The State is ordered to show cause within 30 days why the post-invocation statements should not be suppressed in any retrial. DEFENSE WIN.`;

async function seedInCourtSimulation(tx: Parameters<Parameters<typeof db.transaction>[0]>[0], caseId: number, docId: number): Promise<void> {
  const [session] = await tx.insert(courtSessionsTable).values({
    caseId,
    simulationMode: "postconviction_974",
    skepticMode: true,
    expandedRecord: false,
    pleaQuestionnaireNotes: null,
    documentIds: JSON.stringify([docId]),
    status: "completed",
    verdictRating: "DEFENSE WIN",
    verdictSummary: IN_DEMO_VERDICT_SUMMARY,
    defenseWon: true,
    totalRounds: IN_DEMO_ROUNDS.length,
  }).returning();
  for (const r of IN_DEMO_ROUNDS) {
    await tx.insert(courtRoundsTable).values({
      sessionId: session.id,
      roundNumber: r.roundNumber,
      stateStrength: r.stateStrength,
      defenseBurden: r.defenseBurden,
      stateArgument: r.stateArgument,
      courtCommentary: r.courtCommentary,
      defenseResponse: r.defenseResponse,
    });
  }
}

export async function seedIndianaDemoCase(): Promise<void> {
  try {
    const existing = await db
      .select({ id: casesTable.id })
      .from(casesTable)
      .where(eq(casesTable.caseNumber, IN_DEMO_CASE_NUMBER))
      .limit(1);

    if (existing.length > 0) {
      const caseId = existing[0].id;
      const demoDoc = await db
        .select({ id: documentsTable.id, status: documentsTable.status, findingCount: documentsTable.findingCount })
        .from(documentsTable)
        .where(eq(documentsTable.caseId, caseId))
        .limit(1)
        .then((rows) => rows[0] ?? null);

      const needsRestore = !demoDoc || demoDoc.status === "error" || demoDoc.status === "pending" || (demoDoc.findingCount ?? 0) === 0;
      if (!needsRestore) {
        const existingSession = await db
          .select({ id: courtSessionsTable.id })
          .from(courtSessionsTable)
          .where(eq(courtSessionsTable.caseId, caseId))
          .limit(1)
          .then((rows) => rows[0] ?? null);
        if (!existingSession) {
          logger.info({ caseId }, "Indiana demo case missing court simulation — seeding session...");
          await db.transaction(async (tx) => {
            await seedInCourtSimulation(tx, caseId, demoDoc!.id);
          });
          logger.info({ caseId }, "Indiana demo court simulation seeded");
        } else {
          logger.info({ caseId }, "Indiana demo case already exists and is healthy — skipping seed");
        }
        return;
      }

      logger.info({ caseId }, "Indiana demo case is corrupted — restoring...");
      await db.transaction(async (tx) => {
        let docId: number;
        if (!demoDoc) {
          const [newDoc] = await tx.insert(documentsTable).values({ caseId, title: "Jury Trial Transcript — Day 2, September 8, 2020", documentType: "transcript", content: IN_DEMO_TRANSCRIPT, status: "analyzed" }).returning();
          docId = newDoc.id;
        } else {
          docId = demoDoc.id;
          await tx.delete(findingsTable).where(eq(findingsTable.documentId, docId));
        }
        for (const f of IN_DEMO_FINDINGS) {
          await tx.insert(findingsTable).values({ caseId, documentId: docId, issueTitle: f.issueTitle, transcriptExcerpt: f.transcriptExcerpt, legalAnalysis: f.legalAnalysis, pageNumber: f.pageNumber, lineNumber: f.lineNumber, precedentName: f.precedentName, precedentCitation: f.precedentCitation, precedentType: f.precedentType, courtRuling: f.courtRuling, materialSimilarity: f.materialSimilarity, proceduralStatus: f.proceduralStatus, anticipatedBlock: f.anticipatedBlock, breakthroughArgument: f.breakthroughArgument, legalVehicle: f.legalVehicle, survivability: f.survivability });
        }
        await tx.update(documentsTable).set({ status: "analyzed", findingCount: IN_DEMO_FINDINGS.length }).where(eq(documentsTable.id, docId));
        await tx.update(casesTable).set({ hasAnalysis: true }).where(eq(casesTable.id, caseId));
        await tx.delete(courtSessionsTable).where(eq(courtSessionsTable.caseId, caseId));
        await seedInCourtSimulation(tx, caseId, docId);
      });
      logger.info({ caseId }, "Indiana demo case restored");
      return;
    }

    logger.info("Seeding Indiana demo case...");
    await db.transaction(async (tx) => {
      const [inCase] = await tx.insert(casesTable).values({
        title: "State v. Terrell Mitchell — IN DEMO",
        defendantName: "Terrell Damon Mitchell",
        caseNumber: IN_DEMO_CASE_NUMBER,
        jurisdiction: "Marion County Superior Court, Criminal Division 6, State of Indiana",
        notes: "DEMO CASE — Indiana post-conviction example showcasing the Indiana P-C.R. 1 relief pathway, 7th Circuit federal ladder, and Indiana-specific executive relief options including the Parole Board pardon process and Second Chance Law expungement.",
        hasAnalysis: true,
        hasMotion: false,
      }).returning();

      const [inDoc] = await tx.insert(documentsTable).values({
        caseId: inCase.id,
        title: "Jury Trial Transcript — Day 2, September 8, 2020",
        documentType: "transcript",
        content: IN_DEMO_TRANSCRIPT,
        status: "analyzed",
      }).returning();

      for (const f of IN_DEMO_FINDINGS) {
        await tx.insert(findingsTable).values({ caseId: inCase.id, documentId: inDoc.id, issueTitle: f.issueTitle, transcriptExcerpt: f.transcriptExcerpt, legalAnalysis: f.legalAnalysis, pageNumber: f.pageNumber, lineNumber: f.lineNumber, precedentName: f.precedentName, precedentCitation: f.precedentCitation, precedentType: f.precedentType, courtRuling: f.courtRuling, materialSimilarity: f.materialSimilarity, proceduralStatus: f.proceduralStatus, anticipatedBlock: f.anticipatedBlock, breakthroughArgument: f.breakthroughArgument, legalVehicle: f.legalVehicle, survivability: f.survivability });
      }

      await tx.update(documentsTable).set({ findingCount: IN_DEMO_FINDINGS.length }).where(eq(documentsTable.id, inDoc.id));
      await seedInCourtSimulation(tx, inCase.id, inDoc.id);
      logger.info({ caseId: inCase.id }, "Indiana demo case seeded successfully");
    });
  } catch (err) {
    logger.error({ err }, "Failed to seed Indiana demo case");
  }
}

// ─────────────────────────────────────────────────────────────────
// IOWA DEMO CASE
// ─────────────────────────────────────────────────────────────────

const IA_DEMO_CASE_NUMBER = "DEMO-IA-2019FECR001847";

const IA_DEMO_TRANSCRIPT = `STATE OF IOWA
IOWA DISTRICT COURT FOR POLK COUNTY

STATE OF IOWA,
    Plaintiff,

    vs.                                             Case No. FECR319847

DENISE RENÉE CARVER,
    Defendant.

TRANSCRIPT OF JURY TRIAL — DAY 3
Honorable Thomas R. Callahan, Presiding
November 19, 2019

Appearances:
    For the State: Assistant County Attorney Patricia Morrow
    For the Defense: Attorney Gregory Stahl
    Court Reporter: Anne-Marie Wieczorek

---

THE COURT: We're back on the record. Ms. Morrow, call your next witness.

MS. MORROW: The State calls Agent Dale Whitmore.

DIRECT EXAMINATION BY MS. MORROW:

Page 31, Line 1
Q: Agent Whitmore, you were the case agent for the Iowa Division of Narcotics Enforcement in this investigation?
A: Yes, I supervised the confidential informant operation targeting the defendant.

Q: Can you describe the operation?
A: We deployed Confidential Informant 44 — CI-44 — to make a series of controlled buys from the defendant beginning in August 2019. CI-44 made three successful purchases of methamphetamine, each recorded and documented.

Q: What happened after the controlled buys?
A: We executed a search warrant on the defendant's residence at 4721 Southeast 14th Street on October 9, 2019. We recovered 312 grams of methamphetamine, a digital scale, and $8,400 in cash.

Page 31, Line 22
Q: Did CI-44 testify in this case?
A: CI-44 is not testifying in exchange for the work performed — that was the agreement. The recordings speak for themselves.

Q: Were there any concerns about CI-44's reliability?
A: None that affected our investigation. CI-44 had been used in two prior cases with successful prosecutions.

Page 32, Line 9
Q: No further questions.

CROSS-EXAMINATION BY MR. STAHL:

Q: Agent Whitmore, is CI-44's identity known to defense counsel?
A: That information was protected under Iowa Code § 80.13 as law enforcement sensitive.

Q: So the defense has never been told who made these recorded purchases?
A: The recordings were disclosed. The informant's identity was protected.

Page 32, Line 22
Q: Did CI-44 provide any written statement about the transactions?
A: CI-44 provided post-buy debriefs to me.

Q: Were those debrief reports produced to the defense?
A: The relevant portions were summarized in my report.

Q: The actual debrief reports — the documents CI-44 signed — were those produced?
A: Those are law enforcement sensitive.

Page 33, Line 8
Q: Agent Whitmore, did CI-44 at any point express doubt about whether the person who made the sales was in fact Denise Carver?
A: I — CI-44 expressed some uncertainty after the third buy, yes.

Q: CI-44 expressed uncertainty about the seller's identity after the third buy?
A: It was resolved internally.

Q: "Resolved internally" — meaning what?
A: I reviewed the recording and concluded the identification was sound.

Page 33, Line 24
Q: So CI-44 told you there was uncertainty about who made the sale and you resolved that uncertainty yourself?
A: The recording corroborates the identification.

Q: Was CI-44's uncertainty documented in the debrief report?
A: I don't recall the exact wording.

Q: Was the fact that CI-44 expressed post-transaction doubt about the seller's identity disclosed to defense counsel in any form?
A: I don't believe that specific statement was separately disclosed.

Page 34, Line 12
MR. STAHL: Your Honor, at this time the defense requests an immediate production of the full CI-44 debrief reports, including any statements about identification uncertainty.

MS. MORROW: Your Honor, those materials are protected under Iowa's informant privilege statute.

THE COURT: I will review the documents in camera. We'll take a short recess.

[RECESS]

THE COURT: I have reviewed the CI-44 debrief materials in camera. I find that they are law enforcement sensitive and will not be produced to defense at this stage. However, Agent Whitmore's testimony about CI-44's uncertainty is now before the jury.

Page 35, Line 1
MR. STAHL: Your Honor, we renew our objection. The Brady obligation requires disclosure of all exculpatory information in the State's possession, including CI-44's uncertainty about whether Denise Carver was the seller.

THE COURT: Your objection is noted and preserved.

MR. STAHL: Defense has no further questions of this witness at this time.

THE COURT: Any redirect?

MS. MORROW: Briefly.

REDIRECT BY MS. MORROW:

Page 35, Line 12
Q: Agent Whitmore, the recordings of the controlled buys — those were verified to be authentic?
A: Yes. They were recorded on agency-issued equipment, handled by me, and the chain of custody is documented.

Q: And after reviewing the recording following CI-44's uncertainty, you were satisfied the seller in the recording was the defendant?
A: I was.

THE COURT: Witness excused.

[JURY VERDICT: GUILTY — November 20, 2019 — Delivery of a Controlled Substance (Methamphetamine) — Class B Felony]

THE COURT: Verdict recorded. Sentencing scheduled for January 14, 2020. Defendant is remanded.

[END OF TRANSCRIPT]
Certified by: Anne-Marie Wieczorek, Official Court Reporter
`;

const IA_DEMO_FINDINGS = [
  {
    issueTitle: "Brady Violation — Suppression of CI-44's Post-Transaction Identification Doubt",
    transcriptExcerpt: "CI-44 expressed some uncertainty after the third buy, yes. [...] I don't believe that specific statement was separately disclosed.",
    legalAnalysis: "Agent Whitmore conceded on cross-examination that after the third controlled buy, CI-44 expressed uncertainty about whether the seller was in fact Denise Carver. This uncertainty — the informant's own post-transaction doubt about the identity of the person who made the drug sale — was never disclosed to defense counsel. Under Brady v. Maryland, 373 U.S. 83 (1963), the prosecution has a constitutional duty to disclose all evidence favorable to the accused that is material to guilt or punishment. CI-44's uncertainty is not merely impeachment material — it directly attacks the foundational identification underlying the entire prosecution. The State's case rested on three controlled buys attributed to Carver based on CI-44's identification. If CI-44 expressed doubt after the third buy, that doubt extends retroactively to all three transactions. Agent Whitmore's decision to 'resolve' the uncertainty internally by reviewing the recording and reaching his own conclusion is not a Brady substitute. The Brady obligation belongs to the prosecution and cannot be satisfied by the investigating agent conducting a self-review of disputed evidence.",
    pageNumber: 33,
    lineNumber: 8,
    precedentName: "Brady v. Maryland",
    precedentCitation: "373 U.S. 83 (1963)",
    precedentType: "BINDING",
    courtRuling: "The prosecution's suppression of evidence favorable to an accused violates due process where the evidence is material to guilt or punishment; the duty applies regardless of the good or bad faith of the prosecution.",
    materialSimilarity: "The entirety of the State's case against Carver was built on CI-44's identification of her as the seller in three controlled buys. CI-44's own uncertainty about that identification — undisclosed to the defense — is the single most material piece of exculpatory evidence in the case. Defense counsel was denied the ability to cross-examine Agent Whitmore with the debrief language, seek an expert on recording identification, or investigate alternative identifications.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue that Whitmore's testimony about the uncertainty was, in fact, disclosed during cross-examination and that no separate document needed to be produced. State will also argue that the recording independently identifies Carver and that the uncertainty claim is immaterial given the physical evidence from the search.",
    breakthroughArgument: "Whitmore's in-court admission does not cure the Brady violation — the violation occurred before trial when defense received no disclosure of the uncertainty. Under United States v. Agurs, 427 U.S. 97 (1976), Brady suppression is measured at the time of trial preparation, not by what emerges through cross-examination at trial. Defense counsel who learns for the first time at trial that the State's key informant doubted the identification cannot adequately investigate, retain experts, or develop alternative theories. The Eighth Circuit in United States v. Spencer, 753 F.3d 746 (8th Cir. 2014), has affirmed that mid-trial disclosure of Brady material is constitutionally insufficient when it deprives the defense of meaningful investigative opportunity.",
    legalVehicle: "Iowa Code § 822.2 Post-Conviction Relief Application",
    survivability: "Strong",
  },
  {
    issueTitle: "Sixth Amendment — Denial of Right to Confront Accuser: Informant Identity and Debrief Suppression",
    transcriptExcerpt: "CI-44's identity was protected under Iowa Code § 80.13 as law enforcement sensitive. [...] The actual debrief reports — the documents CI-44 signed — those are law enforcement sensitive.",
    legalAnalysis: "The Sixth Amendment's Confrontation Clause guarantees defendants the right to confront the witnesses against them. CI-44 was not a peripheral witness — CI-44 was the State's primary identification witness who allegedly purchased methamphetamine directly from Carver on three occasions. The recordings were the State's centerpiece evidence. Yet Carver was denied: (1) CI-44's identity, preventing any investigation into motive, history, or reliability; (2) the signed debrief reports, preventing confrontation with CI-44's documented uncertainty; and (3) the ability to cross-examine CI-44 directly. Under Roviaro v. United States, 353 U.S. 53 (1957), the government's informant privilege must yield when the informant is a percipient participant in the charged transaction — not merely a tipster. Here, CI-44 was the alleged buyer in each sale. That makes CI-44 a material witness whose identity and statements go to the heart of guilt. The Iowa Supreme Court in State v. Demaray recognized that Roviaro requires disclosure of an informant's identity when the informant participated in the charged conduct and the defendant's ability to prepare a defense is substantially impaired without that identity.",
    pageNumber: 32,
    lineNumber: 9,
    precedentName: "Roviaro v. United States",
    precedentCitation: "353 U.S. 53 (1957)",
    precedentType: "BINDING",
    courtRuling: "The government's privilege to withhold an informant's identity must yield where the informant was an active participant in the crime charged and disclosure is relevant and helpful to the defense or essential to a fair determination of the cause.",
    materialSimilarity: "CI-44 was not a tipster — CI-44 allegedly participated in all three drug transactions as the buyer. Without CI-44's identity, Carver could not investigate whether CI-44 had a prior relationship with her, a history of false reporting, pending criminal charges that motivated cooperation, or bias against her. CI-44's identity is the predicate for any meaningful cross-examination, and its suppression throughout trial violated Roviaro and the Confrontation Clause.",
    proceduralStatus: "Preserved",
    anticipatedBlock: "State will argue that Iowa Code § 80.13 provides a statutory basis for informant identity protection, that the trial court conducted an in camera review and found the privilege applicable, and that the recordings provided adequate corroboration of guilt independent of any credibility issue with CI-44.",
    breakthroughArgument: "Roviaro is a federal constitutional floor that state privilege statutes cannot override. The trial court's in camera review addressed confidentiality — it did not apply the Roviaro balancing test to determine whether the defense need for CI-44's identity outweighed the government's interest in protection. On these facts — three transactions, CI-44 as sole percipient witness, and CI-44's own post-transaction doubt — Roviaro compels disclosure. Post-conviction counsel should seek the debrief documents through a § 822.2 application with an explicit Roviaro demand, supported by a declaration that the identification is the sole disputed issue.",
    legalVehicle: "Iowa Code § 822.2 Post-Conviction Relief Application",
    survivability: "Strong",
  },
  {
    issueTitle: "Ineffective Assistance of Counsel — Failure to Request Roviaro Hearing or Move to Dismiss for Brady Violation",
    transcriptExcerpt: "Defense has no further questions of this witness at this time. [...] Your objection is noted and preserved.",
    legalAnalysis: "Defense counsel Gregory Stahl preserved the Brady and disclosure objections on the record but took no additional remedial action. Stahl did not: (1) move for a mistrial based on the mid-trial Brady disclosure; (2) request a continuance to investigate CI-44's uncertainty; (3) seek a formal Roviaro hearing before trial commenced; or (4) retain an audio identification expert to challenge whether the recordings independently identified Carver. Under Strickland v. Washington, 466 U.S. 668 (1984), these omissions constitute deficient performance in a case where the entire identification rested on a confidential informant whose own uncertainty about the defendant's identity was never disclosed. A competent defense attorney in a narcotics delivery case where the State's entire case is built on an informant's controlled buys files a pre-trial Roviaro motion as a matter of course. The failure to do so here, combined with the failure to seek any remedy after Whitmore's mid-trial admission about CI-44's uncertainty, denied Carver any meaningful opportunity to challenge the identification.",
    pageNumber: 34,
    lineNumber: 12,
    precedentName: "Strickland v. Washington",
    precedentCitation: "466 U.S. 668 (1984)",
    precedentType: "BINDING",
    courtRuling: "Counsel renders ineffective assistance when performance falls below an objective standard of reasonableness and there is a reasonable probability that, but for the deficiency, the result of the proceeding would have been different.",
    materialSimilarity: "Stahl had every predicate to request a Roviaro hearing before trial — he knew the case rested on an informant's controlled buys. He preserved the Brady objection at trial but requested no remedy. The failure to move for a mistrial or continuance after Whitmore admitted the undisclosed uncertainty left the jury with the tainted identification unremedied. In a case turning entirely on identification, these failures meet both Strickland prongs.",
    proceduralStatus: "Unclear",
    anticipatedBlock: "State will argue Stahl made reasonable strategic decisions — a Roviaro hearing might have been denied, and a mistrial motion is a high-risk tactic that could have backfired. State will also argue that the recording independently identifies Carver and that any Strickland error was not prejudicial given the physical evidence from the search.",
    breakthroughArgument: "The physical evidence from the search — methamphetamine at the residence — does not independently connect Carver to the sales CI-44 allegedly witnessed. Possession charges require different proof than delivery charges. The jury convicted on delivery, which depended entirely on the CI-44 identifications. A pre-trial Roviaro motion had a substantial likelihood of success given that CI-44 was a participant, not a tipster. Post-conviction counsel should obtain Stahl's file to confirm whether a Roviaro motion was considered and why it was not filed.",
    legalVehicle: "Iowa Code § 822.2 Post-Conviction Relief Application",
    survivability: "Moderate",
  },
  {
    issueTitle: "Fourth Amendment — Probable Cause Deficiency: Warrant Dependent on Unverified Informant Reliability After Expressed Doubt",
    transcriptExcerpt: "CI-44 expressed some uncertainty after the third buy, yes. [...] I reviewed the recording and concluded the identification was sound. [...] None that affected our investigation.",
    legalAnalysis: "The search warrant for 4721 Southeast 14th Street was issued on the basis of three controlled buys attributed to Denise Carver by CI-44. Agent Whitmore's testimony reveals that after the third buy — the final predicate for the warrant — CI-44 expressed uncertainty about whether the seller was in fact Carver. Whitmore resolved this uncertainty internally by reviewing the recording himself. The warrant affidavit almost certainly did not disclose CI-44's post-third-buy uncertainty. Under Illinois v. Gates, 462 U.S. 213 (1983), and Franks v. Delaware, 438 U.S. 154 (1978), a warrant affidavit that omits material information bearing on probable cause — or contains misleading statements — may be challenged in a Franks hearing. The omission of CI-44's uncertainty from the warrant affidavit, combined with Whitmore's unilateral 'resolution' of the reliability question, potentially renders the warrant facially deficient on the third-buy predicate. If the third buy is excised, the remaining probable cause may be insufficient to support the warrant.",
    pageNumber: 33,
    lineNumber: 24,
    precedentName: "Franks v. Delaware",
    precedentCitation: "438 U.S. 154 (1978)",
    precedentType: "BINDING",
    courtRuling: "A defendant has the right to challenge a warrant affidavit if it contains deliberately or recklessly false or misleading statements; if the false material is excised and the remaining content does not support probable cause, the warrant must be voided and the seized evidence suppressed.",
    materialSimilarity: "Whitmore drafted the warrant affidavit after CI-44's uncertainty was expressed and after Whitmore 'resolved' it unilaterally. If the affidavit represented CI-44's reliability as unqualified, it omitted material information. The methamphetamine recovered from the search — the only physical evidence of possession — would be suppressed if the warrant falls. Without the search evidence, the delivery charge stands alone on the CI-44 identification.",
    proceduralStatus: "Defaulted",
    anticipatedBlock: "State will argue procedural default — the Franks issue was not raised in a pretrial suppression motion. State will also invoke the Leon good-faith exception: officers executing a warrant that appears facially valid are entitled to rely on it in good faith, and suppression is an inappropriate remedy.",
    breakthroughArgument: "The Franks defaulted issue is raised through the IAC vehicle: trial counsel's failure to investigate the warrant affidavit's accuracy — and to request a Franks hearing after Whitmore admitted on the stand that CI-44's uncertainty was not disclosed — independently constitutes deficient performance. Leon good-faith does not apply when the affiant was aware of material reliability information that was omitted. Post-conviction counsel should obtain the full warrant affidavit and compare it against Whitmore's trial testimony to determine whether omission of the uncertainty was reckless.",
    legalVehicle: "Iowa Code § 822.2 Post-Conviction Relief Application",
    survivability: "Moderate",
  },
];

const IA_DEMO_ROUNDS = [
  {
    roundNumber: 1,
    stateStrength: "MODERATE",
    defenseBurden: "Defense must establish that CI-44's post-transaction identification doubt constitutes Brady material, that it was suppressed, and that its suppression was material to the jury's guilty verdict on delivery charges.",
    stateArgument: "Your Honor, the State begins with a threshold framing point: the Brady claim here is not a classic suppression — Agent Whitmore disclosed CI-44's uncertainty during cross-examination at trial. The defense received this information. Under United States v. Bagley, 473 U.S. 667 (1985), Brady materiality is assessed on the totality of evidence, and the jury heard through Whitmore that CI-44 had some uncertainty. Defense counsel used that testimony in closing argument. There was no suppression of the kind Brady addresses.\n\nOn the merits: the recordings of the three controlled buys were authenticated, admitted, and played for the jury. The jury could assess for themselves whether the person in the recordings was Denise Carver. CI-44's uncertainty — noted and resolved by Whitmore — does not change what the jury saw and heard in the recordings. The physical evidence from the search — 312 grams of methamphetamine in the defendant's residence — corroborates the delivery charges independent of CI-44's identification.\n\nThe State asks this Court to find that Brady materiality is not established and to deny relief.",
    courtCommentary: "Counsel, I find the mid-trial disclosure argument unpersuasive. The Eighth Circuit has been clear that Brady violations are measured at the time of trial preparation, not by the moment disclosure finally occurs. Defense counsel who learns on cross-examination that the State's lead informant expressed post-transaction doubt about the identification cannot — in the minutes remaining before the jury resumes — adequately investigate, retain an expert, or develop alternative theories. The cure for Brady is meaningful pre-trial notice, not a mid-trial concession.\n\nOn the recordings: you ask me to accept that the jury could independently assess the identification from the recordings. But the recordings were authenticated and described by Whitmore — the same agent who unilaterally resolved CI-44's uncertainty. If CI-44's doubt was legitimate enough to record in a debrief, it was material enough for a jury to evaluate.\n\nI want the State to address one specific question: what was in the CI-44 debrief report concerning the third buy? The trial court reviewed it in camera but did not make detailed findings on what it said. Can the State represent to this Court what language the debrief actually used?",
    defenseResponse: "Your Honor, post-conviction counsel has submitted a § 822.2 application with a specific request for production of the full CI-44 debrief reports. If those documents reflect — as Whitmore's testimony strongly suggests — that CI-44 used language like 'I'm not sure it was her' or 'the person looked different than before,' that is textbook Brady material. Agent Whitmore's answer at trial — that the uncertainty was 'resolved internally' by his review of the recording — is precisely the kind of unilateral State action that Brady forbids. The State cannot be its own Brady arbiter.\n\nOn the recordings: the State produced recordings of transactions involving an unidentified buyer and an unidentified seller. The only link to Denise Carver was CI-44's identification. Without CI-44's reliable identification, the recordings are three drug sales by unidentified individuals. That is why CI-44's uncertainty is material — it goes to the entire identification framework the prosecution used.\n\nWe respectfully request this Court to order production of the full debrief materials as a predicate to a complete Brady determination.",
  },
  {
    roundNumber: 2,
    stateStrength: "WEAK",
    defenseBurden: "Defense must establish that the denial of CI-44's identity and the suppression of the full debrief reports violated Roviaro v. United States and the Confrontation Clause, causing constitutional prejudice.",
    stateArgument: "Your Honor, the State addresses the Roviaro and Confrontation Clause claims. Iowa Code § 80.13 protects informant identities to encourage cooperation in narcotics investigations. The trial court conducted an in camera review and upheld the privilege. The State's interest in protecting CI-44 is substantial — disclosure of CI-44's identity in a methamphetamine distribution case creates significant safety risks.\n\nOn the Confrontation Clause: CI-44 did not testify. The Confrontation Clause applies to witnesses who bear testimony at trial; an informant whose recordings are introduced through the authenticating agent is not a testimonial witness under Crawford v. Washington. The recordings were what the jury saw — not CI-44's hearsay statements.\n\nThe State submits that Roviaro does not mandate disclosure here. The recordings provided the jury with the direct evidence; CI-44's identity was not necessary to evaluate that evidence.",
    courtCommentary: "The Crawford argument misses the point the defense is raising. The Confrontation Clause issue is not about CI-44 testifying — it is about the defendant's ability to investigate and challenge the only person who identified her as the seller in the charged transactions. Roviaro explicitly addresses participant informants — it distinguishes between informants who merely tip off police and informants who participate in the charged conduct. CI-44 is the latter.\n\nI have significant concerns about whether the trial court's in camera review applied the Roviaro balancing test or merely assessed the Iowa statutory privilege. Those are different analyses. An in camera review that applies only state privilege law without asking whether the constitutional floor of Roviaro is satisfied is legally insufficient.\n\nThe debrief materials have now been produced to this Court under the § 822.2 order. I have reviewed them. CI-44's debrief following the third buy states — and I am reading directly — 'I am not certain the woman today was the same woman as the first two times. She seemed shorter.' This is not vague uncertainty. This is a specific identification doubt. The State's brief to this Court did not disclose that language. Counsel, I am giving the State an opportunity to address this directly.",
    defenseResponse: "Your Honor, the debrief language this Court has just read confirms everything the defense has argued. CI-44 — the State's sole identification witness — told Agent Whitmore after the third buy that she was not certain the woman was the same person as in the first two transactions. That is Brady material of the highest order. It directly attacks the reliability of the identification across all three charged deliveries, because if the third-buy seller may have been different, the question extends to whether the first and second were Denise Carver either.\n\nThe State did not disclose this language. The trial court's in camera review protected it. Defense counsel never saw it. The jury convicted on an identification the informant herself doubted, and that doubt was never put before them.\n\nWe respectfully submit this is the paradigm case for § 822.2 relief. The Brady violation is not technical — it is the suppression of the single fact that could have changed the verdict: the informant's own uncertainty about whether Denise Carver was the seller.",
  },
  {
    roundNumber: 3,
    stateStrength: "VERY WEAK",
    defenseBurden: "Defense must establish that the cumulative Brady and Roviaro violations, combined with the IAC failures, created prejudice sufficient to undermine confidence in the jury's verdict under the Iowa § 822.2 standard.",
    stateArgument: "Your Honor, the State acknowledges that the debrief language — now before this Court — is significant. The State does not dispute that Agent Whitmore characterized CI-44's statement as mere 'uncertainty' when the debrief used more specific language. The State submits that this Court should consider, however, that the jury convicted on the totality of the evidence: three controlled buys recorded on agency equipment, 312 grams of methamphetamine in the defendant's residence, and $8,400 in cash. The physical evidence corroborates the deliveries even if the identification is challenged. The State asks this Court to find no prejudice given the strength of the corroborating evidence.",
    courtCommentary: "I have heard this case over three rounds. The debrief language changes the legal analysis fundamentally. CI-44's statement that she was 'not certain the woman today was the same woman as the first two times' is not the 'some uncertainty' Agent Whitmore described at trial — it is a specific, documented doubt that a different person may have made the third sale. That language was in the State's possession throughout trial. It was not disclosed. The jury never had it.\n\nOn the corroboration argument: methamphetamine in a residence proves possession. The delivery charges required the jury to find that Denise Carver personally made three sales. CI-44's identification was the only evidence linking Carver to those sales as the seller. If CI-44 doubted that Carver was the seller on the third occasion, the jury was entitled to weigh that doubt — and they never got the chance.\n\nThis Court is prepared to rule. The Brady violation is established by the debrief language. The Roviaro violation is established by the trial court's failure to apply the federal constitutional balancing test to a participant informant. The IAC is established by trial counsel's failure to file a pre-trial Roviaro motion in a case where counsel knew the entire prosecution rested on an informant's controlled buys.\n\nThe conviction of Denise Carver cannot stand on this record.",
    defenseResponse: "Your Honor, we thank the Court for its thorough and careful review. Denise Carver has maintained throughout these proceedings that she did not make the sales attributed to her, and the debrief language this Court has reviewed confirms that the State's own informant shared that doubt. The Brady violation here is not a paperwork failure — it is the suppression of the single piece of evidence that most directly supported the defense.\n\nWe ask this Court to vacate the conviction, order production of all CI-44 materials in any retrial, and require that any future identification evidence comply with Iowa's discovery obligations and the Roviaro constitutional standard. Denise Carver deserves a trial at which the jury receives the complete truth about the reliability of the identification evidence used to convict her.",
  },
];

const IA_DEMO_VERDICT_SUMMARY = `After three rounds of argument in this Iowa Code § 822.2 post-conviction relief proceeding, this Court finds that the conviction of Denise Renée Carver cannot stand.

The Brady violation is established by the CI-44 debrief report, now before this Court, which states: 'I am not certain the woman today was the same woman as the first two times. She seemed shorter.' Agent Whitmore characterized this to the jury as vague 'uncertainty' that was 'resolved internally.' It was not vague — it was a specific doubt, recorded in writing, that a different person may have made the third controlled buy. That document was in the State's possession throughout trial and was never produced to defense counsel. This is Brady suppression. The language was material because the entire prosecution rested on CI-44's identification of Carver as the seller; CI-44's own documented doubt about that identification goes to the heart of the case.

The Roviaro violation is established by the trial court's in camera review, which applied Iowa's statutory informant privilege without conducting the federal constitutional balancing required by Roviaro v. United States. CI-44 was a participant informant — not a tipster — who allegedly purchased methamphetamine directly from the defendant on three occasions. Roviaro requires that the government's interest in protecting such an informant's identity yield when the informant is the only witness to the charged conduct and the defendant's ability to prepare a defense is substantially impaired. That standard was met here and the Roviaro disclosure obligation was not satisfied.

The ineffective assistance finding follows from trial counsel's failure to file a pre-trial Roviaro motion in a case where the entire prosecution rested on an informant's controlled buys — a foundational step in competent narcotics defense practice.

RULING: The conviction of Denise Renée Carver is VACATED. The matter is remanded for a new trial. The State is ordered to produce all CI-44 debrief reports and communications in any retrial. A Roviaro hearing shall be conducted before any retrial proceeds. DEFENSE WIN.`;

async function seedIaCourtSimulation(tx: Parameters<Parameters<typeof db.transaction>[0]>[0], caseId: number, docId: number): Promise<void> {
  const [session] = await tx.insert(courtSessionsTable).values({
    caseId,
    simulationMode: "postconviction_974",
    skepticMode: true,
    expandedRecord: false,
    pleaQuestionnaireNotes: null,
    documentIds: JSON.stringify([docId]),
    status: "completed",
    verdictRating: "DEFENSE WIN",
    verdictSummary: IA_DEMO_VERDICT_SUMMARY,
    defenseWon: true,
    totalRounds: IA_DEMO_ROUNDS.length,
  }).returning();
  for (const r of IA_DEMO_ROUNDS) {
    await tx.insert(courtRoundsTable).values({
      sessionId: session.id,
      roundNumber: r.roundNumber,
      stateStrength: r.stateStrength,
      defenseBurden: r.defenseBurden,
      stateArgument: r.stateArgument,
      courtCommentary: r.courtCommentary,
      defenseResponse: r.defenseResponse,
    });
  }
}

export async function seedIowaDemoCase(): Promise<void> {
  try {
    const existing = await db
      .select({ id: casesTable.id })
      .from(casesTable)
      .where(eq(casesTable.caseNumber, IA_DEMO_CASE_NUMBER))
      .limit(1);

    if (existing.length > 0) {
      const caseId = existing[0].id;
      const demoDoc = await db
        .select({ id: documentsTable.id, status: documentsTable.status, findingCount: documentsTable.findingCount })
        .from(documentsTable)
        .where(eq(documentsTable.caseId, caseId))
        .limit(1)
        .then((rows) => rows[0] ?? null);

      const needsRestore = !demoDoc || demoDoc.status === "error" || demoDoc.status === "pending" || (demoDoc.findingCount ?? 0) === 0;
      if (!needsRestore) {
        const existingSession = await db
          .select({ id: courtSessionsTable.id })
          .from(courtSessionsTable)
          .where(eq(courtSessionsTable.caseId, caseId))
          .limit(1)
          .then((rows) => rows[0] ?? null);
        if (!existingSession) {
          logger.info({ caseId }, "Iowa demo case missing court simulation — seeding session...");
          await db.transaction(async (tx) => {
            await seedIaCourtSimulation(tx, caseId, demoDoc!.id);
          });
          logger.info({ caseId }, "Iowa demo court simulation seeded");
        } else {
          logger.info({ caseId }, "Iowa demo case already exists and is healthy — skipping seed");
        }
        return;
      }

      logger.info({ caseId }, "Iowa demo case is corrupted — restoring...");
      await db.transaction(async (tx) => {
        let docId: number;
        if (!demoDoc) {
          const [newDoc] = await tx.insert(documentsTable).values({ caseId, title: "Jury Trial Transcript — Day 3, November 19, 2019", documentType: "transcript", content: IA_DEMO_TRANSCRIPT, status: "analyzed" }).returning();
          docId = newDoc.id;
        } else {
          docId = demoDoc.id;
          await tx.delete(findingsTable).where(eq(findingsTable.documentId, docId));
        }
        for (const f of IA_DEMO_FINDINGS) {
          await tx.insert(findingsTable).values({ caseId, documentId: docId, issueTitle: f.issueTitle, transcriptExcerpt: f.transcriptExcerpt, legalAnalysis: f.legalAnalysis, pageNumber: f.pageNumber, lineNumber: f.lineNumber, precedentName: f.precedentName, precedentCitation: f.precedentCitation, precedentType: f.precedentType, courtRuling: f.courtRuling, materialSimilarity: f.materialSimilarity, proceduralStatus: f.proceduralStatus, anticipatedBlock: f.anticipatedBlock, breakthroughArgument: f.breakthroughArgument, legalVehicle: f.legalVehicle, survivability: f.survivability });
        }
        await tx.update(documentsTable).set({ status: "analyzed", findingCount: IA_DEMO_FINDINGS.length }).where(eq(documentsTable.id, docId));
        await tx.update(casesTable).set({ hasAnalysis: true }).where(eq(casesTable.id, caseId));
        await tx.delete(courtSessionsTable).where(eq(courtSessionsTable.caseId, caseId));
        await seedIaCourtSimulation(tx, caseId, docId);
      });
      logger.info({ caseId }, "Iowa demo case restored");
      return;
    }

    logger.info("Seeding Iowa demo case...");
    await db.transaction(async (tx) => {
      const [iaCase] = await tx.insert(casesTable).values({
        title: "State v. Denise Carver — IA DEMO",
        defendantName: "Denise Renée Carver",
        caseNumber: IA_DEMO_CASE_NUMBER,
        jurisdiction: "Iowa District Court for Polk County, State of Iowa",
        notes: "DEMO CASE — Iowa post-conviction example showcasing the Iowa Code § 822.2 relief pathway, 8th Circuit federal ladder, and Iowa-specific executive relief options including the Board of Parole and Governor's pardon process.",
        hasAnalysis: true,
        hasMotion: false,
      }).returning();

      const [iaDoc] = await tx.insert(documentsTable).values({
        caseId: iaCase.id,
        title: "Jury Trial Transcript — Day 3, November 19, 2019",
        documentType: "transcript",
        content: IA_DEMO_TRANSCRIPT,
        status: "analyzed",
      }).returning();

      for (const f of IA_DEMO_FINDINGS) {
        await tx.insert(findingsTable).values({ caseId: iaCase.id, documentId: iaDoc.id, issueTitle: f.issueTitle, transcriptExcerpt: f.transcriptExcerpt, legalAnalysis: f.legalAnalysis, pageNumber: f.pageNumber, lineNumber: f.lineNumber, precedentName: f.precedentName, precedentCitation: f.precedentCitation, precedentType: f.precedentType, courtRuling: f.courtRuling, materialSimilarity: f.materialSimilarity, proceduralStatus: f.proceduralStatus, anticipatedBlock: f.anticipatedBlock, breakthroughArgument: f.breakthroughArgument, legalVehicle: f.legalVehicle, survivability: f.survivability });
      }

      await tx.update(documentsTable).set({ findingCount: IA_DEMO_FINDINGS.length }).where(eq(documentsTable.id, iaDoc.id));
      await seedIaCourtSimulation(tx, iaCase.id, iaDoc.id);
      logger.info({ caseId: iaCase.id }, "Iowa demo case seeded successfully");
    });
  } catch (err) {
    logger.error({ err }, "Failed to seed Iowa demo case");
  }
}
