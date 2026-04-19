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
