--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-09-13 02:50:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 890 (class 1247 OID 146120)
-- Name: ApplicationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ApplicationStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."ApplicationStatus" OWNER TO postgres;

--
-- TOC entry 896 (class 1247 OID 146136)
-- Name: PaperStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaperStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED',
    'UNDER_REVIEW'
);


ALTER TYPE public."PaperStatus" OWNER TO postgres;

--
-- TOC entry 899 (class 1247 OID 146146)
-- Name: ReviewerStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReviewerStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'PENDING'
);


ALTER TYPE public."ReviewerStatus" OWNER TO postgres;

--
-- TOC entry 881 (class 1247 OID 146095)
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'TEACHER',
    'REVIEWER',
    'STUDENT',
    'GENERALUSER'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- TOC entry 893 (class 1247 OID 146128)
-- Name: TeamRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TeamRole" AS ENUM (
    'LEAD',
    'RESEARCHER',
    'ASSISTANT'
);


ALTER TYPE public."TeamRole" OWNER TO postgres;

--
-- TOC entry 884 (class 1247 OID 146106)
-- Name: TeamStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TeamStatus" AS ENUM (
    'ACTIVE',
    'RECRUITING',
    'INACTIVE'
);


ALTER TYPE public."TeamStatus" OWNER TO postgres;

--
-- TOC entry 887 (class 1247 OID 146114)
-- Name: TeamVisibility; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TeamVisibility" AS ENUM (
    'PUBLIC',
    'PRIVATE'
);


ALTER TYPE public."TeamVisibility" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 146085)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 146168)
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin (
    admin_id integer NOT NULL,
    user_id integer
);


ALTER TABLE public.admin OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 146167)
-- Name: admin_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_admin_id_seq OWNER TO postgres;

--
-- TOC entry 5134 (class 0 OID 0)
-- Dependencies: 220
-- Name: admin_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_admin_id_seq OWNED BY public.admin.admin_id;


--
-- TOC entry 223 (class 1259 OID 146175)
-- Name: department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.department (
    department_id integer NOT NULL,
    department_name text
);


ALTER TABLE public.department OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 146174)
-- Name: department_department_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.department_department_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.department_department_id_seq OWNER TO postgres;

--
-- TOC entry 5135 (class 0 OID 0)
-- Dependencies: 222
-- Name: department_department_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.department_department_id_seq OWNED BY public.department.department_id;


--
-- TOC entry 226 (class 1259 OID 146192)
-- Name: departmentdomain; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departmentdomain (
    department_id integer NOT NULL,
    domain_id integer NOT NULL
);


ALTER TABLE public.departmentdomain OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 146184)
-- Name: domain; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.domain (
    domain_id integer NOT NULL,
    domain_name text
);


ALTER TABLE public.domain OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 146183)
-- Name: domain_domain_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.domain_domain_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.domain_domain_id_seq OWNER TO postgres;

--
-- TOC entry 5136 (class 0 OID 0)
-- Dependencies: 224
-- Name: domain_domain_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.domain_domain_id_seq OWNED BY public.domain.domain_id;


--
-- TOC entry 228 (class 1259 OID 146198)
-- Name: generaluser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.generaluser (
    generaluser_id integer NOT NULL,
    user_id integer
);


ALTER TABLE public.generaluser OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 146197)
-- Name: generaluser_generaluser_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.generaluser_generaluser_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.generaluser_generaluser_id_seq OWNER TO postgres;

--
-- TOC entry 5137 (class 0 OID 0)
-- Dependencies: 227
-- Name: generaluser_generaluser_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.generaluser_generaluser_id_seq OWNED BY public.generaluser.generaluser_id;


--
-- TOC entry 242 (class 1259 OID 146264)
-- Name: paper; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paper (
    paper_id integer NOT NULL,
    title text,
    abstract text,
    team_id integer,
    submitted_by integer,
    pdf_path text,
    file_size integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."PaperStatus" DEFAULT 'PENDING'::public."PaperStatus"
);


ALTER TABLE public.paper OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 146263)
-- Name: paper_paper_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paper_paper_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paper_paper_id_seq OWNER TO postgres;

--
-- TOC entry 5138 (class 0 OID 0)
-- Dependencies: 241
-- Name: paper_paper_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paper_paper_id_seq OWNED BY public.paper.paper_id;


--
-- TOC entry 244 (class 1259 OID 146275)
-- Name: proposal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proposal (
    proposal_id integer NOT NULL,
    title text,
    abstract text,
    team_id integer,
    submitted_by integer,
    pdf_path text,
    file_size integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."PaperStatus" DEFAULT 'PENDING'::public."PaperStatus"
);


ALTER TABLE public.proposal OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 146274)
-- Name: proposal_proposal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proposal_proposal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proposal_proposal_id_seq OWNER TO postgres;

--
-- TOC entry 5139 (class 0 OID 0)
-- Dependencies: 243
-- Name: proposal_proposal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.proposal_proposal_id_seq OWNED BY public.proposal.proposal_id;


--
-- TOC entry 246 (class 1259 OID 146286)
-- Name: review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review (
    review_id integer NOT NULL,
    reviewer_id integer,
    proposal_id integer,
    paper_id integer,
    comments text,
    score integer,
    decision text,
    reviewed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.review OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 146285)
-- Name: review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_review_id_seq OWNER TO postgres;

--
-- TOC entry 5140 (class 0 OID 0)
-- Dependencies: 245
-- Name: review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_review_id_seq OWNED BY public.review.review_id;


--
-- TOC entry 233 (class 1259 OID 146223)
-- Name: reviewer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviewer (
    reviewer_id integer NOT NULL,
    teacher_id integer,
    status public."ReviewerStatus" DEFAULT 'ACTIVE'::public."ReviewerStatus"
);


ALTER TABLE public.reviewer OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 146296)
-- Name: reviewerassignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviewerassignment (
    assignment_id integer NOT NULL,
    reviewer_id integer,
    proposal_id integer,
    paper_id integer,
    assigned_by integer
);


ALTER TABLE public.reviewerassignment OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 146295)
-- Name: reviewerassignment_assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviewerassignment_assignment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviewerassignment_assignment_id_seq OWNER TO postgres;

--
-- TOC entry 5141 (class 0 OID 0)
-- Dependencies: 247
-- Name: reviewerassignment_assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviewerassignment_assignment_id_seq OWNED BY public.reviewerassignment.assignment_id;


--
-- TOC entry 230 (class 1259 OID 146205)
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    student_id integer NOT NULL,
    roll_number text,
    department_id integer,
    user_id integer
);


ALTER TABLE public.student OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 146204)
-- Name: student_student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_student_id_seq OWNER TO postgres;

--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 229
-- Name: student_student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_student_id_seq OWNED BY public.student.student_id;


--
-- TOC entry 232 (class 1259 OID 146214)
-- Name: teacher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher (
    teacher_id integer NOT NULL,
    designation text,
    department_id integer,
    user_id integer,
    "isReviewer" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.teacher OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 146213)
-- Name: teacher_teacher_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teacher_teacher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teacher_teacher_id_seq OWNER TO postgres;

--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 231
-- Name: teacher_teacher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teacher_teacher_id_seq OWNED BY public.teacher.teacher_id;


--
-- TOC entry 235 (class 1259 OID 146230)
-- Name: team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team (
    team_id integer NOT NULL,
    team_name text,
    team_description text,
    domain_id integer,
    status public."TeamStatus",
    visibility public."TeamVisibility",
    max_members integer,
    "isHiring" boolean,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by_user_id integer
);


ALTER TABLE public.team OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 146229)
-- Name: team_team_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.team_team_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.team_team_id_seq OWNER TO postgres;

--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 234
-- Name: team_team_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.team_team_id_seq OWNED BY public.team.team_id;


--
-- TOC entry 238 (class 1259 OID 146245)
-- Name: teamapplication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teamapplication (
    application_id integer NOT NULL,
    team_id integer NOT NULL,
    student_id integer NOT NULL,
    status public."ApplicationStatus" DEFAULT 'PENDING'::public."ApplicationStatus" NOT NULL,
    applied_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.teamapplication OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 146244)
-- Name: teamapplication_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teamapplication_application_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teamapplication_application_id_seq OWNER TO postgres;

--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 237
-- Name: teamapplication_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teamapplication_application_id_seq OWNED BY public.teamapplication.application_id;


--
-- TOC entry 240 (class 1259 OID 146254)
-- Name: teamcomment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teamcomment (
    comment_id integer NOT NULL,
    team_id integer NOT NULL,
    user_id integer NOT NULL,
    comment text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.teamcomment OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 146253)
-- Name: teamcomment_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teamcomment_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teamcomment_comment_id_seq OWNER TO postgres;

--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 239
-- Name: teamcomment_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teamcomment_comment_id_seq OWNED BY public.teamcomment.comment_id;


--
-- TOC entry 236 (class 1259 OID 146239)
-- Name: teammember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teammember (
    team_id integer NOT NULL,
    user_id integer NOT NULL,
    role_in_team public."TeamRole"
);


ALTER TABLE public.teammember OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 146156)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    user_id integer NOT NULL,
    name text,
    email text,
    password text,
    role public."Role",
    "isVerified" boolean DEFAULT false NOT NULL,
    "isMainAdmin" boolean DEFAULT false NOT NULL,
    "verifyToken" text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    profile_image text
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 146155)
-- Name: user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_user_id_seq OWNER TO postgres;

--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 218
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_user_id_seq OWNED BY public."user".user_id;


--
-- TOC entry 249 (class 1259 OID 146302)
-- Name: userdomain; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userdomain (
    user_id integer NOT NULL,
    domain_id integer NOT NULL
);


ALTER TABLE public.userdomain OWNER TO postgres;

--
-- TOC entry 4854 (class 2604 OID 146171)
-- Name: admin admin_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin ALTER COLUMN admin_id SET DEFAULT nextval('public.admin_admin_id_seq'::regclass);


--
-- TOC entry 4855 (class 2604 OID 146178)
-- Name: department department_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department ALTER COLUMN department_id SET DEFAULT nextval('public.department_department_id_seq'::regclass);


--
-- TOC entry 4856 (class 2604 OID 146187)
-- Name: domain domain_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domain ALTER COLUMN domain_id SET DEFAULT nextval('public.domain_domain_id_seq'::regclass);


--
-- TOC entry 4857 (class 2604 OID 146201)
-- Name: generaluser generaluser_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generaluser ALTER COLUMN generaluser_id SET DEFAULT nextval('public.generaluser_generaluser_id_seq'::regclass);


--
-- TOC entry 4869 (class 2604 OID 146267)
-- Name: paper paper_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paper ALTER COLUMN paper_id SET DEFAULT nextval('public.paper_paper_id_seq'::regclass);


--
-- TOC entry 4872 (class 2604 OID 146278)
-- Name: proposal proposal_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proposal ALTER COLUMN proposal_id SET DEFAULT nextval('public.proposal_proposal_id_seq'::regclass);


--
-- TOC entry 4875 (class 2604 OID 146289)
-- Name: review review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review ALTER COLUMN review_id SET DEFAULT nextval('public.review_review_id_seq'::regclass);


--
-- TOC entry 4877 (class 2604 OID 146299)
-- Name: reviewerassignment assignment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviewerassignment ALTER COLUMN assignment_id SET DEFAULT nextval('public.reviewerassignment_assignment_id_seq'::regclass);


--
-- TOC entry 4858 (class 2604 OID 146208)
-- Name: student student_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student ALTER COLUMN student_id SET DEFAULT nextval('public.student_student_id_seq'::regclass);


--
-- TOC entry 4859 (class 2604 OID 146217)
-- Name: teacher teacher_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher ALTER COLUMN teacher_id SET DEFAULT nextval('public.teacher_teacher_id_seq'::regclass);


--
-- TOC entry 4862 (class 2604 OID 146233)
-- Name: team team_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team ALTER COLUMN team_id SET DEFAULT nextval('public.team_team_id_seq'::regclass);


--
-- TOC entry 4864 (class 2604 OID 146248)
-- Name: teamapplication application_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teamapplication ALTER COLUMN application_id SET DEFAULT nextval('public.teamapplication_application_id_seq'::regclass);


--
-- TOC entry 4867 (class 2604 OID 146257)
-- Name: teamcomment comment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teamcomment ALTER COLUMN comment_id SET DEFAULT nextval('public.teamcomment_comment_id_seq'::regclass);


--
-- TOC entry 4850 (class 2604 OID 146159)
-- Name: user user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN user_id SET DEFAULT nextval('public.user_user_id_seq'::regclass);


--
-- TOC entry 5096 (class 0 OID 146085)
-- Dependencies: 217
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
1141555d-af02-4a3c-b765-2a5dfe09a0b6	51f6915f225b1f60d182adbf345e7c9ed86633ac16aedf25591006737000dd88	2025-09-12 21:02:02.486008+06	20250912150202_created_db	\N	\N	2025-09-12 21:02:02.405856+06	1
6601da37-9a1d-4b5d-b123-178154edde03	382fff0cb103f2c4a412644973cefc94752fafe526bc3c1eb2d41f820aa4d381	2025-09-13 02:42:18.769538+06	20250909195634_delete_reviewer_preference		\N	2025-09-13 02:42:18.769538+06	0
0e35c060-c5af-4aee-af9d-7fe77c4efc46	4cd5a98e98ac5a0d1f969c903761134d26d21cb64c531400e8255e27dcc774ee	2025-09-13 02:46:26.653692+06	20250905201542_removed_reviewerpreference_table		\N	2025-09-13 02:46:26.653692+06	0
\.


--
-- TOC entry 5100 (class 0 OID 146168)
-- Dependencies: 221
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin (admin_id, user_id) FROM stdin;
1	11
\.


--
-- TOC entry 5102 (class 0 OID 146175)
-- Dependencies: 223
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.department (department_id, department_name) FROM stdin;
1	CSE
2	EEE
\.


--
-- TOC entry 5105 (class 0 OID 146192)
-- Dependencies: 226
-- Data for Name: departmentdomain; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departmentdomain (department_id, domain_id) FROM stdin;
1	1
1	2
1	4
1	13
1	14
1	15
1	16
1	17
1	18
1	19
2	1
2	3
2	5
2	6
2	7
2	8
2	9
2	10
2	11
2	12
\.


--
-- TOC entry 5104 (class 0 OID 146184)
-- Dependencies: 225
-- Data for Name: domain; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.domain (domain_id, domain_name) FROM stdin;
1	Artificial Intelligence
2	Machine Learning
3	Computer Vision
4	Data Science
5	Robotics
6	Embedded Systems
7	Power Electronics
8	Control Systems
9	Renewable Energy Systems
10	Signal Processing
11	Microelectronics
12	VLSI Design
13	Software Engineering
14	Cybersecurity
15	Computer Networks
16	Databases and Information Systems
17	Human-Computer Interaction
18	Operating Systems
19	Distributed Systems
\.


--
-- TOC entry 5107 (class 0 OID 146198)
-- Dependencies: 228
-- Data for Name: generaluser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.generaluser (generaluser_id, user_id) FROM stdin;
1	1
\.


--
-- TOC entry 5121 (class 0 OID 146264)
-- Dependencies: 242
-- Data for Name: paper; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paper (paper_id, title, abstract, team_id, submitted_by, pdf_path, file_size, created_at, status) FROM stdin;
\.


--
-- TOC entry 5123 (class 0 OID 146275)
-- Dependencies: 244
-- Data for Name: proposal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proposal (proposal_id, title, abstract, team_id, submitted_by, pdf_path, file_size, created_at, status) FROM stdin;
1	Smart Traffic Monitoring Using Deep Learning	This research proposal aims to develop an intelligent traffic monitoring system using deep learning techniques to detect and analyze vehicles, pedestrians, and traffic patterns in real-time. The system will leverage convolutional neural networks (CNNs) and object detection algorithms to enhance traffic management and safety.	\N	1	documents/b9a5dd82-4387-4b7b-a614-6a7b2ed332c1.pdf	1850417	2025-09-12 19:26:24.433	PENDING
2	Smart Traffic Monitoring Using Deep Learning	This research proposal aims to develop an intelligent traffic monitoring system using deep learning techniques to detect and analyze vehicles, pedestrians, and traffic patterns in real-time. The system will leverage convolutional neural networks (CNNs) and object detection algorithms to enhance traffic management and safety.	1	1	documents/ab27f488-e43b-4b34-a932-c7c3a426c697.pdf	94464	2025-09-12 19:30:32.03	PENDING
\.


--
-- TOC entry 5125 (class 0 OID 146286)
-- Dependencies: 246
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review (review_id, reviewer_id, proposal_id, paper_id, comments, score, decision, reviewed_at) FROM stdin;
\.


--
-- TOC entry 5112 (class 0 OID 146223)
-- Dependencies: 233
-- Data for Name: reviewer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviewer (reviewer_id, teacher_id, status) FROM stdin;
3	3	PENDING
4	4	ACTIVE
\.


--
-- TOC entry 5127 (class 0 OID 146296)
-- Dependencies: 248
-- Data for Name: reviewerassignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviewerassignment (assignment_id, reviewer_id, proposal_id, paper_id, assigned_by) FROM stdin;
\.


--
-- TOC entry 5109 (class 0 OID 146205)
-- Dependencies: 230
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student (student_id, roll_number, department_id, user_id) FROM stdin;
1	20701051	1	4
2	21701039	1	5
3	20702027	2	7
4	21702016	2	10
\.


--
-- TOC entry 5111 (class 0 OID 146214)
-- Dependencies: 232
-- Data for Name: teacher; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher (teacher_id, designation, department_id, user_id, "isReviewer") FROM stdin;
2	Associate Professor	2	3	f
5	Lecturer	1	9	f
1	Professor	1	2	f
3	Professor	1	6	t
4	Professor	2	8	t
\.


--
-- TOC entry 5114 (class 0 OID 146230)
-- Dependencies: 235
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team (team_id, team_name, team_description, domain_id, status, visibility, max_members, "isHiring", created_at, created_by_user_id) FROM stdin;
1	DeepVision Innovators	A collaborative research team focusing on advanced computer vision, deep learning, and AI-driven solutions for real-world applications.	1	ACTIVE	PUBLIC	3	t	2025-09-12 19:17:36.1	2
\.


--
-- TOC entry 5117 (class 0 OID 146245)
-- Dependencies: 238
-- Data for Name: teamapplication; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teamapplication (application_id, team_id, student_id, status, applied_at) FROM stdin;
\.


--
-- TOC entry 5119 (class 0 OID 146254)
-- Dependencies: 240
-- Data for Name: teamcomment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teamcomment (comment_id, team_id, user_id, comment, created_at) FROM stdin;
\.


--
-- TOC entry 5115 (class 0 OID 146239)
-- Dependencies: 236
-- Data for Name: teammember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teammember (team_id, user_id, role_in_team) FROM stdin;
1	2	LEAD
1	4	ASSISTANT
\.


--
-- TOC entry 5098 (class 0 OID 146156)
-- Dependencies: 219
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (user_id, name, email, password, role, "isVerified", "isMainAdmin", "verifyToken", created_at, profile_image) FROM stdin;
1	Umme Maimuna Tishma	fahmida.csecu@gmail.com	$2b$10$9YTDap34YNQJY1rB4TUmpu6yqk4E5St4Vr1sV4eVDcHc1OnhznE4u	GENERALUSER	t	f	\N	2025-09-12 15:07:33.946	\N
3	Dr. Fahmida Rahman	fahmidarahman027@gmail.com	$2b$10$9H0lC3KMmJVoLx7z0biK2ubugW6Vc.XEsvXd6uyMf3oiWUybPMpaO	TEACHER	t	f	\N	2025-09-12 16:38:03.631	\N
4	Toasean Elmah Tasean	tushu.016@gmail.com	$2b$10$bW3njuBZzvgDXOaFY9BzrOhV.5ihuOQqdiDBmX.kcZ7wpcAWfEYey	STUDENT	t	f	\N	2025-09-12 16:40:43.135	\N
5	Fariha Alam Mazumder	toaseanelmah@gmail.com	$2b$10$eGvBicy3f1wgjXdsuK0vm.h9knvnS..bB.imQz2Tqq1.YAWumcmVS	STUDENT	t	f	\N	2025-09-12 16:44:07.207	\N
6	Mohammad Rokan Uddin Faruqi	urcms.cu@gmail.com	$2b$10$VWs26xz8xfLErPm.LqSbjeAJV.II8PNzVX43K7NFuok8dZD.mEv8K	TEACHER	t	f	\N	2025-09-12 16:47:42.77	\N
7	Umme Fahmida	tushu.rs7@gmail.com	$2b$10$tTHAfPaXro/76v0KUtyXe.I51P0COXjsMhczr6vSQLHWrQ5qfjEi.	STUDENT	t	f	\N	2025-09-12 16:49:35.065	\N
8	Dipannita Das	fatimashome258@gmail.com	$2b$10$sPHnZJ7Z7rgFPphOgAzP2.m5ltYA8dtV49EtOf9eMyHqyRnznJ71G	TEACHER	t	f	\N	2025-09-12 16:56:48.907	\N
9	Dr. Elmah	toaseanafnan0208@gmail.com	$2b$10$t8oqkTPhg3TGNXDI3UqTJe1nzSW/sCCUQbmhFWm2uciRF/bueNvIC	TEACHER	t	f	\N	2025-09-12 17:00:48.458	\N
10	Mst. Erina Akter	fatima.tushu@gmail.com	$2b$10$HwhGa46K2rjOozPFosQYDeio6z5kkghSdWhA8LgtrA8DLhmEwef7y	STUDENT	t	f	\N	2025-09-12 17:07:09.828	\N
2	Dr. Humayratul Ekra	ekrahumayratul@gmail.com	$2b$10$xzgs1.Vvrd15CVbfYs8zR.jsNQ.dn6Q29hacRYpiIcwaryICAeora	TEACHER	t	f	\N	2025-09-12 15:54:42.719	images/4dfe974e-e8bb-45de-bee0-083bdb1f8ecc.png
11	Main Admin	admin@example.com	$2b$10$WNB0/49wxFvdf2tU7PSJMezjNk4PJgPXAlj8fYnlOjGvz0/MsLZdq	ADMIN	t	t	\N	2025-09-12 17:12:56.277	images/75eb4e61-4412-49d0-9f84-cb89b06eea6d.png
\.


--
-- TOC entry 5128 (class 0 OID 146302)
-- Dependencies: 249
-- Data for Name: userdomain; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.userdomain (user_id, domain_id) FROM stdin;
2	1
2	4
2	17
2	2
2	13
3	1
3	3
3	5
3	6
3	7
4	1
4	2
4	4
4	13
5	1
5	2
5	4
5	13
6	1
6	2
6	4
6	13
7	1
7	3
7	5
7	6
7	7
8	1
8	3
8	5
8	6
8	7
9	1
9	2
9	4
9	13
10	1
10	3
10	5
10	6
10	7
\.


--
-- TOC entry 5148 (class 0 OID 0)
-- Dependencies: 220
-- Name: admin_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_admin_id_seq', 1, true);


--
-- TOC entry 5149 (class 0 OID 0)
-- Dependencies: 222
-- Name: department_department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.department_department_id_seq', 2, true);


--
-- TOC entry 5150 (class 0 OID 0)
-- Dependencies: 224
-- Name: domain_domain_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.domain_domain_id_seq', 19, true);


--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 227
-- Name: generaluser_generaluser_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.generaluser_generaluser_id_seq', 1, true);


--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 241
-- Name: paper_paper_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paper_paper_id_seq', 1, true);


--
-- TOC entry 5153 (class 0 OID 0)
-- Dependencies: 243
-- Name: proposal_proposal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.proposal_proposal_id_seq', 2, true);


--
-- TOC entry 5154 (class 0 OID 0)
-- Dependencies: 245
-- Name: review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_review_id_seq', 1, false);


--
-- TOC entry 5155 (class 0 OID 0)
-- Dependencies: 247
-- Name: reviewerassignment_assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviewerassignment_assignment_id_seq', 1, false);


--
-- TOC entry 5156 (class 0 OID 0)
-- Dependencies: 229
-- Name: student_student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_student_id_seq', 4, true);


--
-- TOC entry 5157 (class 0 OID 0)
-- Dependencies: 231
-- Name: teacher_teacher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teacher_teacher_id_seq', 5, true);


--
-- TOC entry 5158 (class 0 OID 0)
-- Dependencies: 234
-- Name: team_team_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.team_team_id_seq', 2, true);


--
-- TOC entry 5159 (class 0 OID 0)
-- Dependencies: 237
-- Name: teamapplication_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teamapplication_application_id_seq', 1, false);


--
-- TOC entry 5160 (class 0 OID 0)
-- Dependencies: 239
-- Name: teamcomment_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teamcomment_comment_id_seq', 1, false);


--
-- TOC entry 5161 (class 0 OID 0)
-- Dependencies: 218
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_user_id_seq', 11, true);


--
-- TOC entry 4879 (class 2606 OID 146093)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4884 (class 2606 OID 146173)
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (admin_id);


--
-- TOC entry 4887 (class 2606 OID 146182)
-- Name: department department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (department_id);


--
-- TOC entry 4892 (class 2606 OID 146196)
-- Name: departmentdomain departmentdomain_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departmentdomain
    ADD CONSTRAINT departmentdomain_pkey PRIMARY KEY (department_id, domain_id);


--
-- TOC entry 4890 (class 2606 OID 146191)
-- Name: domain domain_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domain
    ADD CONSTRAINT domain_pkey PRIMARY KEY (domain_id);


--
-- TOC entry 4894 (class 2606 OID 146203)
-- Name: generaluser generaluser_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generaluser
    ADD CONSTRAINT generaluser_pkey PRIMARY KEY (generaluser_id);


--
-- TOC entry 4912 (class 2606 OID 146273)
-- Name: paper paper_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paper
    ADD CONSTRAINT paper_pkey PRIMARY KEY (paper_id);


--
-- TOC entry 4914 (class 2606 OID 146284)
-- Name: proposal proposal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proposal
    ADD CONSTRAINT proposal_pkey PRIMARY KEY (proposal_id);


--
-- TOC entry 4916 (class 2606 OID 146294)
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (review_id);


--
-- TOC entry 4900 (class 2606 OID 146228)
-- Name: reviewer reviewer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviewer
    ADD CONSTRAINT reviewer_pkey PRIMARY KEY (reviewer_id);


--
-- TOC entry 4918 (class 2606 OID 146301)
-- Name: reviewerassignment reviewerassignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviewerassignment
    ADD CONSTRAINT reviewerassignment_pkey PRIMARY KEY (assignment_id);


--
-- TOC entry 4896 (class 2606 OID 146212)
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (student_id);


--
-- TOC entry 4898 (class 2606 OID 146222)
-- Name: teacher teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_pkey PRIMARY KEY (teacher_id);


--
-- TOC entry 4903 (class 2606 OID 146238)
-- Name: team team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (team_id);


--
-- TOC entry 4907 (class 2606 OID 146252)
-- Name: teamapplication teamapplication_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teamapplication
    ADD CONSTRAINT teamapplication_pkey PRIMARY KEY (application_id);


--
-- TOC entry 4910 (class 2606 OID 146262)
-- Name: teamcomment teamcomment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teamcomment
    ADD CONSTRAINT teamcomment_pkey PRIMARY KEY (comment_id);


--
-- TOC entry 4905 (class 2606 OID 146243)
-- Name: teammember teammember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teammember
    ADD CONSTRAINT teammember_pkey PRIMARY KEY (team_id, user_id);


--
-- TOC entry 4882 (class 2606 OID 146166)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4920 (class 2606 OID 146306)
-- Name: userdomain userdomain_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userdomain
    ADD CONSTRAINT userdomain_pkey PRIMARY KEY (user_id, domain_id);


--
-- TOC entry 4885 (class 1259 OID 146308)
-- Name: department_department_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX department_department_name_key ON public.department USING btree (department_name);


--
-- TOC entry 4888 (class 1259 OID 146309)
-- Name: domain_domain_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX domain_domain_name_key ON public.domain USING btree (domain_name);


--
-- TOC entry 4901 (class 1259 OID 146310)
-- Name: reviewer_teacher_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX reviewer_teacher_id_key ON public.reviewer USING btree (teacher_id);


--
-- TOC entry 4908 (class 1259 OID 146311)
-- Name: teamapplication_team_id_student_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX teamapplication_team_id_student_id_key ON public.teamapplication USING btree (team_id, student_id);


--
-- TOC entry 4880 (class 1259 OID 146307)
-- Name: user_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);


--
-- TOC entry 4921 (class 2606 OID 146312)
-- Name: admin admin_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4922 (class 2606 OID 146317)
-- Name: departmentdomain departmentdomain_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departmentdomain
    ADD CONSTRAINT departmentdomain_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.department(department_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4923 (class 2606 OID 146322)
-- Name: departmentdomain departmentdomain_domain_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departmentdomain
    ADD CONSTRAINT departmentdomain_domain_id_fkey FOREIGN KEY (domain_id) REFERENCES public.domain(domain_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4924 (class 2606 OID 146327)
-- Name: generaluser generaluser_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generaluser
    ADD CONSTRAINT generaluser_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4938 (class 2606 OID 146397)
-- Name: paper paper_submitted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paper
    ADD CONSTRAINT paper_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES public.teacher(teacher_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4939 (class 2606 OID 146402)
-- Name: paper paper_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paper
    ADD CONSTRAINT paper_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4940 (class 2606 OID 146407)
-- Name: proposal proposal_submitted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proposal
    ADD CONSTRAINT proposal_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES public.teacher(teacher_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4941 (class 2606 OID 146412)
-- Name: proposal proposal_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proposal
    ADD CONSTRAINT proposal_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4942 (class 2606 OID 146417)
-- Name: review review_paper_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_paper_id_fkey FOREIGN KEY (paper_id) REFERENCES public.paper(paper_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4943 (class 2606 OID 146422)
-- Name: review review_proposal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.proposal(proposal_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4944 (class 2606 OID 146427)
-- Name: review review_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.reviewer(reviewer_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4929 (class 2606 OID 146352)
-- Name: reviewer reviewer_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviewer
    ADD CONSTRAINT reviewer_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teacher(teacher_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4945 (class 2606 OID 146432)
-- Name: reviewerassignment reviewerassignment_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviewerassignment
    ADD CONSTRAINT reviewerassignment_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.admin(admin_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4946 (class 2606 OID 146437)
-- Name: reviewerassignment reviewerassignment_paper_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviewerassignment
    ADD CONSTRAINT reviewerassignment_paper_id_fkey FOREIGN KEY (paper_id) REFERENCES public.paper(paper_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4947 (class 2606 OID 146442)
-- Name: reviewerassignment reviewerassignment_proposal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviewerassignment
    ADD CONSTRAINT reviewerassignment_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.proposal(proposal_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4948 (class 2606 OID 146447)
-- Name: reviewerassignment reviewerassignment_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviewerassignment
    ADD CONSTRAINT reviewerassignment_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.reviewer(reviewer_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4925 (class 2606 OID 146332)
-- Name: student student_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.department(department_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4926 (class 2606 OID 146337)
-- Name: student student_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4927 (class 2606 OID 146342)
-- Name: teacher teacher_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.department(department_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4928 (class 2606 OID 146347)
-- Name: teacher teacher_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4930 (class 2606 OID 146357)
-- Name: team team_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4931 (class 2606 OID 146362)
-- Name: team team_domain_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_domain_id_fkey FOREIGN KEY (domain_id) REFERENCES public.domain(domain_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4934 (class 2606 OID 146377)
-- Name: teamapplication teamapplication_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teamapplication
    ADD CONSTRAINT teamapplication_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(student_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4935 (class 2606 OID 146382)
-- Name: teamapplication teamapplication_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teamapplication
    ADD CONSTRAINT teamapplication_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4936 (class 2606 OID 146387)
-- Name: teamcomment teamcomment_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teamcomment
    ADD CONSTRAINT teamcomment_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4937 (class 2606 OID 146392)
-- Name: teamcomment teamcomment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teamcomment
    ADD CONSTRAINT teamcomment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4932 (class 2606 OID 146367)
-- Name: teammember teammember_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teammember
    ADD CONSTRAINT teammember_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4933 (class 2606 OID 146372)
-- Name: teammember teammember_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teammember
    ADD CONSTRAINT teammember_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4949 (class 2606 OID 146452)
-- Name: userdomain userdomain_domain_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userdomain
    ADD CONSTRAINT userdomain_domain_id_fkey FOREIGN KEY (domain_id) REFERENCES public.domain(domain_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4950 (class 2606 OID 146457)
-- Name: userdomain userdomain_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userdomain
    ADD CONSTRAINT userdomain_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2025-09-13 02:50:43

--
-- PostgreSQL database dump complete
--

