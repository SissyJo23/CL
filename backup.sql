--
-- PostgreSQL database dump
--

\restrict w2Y58Lj7FeuHvQKkaxjY9qnJMhkGRJxEYzpoAInwktJ63cpXoCRmKT4yjHRDqNU

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analysis_runs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analysis_runs (
    id integer NOT NULL,
    case_id integer NOT NULL,
    document_id integer NOT NULL,
    model text NOT NULL,
    input_tokens integer DEFAULT 0 NOT NULL,
    output_tokens integer DEFAULT 0 NOT NULL,
    duration_ms integer DEFAULT 0 NOT NULL,
    findings_returned integer DEFAULT 0 NOT NULL,
    findings_dropped integer DEFAULT 0 NOT NULL,
    findings_verified integer DEFAULT 0 NOT NULL,
    findings_unverified integer DEFAULT 0 NOT NULL,
    findings_no_index integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'success'::text NOT NULL,
    error_message text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.analysis_runs OWNER TO postgres;

--
-- Name: analysis_runs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.analysis_runs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.analysis_runs_id_seq OWNER TO postgres;

--
-- Name: analysis_runs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.analysis_runs_id_seq OWNED BY public.analysis_runs.id;


--
-- Name: case_strategies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.case_strategies (
    id integer NOT NULL,
    case_id integer NOT NULL,
    cumulative_error_brief text NOT NULL,
    strategic_roadmap text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.case_strategies OWNER TO postgres;

--
-- Name: case_strategies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.case_strategies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.case_strategies_id_seq OWNER TO postgres;

--
-- Name: case_strategies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.case_strategies_id_seq OWNED BY public.case_strategies.id;


--
-- Name: cases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cases (
    id integer NOT NULL,
    title text NOT NULL,
    defendant_name text,
    case_number text,
    jurisdiction text,
    notes text,
    has_analysis boolean DEFAULT false NOT NULL,
    has_motion boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cases OWNER TO postgres;

--
-- Name: cases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cases_id_seq OWNER TO postgres;

--
-- Name: cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cases_id_seq OWNED BY public.cases.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    badge_label text NOT NULL,
    description text,
    color text DEFAULT 'blue'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: court_rounds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.court_rounds (
    id integer NOT NULL,
    session_id integer NOT NULL,
    round_number integer NOT NULL,
    state_strength text NOT NULL,
    defense_burden text NOT NULL,
    state_argument text NOT NULL,
    court_commentary text NOT NULL,
    defense_response text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.court_rounds OWNER TO postgres;

--
-- Name: court_rounds_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.court_rounds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.court_rounds_id_seq OWNER TO postgres;

--
-- Name: court_rounds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.court_rounds_id_seq OWNED BY public.court_rounds.id;


--
-- Name: court_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.court_sessions (
    id integer NOT NULL,
    case_id integer NOT NULL,
    simulation_mode text NOT NULL,
    skeptic_mode boolean DEFAULT false NOT NULL,
    expanded_record boolean DEFAULT false NOT NULL,
    plea_questionnaire_notes text,
    document_ids text DEFAULT '[]'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    verdict_rating text,
    verdict_summary text,
    defense_won boolean,
    total_rounds integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.court_sessions OWNER TO postgres;

--
-- Name: court_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.court_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.court_sessions_id_seq OWNER TO postgres;

--
-- Name: court_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.court_sessions_id_seq OWNED BY public.court_sessions.id;


--
-- Name: cross_case_matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cross_case_matches (
    id integer NOT NULL,
    finding_id integer NOT NULL,
    source_document_id integer NOT NULL,
    source_document_title text NOT NULL,
    matched_passage text NOT NULL,
    explanation text NOT NULL,
    relevance_score numeric DEFAULT '0'::numeric NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cross_case_matches OWNER TO postgres;

--
-- Name: cross_case_matches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cross_case_matches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cross_case_matches_id_seq OWNER TO postgres;

--
-- Name: cross_case_matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cross_case_matches_id_seq OWNED BY public.cross_case_matches.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    case_id integer NOT NULL,
    title text NOT NULL,
    document_type text DEFAULT 'other'::text NOT NULL,
    content text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    finding_count integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    word_data jsonb,
    pdf_storage_path text
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO postgres;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: findings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.findings (
    id integer NOT NULL,
    document_id integer NOT NULL,
    case_id integer NOT NULL,
    issue_title text NOT NULL,
    transcript_excerpt text NOT NULL,
    legal_analysis text NOT NULL,
    precedent_name text,
    precedent_citation text,
    precedent_type text,
    court_ruling text,
    material_similarity text,
    category_id integer,
    user_notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    page_number integer,
    line_number integer,
    procedural_status text,
    anticipated_block text,
    breakthrough_argument text,
    legal_vehicle text,
    survivability text,
    bbox_data jsonb,
    citation_verified boolean
);


ALTER TABLE public.findings OWNER TO postgres;

--
-- Name: findings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.findings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.findings_id_seq OWNER TO postgres;

--
-- Name: findings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.findings_id_seq OWNED BY public.findings.id;


--
-- Name: motions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.motions (
    id integer NOT NULL,
    case_id integer NOT NULL,
    session_id integer,
    title text NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.motions OWNER TO postgres;

--
-- Name: motions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.motions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.motions_id_seq OWNER TO postgres;

--
-- Name: motions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.motions_id_seq OWNED BY public.motions.id;


--
-- Name: analysis_runs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analysis_runs ALTER COLUMN id SET DEFAULT nextval('public.analysis_runs_id_seq'::regclass);


--
-- Name: case_strategies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_strategies ALTER COLUMN id SET DEFAULT nextval('public.case_strategies_id_seq'::regclass);


--
-- Name: cases id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases ALTER COLUMN id SET DEFAULT nextval('public.cases_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: court_rounds id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.court_rounds ALTER COLUMN id SET DEFAULT nextval('public.court_rounds_id_seq'::regclass);


--
-- Name: court_sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.court_sessions ALTER COLUMN id SET DEFAULT nextval('public.court_sessions_id_seq'::regclass);


--
-- Name: cross_case_matches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cross_case_matches ALTER COLUMN id SET DEFAULT nextval('public.cross_case_matches_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: findings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.findings ALTER COLUMN id SET DEFAULT nextval('public.findings_id_seq'::regclass);


--
-- Name: motions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.motions ALTER COLUMN id SET DEFAULT nextval('public.motions_id_seq'::regclass);


--
-- Data for Name: analysis_runs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analysis_runs (id, case_id, document_id, model, input_tokens, output_tokens, duration_ms, findings_returned, findings_dropped, findings_verified, findings_unverified, findings_no_index, status, error_message, created_at) FROM stdin;
\.


--
-- Data for Name: case_strategies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.case_strategies (id, case_id, cumulative_error_brief, strategic_roadmap, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: cases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cases (id, title, defendant_name, case_number, jurisdiction, notes, has_analysis, has_motion, created_at, updated_at) FROM stdin;
2	State v. Marcus Johnson — DEMO	Marcus Deon Johnson	2021CF003117	Milwaukee County Circuit Court, State of Wisconsin	DEMO CASE — Pre-loaded example showing CaseLight's full analysis capabilities. This case contains realistic findings, court simulation, and motion generation based on a fictional post-conviction scenario.	t	t	2026-04-08 02:30:11.807478	2026-04-08 02:30:11.807478
1	State v. Marcus Johnson — DEMO	Marcus Deon Johnson	MKE-2018CF000847	Milwaukee County Circuit Court, State of Wisconsin	\N	t	t	2026-04-05 22:50:07.166501	2026-04-05 22:50:07.166501
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, badge_label, description, color, created_at) FROM stdin;
1	Miranda/5th Amendment	Miranda	Violations of Miranda rights and Fifth Amendment self-incrimination protections	red	2026-04-06 04:06:03.964173
2	Brady/Giglio	Brady	Suppression of exculpatory or impeachment evidence by the prosecution	orange	2026-04-06 04:06:03.964173
3	IAC — Trial Counsel	IAC Trial	Ineffective assistance of trial counsel under Strickland v. Washington	yellow	2026-04-06 04:06:03.964173
4	IAC — Appellate Counsel	IAC Appeal	Ineffective assistance of appellate counsel	yellow	2026-04-06 04:06:03.964173
5	Prosecutorial Misconduct	Pros. Misconduct	Improper conduct by the prosecution during trial or investigation	red	2026-04-06 04:06:03.964173
6	4th Amendment	4th Amend.	Unlawful searches and seizures in violation of the Fourth Amendment	blue	2026-04-06 04:06:03.964173
7	Confrontation Clause	Confrontation	Violations of the Sixth Amendment right to confront witnesses	blue	2026-04-06 04:06:03.964173
8	Jury Instructions	Jury Instr.	Erroneous or misleading jury instructions affecting the verdict	purple	2026-04-06 04:06:03.964173
9	Chain of Custody	Chain of Custody	Breaks or irregularities in evidence chain of custody	gray	2026-04-06 04:06:03.964173
10	Eyewitness Identification	Eyewitness ID	Unreliable or improperly obtained eyewitness identifications	orange	2026-04-06 04:06:03.964173
11	Coerced Confession	Coerced Conf.	Confessions obtained through coercion, duress, or improper inducement	red	2026-04-06 04:06:03.964173
12	Sentencing Error	Sentencing	Legal errors in sentencing, including improper enhancements or calculations	purple	2026-04-06 04:06:03.964173
13	Jury Selection/Batson	Batson	Discriminatory use of peremptory challenges under Batson v. Kentucky	teal	2026-04-06 04:06:03.964173
14	Forensic/Scientific Evidence	Forensic	Issues with forensic or scientific evidence reliability and admissibility	green	2026-04-06 04:06:03.964173
15	Newly Discovered Evidence	New Evidence	Evidence discovered after trial that could affect the verdict	green	2026-04-06 04:06:03.964173
16	Actual Innocence	Actual Innocence	Claims of factual innocence supported by new or overlooked evidence	green	2026-04-06 04:06:03.964173
17	Double Jeopardy	Double Jeopardy	Prosecution or punishment in violation of double jeopardy protections	blue	2026-04-06 04:06:03.964173
18	Speedy Trial	Speedy Trial	Violations of the Sixth Amendment right to a speedy trial	blue	2026-04-06 04:06:03.964173
19	Government Informant	Informant	Issues with undisclosed or unreliable government informants	orange	2026-04-06 04:06:03.964173
20	Due Process	Due Process	Violations of procedural or substantive due process rights	blue	2026-04-06 04:06:03.964173
21	Expert Witness	Expert Witness	Improper admission or exclusion of expert witness testimony	gray	2026-04-06 04:06:03.964173
22	Cumulative Error	Cumulative Error	Prejudice resulting from the cumulative effect of multiple trial errors	purple	2026-04-06 04:06:03.964173
23	Plea Voluntariness	Plea	Challenges to the knowing or voluntary nature of a guilty plea	yellow	2026-04-06 04:06:03.964173
24	Conflict of Interest	Conflict	Defense counsel operating under an actual or potential conflict of interest	red	2026-04-06 04:06:03.964173
\.


--
-- Data for Name: court_rounds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.court_rounds (id, session_id, round_number, state_strength, defense_burden, state_argument, court_commentary, defense_response, created_at) FROM stdin;
1	1	1	MODERATE	Defense must demonstrate that the Miranda invocation was sufficiently clear to trigger the Edwards rule and that the resulting statement was not harmless beyond a reasonable doubt.	Your Honor, the State will address the procedural posture before reaching the merits. Defense counsel raises a Miranda claim for the first time in post-conviction proceedings, which raises an immediate Escalona-Naranjo procedural bar — this claim was never raised on direct appeal, and no sufficient reason has been offered for that failure. The claim is forfeited.\n\nOn the merits, even if this Court entertains the Miranda argument, Davis v. United States, 512 U.S. 452 (1994), requires that a request for counsel be unambiguous. 'Maybe I should talk to someone' is a textbook equivocal statement. Detective Rodriguez, a 17-year veteran, made a reasonable, good-faith judgment that no invocation had occurred. The Supreme Court in Davis was explicit: an ambiguous statement does not require police to stop questioning.\n\nFinally, even if error occurred, it was harmless beyond a reasonable doubt under Chapman v. California. The statement obtained was that Johnson 'wasn't anywhere near the scene' — a denial he repeated from the witness stand. The statement was cumulative of his own testimony and added nothing to the State's case that the physical evidence and eyewitness identifications did not already establish.	Counsel, I have concerns about the procedural posture. Mr. Johnson — the record indicates this Miranda claim was not raised at trial by objection at the time the statement was admitted, nor on direct appeal. Walk me through your cause-and-prejudice argument for overcoming Escalona-Naranjo.\n\nOn the Davis question, I'm also troubled by the 'maybe I should' formulation. The Supreme Court was quite clear in Davis. However, I note that Rodriguez's own testimony raises a factual question — he acknowledged the statement, acknowledged he continued questioning, and acknowledged he made a personal judgment. Can defense speak to whether the trial court was ever asked to make a finding on this issue?\n\nFinally, on harmless error — the State argues the statement was cumulative. Is that accurate? Was any portion of that statement not covered by Johnson's own testimony?	Your Honor, we go directly to cause and prejudice for Escalona-Naranjo. The sufficient reason for not raising this claim on direct appeal is the ineffective assistance of appellate counsel — counsel who also failed to raise it and whose deficiency is itself an independent IAC claim. Under State v. Romero-Georgana, 2014 WI 83, IAC of appellate counsel constitutes cause sufficient to overcome Escalona-Naranjo. That independently viable claim unlocks the procedural gateway.\n\nOn Davis — the State reads Davis too broadly. Davis established a clarity requirement for ambiguous invocations, but it did not eliminate the obligation to clarify when the circumstances create ambiguity. More importantly, Wisconsin courts applying Davis look at the totality of the circumstances. Here, the detective himself acknowledged uncertainty — 'he said something like' — and chose to press on. That choice, made without clarification, cannot be insulated from constitutional review.\n\nOn harmless error under Chapman, the State is wrong that the statement was cumulative. Johnson's trial testimony denied presence at the scene, but the statement to Rodriguez included details about his location that were used to undermine his alibi at trial. Those details — extracted after the invocation — were used in closing argument against him. The error was not harmless.	2026-04-05 22:50:07.249114
2	1	2	MINIMAL	Defense must demonstrate materiality of the Whitfield statement under the Brady standard — that there is a reasonable probability the result would have been different had the statement been disclosed.	Your Honor, on the Brady claim regarding the Whitfield statement, the State's position is straightforward: materiality is not established here. Under Strickler v. Greene, 527 U.S. 263 (1999), the defendant must show a reasonable probability — not merely a possibility — that disclosure would have produced a different result. The State had two additional eyewitnesses who unequivocally identified Johnson. One equivocal witness, even if fully disclosed and presented, does not undermine the strength of two consistent identifications plus the physical evidence of the firearm in Johnson's vehicle.\n\nMoreover, Detective Rodriguez testified that the Whitfield statement was 'in the file.' Defense counsel had an obligation to review the complete discovery file and request any witness statements. If the statement was not produced, the appropriate remedy was a pretrial motion to compel — not a post-conviction Brady claim.\n\nThe State also raises AEDPA deference: the state courts found no Brady violation. That determination is entitled to deference under 28 U.S.C. § 2254(d). Defense must show not merely that the state court was wrong, but that it unreasonably applied clearly established federal law.	I'm going to stop the State right there on the 'in the file' argument. Detective Rodriguez testified on the stand that 'we didn't use his statement' — that is not a disclosure. That is the opposite of disclosure. If the statement was deliberately set aside by the investigating detective and never produced to defense counsel, the State cannot now argue that defense had constructive knowledge of it.\n\nThe materiality question is harder. Counsel, what is the full record of the eyewitness evidence? The Whitfield statement expresses doubt — how does that interact with the other two identifications? And can you tell me whether defense counsel made any inquiry into the Whitfield statement before or during trial beyond the objection I see on the record?	Your Honor, the State's AEDPA argument fails because the state court did not conduct a proper Brady materiality analysis — it denied the claim in a summary order without opinion. Under Harrington v. Richter, 562 U.S. 86 (2011), a summary denial is still entitled to deference, but where the state court's analysis is facially incomplete — as it is here — the federal court conducts a more searching review.\n\nOn materiality: the Brady analysis requires looking at the suppressed evidence in the context of the entire record. The State had two consistent eyewitnesses and one equivocal one. But eyewitness identification is the most contested category of evidence in criminal law. Under Perry v. New Hampshire, 565 U.S. 228 (2012), the reliability of eyewitness evidence is precisely the kind of issue juries must weigh carefully. A third eyewitness expressing doubt does not merely reduce the State's case by one-third — it creates reasonable doubt about the reliability of the entire identification framework.\n\nDetective Rodriguez's admission — 'we didn't use his statement' — is tantamount to an admission of willful suppression under Giglio. Willful suppression is sufficient for Brady materiality without needing to quantify the precise impact.	2026-04-05 22:50:07.252846
3	1	3	MODERATE	Defense must show that trial counsel's failure to investigate alibi witnesses fell below an objective standard of reasonableness AND that there is a reasonable probability of a different outcome had those witnesses testified.	Your Honor, on the IAC claim regarding alibi witnesses, the State raises three arguments. First, under Strickland, the deficiency prong requires overcoming a strong presumption of competence. We do not know why Attorney Bowes did not call Terrence Webb — we have no affidavit from Bowes, no hearing record, nothing. Defense asks this court to assume the worst about trial counsel based on a cold record. That is not how Strickland works. Under Harrington, courts must presume that an unelucidated decision reflects a strategic choice. Perhaps Bowes interviewed Webb and found him to be a bad witness. We simply do not know.\n\nSecond, on prejudice — the alibi was presented through Johnson's own testimony. The jury heard the alibi and rejected it. There is no reason to believe a corroborating witness would have changed that outcome when the jury already chose to disbelieve the defendant's version of events.\n\nThird, the Escalona-Naranjo bar applies here even more forcefully — this claim was clearly available on direct appeal.	On the question of why counsel did not call alibi witnesses — both sides are speculating in the absence of a Machner hearing. Counsel, why has no Machner hearing been requested or held? The record on this IAC claim is thin.\n\nOn the Strickland prejudice question, I want to hear from defense specifically on the 'why would the jury have changed its mind' question. The jury heard Johnson's alibi from his own mouth and convicted him. What does adding Webb's testimony actually change in the analysis?\n\nI'll also note for the record that the prosecutor's closing argument specifically capitalized on the absence of Webb: 'No Terrence Webb came here to testify. Why? Because there is no Terrence Webb who can help this man.' If Webb had testified, that entire closing argument — which I would characterize as substantial — disappears from the jury's deliberations.	Your Honor, the absence of a Machner hearing is itself attributable to the failures of postconviction counsel. We are requesting a Machner evidentiary hearing as part of this proceeding — we are not asking this Court to decide the IAC claim on the cold record alone.\n\nOn the prejudice prong — the Court has itself identified the key point. The prosecution's entire closing attack on the alibi was built on Webb's absence. 'There is no Terrence Webb who can help this man.' That is not a minor rhetorical point — it is the State's explicit argument to the jury that the alibi was fabricated. If Webb had testified, that argument never gets made, and the jury deliberates on a fundamentally different record.\n\nUnder Wiggins v. Smith, 539 U.S. 510 (2003), the failure to investigate is not strategic when counsel has no record of any investigation at all. Bowes filed no investigative notes, no subpoenas, no correspondence with Webb. Under those circumstances, Strickland's presumption of strategy has nothing to attach to. The claim survives to a Machner hearing.	2026-04-05 22:50:07.256117
4	1	4	MINIMAL	Defense must demonstrate that the combined effect of all errors, taken together, denied Marcus Johnson a fundamentally fair trial.	Your Honor, in closing, the State acknowledges this was not a perfect trial. But imperfect trials are not unconstitutional trials. Each of the errors defense has raised either was properly preserved and addressed, was waived, or was harmless in the context of the overall evidence. The cumulative error doctrine, as this Court knows, does not transform a collection of individually non-reversible errors into a reversible one. Under State v. Thiel, 2003 WI 111, cumulative error analysis requires each claimed error to be an actual error — and we have contested each one. The conviction of Marcus Johnson was supported by eyewitness identification, physical evidence, and his own inability to produce corroboration. This Court should affirm.	I have heard four rounds of argument in this matter. I want to state for the record that several of the issues raised here are serious and troubling. The Brady question, in particular, rests on Detective Rodriguez's own testimony that he deliberately set aside the Whitfield statement. That is not a close question on the facts.\n\nI am prepared to rule. My ruling will address the Brady claim as the clearest basis for relief, with observations on the Miranda and IAC claims as independent alternative grounds. The cumulative error argument provides additional support for the conclusion I have reached.\n\nI will note that the system worked exactly as defense counsel described in their opening — the fight for the state ended at sentencing, and Marcus Johnson has been fighting uphill ever since. That does not change the law, but it does remind me of why this review function exists.	Your Honor, we rest on the argument. Marcus Johnson has been incarcerated for six years on a conviction built on a suppressed witness statement, a Miranda violation this Court now has the record to see clearly, and an alibi that was never properly investigated. We are asking this Court to do what the trial court could not: give him a fair proceeding. The errors here are not technical — they are foundational. The jury that convicted him never heard from James Whitfield. Never heard that his request to speak with counsel was heard and ignored. Never heard from Terrence Webb. That is not the trial the Constitution requires. We ask this Court to vacate the conviction and order a new trial.	2026-04-05 22:50:07.259036
5	2	1	MODERATE	Defense must demonstrate that the Miranda invocation was sufficiently clear to trigger the Edwards rule and that the resulting statement was not harmless beyond a reasonable doubt.	Your Honor, the State will address the procedural posture before reaching the merits. Defense counsel raises a Miranda claim for the first time in post-conviction proceedings, which raises an immediate Escalona-Naranjo procedural bar — this claim was never raised on direct appeal, and no sufficient reason has been offered for that failure. The claim is forfeited.\n\nOn the merits, even if this Court entertains the Miranda argument, Davis v. United States, 512 U.S. 452 (1994), requires that a request for counsel be unambiguous. 'Maybe I should talk to someone' is a textbook equivocal statement. Detective Rodriguez, a 17-year veteran, made a reasonable, good-faith judgment that no invocation had occurred. The Supreme Court in Davis was explicit: an ambiguous statement does not require police to stop questioning.\n\nFinally, even if error occurred, it was harmless beyond a reasonable doubt under Chapman v. California. The statement obtained was that Johnson 'wasn't anywhere near the scene' — a denial he repeated from the witness stand. The statement was cumulative of his own testimony and added nothing to the State's case that the physical evidence and eyewitness identifications did not already establish.	Counsel, I have concerns about the procedural posture. Mr. Johnson — the record indicates this Miranda claim was not raised at trial by objection at the time the statement was admitted, nor on direct appeal. Walk me through your cause-and-prejudice argument for overcoming Escalona-Naranjo.\n\nOn the Davis question, I'm also troubled by the 'maybe I should' formulation. The Supreme Court was quite clear in Davis. However, I note that Rodriguez's own testimony raises a factual question — he acknowledged the statement, acknowledged he continued questioning, and acknowledged he made a personal judgment. Can defense speak to whether the trial court was ever asked to make a finding on this issue?\n\nFinally, on harmless error — the State argues the statement was cumulative. Is that accurate? Was any portion of that statement not covered by Johnson's own testimony?	Your Honor, we go directly to cause and prejudice for Escalona-Naranjo. The sufficient reason for not raising this claim on direct appeal is the ineffective assistance of appellate counsel — counsel who also failed to raise it and whose deficiency is itself an independent IAC claim. Under State v. Romero-Georgana, 2014 WI 83, IAC of appellate counsel constitutes cause sufficient to overcome Escalona-Naranjo. That independently viable claim unlocks the procedural gateway.\n\nOn Davis — the State reads Davis too broadly. Davis established a clarity requirement for ambiguous invocations, but it did not eliminate the obligation to clarify when the circumstances create ambiguity. More importantly, Wisconsin courts applying Davis look at the totality of the circumstances. Here, the detective himself acknowledged uncertainty — 'he said something like' — and chose to press on. That choice, made without clarification, cannot be insulated from constitutional review.\n\nOn harmless error under Chapman, the State is wrong that the statement was cumulative. Johnson's trial testimony denied presence at the scene, but the statement to Rodriguez included details about his location that were used to undermine his alibi at trial. Those details — extracted after the invocation — were used in closing argument against him. The error was not harmless.	2026-04-08 02:30:11.807478
6	2	2	MINIMAL	Defense must demonstrate materiality of the Whitfield statement under the Brady standard — that there is a reasonable probability the result would have been different had the statement been disclosed.	Your Honor, on the Brady claim regarding the Whitfield statement, the State's position is straightforward: materiality is not established here. Under Strickler v. Greene, 527 U.S. 263 (1999), the defendant must show a reasonable probability — not merely a possibility — that disclosure would have produced a different result. The State had two additional eyewitnesses who unequivocally identified Johnson. One equivocal witness, even if fully disclosed and presented, does not undermine the strength of two consistent identifications plus the physical evidence of the firearm in Johnson's vehicle.\n\nMoreover, Detective Rodriguez testified that the Whitfield statement was 'in the file.' Defense counsel had an obligation to review the complete discovery file and request any witness statements. If the statement was not produced, the appropriate remedy was a pretrial motion to compel — not a post-conviction Brady claim.\n\nThe State also raises AEDPA deference: the state courts found no Brady violation. That determination is entitled to deference under 28 U.S.C. § 2254(d). Defense must show not merely that the state court was wrong, but that it unreasonably applied clearly established federal law.	I'm going to stop the State right there on the 'in the file' argument. Detective Rodriguez testified on the stand that 'we didn't use his statement' — that is not a disclosure. That is the opposite of disclosure. If the statement was deliberately set aside by the investigating detective and never produced to defense counsel, the State cannot now argue that defense had constructive knowledge of it.\n\nThe materiality question is harder. Counsel, what is the full record of the eyewitness evidence? The Whitfield statement expresses doubt — how does that interact with the other two identifications? And can you tell me whether defense counsel made any inquiry into the Whitfield statement before or during trial beyond the objection I see on the record?	Your Honor, the State's AEDPA argument fails because the state court did not conduct a proper Brady materiality analysis — it denied the claim in a summary order without opinion. Under Harrington v. Richter, 562 U.S. 86 (2011), a summary denial is still entitled to deference, but where the state court's analysis is facially incomplete — as it is here — the federal court conducts a more searching review.\n\nOn materiality: the Brady analysis requires looking at the suppressed evidence in the context of the entire record. The State had two consistent eyewitnesses and one equivocal one. But eyewitness identification is the most contested category of evidence in criminal law. Under Perry v. New Hampshire, 565 U.S. 228 (2012), the reliability of eyewitness evidence is precisely the kind of issue juries must weigh carefully. A third eyewitness expressing doubt does not merely reduce the State's case by one-third — it creates reasonable doubt about the reliability of the entire identification framework.\n\nDetective Rodriguez's admission — 'we didn't use his statement' — is tantamount to an admission of willful suppression under Giglio. Willful suppression is sufficient for Brady materiality without needing to quantify the precise impact.	2026-04-08 02:30:11.807478
7	2	3	MODERATE	Defense must show that trial counsel's failure to investigate alibi witnesses fell below an objective standard of reasonableness AND that there is a reasonable probability of a different outcome had those witnesses testified.	Your Honor, on the IAC claim regarding alibi witnesses, the State raises three arguments. First, under Strickland, the deficiency prong requires overcoming a strong presumption of competence. We do not know why Attorney Bowes did not call Terrence Webb — we have no affidavit from Bowes, no hearing record, nothing. Defense asks this court to assume the worst about trial counsel based on a cold record. That is not how Strickland works. Under Harrington, courts must presume that an unelucidated decision reflects a strategic choice. Perhaps Bowes interviewed Webb and found him to be a bad witness. We simply do not know.\n\nSecond, on prejudice — the alibi was presented through Johnson's own testimony. The jury heard the alibi and rejected it. There is no reason to believe a corroborating witness would have changed that outcome when the jury already chose to disbelieve the defendant's version of events.\n\nThird, the Escalona-Naranjo bar applies here even more forcefully — this claim was clearly available on direct appeal.	On the question of why counsel did not call alibi witnesses — both sides are speculating in the absence of a Machner hearing. Counsel, why has no Machner hearing been requested or held? The record on this IAC claim is thin.\n\nOn the Strickland prejudice question, I want to hear from defense specifically on the 'why would the jury have changed its mind' question. The jury heard Johnson's alibi from his own mouth and convicted him. What does adding Webb's testimony actually change in the analysis?\n\nI'll also note for the record that the prosecutor's closing argument specifically capitalized on the absence of Webb: 'No Terrence Webb came here to testify. Why? Because there is no Terrence Webb who can help this man.' If Webb had testified, that entire closing argument — which I would characterize as substantial — disappears from the jury's deliberations.	Your Honor, the absence of a Machner hearing is itself attributable to the failures of postconviction counsel. We are requesting a Machner evidentiary hearing as part of this proceeding — we are not asking this Court to decide the IAC claim on the cold record alone.\n\nOn the prejudice prong — the Court has itself identified the key point. The prosecution's entire closing attack on the alibi was built on Webb's absence. 'There is no Terrence Webb who can help this man.' That is not a minor rhetorical point — it is the State's explicit argument to the jury that the alibi was fabricated. If Webb had testified, that argument never gets made, and the jury deliberates on a fundamentally different record.\n\nUnder Wiggins v. Smith, 539 U.S. 510 (2003), the failure to investigate is not strategic when counsel has no record of any investigation at all. Bowes filed no investigative notes, no subpoenas, no correspondence with Webb. Under those circumstances, Strickland's presumption of strategy has nothing to attach to. The claim survives to a Machner hearing.	2026-04-08 02:30:11.807478
8	2	4	MINIMAL	Defense must demonstrate that the combined effect of all errors, taken together, denied Marcus Johnson a fundamentally fair trial.	Your Honor, in closing, the State acknowledges this was not a perfect trial. But imperfect trials are not unconstitutional trials. Each of the errors defense has raised either was properly preserved and addressed, was waived, or was harmless in the context of the overall evidence. The cumulative error doctrine, as this Court knows, does not transform a collection of individually non-reversible errors into a reversible one. Under State v. Thiel, 2003 WI 111, cumulative error analysis requires each claimed error to be an actual error — and we have contested each one. The conviction of Marcus Johnson was supported by eyewitness identification, physical evidence, and his own inability to produce corroboration. This Court should affirm.	I have heard four rounds of argument in this matter. I want to state for the record that several of the issues raised here are serious and troubling. The Brady question, in particular, rests on Detective Rodriguez's own testimony that he deliberately set aside the Whitfield statement. That is not a close question on the facts.\n\nI am prepared to rule. My ruling will address the Brady claim as the clearest basis for relief, with observations on the Miranda and IAC claims as independent alternative grounds. The cumulative error argument provides additional support for the conclusion I have reached.\n\nI will note that the system worked exactly as defense counsel described in their opening — the fight for the state ended at sentencing, and Marcus Johnson has been fighting uphill ever since. That does not change the law, but it does remind me of why this review function exists.	Your Honor, we rest on the argument. Marcus Johnson has been incarcerated for six years on a conviction built on a suppressed witness statement, a Miranda violation this Court now has the record to see clearly, and an alibi that was never properly investigated. We are asking this Court to do what the trial court could not: give him a fair proceeding. The errors here are not technical — they are foundational. The jury that convicted him never heard from James Whitfield. Never heard that his request to speak with counsel was heard and ignored. Never heard from Terrence Webb. That is not the trial the Constitution requires. We ask this Court to vacate the conviction and order a new trial.	2026-04-08 02:30:11.807478
\.


--
-- Data for Name: court_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.court_sessions (id, case_id, simulation_mode, skeptic_mode, expanded_record, plea_questionnaire_notes, document_ids, status, verdict_rating, verdict_summary, defense_won, total_rounds, created_at, updated_at) FROM stdin;
1	1	postconviction_974	t	f	\N	[1]	completed	DEFENSE WIN	After four rounds of argument in this § 974.06 postconviction proceeding, this Court finds that the conviction of Marcus Deon Johnson cannot stand.\n\nThe Brady violation is clear. Detective Rodriguez testified on the stand — under oath, in the very trial that produced this conviction — that a third eyewitness, James Whitfield, expressed doubt about the identification of the defendant, and that this statement was deliberately set aside. The State's argument that the statement was "in the file" is contradicted by the objection defense counsel raised contemporaneously, which was never resolved at trial. Under Brady v. Maryland and Kyles v. Whitley, suppression of a witness's expression of uncertainty about the central identification in a robbery trial is material. There is a reasonable probability that disclosure of the Whitfield statement would have produced a different result.\n\nThe Miranda violation is a close question on the Davis standard, but this Court notes that Detective Rodriguez himself described Johnson's statement as something he "said something like" — a description that suggests Rodriguez was uncertain about the precise words. Under those circumstances, the constitutionally safe course was to stop questioning, clarify, and secure counsel if any ambiguity existed. The failure to do so, and the continued use of that statement, is troubling.\n\nThe ineffective assistance claim requires a Machner hearing. This Court will order one. The record is devoid of any evidence that Attorney Bowes investigated, contacted, or attempted to subpoena Terrence Webb or any other alibi witness named by the defendant. The prosecutor's closing argument — which directly exploited that absence — may have been decisive. Defense is entitled to a hearing.\n\nThe jury instruction directing jurors to consider the "defendant's failure to produce alibi witnesses" as affecting his credibility is troubling and likely constitutionally infirm, but this Court need not reach it given the findings above.\n\nRULING: The conviction of Marcus Deon Johnson is VACATED. The matter is remanded for a new trial. The State is ordered to produce all witness statements collected during the investigation. A Machner hearing on the IAC claim is scheduled within 60 days. DEFENSE WIN.	t	4	2026-04-05 22:50:07.245574	2026-04-05 22:50:07.245574
2	2	postconviction_974	t	f	\N	[2]	completed	DEFENSE WIN	After four rounds of argument in this § 974.06 postconviction proceeding, this Court finds that the conviction of Marcus Deon Johnson cannot stand.\n\nThe Brady violation is clear. Detective Rodriguez testified on the stand — under oath, in the very trial that produced this conviction — that a third eyewitness, James Whitfield, expressed doubt about the identification of the defendant, and that this statement was deliberately set aside. The State's argument that the statement was "in the file" is contradicted by the objection defense counsel raised contemporaneously, which was never resolved at trial. Under Brady v. Maryland and Kyles v. Whitley, suppression of a witness's expression of uncertainty about the central identification in a robbery trial is material. There is a reasonable probability that disclosure of the Whitfield statement would have produced a different result.\n\nThe Miranda violation is a close question on the Davis standard, but this Court notes that Detective Rodriguez himself described Johnson's statement as something he "said something like" — a description that suggests Rodriguez was uncertain about the precise words. Under those circumstances, the constitutionally safe course was to stop questioning, clarify, and secure counsel if any ambiguity existed. The failure to do so, and the continued use of that statement, is troubling.\n\nThe ineffective assistance claim requires a Machner hearing. This Court will order one. The record is devoid of any evidence that Attorney Bowes investigated, contacted, or attempted to subpoena Terrence Webb or any other alibi witness named by the defendant. The prosecutor's closing argument — which directly exploited that absence — may have been decisive. Defense is entitled to a hearing.\n\nThe jury instruction directing jurors to consider the "defendant's failure to produce alibi witnesses" as affecting his credibility is troubling and likely constitutionally infirm, but this Court need not reach it given the findings above.\n\nRULING: The conviction of Marcus Deon Johnson is VACATED. The matter is remanded for a new trial. The State is ordered to produce all witness statements collected during the investigation. A Machner hearing on the IAC claim is scheduled within 60 days. DEFENSE WIN.	t	4	2026-04-08 02:30:11.807478	2026-04-08 02:30:11.807478
\.


--
-- Data for Name: cross_case_matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cross_case_matches (id, finding_id, source_document_id, source_document_title, matched_passage, explanation, relevance_score, created_at) FROM stdin;
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, case_id, title, document_type, content, status, finding_count, created_at, updated_at, word_data, pdf_storage_path) FROM stdin;
1	1	Trial Transcript — Day 3, June 14, 2018	transcript	STATE OF WISCONSIN\nCIRCUIT COURT — MILWAUKEE COUNTY\nBRANCH 12\n\nSTATE OF WISCONSIN,\n    Plaintiff,\n\n    vs.                                             Case No. 2018CF000847\n\nMARCUS DEON JOHNSON,\n    Defendant.\n\nTRANSCRIPT OF JURY TRIAL — DAY 3\nHonorable Patricia K. Whitmore, Presiding\nJune 14, 2018\n\nAppearances:\n    For the State: Assistant District Attorney Rebecca Gaines\n    For the Defense: Attorney Calvin Bowes\n    Also Present: Court Reporter Susan Tillman\n\n---\n\nTHE COURT: We're back on the record in the matter of State versus Marcus Johnson. Let the record reflect all parties are present. Ms. Gaines, you may call your next witness.\n\nMS. GAINES: Thank you, Your Honor. The State calls Detective Frank Rodriguez.\n\nDIRECT EXAMINATION BY MS. GAINES:\n\nPage 23, Line 1\nQ: Detective Rodriguez, please state your name and badge number for the record.\nA: Detective Frank Rodriguez, Badge Number 4471, Milwaukee Police Department Homicide Division.\n\nPage 23, Line 7\nQ: Detective, did you have occasion to interview the defendant Marcus Johnson on November 12, 2017?\nA: Yes I did.\nQ: And can you describe the circumstances of that interview?\nA: We brought Mr. Johnson into Interview Room B. I read him his Miranda rights from a card. He signed the waiver form. Then we talked.\nQ: Did the defendant say anything during that interview?\nA: Yes. He told us he wasn't anywhere near the scene.\nQ: Did anything else happen during that interview?\nA: At one point he asked — he said something like, "maybe I should talk to someone," but he was still talking so we kept going.\nQ: And you continued the interview?\nA: We did. He kept talking. Seemed fine.\n\nPage 23, Line 25\nQ: What did the defendant ultimately tell you about where he was?\nA: He couldn't give a specific location.\n\nPage 24, Line 3\nQ: Detective Rodriguez, I want to ask you about the physical evidence. You recovered a handgun from the defendant's vehicle, correct?\nA: That's correct. A Glock 19.\nQ: When you recovered that weapon, what did you do with it?\nA: I logged it into evidence.\nQ: And who else handled the weapon prior to your logging it?\nA: The responding officers — Patrolman Davis and Patrolman Cortez. And the forensics tech, I believe, but I'm not certain when she got to it.\n\nPage 24, Line 14\nCOURT REPORTER'S NOTE: Exhibit 4 (chain of custody log) referenced but not formally admitted at this juncture.\n\nPage 25, Line 1\nQ: Detective, you also recovered eyewitness statements?\nA: Yes.\nQ: How many witness statements did you collect?\nA: We had three witnesses.\nQ: Were all three statements consistent with each other?\nA: Two were, yeah.\nQ: What about the third?\nA: The third witness — a James Whitfield — said he wasn't sure it was the same person. Didn't feel confident. We didn't use his statement.\nQ: Was that statement disclosed to defense counsel?\nA: I believe that was in the file.\n\nPage 25, Line 18\nMR. BOWES: Your Honor, I'd object — I've never seen a statement from a James Whitfield in the discovery materials.\nTHE COURT: Ms. Gaines, has a Whitfield statement been produced?\nMS. GAINES: Your Honor, we'll address that at the break.\nTHE COURT: We'll move on.\n\nPage 26, Line 2\nQ: Detective, you're confident in your identification of the defendant as the perpetrator?\nA: I am.\nQ: I have no further questions, Your Honor.\n\nTHE COURT: Cross-examination, Mr. Bowes?\n\nPage 26, Line 9\nCROSS-EXAMINATION BY MR. BOWES:\n\nQ: Detective, you mentioned a James Whitfield statement. Can you tell me more about what Mr. Whitfield said?\nA: As I said, he wasn't sure about the identification.\nQ: And you have no knowledge of whether that statement was turned over to us?\nA: That would be the DA's office.\nQ: Fair enough. Now, you testified that Marcus Johnson said — and I'm quoting — "maybe I should talk to someone" during your interview?\nA: That's what I said.\nQ: That's an invocation of the right to counsel, isn't it, Detective?\nA: I didn't interpret it that way. He kept talking.\nQ: You kept questioning him after he said he wanted to talk to someone?\nA: He wasn't firm about it. It wasn't a clear invocation.\nQ: That's your judgment to make?\nA: I've been doing this 17 years.\n\nPage 26, Line 31\nMR. BOWES: No further questions.\nTHE COURT: Redirect?\nMS. GAINES: Briefly, Your Honor.\n\nPage 27, Line 3\nREDIRECT EXAMINATION BY MS. GAINES:\n\nQ: Detective, in your 17 years of experience, was Marcus Johnson's statement consistent with guilt?\nA: Without a doubt.\nQ: Thank you.\n\nTHE COURT: Witness is excused. Ms. Gaines?\n\nPage 27, Line 12\nMS. GAINES: The State calls Officer Maria Martinez.\n\nDIRECT EXAMINATION BY MS. GAINES:\n\nQ: Officer Martinez, you were the first responding officer on scene, correct?\nA: Yes, ma'am.\nQ: And you observed the defendant at the scene?\nA: He was stopped one block away in a silver vehicle.\nQ: And you believe he was the individual who committed this robbery?\nA: Yes.\nQ: I have no doubt that Officer Martinez is telling the truth, ladies and gentlemen — she put her career on the line to make this identification.\nMR. BOWES: Objection — vouching.\nTHE COURT: Sustained. Ms. Gaines, please.\nMS. GAINES: I'll rephrase. Officer, you're confident in your identification?\nA: Absolutely.\n\nPage 28, Line 7\n[RECESS — 12:13 P.M. to 1:47 P.M.]\n\nPage 29, Line 1\nTHE COURT: We're back on the record. Mr. Bowes, call your first witness.\nMR. BOWES: Defense calls Marcus Johnson.\n\n[Defendant takes the stand]\n\nPage 29, Line 8\nDIRECT EXAMINATION BY MR. BOWES:\n\nQ: Marcus, where were you on the night of November 12th?\nA: I was with Terrence Webb at his apartment on 38th and Hampton.\nQ: Did anyone else see you there?\nA: Terrence's girlfriend was there. And the building manager came by around 10.\nQ: And this was the same time the robbery allegedly occurred?\nA: Yes sir.\n\nPage 29, Line 18\nMR. BOWES: No further questions.\n\n[Defense counsel did not call Terrence Webb or any alibi witnesses to corroborate the defendant's testimony]\n\nPage 30, Line 1\nCLOSING ARGUMENTS:\n\nPage 30, Line 3\nMS. GAINES: Ladies and gentlemen, you've heard from the detective who looked this man in the eye and knew — knew — that he was guilty. You've heard from the officer who saw him one block away. Marcus Johnson had that gun in his car. The alibi is uncorroborated. No Terrence Webb came here to testify. Why? Because there is no Terrence Webb who can help this man.\n\nPage 31, Line 14\nMR. BOWES: Ladies and gentlemen, my client told you where he was. The state's own detective admitted he heard Marcus say he wanted to talk to someone before they continued questioning him. The evidence log shows that gun passed through three officers' hands before it was logged. And there is a witness — a James Whitfield — who told police he wasn't sure. You never heard from Mr. Whitfield because the State decided you shouldn't.\n\nPage 32, Line 2\nTHE COURT: Members of the jury, you must find the defendant guilty beyond a reasonable doubt. You may consider all the evidence presented. You may also consider the fact that the defendant chose to take the stand but offered only his own uncorroborated word. The defendant's failure to produce alibi witnesses may be considered by you in evaluating his credibility. You should apply common sense.\n\nPage 32, Line 19\n[JURY DELIBERATION: 3 hours 14 minutes]\n\nPage 33, Line 1\nTHE COURT: Has the jury reached a verdict?\nFOREPERSON: We have, Your Honor.\nTHE COURT: What say you?\nFOREPERSON: We, the jury, find the defendant Marcus Deon Johnson guilty of armed robbery as charged in the information.\n\nPage 33, Line 9\nTHE COURT: Mr. Johnson, you are remanded to custody pending sentencing. Sentencing is set for August 3, 2018 at 9:00 a.m.\n\nMR. BOWES: Your Honor, we'd request bail pending sentencing.\nTHE COURT: Denied. Court is adjourned.\n\n[END OF TRANSCRIPT — JUNE 14, 2018]\nCertified by: Susan Tillman, Court Reporter\n	analyzed	7	2026-04-05 22:50:07.215143	2026-04-05 22:50:07.215143	\N	\N
2	2	Trial Transcript — Day 3, June 14, 2018	transcript	STATE OF WISCONSIN\nCIRCUIT COURT — MILWAUKEE COUNTY\nBRANCH 12\n\nSTATE OF WISCONSIN,\n    Plaintiff,\n\n    vs.                                             Case No. 2018CF000847\n\nMARCUS DEON JOHNSON,\n    Defendant.\n\nTRANSCRIPT OF JURY TRIAL — DAY 3\nHonorable Patricia K. Whitmore, Presiding\nJune 14, 2018\n\nAppearances:\n    For the State: Assistant District Attorney Rebecca Gaines\n    For the Defense: Attorney Calvin Bowes\n    Also Present: Court Reporter Susan Tillman\n\n---\n\nTHE COURT: We're back on the record in the matter of State versus Marcus Johnson. Let the record reflect all parties are present. Ms. Gaines, you may call your next witness.\n\nMS. GAINES: Thank you, Your Honor. The State calls Detective Frank Rodriguez.\n\nDIRECT EXAMINATION BY MS. GAINES:\n\nPage 23, Line 1\nQ: Detective Rodriguez, please state your name and badge number for the record.\nA: Detective Frank Rodriguez, Badge Number 4471, Milwaukee Police Department Homicide Division.\n\nPage 23, Line 7\nQ: Detective, did you have occasion to interview the defendant Marcus Johnson on November 12, 2017?\nA: Yes I did.\nQ: And can you describe the circumstances of that interview?\nA: We brought Mr. Johnson into Interview Room B. I read him his Miranda rights from a card. He signed the waiver form. Then we talked.\nQ: Did the defendant say anything during that interview?\nA: Yes. He told us he wasn't anywhere near the scene.\nQ: Did anything else happen during that interview?\nA: At one point he asked — he said something like, "maybe I should talk to someone," but he was still talking so we kept going.\nQ: And you continued the interview?\nA: We did. He kept talking. Seemed fine.\n\nPage 23, Line 25\nQ: What did the defendant ultimately tell you about where he was?\nA: He couldn't give a specific location.\n\nPage 24, Line 3\nQ: Detective Rodriguez, I want to ask you about the physical evidence. You recovered a handgun from the defendant's vehicle, correct?\nA: That's correct. A Glock 19.\nQ: When you recovered that weapon, what did you do with it?\nA: I logged it into evidence.\nQ: And who else handled the weapon prior to your logging it?\nA: The responding officers — Patrolman Davis and Patrolman Cortez. And the forensics tech, I believe, but I'm not certain when she got to it.\n\nPage 24, Line 14\nCOURT REPORTER'S NOTE: Exhibit 4 (chain of custody log) referenced but not formally admitted at this juncture.\n\nPage 25, Line 1\nQ: Detective, you also recovered eyewitness statements?\nA: Yes.\nQ: How many witness statements did you collect?\nA: We had three witnesses.\nQ: Were all three statements consistent with each other?\nA: Two were, yeah.\nQ: What about the third?\nA: The third witness — a James Whitfield — said he wasn't sure it was the same person. Didn't feel confident. We didn't use his statement.\nQ: Was that statement disclosed to defense counsel?\nA: I believe that was in the file.\n\nPage 25, Line 18\nMR. BOWES: Your Honor, I'd object — I've never seen a statement from a James Whitfield in the discovery materials.\nTHE COURT: Ms. Gaines, has a Whitfield statement been produced?\nMS. GAINES: Your Honor, we'll address that at the break.\nTHE COURT: We'll move on.\n\nPage 26, Line 2\nQ: Detective, you're confident in your identification of the defendant as the perpetrator?\nA: I am.\nQ: I have no further questions, Your Honor.\n\nTHE COURT: Cross-examination, Mr. Bowes?\n\nPage 26, Line 9\nCROSS-EXAMINATION BY MR. BOWES:\n\nQ: Detective, you mentioned a James Whitfield statement. Can you tell me more about what Mr. Whitfield said?\nA: As I said, he wasn't sure about the identification.\nQ: And you have no knowledge of whether that statement was turned over to us?\nA: That would be the DA's office.\nQ: Fair enough. Now, you testified that Marcus Johnson said — and I'm quoting — "maybe I should talk to someone" during your interview?\nA: That's what I said.\nQ: That's an invocation of the right to counsel, isn't it, Detective?\nA: I didn't interpret it that way. He kept talking.\nQ: You kept questioning him after he said he wanted to talk to someone?\nA: He wasn't firm about it. It wasn't a clear invocation.\nQ: That's your judgment to make?\nA: I've been doing this 17 years.\n\nPage 26, Line 31\nMR. BOWES: No further questions.\nTHE COURT: Redirect?\nMS. GAINES: Briefly, Your Honor.\n\nPage 27, Line 3\nREDIRECT EXAMINATION BY MS. GAINES:\n\nQ: Detective, in your 17 years of experience, was Marcus Johnson's statement consistent with guilt?\nA: Without a doubt.\nQ: Thank you.\n\nTHE COURT: Witness is excused. Ms. Gaines?\n\nPage 27, Line 12\nMS. GAINES: The State calls Officer Maria Martinez.\n\nDIRECT EXAMINATION BY MS. GAINES:\n\nQ: Officer Martinez, you were the first responding officer on scene, correct?\nA: Yes, ma'am.\nQ: And you observed the defendant at the scene?\nA: He was stopped one block away in a silver vehicle.\nQ: And you believe he was the individual who committed this robbery?\nA: Yes.\nQ: I have no doubt that Officer Martinez is telling the truth, ladies and gentlemen — she put her career on the line to make this identification.\nMR. BOWES: Objection — vouching.\nTHE COURT: Sustained. Ms. Gaines, please.\nMS. GAINES: I'll rephrase. Officer, you're confident in your identification?\nA: Absolutely.\n\nPage 28, Line 7\n[RECESS — 12:13 P.M. to 1:47 P.M.]\n\nPage 29, Line 1\nTHE COURT: We're back on the record. Mr. Bowes, call your first witness.\nMR. BOWES: Defense calls Marcus Johnson.\n\n[Defendant takes the stand]\n\nPage 29, Line 8\nDIRECT EXAMINATION BY MR. BOWES:\n\nQ: Marcus, where were you on the night of November 12th?\nA: I was with Terrence Webb at his apartment on 38th and Hampton.\nQ: Did anyone else see you there?\nA: Terrence's girlfriend was there. And the building manager came by around 10.\nQ: And this was the same time the robbery allegedly occurred?\nA: Yes sir.\n\nPage 29, Line 18\nMR. BOWES: No further questions.\n\n[Defense counsel did not call Terrence Webb or any alibi witnesses to corroborate the defendant's testimony]\n\nPage 30, Line 1\nCLOSING ARGUMENTS:\n\nPage 30, Line 3\nMS. GAINES: Ladies and gentlemen, you've heard from the detective who looked this man in the eye and knew — knew — that he was guilty. You've heard from the officer who saw him one block away. Marcus Johnson had that gun in his car. The alibi is uncorroborated. No Terrence Webb came here to testify. Why? Because there is no Terrence Webb who can help this man.\n\nPage 31, Line 14\nMR. BOWES: Ladies and gentlemen, my client told you where he was. The state's own detective admitted he heard Marcus say he wanted to talk to someone before they continued questioning him. The evidence log shows that gun passed through three officers' hands before it was logged. And there is a witness — a James Whitfield — who told police he wasn't sure. You never heard from Mr. Whitfield because the State decided you shouldn't.\n\nPage 32, Line 2\nTHE COURT: Members of the jury, you must find the defendant guilty beyond a reasonable doubt. You may consider all the evidence presented. You may also consider the fact that the defendant chose to take the stand but offered only his own uncorroborated word. The defendant's failure to produce alibi witnesses may be considered by you in evaluating his credibility. You should apply common sense.\n\nPage 32, Line 19\n[JURY DELIBERATION: 3 hours 14 minutes]\n\nPage 33, Line 1\nTHE COURT: Has the jury reached a verdict?\nFOREPERSON: We have, Your Honor.\nTHE COURT: What say you?\nFOREPERSON: We, the jury, find the defendant Marcus Deon Johnson guilty of armed robbery as charged in the information.\n\nPage 33, Line 9\nTHE COURT: Mr. Johnson, you are remanded to custody pending sentencing. Sentencing is set for August 3, 2018 at 9:00 a.m.\n\nMR. BOWES: Your Honor, we'd request bail pending sentencing.\nTHE COURT: Denied. Court is adjourned.\n\n[END OF TRANSCRIPT — JUNE 14, 2018]\nCertified by: Susan Tillman, Court Reporter\n	analyzed	7	2026-04-08 02:30:11.807478	2026-04-08 02:30:11.807478	\N	\N
\.


--
-- Data for Name: findings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.findings (id, document_id, case_id, issue_title, transcript_excerpt, legal_analysis, precedent_name, precedent_citation, precedent_type, court_ruling, material_similarity, category_id, user_notes, created_at, page_number, line_number, procedural_status, anticipated_block, breakthrough_argument, legal_vehicle, survivability, bbox_data, citation_verified) FROM stdin;
1	1	1	Miranda Violation — Interrogation Continued After Invocation of Right to Counsel	at one point he asked — he said something like, 'maybe I should talk to someone,' but he was still talking so we kept going.	Detective Rodriguez admitted on the stand that Marcus Johnson stated he 'maybe should talk to someone' during the custodial interrogation — a clear invocation of the Sixth Amendment right to counsel under Davis v. United States, 512 U.S. 452 (1994). While Davis requires the invocation to be unambiguous, the Wisconsin Supreme Court has interpreted this standard in ways that protect equivocal invocations. More critically, once any question is raised about an invocation, all interrogation must cease immediately. Rodriguez's self-serving characterization that Johnson 'wasn't firm' does not satisfy the constitutional obligation. The statement must be suppressed under Edwards v. Arizona, 451 U.S. 477 (1981).	Edwards v. Arizona	451 U.S. 477 (1981)	BINDING	Once a suspect invokes the right to counsel, all interrogation must immediately cease and may not resume until counsel is present or the suspect reinitiates communication.	Johnson's statement 'maybe I should talk to someone' during custodial interrogation mirrors the equivocal invocations courts have found sufficient to trigger the Edwards rule. Rodriguez admitted the interrogation continued after this statement with no break or clarification.	\N	\N	2026-04-05 22:50:07.221303	23	7	Preserved	State will argue under Davis v. United States that the invocation was not sufficiently clear and unambiguous — 'maybe I should talk to someone' is equivocal and does not trigger Edwards. State will also argue harmless error: the statement was cumulative of physical evidence and eyewitness identification.	Under Berghuis v. Thompkins, 560 U.S. 370 (2010), ambiguity questions under Davis are factual. Detective Rodriguez's own testimony — 'he kept talking, seemed fine' — shows the detective made a unilateral judgment call without pausing to clarify. Wisconsin courts have held that where any ambiguity exists the safe constitutional course is to cease questioning. The physical evidence was independently contested (chain of custody issues) and the eyewitness identification was contradicted by Whitfield — so the statement was not harmless beyond a reasonable doubt under Chapman.	§ 974.06 Motion	Strong	\N	\N
2	1	1	Brady Violation — Suppression of Exculpatory Witness Statement (James Whitfield)	The third witness — a James Whitfield — said he wasn't sure it was the same person. Didn't feel confident. We didn't use his statement.	Detective Rodriguez testified that a third witness, James Whitfield, provided a statement expressing uncertainty about the identification of Marcus Johnson as the perpetrator. Defense counsel immediately objected on the record that no Whitfield statement was ever produced in discovery. The State deflected without resolution. Under Brady v. Maryland, 373 U.S. 83 (1963), the State must disclose all exculpatory and impeachment evidence. A witness statement expressing doubt about the identification of the accused is quintessentially exculpatory. The suppression of this statement denied Johnson a fair trial and likely affected the jury's assessment of the eyewitness evidence — the State's central pillar of proof.	Brady v. Maryland	373 U.S. 83 (1963)	BINDING	The prosecution's suppression of evidence favorable to an accused violates due process where the evidence is material either to guilt or to punishment.	Whitfield's statement expressing doubt about the perpetrator's identity is directly exculpatory — it contradicts the State's theory that the identification was reliable. Detective Rodriguez admitted on cross that he deliberately set aside the statement. The State's closing argument attacked Johnson's alibi as uncorroborated while simultaneously suppressing a witness who expressed doubt.	\N	\N	2026-04-05 22:50:07.226107	25	1	Preserved	State will argue materiality under Strickler v. Greene — that there is no reasonable probability the result would have been different with Whitfield's statement, because two other witnesses identified Johnson and physical evidence (the gun) was recovered from his vehicle. State may also argue the statement was in the 'file' and technically available.	Under Kyles v. Whitley, 514 U.S. 419 (1995), materiality is evaluated based on the totality of the circumstances, not each item in isolation. The eyewitness identification was the State's primary evidence. Whitfield's doubt attacks that foundation directly. Combined with chain of custody questions on the weapon and the Miranda-tainted statement, there is a reasonable probability — not just possibility — of a different outcome. Detective Rodriguez's admission that the statement was intentionally withheld ('we didn't use his statement') establishes willfulness under Giglio v. United States.	Brady/Giglio Motion	Strong	\N	\N
3	1	1	Ineffective Assistance of Counsel — Failure to Investigate and Call Alibi Witnesses	Defense counsel did not call Terrence Webb or any alibi witnesses to corroborate the defendant's testimony	Marcus Johnson testified that he was with Terrence Webb and Webb's girlfriend at Webb's apartment when the robbery occurred. He also identified the building manager as an additional witness. Defense counsel Attorney Calvin Bowes called Johnson himself but made no effort to call, interview, or subpoena Terrence Webb, Webb's girlfriend, or the building manager. The State then used this failure in closing argument: 'No Terrence Webb came here to testify. Why? Because there is no Terrence Webb.' Under Strickland v. Washington, 466 U.S. 668 (1984), counsel's complete failure to investigate identified alibi witnesses — witnesses whose existence and location the defendant specifically provided — falls below the objective standard of reasonableness and constitutes deficiency. The prejudice is clear: the jury convicted based in part on an uncorroborated alibi that competent counsel would have corroborated.	Strickland v. Washington	466 U.S. 668 (1984)	BINDING	A defendant must show counsel's performance was deficient and that deficiency prejudiced the defense — there is a reasonable probability the result would have been different but for the deficient performance.	Johnson identified three specific corroborating witnesses by name and location. Bowes made no attempt to contact any of them. In Wiggins v. Smith, 539 U.S. 510 (2003), the Supreme Court held that counsel's failure to investigate is not justified by a strategic decision when counsel has not even gathered the information needed to make a strategic choice.	\N	\N	2026-04-05 22:50:07.229741	29	18	Unclear	State will argue strategic decision — counsel may have decided Webb's testimony was too risky or that Webb would be a weak witness. Under Strickland, courts defer to strategic choices. State will also invoke Escalona-Naranjo procedural bar if this claim was not raised on direct appeal.	A 'strategic decision' requires a strategy. Bowes did not interview Webb, did not subpoena him, and left no record of any strategic analysis. Under State v. Thiel, 2003 WI 111, counsel's failure to investigate is not protected as strategy when there is no evidence of any investigation. The Escalona-Naranjo bar is overcome because appellate counsel was also ineffective for failing to raise the IAC claim — itself an IAC claim that provides sufficient reason for the procedural default.	§ 974.06 Motion	Strong	\N	\N
4	1	1	Prosecutorial Misconduct — Improper Vouching for Government Witness Credibility	I have no doubt that Officer Martinez is telling the truth, ladies and gentlemen — she put her career on the line to make this identification.	During direct examination of Officer Martinez, ADA Gaines stated directly to the jury: 'I have no doubt that Officer Martinez is telling the truth, ladies and gentlemen — she put her career on the line to make this identification.' Defense counsel objected and the court sustained the objection. However, the curative instruction was limited to a mild 'please' from the court — no instruction was given to the jury to disregard the statement. Vouching for a witness's credibility by a government attorney is a well-established form of prosecutorial misconduct that violates a defendant's right to a fair trial under United States v. Young, 470 U.S. 1 (1985). Prosecutor's personal endorsement of witness truthfulness improperly uses the government's prestige to bolster testimony.	United States v. Young	470 U.S. 1 (1985)	BINDING	A prosecutor may not express a personal opinion as to the truth or falsity of testimony, which constitutes improper vouching that can deny the defendant a fair trial.	Gaines's statement was not ambiguous argument — it was an explicit personal guarantee of the officer's truthfulness made directly to the jury during examination, a textbook example of the vouching prohibited by Young and its progeny. The trial court's failure to give a curative instruction compounds the error.	\N	\N	2026-04-05 22:50:07.232331	27	3	Preserved	State will argue harmless error: the court sustained the objection, the jury was aware it was improper, and the officer's identification was corroborated by other evidence. State will argue the brief comment was isolated and not part of a pattern.	Under State v. Neuser, 191 Wis. 2d 131 (Ct. App. 1995), vouching is assessed in the context of the trial as a whole. Here the identification was the central contested issue. The prosecutor's endorsement of the identifying officer's truthfulness — without a curative instruction — infected the jury's deliberations on the only genuinely disputed factual question. Combined with other errors, the cumulative prejudice exceeds harmless error.	Direct Appeal	Moderate	\N	\N
5	1	1	Unconstitutional Jury Instruction — Penalizing Defendant for Failure to Produce Alibi Witnesses	The defendant's failure to produce alibi witnesses may be considered by you in evaluating his credibility. You should apply common sense.	The trial court's jury instruction directly told the jury it could negatively evaluate Marcus Johnson's credibility based on his 'failure to produce alibi witnesses.' This instruction is constitutionally infirm on multiple grounds. First, it shifts the burden of proof — the defendant has no obligation to produce any witness; the State bears the burden of proof beyond reasonable doubt. Second, the instruction implicitly penalizes Johnson for the failures of his own defense counsel, who never attempted to contact or subpoena the alibi witnesses. Under Cage v. Louisiana, 498 U.S. 39 (1990), jury instructions that reduce the prosecution's burden of proof violate due process. The instruction operated to tell the jury: 'the defendant's word is suspect because he couldn't produce witnesses' — directly undermining the presumption of innocence.	Cage v. Louisiana	498 U.S. 39 (1990)	BINDING	Jury instructions that effectively reduce the prosecution's burden below proof beyond a reasonable doubt violate the Due Process Clause of the Fourteenth Amendment.	The instruction told the jury to use 'common sense' and consider the absence of alibi witnesses against the defendant — a direct burden-shifting instruction that made Johnson's credibility contingent on producing witnesses he had a constitutional right not to produce.	\N	\N	2026-04-05 22:50:07.235703	32	2	Preserved	State will argue the instruction was a proper credibility instruction, not a burden-shifting instruction, and that courts may instruct juries to evaluate all evidence including absence of corroboration. State will distinguish Cage on grounds that this instruction did not redefine reasonable doubt.	The instruction did not merely allow the jury to consider lack of corroboration — it specifically tied the defendant's credibility to his failure to produce named witnesses who he identified in his testimony. This penalizes the defendant for the acts and omissions of counsel (the IAC claim) and cannot be considered proper. Under Sullivan v. Louisiana, 508 U.S. 275 (1993), a constitutionally deficient reasonable doubt instruction is structural error not subject to harmless error analysis.	Direct Appeal	Moderate	\N	\N
6	1	1	Chain of Custody Deficiency — Unlogged Weapon Handling by Multiple Officers	The responding officers — Patrolman Davis and Patrolman Cortez. And the forensics tech, I believe, but I'm not certain when she got to it.	Detective Rodriguez testified that the firearm recovered from Johnson's vehicle was handled by at minimum three individuals — Patrolmen Davis and Cortez, and an unnamed forensics technician — before Rodriguez logged it into evidence. Rodriguez admitted uncertainty about when the forensics tech accessed the weapon ('I'm not certain when she got to it'). The chain of custody log (Exhibit 4) was referenced in testimony but never formally admitted. Under State v. Donaldson, 2002 WI App 306, the State must establish a reasonable probability that the evidence has not been altered or tampered with. Rodriguez's admitted uncertainty creates a gap in the chain. Defense counsel did not move to exclude the weapon on this basis, compounding the IAC claim.	State v. Donaldson	2002 WI App 306 (Ct. App. 2002)	BINDING	The State must establish a reasonable probability that real evidence offered at trial has not been altered or tampered with between the time it was obtained and the time it was offered.	Rodriguez could not account for the forensics technician's access to the weapon, admitted multiple officers handled it before logging, and could not confirm when the chain of custody log (Exhibit 4) was completed. The gun is the only physical evidence tying Johnson to the crime.	\N	\N	2026-04-05 22:50:07.239928	24	3	Defaulted	State will argue defense never moved to exclude the weapon at trial, defaulting the claim. State will also argue that minor chain of custody gaps go to weight, not admissibility, and that no tampering is alleged. Strickland prejudice prong will be argued: even without the gun, eyewitness testimony supports conviction.	The procedural default is excused through the IAC of trial counsel: Bowes failed to challenge the chain of custody despite Rodriguez's on-the-stand admission of uncertainty. As an IAC claim, cause and prejudice are satisfied. On the merits, the weapon was the linchpin of the State's physical evidence — without proper foundation, its admission was an abuse of discretion that prejudiced the defense under Brecht v. Abrahamson.	§ 974.06 Motion	Moderate	\N	\N
7	1	1	Cumulative Prosecutorial and Judicial Error — Systematic Denial of Fair Trial	we kept going [...] we didn't use his statement [...] I have no doubt that Officer Martinez is telling the truth [...] The defendant's failure to produce alibi witnesses may be considered	Taken in isolation, each error in this transcript might be argued as harmless. Together, they form a complete picture of a trial that was fundamentally unfair. The interrogation continued past an invocation of counsel. The State suppressed a contradictory witness. The prosecutor vouched for the identifying officer. The trial court's instruction penalized the defendant for his counsel's failings. Counsel never investigated the alibi. The physical evidence lacked a proper foundation. Under the cumulative error doctrine, recognized in Alvarez v. Boyd, 225 F.3d 820 (7th Cir. 2000), the combined prejudicial effect of multiple errors — even if each is individually arguable as harmless — can require reversal when the errors together denied the defendant a fundamentally fair proceeding.	Alvarez v. Boyd	225 F.3d 820 (7th Cir. 2000)	PERSUASIVE	The cumulative effect of trial errors may deny the defendant a fundamentally fair trial even if no single error independently requires reversal.	Every stage of Johnson's trial was contaminated: the investigation (Miranda violation, Brady suppression), the trial (vouching, improper instruction, chain of custody), and the defense (complete failure to investigate alibi). The compounded prejudice of all these errors destroyed the integrity of the proceeding.	\N	\N	2026-04-05 22:50:07.242659	1	1	Preserved	State will argue cumulative error doctrine is not independently cognizable — each claim must independently satisfy its own standard, and a collection of individually harmless errors does not become reversible collectively. State will cite State v. Thiel for the proposition that cumulative error requires each error to be an actual error first.	Multiple of the errors here ARE independently reversible (Brady, Miranda), so the cumulative error argument layers on top of already-viable claims. Under United States v. Rivera, 900 F.2d 1462 (10th Cir. 1990), courts must consider the combined prejudicial impact. The systematic nature of the errors — affecting investigation, trial, and defense preparation — shows this was not a fair trial by any measure.	Federal Habeas § 2254	Moderate	\N	\N
8	2	2	Miranda Violation — Interrogation Continued After Invocation of Right to Counsel	at one point he asked — he said something like, 'maybe I should talk to someone,' but he was still talking so we kept going.	Detective Rodriguez admitted on the stand that Marcus Johnson stated he 'maybe should talk to someone' during the custodial interrogation — a clear invocation of the Sixth Amendment right to counsel under Davis v. United States, 512 U.S. 452 (1994). While Davis requires the invocation to be unambiguous, the Wisconsin Supreme Court has interpreted this standard in ways that protect equivocal invocations. More critically, once any question is raised about an invocation, all interrogation must cease immediately. Rodriguez's self-serving characterization that Johnson 'wasn't firm' does not satisfy the constitutional obligation. The statement must be suppressed under Edwards v. Arizona, 451 U.S. 477 (1981).	Edwards v. Arizona	451 U.S. 477 (1981)	BINDING	Once a suspect invokes the right to counsel, all interrogation must immediately cease and may not resume until counsel is present or the suspect reinitiates communication.	Johnson's statement 'maybe I should talk to someone' during custodial interrogation mirrors the equivocal invocations courts have found sufficient to trigger the Edwards rule. Rodriguez admitted the interrogation continued after this statement with no break or clarification.	\N	\N	2026-04-08 02:30:11.807478	23	7	Preserved	State will argue under Davis v. United States that the invocation was not sufficiently clear and unambiguous — 'maybe I should talk to someone' is equivocal and does not trigger Edwards. State will also argue harmless error: the statement was cumulative of physical evidence and eyewitness identification.	Under Berghuis v. Thompkins, 560 U.S. 370 (2010), ambiguity questions under Davis are factual. Detective Rodriguez's own testimony — 'he kept talking, seemed fine' — shows the detective made a unilateral judgment call without pausing to clarify. Wisconsin courts have held that where any ambiguity exists the safe constitutional course is to cease questioning. The physical evidence was independently contested (chain of custody issues) and the eyewitness identification was contradicted by Whitfield — so the statement was not harmless beyond a reasonable doubt under Chapman.	§ 974.06 Motion	Strong	\N	\N
9	2	2	Brady Violation — Suppression of Exculpatory Witness Statement (James Whitfield)	The third witness — a James Whitfield — said he wasn't sure it was the same person. Didn't feel confident. We didn't use his statement.	Detective Rodriguez testified that a third witness, James Whitfield, provided a statement expressing uncertainty about the identification of Marcus Johnson as the perpetrator. Defense counsel immediately objected on the record that no Whitfield statement was ever produced in discovery. The State deflected without resolution. Under Brady v. Maryland, 373 U.S. 83 (1963), the State must disclose all exculpatory and impeachment evidence. A witness statement expressing doubt about the identification of the accused is quintessentially exculpatory. The suppression of this statement denied Johnson a fair trial and likely affected the jury's assessment of the eyewitness evidence — the State's central pillar of proof.	Brady v. Maryland	373 U.S. 83 (1963)	BINDING	The prosecution's suppression of evidence favorable to an accused violates due process where the evidence is material either to guilt or to punishment.	Whitfield's statement expressing doubt about the perpetrator's identity is directly exculpatory — it contradicts the State's theory that the identification was reliable. Detective Rodriguez admitted on cross that he deliberately set aside the statement. The State's closing argument attacked Johnson's alibi as uncorroborated while simultaneously suppressing a witness who expressed doubt.	\N	\N	2026-04-08 02:30:11.807478	25	1	Preserved	State will argue materiality under Strickler v. Greene — that there is no reasonable probability the result would have been different with Whitfield's statement, because two other witnesses identified Johnson and physical evidence (the gun) was recovered from his vehicle. State may also argue the statement was in the 'file' and technically available.	Under Kyles v. Whitley, 514 U.S. 419 (1995), materiality is evaluated based on the totality of the circumstances, not each item in isolation. The eyewitness identification was the State's primary evidence. Whitfield's doubt attacks that foundation directly. Combined with chain of custody questions on the weapon and the Miranda-tainted statement, there is a reasonable probability — not just possibility — of a different outcome. Detective Rodriguez's admission that the statement was intentionally withheld ('we didn't use his statement') establishes willfulness under Giglio v. United States.	Brady/Giglio Motion	Strong	\N	\N
10	2	2	Ineffective Assistance of Counsel — Failure to Investigate and Call Alibi Witnesses	Defense counsel did not call Terrence Webb or any alibi witnesses to corroborate the defendant's testimony	Marcus Johnson testified that he was with Terrence Webb and Webb's girlfriend at Webb's apartment when the robbery occurred. He also identified the building manager as an additional witness. Defense counsel Attorney Calvin Bowes called Johnson himself but made no effort to call, interview, or subpoena Terrence Webb, Webb's girlfriend, or the building manager. The State then used this failure in closing argument: 'No Terrence Webb came here to testify. Why? Because there is no Terrence Webb.' Under Strickland v. Washington, 466 U.S. 668 (1984), counsel's complete failure to investigate identified alibi witnesses — witnesses whose existence and location the defendant specifically provided — falls below the objective standard of reasonableness and constitutes deficiency. The prejudice is clear: the jury convicted based in part on an uncorroborated alibi that competent counsel would have corroborated.	Strickland v. Washington	466 U.S. 668 (1984)	BINDING	A defendant must show counsel's performance was deficient and that deficiency prejudiced the defense — there is a reasonable probability the result would have been different but for the deficient performance.	Johnson identified three specific corroborating witnesses by name and location. Bowes made no attempt to contact any of them. In Wiggins v. Smith, 539 U.S. 510 (2003), the Supreme Court held that counsel's failure to investigate is not justified by a strategic decision when counsel has not even gathered the information needed to make a strategic choice.	\N	\N	2026-04-08 02:30:11.807478	29	18	Unclear	State will argue strategic decision — counsel may have decided Webb's testimony was too risky or that Webb would be a weak witness. Under Strickland, courts defer to strategic choices. State will also invoke Escalona-Naranjo procedural bar if this claim was not raised on direct appeal.	A 'strategic decision' requires a strategy. Bowes did not interview Webb, did not subpoena him, and left no record of any strategic analysis. Under State v. Thiel, 2003 WI 111, counsel's failure to investigate is not protected as strategy when there is no evidence of any investigation. The Escalona-Naranjo bar is overcome because appellate counsel was also ineffective for failing to raise the IAC claim — itself an IAC claim that provides sufficient reason for the procedural default.	§ 974.06 Motion	Strong	\N	\N
11	2	2	Prosecutorial Misconduct — Improper Vouching for Government Witness Credibility	I have no doubt that Officer Martinez is telling the truth, ladies and gentlemen — she put her career on the line to make this identification.	During direct examination of Officer Martinez, ADA Gaines stated directly to the jury: 'I have no doubt that Officer Martinez is telling the truth, ladies and gentlemen — she put her career on the line to make this identification.' Defense counsel objected and the court sustained the objection. However, the curative instruction was limited to a mild 'please' from the court — no instruction was given to the jury to disregard the statement. Vouching for a witness's credibility by a government attorney is a well-established form of prosecutorial misconduct that violates a defendant's right to a fair trial under United States v. Young, 470 U.S. 1 (1985). Prosecutor's personal endorsement of witness truthfulness improperly uses the government's prestige to bolster testimony.	United States v. Young	470 U.S. 1 (1985)	BINDING	A prosecutor may not express a personal opinion as to the truth or falsity of testimony, which constitutes improper vouching that can deny the defendant a fair trial.	Gaines's statement was not ambiguous argument — it was an explicit personal guarantee of the officer's truthfulness made directly to the jury during examination, a textbook example of the vouching prohibited by Young and its progeny. The trial court's failure to give a curative instruction compounds the error.	\N	\N	2026-04-08 02:30:11.807478	27	3	Preserved	State will argue harmless error: the court sustained the objection, the jury was aware it was improper, and the officer's identification was corroborated by other evidence. State will argue the brief comment was isolated and not part of a pattern.	Under State v. Neuser, 191 Wis. 2d 131 (Ct. App. 1995), vouching is assessed in the context of the trial as a whole. Here the identification was the central contested issue. The prosecutor's endorsement of the identifying officer's truthfulness — without a curative instruction — infected the jury's deliberations on the only genuinely disputed factual question. Combined with other errors, the cumulative prejudice exceeds harmless error.	Direct Appeal	Moderate	\N	\N
12	2	2	Unconstitutional Jury Instruction — Penalizing Defendant for Failure to Produce Alibi Witnesses	The defendant's failure to produce alibi witnesses may be considered by you in evaluating his credibility. You should apply common sense.	The trial court's jury instruction directly told the jury it could negatively evaluate Marcus Johnson's credibility based on his 'failure to produce alibi witnesses.' This instruction is constitutionally infirm on multiple grounds. First, it shifts the burden of proof — the defendant has no obligation to produce any witness; the State bears the burden of proof beyond reasonable doubt. Second, the instruction implicitly penalizes Johnson for the failures of his own defense counsel, who never attempted to contact or subpoena the alibi witnesses. Under Cage v. Louisiana, 498 U.S. 39 (1990), jury instructions that reduce the prosecution's burden of proof violate due process. The instruction operated to tell the jury: 'the defendant's word is suspect because he couldn't produce witnesses' — directly undermining the presumption of innocence.	Cage v. Louisiana	498 U.S. 39 (1990)	BINDING	Jury instructions that effectively reduce the prosecution's burden below proof beyond a reasonable doubt violate the Due Process Clause of the Fourteenth Amendment.	The instruction told the jury to use 'common sense' and consider the absence of alibi witnesses against the defendant — a direct burden-shifting instruction that made Johnson's credibility contingent on producing witnesses he had a constitutional right not to produce.	\N	\N	2026-04-08 02:30:11.807478	32	2	Preserved	State will argue the instruction was a proper credibility instruction, not a burden-shifting instruction, and that courts may instruct juries to evaluate all evidence including absence of corroboration. State will distinguish Cage on grounds that this instruction did not redefine reasonable doubt.	The instruction did not merely allow the jury to consider lack of corroboration — it specifically tied the defendant's credibility to his failure to produce named witnesses who he identified in his testimony. This penalizes the defendant for the acts and omissions of counsel (the IAC claim) and cannot be considered proper. Under Sullivan v. Louisiana, 508 U.S. 275 (1993), a constitutionally deficient reasonable doubt instruction is structural error not subject to harmless error analysis.	Direct Appeal	Moderate	\N	\N
13	2	2	Chain of Custody Deficiency — Unlogged Weapon Handling by Multiple Officers	The responding officers — Patrolman Davis and Patrolman Cortez. And the forensics tech, I believe, but I'm not certain when she got to it.	Detective Rodriguez testified that the firearm recovered from Johnson's vehicle was handled by at minimum three individuals — Patrolmen Davis and Cortez, and an unnamed forensics technician — before Rodriguez logged it into evidence. Rodriguez admitted uncertainty about when the forensics tech accessed the weapon ('I'm not certain when she got to it'). The chain of custody log (Exhibit 4) was referenced in testimony but never formally admitted. Under State v. Donaldson, 2002 WI App 306, the State must establish a reasonable probability that the evidence has not been altered or tampered with. Rodriguez's admitted uncertainty creates a gap in the chain. Defense counsel did not move to exclude the weapon on this basis, compounding the IAC claim.	State v. Donaldson	2002 WI App 306 (Ct. App. 2002)	BINDING	The State must establish a reasonable probability that real evidence offered at trial has not been altered or tampered with between the time it was obtained and the time it was offered.	Rodriguez could not account for the forensics technician's access to the weapon, admitted multiple officers handled it before logging, and could not confirm when the chain of custody log (Exhibit 4) was completed. The gun is the only physical evidence tying Johnson to the crime.	\N	\N	2026-04-08 02:30:11.807478	24	3	Defaulted	State will argue defense never moved to exclude the weapon at trial, defaulting the claim. State will also argue that minor chain of custody gaps go to weight, not admissibility, and that no tampering is alleged. Strickland prejudice prong will be argued: even without the gun, eyewitness testimony supports conviction.	The procedural default is excused through the IAC of trial counsel: Bowes failed to challenge the chain of custody despite Rodriguez's on-the-stand admission of uncertainty. As an IAC claim, cause and prejudice are satisfied. On the merits, the weapon was the linchpin of the State's physical evidence — without proper foundation, its admission was an abuse of discretion that prejudiced the defense under Brecht v. Abrahamson.	§ 974.06 Motion	Moderate	\N	\N
14	2	2	Cumulative Prosecutorial and Judicial Error — Systematic Denial of Fair Trial	we kept going [...] we didn't use his statement [...] I have no doubt that Officer Martinez is telling the truth [...] The defendant's failure to produce alibi witnesses may be considered	Taken in isolation, each error in this transcript might be argued as harmless. Together, they form a complete picture of a trial that was fundamentally unfair. The interrogation continued past an invocation of counsel. The State suppressed a contradictory witness. The prosecutor vouched for the identifying officer. The trial court's instruction penalized the defendant for his counsel's failings. Counsel never investigated the alibi. The physical evidence lacked a proper foundation. Under the cumulative error doctrine, recognized in Alvarez v. Boyd, 225 F.3d 820 (7th Cir. 2000), the combined prejudicial effect of multiple errors — even if each is individually arguable as harmless — can require reversal when the errors together denied the defendant a fundamentally fair proceeding.	Alvarez v. Boyd	225 F.3d 820 (7th Cir. 2000)	PERSUASIVE	The cumulative effect of trial errors may deny the defendant a fundamentally fair trial even if no single error independently requires reversal.	Every stage of Johnson's trial was contaminated: the investigation (Miranda violation, Brady suppression), the trial (vouching, improper instruction, chain of custody), and the defense (complete failure to investigate alibi). The compounded prejudice of all these errors destroyed the integrity of the proceeding.	\N	\N	2026-04-08 02:30:11.807478	1	1	Preserved	State will argue cumulative error doctrine is not independently cognizable — each claim must independently satisfy its own standard, and a collection of individually harmless errors does not become reversible collectively. State will cite State v. Thiel for the proposition that cumulative error requires each error to be an actual error first.	Multiple of the errors here ARE independently reversible (Brady, Miranda), so the cumulative error argument layers on top of already-viable claims. Under United States v. Rivera, 900 F.2d 1462 (10th Cir. 1990), courts must consider the combined prejudicial impact. The systematic nature of the errors — affecting investigation, trial, and defense preparation — shows this was not a fair trial by any measure.	Federal Habeas § 2254	Moderate	\N	\N
\.


--
-- Data for Name: motions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.motions (id, case_id, session_id, title, content, created_at) FROM stdin;
1	1	1	Motion for Post-Conviction Relief Pursuant to Wis. Stat. § 974.06 — State v. Marcus Johnson	IN THE CIRCUIT COURT OF MILWAUKEE COUNTY\nSTATE OF WISCONSIN\n\nSTATE OF WISCONSIN,\n    Plaintiff-Respondent,\n\n    vs.                                     Case No. 2018CF000847\n\nMARCUS DEON JOHNSON,\n    Defendant-Appellant.\n\nMOTION FOR POST-CONVICTION RELIEF\nPURSUANT TO WIS. STAT. § 974.06\n\nINTRODUCTION\n\nMarcus Deon Johnson was convicted of armed robbery on June 14, 2018, following a trial infected by constitutional violations that individually undermine the verdict and collectively destroyed any possibility of a fair proceeding. Mr. Johnson now moves this Court for post-conviction relief on four independent grounds: (1) the State's deliberate suppression of an exculpatory eyewitness statement in violation of Brady v. Maryland; (2) the continuation of custodial interrogation after Mr. Johnson invoked his right to counsel in violation of Edwards v. Arizona; (3) the ineffective assistance of trial counsel in failing to investigate and present identified alibi witnesses; and (4) the cumulative effect of all errors, which denied Mr. Johnson the fundamentally fair trial the Constitution guarantees.\n\nPROCEDURAL HISTORY\n\nMr. Johnson was charged with one count of armed robbery in Milwaukee County Circuit Court on November 28, 2017. Trial commenced on June 12, 2018, before the Honorable Patricia K. Whitmore. On June 14, 2018, the jury returned a guilty verdict after three hours of deliberation. Mr. Johnson was sentenced to fifteen years imprisonment on August 3, 2018. He filed a timely notice of direct appeal, which was decided without raising the claims now before this Court. Mr. Johnson now brings this § 974.06 motion, supported by newly discovered evidence and a showing of ineffective assistance of appellate counsel as cause for any procedural default.\n\nSTATEMENT OF FACTS\n\nThe prosecution's case rested on three pillars: eyewitness identification, a statement obtained from Mr. Johnson during custodial interrogation, and a firearm recovered from his vehicle. Each pillar is now compromised.\n\nOn November 12, 2017, Detective Frank Rodriguez brought Mr. Johnson to Interview Room B and administered Miranda warnings. During the interview, Mr. Johnson stated — in Detective Rodriguez's own words at trial — "maybe I should talk to someone." Rodriguez acknowledged this statement under oath but testified that he "didn't interpret it that way" and continued the interrogation. (Trial Tr. 23:7-25.) No break was taken. No counsel was summoned. The interrogation continued until Rodriguez had what he needed.\n\nAt trial, Detective Rodriguez testified that three witnesses provided statements. Two were consistent with the prosecution's theory. The third, a James Whitfield, "said he wasn't sure it was the same person. Didn't feel confident." (Trial Tr. 25:1.) Rodriguez testified the statement was deliberately not used. Defense counsel immediately objected on the record that no Whitfield statement had ever been produced in discovery. The Court deferred the issue; it was never resolved.\n\nMr. Johnson testified that on the night of the robbery he was at the apartment of Terrence Webb, corroborated by Webb's girlfriend and the building manager. Defense counsel called no alibi witnesses other than Mr. Johnson himself. The prosecutor's closing argument made explicit use of this absence: "No Terrence Webb came here to testify. Why? Because there is no Terrence Webb who can help this man." (Trial Tr. 30:3.)\n\nThe trial court's jury instruction told jurors they could consider "the defendant's failure to produce alibi witnesses" in evaluating his credibility. (Trial Tr. 32:2.) No objection was made.\n\nLEGAL ARGUMENT\n\nI. THE STATE'S SUPPRESSION OF THE WHITFIELD STATEMENT VIOLATED BRADY v. MARYLAND AND REQUIRES A NEW TRIAL.\n\nThe Due Process Clause of the Fourteenth Amendment prohibits the prosecution from suppressing evidence favorable to the accused where it is material to guilt or punishment. Brady v. Maryland, 373 U.S. 83, 87 (1963). The Brady duty applies to impeachment evidence as well as exculpatory evidence. Giglio v. United States, 405 U.S. 150, 154 (1972). Evidence is material under Brady if "there is a reasonable probability that, had the evidence been disclosed to the defense, the result of the proceeding would have been different." United States v. Bagley, 473 U.S. 667, 682 (1985). A "reasonable probability" is one sufficient to undermine confidence in the outcome. Kyles v. Whitley, 514 U.S. 419, 434 (1995).\n\nThe Whitfield statement is paradigmatically Brady material. Whitfield — a third witness present at or near the scene — expressed uncertainty about whether Mr. Johnson was the perpetrator. This statement directly contradicts the State's theory that the eyewitness identification was reliable and unambiguous. It was suppressed — not merely not produced, but deliberately set aside, as Detective Rodriguez admitted under oath.\n\nThe materiality standard is satisfied. Eyewitness identification was the cornerstone of the State's case. The gun was physically linked to Mr. Johnson but the chain of custody was compromised. The statement — obtained after an arguably invalid Miranda waiver — was disputed. Had the jury known that a third witness expressed doubt about the identification, confidence in the verdict is undermined. There is a reasonable probability of a different result.\n\nII. THE CONTINUED INTERROGATION OF MR. JOHNSON AFTER HIS INVOCATION OF COUNSEL VIOLATED THE FIFTH AND SIXTH AMENDMENTS.\n\nOnce a suspect invokes the right to counsel during custodial interrogation, all questioning must immediately cease. Edwards v. Arizona, 451 U.S. 477, 484-85 (1981). A subsequent waiver of the right, obtained through continued interrogation initiated by police, is ineffective. Id. The invocation need not be a legal formulation — courts look to what a reasonable officer would understand the suspect to mean. Berghuis v. Thompkins, 560 U.S. 370, 381 (2010).\n\nMr. Johnson told Detective Rodriguez that he wanted "to talk to someone." Rodriguez, by his own admission, made a unilateral judgment that this was not an invocation and continued questioning. That judgment was constitutionally impermissible. The safe course under Edwards is always to stop and clarify — not to press on because the detective has 17 years of experience. The statement obtained after this invocation must be suppressed, and its admission at trial was constitutional error.\n\nIII. TRIAL COUNSEL'S COMPLETE FAILURE TO INVESTIGATE IDENTIFIED ALIBI WITNESSES CONSTITUTED INEFFECTIVE ASSISTANCE UNDER STRICKLAND.\n\nTo establish ineffective assistance of counsel, a defendant must show that counsel's performance was deficient and that the deficiency prejudiced the defense. Strickland v. Washington, 466 U.S. 668, 687 (1984). Deficiency is established when counsel's representation falls below an objective standard of reasonableness. Id. at 688. Prejudice exists where there is a reasonable probability that, but for the deficient performance, the result would have been different. Id. at 694.\n\nMr. Johnson identified Terrence Webb by name, provided his address, and identified two additional witnesses. Attorney Bowes made no effort to contact any of them. There are no investigative notes, no subpoenas, no correspondence in the record showing any alibi investigation. Under Wiggins v. Smith, 539 U.S. 510, 521-22 (2003), a strategic decision not to call a witness requires that counsel first gather the information needed to make a strategic choice. Where no investigation occurred, there is no strategy to defer to.\n\nThe prejudice showing is strong. The prosecution's closing argument used Webb's absence as its central attack on the alibi: "there is no Terrence Webb who can help this man." Had Webb testified, that argument disappears. The jury would have deliberated on a fundamentally different record — one in which the alibi was corroborated, not exposed as a fabrication.\n\nIV. THE CUMULATIVE EFFECT OF THESE ERRORS DENIED MR. JOHNSON A FUNDAMENTALLY FAIR TRIAL.\n\nEven if no individual error independently requires reversal, the cumulative effect of multiple trial errors can deny a defendant the fundamentally fair trial the Constitution guarantees. Alvarez v. Boyd, 225 F.3d 820, 824 (7th Cir. 2000); United States v. Rivera, 900 F.2d 1462, 1469-70 (10th Cir. 1990). Here, every phase of Mr. Johnson's prosecution was infected: the investigation produced a Miranda-tainted statement and a suppressed witness; the trial featured vouching by the prosecutor, a burden-shifting jury instruction, and a chain of custody gap; and the defense provided no alibi corroboration despite specific information to pursue it. This Court should consider the cumulative impact of all errors, which, taken together, make clear that Marcus Johnson never received the trial the Constitution requires.\n\nCONCLUSION\n\nFor the foregoing reasons, Mr. Johnson respectfully requests that this Court: (1) vacate his conviction; (2) order a new trial; (3) direct the production of all witness statements collected during the investigation, including the Whitfield statement; and (4) schedule a Machner evidentiary hearing on the ineffective assistance claim within 60 days.\n\nRespectfully submitted,\n\n___________________________\nCounsel for Marcus Deon Johnson\n\nCERTIFICATE OF SERVICE\n\nI hereby certify that a copy of this motion has been served upon the Milwaukee County District Attorney's Office by first-class mail on this ___ day of _________, 20__.	2026-04-05 22:50:07.261712
2	2	2	Motion for Post-Conviction Relief Pursuant to Wis. Stat. § 974.06 — State v. Marcus Johnson	IN THE CIRCUIT COURT OF MILWAUKEE COUNTY\nSTATE OF WISCONSIN\n\nSTATE OF WISCONSIN,\n    Plaintiff-Respondent,\n\n    vs.                                     Case No. 2018CF000847\n\nMARCUS DEON JOHNSON,\n    Defendant-Appellant.\n\nMOTION FOR POST-CONVICTION RELIEF\nPURSUANT TO WIS. STAT. § 974.06\n\nINTRODUCTION\n\nMarcus Deon Johnson was convicted of armed robbery on June 14, 2018, following a trial infected by constitutional violations that individually undermine the verdict and collectively destroyed any possibility of a fair proceeding. Mr. Johnson now moves this Court for post-conviction relief on four independent grounds: (1) the State's deliberate suppression of an exculpatory eyewitness statement in violation of Brady v. Maryland; (2) the continuation of custodial interrogation after Mr. Johnson invoked his right to counsel in violation of Edwards v. Arizona; (3) the ineffective assistance of trial counsel in failing to investigate and present identified alibi witnesses; and (4) the cumulative effect of all errors, which denied Mr. Johnson the fundamentally fair trial the Constitution guarantees.\n\nPROCEDURAL HISTORY\n\nMr. Johnson was charged with one count of armed robbery in Milwaukee County Circuit Court on November 28, 2017. Trial commenced on June 12, 2018, before the Honorable Patricia K. Whitmore. On June 14, 2018, the jury returned a guilty verdict after three hours of deliberation. Mr. Johnson was sentenced to fifteen years imprisonment on August 3, 2018. He filed a timely notice of direct appeal, which was decided without raising the claims now before this Court. Mr. Johnson now brings this § 974.06 motion, supported by newly discovered evidence and a showing of ineffective assistance of appellate counsel as cause for any procedural default.\n\nSTATEMENT OF FACTS\n\nThe prosecution's case rested on three pillars: eyewitness identification, a statement obtained from Mr. Johnson during custodial interrogation, and a firearm recovered from his vehicle. Each pillar is now compromised.\n\nOn November 12, 2017, Detective Frank Rodriguez brought Mr. Johnson to Interview Room B and administered Miranda warnings. During the interview, Mr. Johnson stated — in Detective Rodriguez's own words at trial — "maybe I should talk to someone." Rodriguez acknowledged this statement under oath but testified that he "didn't interpret it that way" and continued the interrogation. (Trial Tr. 23:7-25.) No break was taken. No counsel was summoned. The interrogation continued until Rodriguez had what he needed.\n\nAt trial, Detective Rodriguez testified that three witnesses provided statements. Two were consistent with the prosecution's theory. The third, a James Whitfield, "said he wasn't sure it was the same person. Didn't feel confident." (Trial Tr. 25:1.) Rodriguez testified the statement was deliberately not used. Defense counsel immediately objected on the record that no Whitfield statement had ever been produced in discovery. The Court deferred the issue; it was never resolved.\n\nMr. Johnson testified that on the night of the robbery he was at the apartment of Terrence Webb, corroborated by Webb's girlfriend and the building manager. Defense counsel called no alibi witnesses other than Mr. Johnson himself. The prosecutor's closing argument made explicit use of this absence: "No Terrence Webb came here to testify. Why? Because there is no Terrence Webb who can help this man." (Trial Tr. 30:3.)\n\nThe trial court's jury instruction told jurors they could consider "the defendant's failure to produce alibi witnesses" in evaluating his credibility. (Trial Tr. 32:2.) No objection was made.\n\nLEGAL ARGUMENT\n\nI. THE STATE'S SUPPRESSION OF THE WHITFIELD STATEMENT VIOLATED BRADY v. MARYLAND AND REQUIRES A NEW TRIAL.\n\nThe Due Process Clause of the Fourteenth Amendment prohibits the prosecution from suppressing evidence favorable to the accused where it is material to guilt or punishment. Brady v. Maryland, 373 U.S. 83, 87 (1963). The Brady duty applies to impeachment evidence as well as exculpatory evidence. Giglio v. United States, 405 U.S. 150, 154 (1972). Evidence is material under Brady if "there is a reasonable probability that, had the evidence been disclosed to the defense, the result of the proceeding would have been different." United States v. Bagley, 473 U.S. 667, 682 (1985). A "reasonable probability" is one sufficient to undermine confidence in the outcome. Kyles v. Whitley, 514 U.S. 419, 434 (1995).\n\nThe Whitfield statement is paradigmatically Brady material. Whitfield — a third witness present at or near the scene — expressed uncertainty about whether Mr. Johnson was the perpetrator. This statement directly contradicts the State's theory that the eyewitness identification was reliable and unambiguous. It was suppressed — not merely not produced, but deliberately set aside, as Detective Rodriguez admitted under oath.\n\nThe materiality standard is satisfied. Eyewitness identification was the cornerstone of the State's case. The gun was physically linked to Mr. Johnson but the chain of custody was compromised. The statement — obtained after an arguably invalid Miranda waiver — was disputed. Had the jury known that a third witness expressed doubt about the identification, confidence in the verdict is undermined. There is a reasonable probability of a different result.\n\nII. THE CONTINUED INTERROGATION OF MR. JOHNSON AFTER HIS INVOCATION OF COUNSEL VIOLATED THE FIFTH AND SIXTH AMENDMENTS.\n\nOnce a suspect invokes the right to counsel during custodial interrogation, all questioning must immediately cease. Edwards v. Arizona, 451 U.S. 477, 484-85 (1981). A subsequent waiver of the right, obtained through continued interrogation initiated by police, is ineffective. Id. The invocation need not be a legal formulation — courts look to what a reasonable officer would understand the suspect to mean. Berghuis v. Thompkins, 560 U.S. 370, 381 (2010).\n\nMr. Johnson told Detective Rodriguez that he wanted "to talk to someone." Rodriguez, by his own admission, made a unilateral judgment that this was not an invocation and continued questioning. That judgment was constitutionally impermissible. The safe course under Edwards is always to stop and clarify — not to press on because the detective has 17 years of experience. The statement obtained after this invocation must be suppressed, and its admission at trial was constitutional error.\n\nIII. TRIAL COUNSEL'S COMPLETE FAILURE TO INVESTIGATE IDENTIFIED ALIBI WITNESSES CONSTITUTED INEFFECTIVE ASSISTANCE UNDER STRICKLAND.\n\nTo establish ineffective assistance of counsel, a defendant must show that counsel's performance was deficient and that the deficiency prejudiced the defense. Strickland v. Washington, 466 U.S. 668, 687 (1984). Deficiency is established when counsel's representation falls below an objective standard of reasonableness. Id. at 688. Prejudice exists where there is a reasonable probability that, but for the deficient performance, the result would have been different. Id. at 694.\n\nMr. Johnson identified Terrence Webb by name, provided his address, and identified two additional witnesses. Attorney Bowes made no effort to contact any of them. There are no investigative notes, no subpoenas, no correspondence in the record showing any alibi investigation. Under Wiggins v. Smith, 539 U.S. 510, 521-22 (2003), a strategic decision not to call a witness requires that counsel first gather the information needed to make a strategic choice. Where no investigation occurred, there is no strategy to defer to.\n\nThe prejudice showing is strong. The prosecution's closing argument used Webb's absence as its central attack on the alibi: "there is no Terrence Webb who can help this man." Had Webb testified, that argument disappears. The jury would have deliberated on a fundamentally different record — one in which the alibi was corroborated, not exposed as a fabrication.\n\nIV. THE CUMULATIVE EFFECT OF THESE ERRORS DENIED MR. JOHNSON A FUNDAMENTALLY FAIR TRIAL.\n\nEven if no individual error independently requires reversal, the cumulative effect of multiple trial errors can deny a defendant the fundamentally fair trial the Constitution guarantees. Alvarez v. Boyd, 225 F.3d 820, 824 (7th Cir. 2000); United States v. Rivera, 900 F.2d 1462, 1469-70 (10th Cir. 1990). Here, every phase of Mr. Johnson's prosecution was infected: the investigation produced a Miranda-tainted statement and a suppressed witness; the trial featured vouching by the prosecutor, a burden-shifting jury instruction, and a chain of custody gap; and the defense provided no alibi corroboration despite specific information to pursue it. This Court should consider the cumulative impact of all errors, which, taken together, make clear that Marcus Johnson never received the trial the Constitution requires.\n\nCONCLUSION\n\nFor the foregoing reasons, Mr. Johnson respectfully requests that this Court: (1) vacate his conviction; (2) order a new trial; (3) direct the production of all witness statements collected during the investigation, including the Whitfield statement; and (4) schedule a Machner evidentiary hearing on the ineffective assistance claim within 60 days.\n\nRespectfully submitted,\n\n___________________________\nCounsel for Marcus Deon Johnson\n\nCERTIFICATE OF SERVICE\n\nI hereby certify that a copy of this motion has been served upon the Milwaukee County District Attorney's Office by first-class mail on this ___ day of _________, 20__.	2026-04-08 02:30:11.807478
\.


--
-- Name: analysis_runs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.analysis_runs_id_seq', 1, false);


--
-- Name: case_strategies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.case_strategies_id_seq', 1, false);


--
-- Name: cases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cases_id_seq', 2, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 24, true);


--
-- Name: court_rounds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.court_rounds_id_seq', 8, true);


--
-- Name: court_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.court_sessions_id_seq', 2, true);


--
-- Name: cross_case_matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cross_case_matches_id_seq', 1, false);


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documents_id_seq', 2, true);


--
-- Name: findings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.findings_id_seq', 14, true);


--
-- Name: motions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.motions_id_seq', 2, true);


--
-- Name: analysis_runs analysis_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analysis_runs
    ADD CONSTRAINT analysis_runs_pkey PRIMARY KEY (id);


--
-- Name: case_strategies case_strategies_case_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_strategies
    ADD CONSTRAINT case_strategies_case_id_unique UNIQUE (case_id);


--
-- Name: case_strategies case_strategies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_strategies
    ADD CONSTRAINT case_strategies_pkey PRIMARY KEY (id);


--
-- Name: cases cases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: court_rounds court_rounds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.court_rounds
    ADD CONSTRAINT court_rounds_pkey PRIMARY KEY (id);


--
-- Name: court_sessions court_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.court_sessions
    ADD CONSTRAINT court_sessions_pkey PRIMARY KEY (id);


--
-- Name: cross_case_matches cross_case_matches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cross_case_matches
    ADD CONSTRAINT cross_case_matches_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: findings findings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.findings
    ADD CONSTRAINT findings_pkey PRIMARY KEY (id);


--
-- Name: motions motions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.motions
    ADD CONSTRAINT motions_pkey PRIMARY KEY (id);


--
-- Name: analysis_runs analysis_runs_case_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analysis_runs
    ADD CONSTRAINT analysis_runs_case_id_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: analysis_runs analysis_runs_document_id_documents_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analysis_runs
    ADD CONSTRAINT analysis_runs_document_id_documents_id_fk FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- Name: case_strategies case_strategies_case_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_strategies
    ADD CONSTRAINT case_strategies_case_id_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: court_rounds court_rounds_session_id_court_sessions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.court_rounds
    ADD CONSTRAINT court_rounds_session_id_court_sessions_id_fk FOREIGN KEY (session_id) REFERENCES public.court_sessions(id) ON DELETE CASCADE;


--
-- Name: court_sessions court_sessions_case_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.court_sessions
    ADD CONSTRAINT court_sessions_case_id_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: cross_case_matches cross_case_matches_finding_id_findings_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cross_case_matches
    ADD CONSTRAINT cross_case_matches_finding_id_findings_id_fk FOREIGN KEY (finding_id) REFERENCES public.findings(id) ON DELETE CASCADE;


--
-- Name: documents documents_case_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_case_id_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: findings findings_case_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.findings
    ADD CONSTRAINT findings_case_id_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: findings findings_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.findings
    ADD CONSTRAINT findings_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: findings findings_document_id_documents_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.findings
    ADD CONSTRAINT findings_document_id_documents_id_fk FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- Name: motions motions_case_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.motions
    ADD CONSTRAINT motions_case_id_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: motions motions_session_id_court_sessions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.motions
    ADD CONSTRAINT motions_session_id_court_sessions_id_fk FOREIGN KEY (session_id) REFERENCES public.court_sessions(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict w2Y58Lj7FeuHvQKkaxjY9qnJMhkGRJxEYzpoAInwktJ63cpXoCRmKT4yjHRDqNU

