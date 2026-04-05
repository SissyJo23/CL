import { db, casesTable, documentsTable, findingsTable, crossCaseMatchesTable, courtSessionsTable, courtRoundsTable, motionsTable } from "@workspace/db";
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

export async function seedDemoCase(): Promise<void> {
  try {
    const existing = await db
      .select({ id: casesTable.id })
      .from(casesTable)
      .where(eq(casesTable.caseNumber, DEMO_CASE_NUMBER))
      .limit(1);

    if (existing.length > 0) {
      logger.info({ caseId: existing[0].id }, "Demo case already exists — skipping seed");
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
