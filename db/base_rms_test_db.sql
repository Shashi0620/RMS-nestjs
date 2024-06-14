--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

\c rms_test_db;


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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

DROP TABLE IF EXISTS public.clients CASCADE  ;
DROP TABLE IF EXISTS public.escalations CASCADE  ;
DROP TABLE IF EXISTS public.files CASCADE  ;
DROP TABLE IF EXISTS public.itemforms CASCADE  ;
DROP TABLE IF EXISTS public.itemtemplatepropertys CASCADE  ;
DROP TABLE IF EXISTS public.itemtemplates CASCADE  ;
DROP TABLE IF EXISTS public.menus CASCADE  ;
DROP TABLE IF EXISTS public."notificationSettings" CASCADE  ;
DROP TABLE IF EXISTS public.notifications CASCADE  ;
DROP TABLE IF EXISTS public."notificationsSettings" CASCADE  ;
DROP TABLE IF EXISTS public.plans CASCADE  ;
DROP TABLE IF EXISTS public.racks CASCADE  ;
DROP TABLE IF EXISTS public.roles CASCADE  ;
DROP TABLE IF EXISTS public.stores CASCADE  ;
DROP TABLE IF EXISTS public.supports CASCADE  ;
DROP TABLE IF EXISTS public.templates CASCADE  ;
DROP TABLE IF EXISTS public."trayItems" CASCADE  ;
DROP TABLE IF EXISTS public.trays CASCADE  ;
DROP TABLE IF EXISTS public."userPreferences" CASCADE  ;
DROP TABLE IF EXISTS public."userStores" CASCADE  ;
DROP TABLE IF EXISTS public.userprofiles CASCADE  ;
DROP TABLE IF EXISTS public.users CASCADE  ;
DROP TABLE IF EXISTS public.userstores CASCADE  ;

DROP SEQUENCE IF EXISTS public.clients_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public.escalations_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public.files_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public.itemforms_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public.itemtemplatepropertys_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public.itemtemplates_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public.menus_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public."notificationSettings_id_seq" CASCADE ;
DROP SEQUENCE IF EXISTS public."notificationsSettings_id_seq" CASCADE ;
DROP SEQUENCE IF EXISTS public.notifications_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public.plans_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public.racks_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public.roles_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public."stores_storeId_seq" CASCADE ;
DROP SEQUENCE IF EXISTS public.supports_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public.templates_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public."trayItems_id_seq" CASCADE ;
DROP SEQUENCE IF EXISTS public.trays_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public."userPreferences_id_seq" CASCADE ;
DROP SEQUENCE IF EXISTS public."userStores_id_seq" CASCADE ;
DROP SEQUENCE IF EXISTS public.userprofiles_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public.users_id_seq CASCADE ;
DROP SEQUENCE IF EXISTS public.userstores_id_seq CASCADE ;

--
-- Name: clients; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    name character varying(255),
    "planFk" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.clients OWNER TO rms_tester;

--

-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.clients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.clients_id_seq OWNER TO rms_tester;

--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- Name: escalations; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.escalations (
    id integer NOT NULL,
    "escalationType" character varying(255),
    "noOfRemainder" character varying(255),
    "timeIntervalBetweenNotificationsInDays" character varying(255),
    "to" character varying(255),
    "notificationSettngFk" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.escalations OWNER TO rms_tester;

--
-- Name: escalations_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.escalations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.escalations_id_seq OWNER TO rms_tester;

--
-- Name: escalations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.escalations_id_seq OWNED BY public.escalations.id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.files (
    id integer NOT NULL,
    filename character varying(255),
    filepath character varying(255),
    user_fk integer,
    tray_fk integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.files OWNER TO rms_tester;

--
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.files_id_seq OWNER TO rms_tester;

--
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- Name: itemforms; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.itemforms (
    id integer NOT NULL,
    name character varying(255),
    description character varying(255),
    attributes json,
    "itemTempId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.itemforms OWNER TO rms_tester;

--
-- Name: itemforms_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.itemforms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.itemforms_id_seq OWNER TO rms_tester;

--
-- Name: itemforms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.itemforms_id_seq OWNED BY public.itemforms.id;


--
-- Name: itemtemplatepropertys; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.itemtemplatepropertys (
    id integer NOT NULL,
    name character varying(255),
    description character varying(255),
    "subscriberId" integer,
    label character varying(255),
    type character varying(255),
    required boolean,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.itemtemplatepropertys OWNER TO rms_tester;

--
-- Name: itemtemplatepropertys_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.itemtemplatepropertys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.itemtemplatepropertys_id_seq OWNER TO rms_tester;

--
-- Name: itemtemplatepropertys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.itemtemplatepropertys_id_seq OWNED BY public.itemtemplatepropertys.id;


--
-- Name: itemtemplates; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.itemtemplates (
    id integer NOT NULL,
    name character varying(255),
    "subscriberId" integer,
    description character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.itemtemplates OWNER TO rms_tester;

--
-- Name: itemtemplates_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.itemtemplates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.itemtemplates_id_seq OWNER TO rms_tester;

--
-- Name: itemtemplates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.itemtemplates_id_seq OWNED BY public.itemtemplates.id;


--
-- Name: menus; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.menus (
    id integer NOT NULL,
    label character varying(255),
    action character varying(255),
    "roleId" integer,
    "clientFk" integer,
    "templateID" integer,
    menu_fk integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.menus OWNER TO rms_tester;

--
-- Name: menus_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.menus_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.menus_id_seq OWNER TO rms_tester;

--
-- Name: menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.menus_id_seq OWNED BY public.menus.id;


--
-- Name: notificationSettings; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public."notificationSettings" (
    id integer NOT NULL,
    "settingName" character varying(255),
    "notificationType" character varying(255),
    "isEscalationRequired" boolean,
    "storeFk" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."notificationSettings" OWNER TO rms_tester;

--
-- Name: notificationSettings_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public."notificationSettings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."notificationSettings_id_seq" OWNER TO rms_tester;

--
-- Name: notificationSettings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public."notificationSettings_id_seq" OWNED BY public."notificationSettings".id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    "notificationType" character varying(255),
    email character varying(255),
    status character varying(255),
    content json,
    "noOfRetry" integer,
    "userFk" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "newNotification" integer,
    "noOfRemainder" integer,
    "notificationTemplate" character(4000)
);


ALTER TABLE public.notifications OWNER TO rms_tester;

--
-- Name: notificationsSettings; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public."notificationsSettings" (
    id integer NOT NULL,
    "settingName" character varying(255),
    "notificationType" character varying(255),
    "isEscalationRequired" boolean,
    "noOfRetry" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."notificationsSettings" OWNER TO rms_tester;

--
-- Name: notificationsSettings_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public."notificationsSettings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."notificationsSettings_id_seq" OWNER TO rms_tester;

--
-- Name: notificationsSettings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public."notificationsSettings_id_seq" OWNED BY public."notificationsSettings".id;


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO rms_tester;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: plans; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.plans (
    id integer NOT NULL,
    name character varying(255),
    "noOfUsers" integer,
    "noOfRacks" integer,
    "noOfItemTypes" integer,
    rate integer,
    "planImg" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "totalNoOfStores" integer
);


ALTER TABLE public.plans OWNER TO rms_tester;

--
-- Name: plans_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.plans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.plans_id_seq OWNER TO rms_tester;

--
-- Name: plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.plans_id_seq OWNED BY public.plans.id;


--
-- Name: racks; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.racks (
    id integer NOT NULL,
    name character varying(255),
    no_of_rows integer,
    no_of_columns character varying(255),
    "createdBy" character varying(255),
    client_fk integer,
    "storeFk" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.racks OWNER TO rms_tester;

--
-- Name: racks_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.racks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.racks_id_seq OWNER TO rms_tester;

--
-- Name: racks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.racks_id_seq OWNED BY public.racks.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO rms_tester;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO rms_tester;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: stores; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.stores (
    "storeId" integer NOT NULL,
    "storeName" character varying(255),
    address character varying(255),
    client_fk integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    longitude double precision,
    latitude double precision
);


ALTER TABLE public.stores OWNER TO rms_tester;

--
-- Name: stores_storeId_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public."stores_storeId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."stores_storeId_seq" OWNER TO rms_tester;

--
-- Name: stores_storeId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public."stores_storeId_seq" OWNED BY public.stores."storeId";


--
-- Name: supports; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.supports (
    id integer NOT NULL,
    title character varying(255),
    support character(4000),
    "videoLink" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.supports OWNER TO rms_tester;

--
-- Name: supports_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.supports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.supports_id_seq OWNER TO rms_tester;

--
-- Name: supports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.supports_id_seq OWNED BY public.supports.id;


--
-- Name: templates; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.templates (
    id integer NOT NULL,
    name character varying(255),
    description character varying(255),
    attributes json,
    "clientFk" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.templates OWNER TO rms_tester;

--
-- Name: templates_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.templates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.templates_id_seq OWNER TO rms_tester;

--
-- Name: templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.templates_id_seq OWNED BY public.templates.id;


--
-- Name: trayItems; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public."trayItems" (
    id integer NOT NULL,
    quantity integer,
    "upperLimit" integer,
    "lowerLimit" integer,
    "formId" integer,
    "rackId" integer,
    "userFk" integer,
    "trayId" integer,
    "notificationSettngFk" integer,
    "tempId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."trayItems" OWNER TO rms_tester;

--
-- Name: trayItems_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public."trayItems_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."trayItems_id_seq" OWNER TO rms_tester;

--
-- Name: trayItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public."trayItems_id_seq" OWNED BY public."trayItems".id;


--
-- Name: trays; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.trays (
    id integer NOT NULL,
    x integer,
    y integer,
    h integer,
    w integer,
    name character varying(255),
    color character varying(255),
    quantity integer,
    searchable boolean,
    img character varying(255),
    attr1 character varying(255),
    val1 integer,
    attr2 character varying(255),
    val2 integer,
    attr3 character varying(255),
    val3 integer,
    attr4 character varying(255),
    val4 integer,
    attr5 character varying(255),
    val5 integer,
    attribute character varying(255),
    "createdBy" character varying(255),
    "modifiedBy" character varying(255),
    rack_fk integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.trays OWNER TO rms_tester;

--
-- Name: trays_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.trays_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trays_id_seq OWNER TO rms_tester;

--
-- Name: trays_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.trays_id_seq OWNED BY public.trays.id;


--
-- Name: userPreferences; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public."userPreferences" (
    id integer NOT NULL,
    "selectedColumns" character varying(255),
    "templateId" integer,
    "userFk" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."userPreferences" OWNER TO rms_tester;

--
-- Name: userPreferences_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public."userPreferences_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."userPreferences_id_seq" OWNER TO rms_tester;

--
-- Name: userPreferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public."userPreferences_id_seq" OWNED BY public."userPreferences".id;


--
-- Name: userStores; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public."userStores" (
    id integer NOT NULL,
    "userFk" integer,
    "storeId" integer,
    "storeName" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."userStores" OWNER TO rms_tester;

--
-- Name: userStores_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public."userStores_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."userStores_id_seq" OWNER TO rms_tester;

--
-- Name: userStores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public."userStores_id_seq" OWNED BY public."userStores".id;


--
-- Name: userprofiles; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.userprofiles (
    id integer NOT NULL,
    "userName" character varying(255),
    email character varying(255),
    phone character varying(255),
    password character varying(255),
    address character varying(255),
    city character varying(255),
    image character varying(255),
    "createdBy" character varying(255),
    user_fk integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.userprofiles OWNER TO rms_tester;

--
-- Name: userprofiles_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.userprofiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.userprofiles_id_seq OWNER TO rms_tester;

--
-- Name: userprofiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.userprofiles_id_seq OWNED BY public.userprofiles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255),
    email character varying(255),
    password character varying(255),
    phone character varying(255),
    location character varying(255),
    token character varying(255),
    status character varying(255) DEFAULT 'REGISTERED'::character varying,
    "esUrl" character varying(255),
    "clientFk" integer,
    "storeFk" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "roleId" integer,
    trialend date,
    logindate date
);


ALTER TABLE public.users OWNER TO rms_tester;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO rms_tester;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: userstores; Type: TABLE; Schema: public; Owner: rms_tester
--

CREATE TABLE public.userstores (
    id integer NOT NULL,
    "storeName" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.userstores OWNER TO rms_tester;

--
-- Name: userstores_id_seq; Type: SEQUENCE; Schema: public; Owner: rms_tester
--

CREATE SEQUENCE public.userstores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.userstores_id_seq OWNER TO rms_tester;

--
-- Name: userstores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rms_tester
--

ALTER SEQUENCE public.userstores_id_seq OWNED BY public.userstores.id;


--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- Name: escalations id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.escalations ALTER COLUMN id SET DEFAULT nextval('public.escalations_id_seq'::regclass);


--
-- Name: files id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- Name: itemforms id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.itemforms ALTER COLUMN id SET DEFAULT nextval('public.itemforms_id_seq'::regclass);


--
-- Name: itemtemplatepropertys id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.itemtemplatepropertys ALTER COLUMN id SET DEFAULT nextval('public.itemtemplatepropertys_id_seq'::regclass);


--
-- Name: itemtemplates id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.itemtemplates ALTER COLUMN id SET DEFAULT nextval('public.itemtemplates_id_seq'::regclass);


--
-- Name: menus id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.menus ALTER COLUMN id SET DEFAULT nextval('public.menus_id_seq'::regclass);


--
-- Name: notificationSettings id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."notificationSettings" ALTER COLUMN id SET DEFAULT nextval('public."notificationSettings_id_seq"'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: notificationsSettings id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."notificationsSettings" ALTER COLUMN id SET DEFAULT nextval('public."notificationsSettings_id_seq"'::regclass);


--
-- Name: plans id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.plans ALTER COLUMN id SET DEFAULT nextval('public.plans_id_seq'::regclass);


--
-- Name: racks id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.racks ALTER COLUMN id SET DEFAULT nextval('public.racks_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: stores storeId; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.stores ALTER COLUMN "storeId" SET DEFAULT nextval('public."stores_storeId_seq"'::regclass);


--
-- Name: supports id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.supports ALTER COLUMN id SET DEFAULT nextval('public.supports_id_seq'::regclass);


--
-- Name: templates id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.templates ALTER COLUMN id SET DEFAULT nextval('public.templates_id_seq'::regclass);


--
-- Name: trayItems id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."trayItems" ALTER COLUMN id SET DEFAULT nextval('public."trayItems_id_seq"'::regclass);


--
-- Name: trays id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.trays ALTER COLUMN id SET DEFAULT nextval('public.trays_id_seq'::regclass);


--
-- Name: userPreferences id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."userPreferences" ALTER COLUMN id SET DEFAULT nextval('public."userPreferences_id_seq"'::regclass);


--
-- Name: userStores id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."userStores" ALTER COLUMN id SET DEFAULT nextval('public."userStores_id_seq"'::regclass);


--
-- Name: userprofiles id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.userprofiles ALTER COLUMN id SET DEFAULT nextval('public.userprofiles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: userstores id; Type: DEFAULT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.userstores ALTER COLUMN id SET DEFAULT nextval('public.userstores_id_seq'::regclass);


--
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: rms_tester
--

COPY public.menus (id, label, action, "roleId", "clientFk", "templateID", menu_fk, "createdAt", "updatedAt") FROM stdin;
1	DashBoard	/dashboard	2	\N	\N	\N	2022-02-14 10:29:22.145+05:30	2022-02-14 10:29:22.145+05:30
2	Staff	/staff	2	\N	\N	\N	2022-02-14 10:29:22.145+05:30	2022-02-14 10:29:22.145+05:30
3	Racks	/racks	2	\N	\N	\N	2022-02-14 10:29:22.146+05:30	2022-02-14 10:29:22.146+05:30
4	Translate	/Translate	2	\N	\N	\N	2022-02-15 16:13:28+05:30	2022-02-15 16:13:32+05:30
5	Categories	/template	2	\N	\N	\N	2024-02-03 09:17:24+05:30	2024-02-03 09:17:29+05:30
6	Stores	/stores	2	\N	\N	\N	2024-02-03 10:15:18+05:30	2024-02-03 10:15:21+05:30
\.

--
-- Data for Name: plans; Type: TABLE DATA; Schema: public; Owner: rms_tester
--

COPY public.plans (id, name, "noOfUsers", "noOfRacks", "noOfItemTypes", rate, "planImg", "createdAt", "updatedAt", "totalNoOfStores") FROM stdin;
1	Personal	1	2	3	500		2022-02-14 10:29:22.144+05:30	2022-02-14 10:29:22.144+05:30	\N
3	Distributors	25	50	20	2000		2022-02-14 10:29:22.145+05:30	2022-02-14 10:29:22.145+05:30	\N
2	Company/Traders	5	10	10	1000		2022-02-14 10:29:22.144+05:30	2022-02-14 10:29:22.144+05:30	20
\.

--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: rms_tester
--

COPY public.roles (id, name, "createdAt", "updatedAt") FROM stdin;
1	Admin	2022-02-14 10:29:22.144+05:30	2022-02-14 10:29:22.144+05:30
3	Staff	2022-02-14 10:29:22.144+05:30	2022-02-14 10:29:22.144+05:30
2	SuperAdmin	2022-02-14 10:29:22.144+05:30	2022-02-14 10:29:22.144+05:30
\.

--
-- Data for Name: supports; Type: TABLE DATA; Schema: public; Owner: rms_tester
--

COPY public.supports (id, title, support, "videoLink", "createdAt", "updatedAt") FROM stdin;
1	staff_support	<html> <head><style>p {  color: navy;  text-indent: 20px;  text-transform: initial;}</style></head><body><h3>About Staffs Listing</h3> <p>This section shows the list of all the staff created by Admin. To create staff User/Admin can click on the Add Staff button. It navigates to the add staff page. On the page admin can able to see some fields that he has to fill in to create staff that will belong to him. i.e. Username - Name of the staff, Email - Email of the staff, Password and Confirm password and select store - Admin has to select a store to save staff so that staff can be assigned to the store. One staff can be also assigned to multiple stores. After the creation of staff, login details of the staff will be mailed to the staff email which is used while registering staff. The staff uses that login credentials to log in and access his account. Staff can only access some of the menu i.e rack and staff. The first name of the staff name will be the admin name to make sure that the staff belongs to a certain admin. Note: Admin cannot able to create two staff with the same name and email address. If the admin wants to add, then the existing staff name should be changed or the staff should be deleted.</p><p> &#8226; With the Click of the pen icon users can able to edit their staff record i.e. Rename their staff name, Change email address, Change password and change their store. After the update the staff record will be updated as per your new details</p><p>&#8226; On Click of delete icon(Dustbin) deletes the staff and staff will be not available in any of your stores</p></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        	\N	2024-02-02 12:28:43.022125+05:30	2024-02-02 12:28:43.022125+05:30
2	racks_support	<html> <head><style>p {  color: navy;  text-indent: 20px;  text-transform: initial;}</style></head><body><h3>About Racks Listing</h3><p>This section shows the list of all racks that are available in your stores around the application. Users can create racks by clicking on the Add Rack button. It navigates the add rack screen and some input boxes are available to fill i.e. Name - Name of your Rack, No. of Rows and Columns - Enter number how many trays the user wanted inside the rack, Store - User has to select the store from the dropdown to make sure that rack is going to present under which store. After the rack creation, it will be listed under this section.</p><p> &#8226; On click of pen icon user can able to edit their rack i.e Rename their rack, change rows and columns i.e reduce or increase the tray counts and user can change the store of the rack if the rack is shifted or not available in the existing sore.</p><p>&#8226; With on Click of the delete icon(Dustbin icon), user can able to delete their rack. Note: It also deletes the associated trays and their products inside the trays.</p><p>&#8226; On Click of View Tray(Eye icon) it shows the view of your tray inside your rack </p></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               	\N	2024-02-02 12:28:43.022125+05:30	2024-02-02 12:28:43.022125+05:30
3	translate_support	<html> <head><style>p {  color: navy;  text-indent: 20px;  text-transform: initial;}</style></head><body><h3>About Translate Listing</h3><p>This section shows the list of all the menus that are available all over the application Eg: Home & Racks. You can modify your menu to whatever users like and it will applied all over the application. For example, you can rename your Racks as a Cupboard in the value input box available at the click of the pen icon and update the menu, It gets updated all over the application. The word Racks will be replaced with Cupboard all over the application wherever the Racks word is present. For Example:- Create Racks will be renamed as Create Cupboard.</p> <p> &#8226; On the Click of the pen icon user can able to see a popup window containing the key and value in the pop-up window. The value part can be edited and the key remains the same. The user can type the replacement word for the corresponding inside the value input box. For example, Users can name their Racks as a Cupboard in the value box and it gets applied all over the application.</p><p>&#8226; With on Click of the Delete icon(Dustbin icon) user can able to delete the menu it gets deleted all over the application. For Eg: If the user deletes the Staff menu it gets deleted and the Staff menu wont be available for the user. If the user wants to create the staff menu once again after the deletion the user has to create a new translation key and value pair by clicking on the Add row button. The user can able to pop up a window with two inputs available i.e. Key and Value. If the user wants to add the same staff menu as the old one user has to enter the old key and value pair which was available for the staff and save it the staff menu will be available. If the user creates a staff with a new key and value the menu will be created as a new menu and the user will not able to see the old Staff menu which had a Staff listing.</p><p>&#8226; On Clicking the Add Row button user can able to see a popup window i.e Create Translate with Key and Value input boxes to fill. Users can add their Key and Value to use all over the application. For Eg:- When the user logs in user can able to see the dropdown name "template" beside the Stores menu. If the user wants to rename it as a product rather than a template user has to create a new Key and Value as "product" for both Key and Value and click add user can able to see the Key and Value in the listing that has been added and "template" will be replace with "product".</p></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            	\N	2024-02-02 12:28:43.022125+05:30	2024-02-02 12:28:43.022125+05:30
4	store_support	<html> <head><style>p {  color: navy;  text-indent: 20px;  text-transform: initial;}</style></head><body><h3>About  Stores Listing</h3><p>This section shows the list of all Stores that user is created. To create a store user should click on Add Store in this page. User can see add store page with two fields i.e. Storename - name of your store and address - adress of your store after on click of the save the saved store will get listed in this section. A User can create maximun of10 stores.Store is used to create Racks and Staffs</p><p> &#8226; On Click of pen icon user can able to edit your store i.e Rename your store, Change your address and update.</p><p>&#8226; On Click of delete icon(Dustbin) deletes the store and its associate Racks, Trays and Products</p><p>&#8226; On Click of Notification icon(Bell) it shows the notification added to this store </p></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              	\N	2024-02-02 12:28:43.022125+05:30	2024-02-02 12:28:43.022125+05:30
5	dashboard_support	<html> <head><style>p {  color: navy;  text-indent: 20px;  text-transform: initial;}</style></head><body><h3>About dashboard section</h3><p>This section shows the location of the stores.</p><p> &#8226; In search box search for an item and click on the search icon it will shows the location of the stores which that item is present</p><p>&#8226; On the right hand side it will shows the storename, trayname and rackname , if you click on the eye icon it shows the tray where that searched item is present , if you click on the rack icon it will shows the rack of searched icon</p></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              	https://www.youtube.com/watch?v=Gf5j4wSfsds	2024-02-02 12:28:43.022125+05:30	2024-02-02 12:28:43.022125+05:30
6	template_support	<html> <head><style>p {  color: navy;  text-indent: 20px;  text-transform: initial;}</style></head><body><h3>About Templates Listing</h3><p>This section shows the list of all the templates available for the user to add products to it. As an application owner, I call it a template listing but the user can change the name as the user wishes in the translate section Eg. Define Products. In this section, you can rename your templates available on this page as you like by clicking on the pen icon. For example, users can rename their template as kitchen appliances and add kitchen products to it on a different page. Users can also change their description as they wish.</p><p> &#8226; On Clicking of pen icon user will be navigated to the Product Fields Builder screen. In that screen, users can rename their template name as they wish Eg.kitchen appliances. To rename their template user to click on the pen icon available beside Name input. The input box gets enabled and the user can rename their template/Product name and save the name by clicking of save button beside the Name input box users template name is renamed. There will be plenty of inputs available on the left side of the screen used to add fields for the product. For eg: If the user adds a product should have a name, quantity and description. For that users can choose their inputs from the left drag and drop to the right below the description field. Users can also modify their input that is dragged by clicking on the down arrow on the field that the user has dropped Click on the save below the drop area and save the template with whatever the changes the user made. To save the description user has rewrite their description and click the save button below drop i.e below the description field </p><p>&#8226; On Click of delete icon(Dustbin) delete the template and the product available inside the template. Once the template is deleted user cannot add new template so please be careful while deleting the template</p></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     	\N	2024-02-02 12:28:43.022125+05:30	2024-02-02 12:28:43.022125+05:30
7	product_support	<html> <head><style>p {  color: navy;  text-indent: 20px;  text-transform: initial;}</style></head><body><h3>About Products Listing</h3><p>This section shows the list of Products that user added inside the templates. To add products user can click on Add New product it navigates to add product page where user can add thier product up filling up the fields and save your product.These fields are available form Product Fields Builder screen where user creates own fields by drag and drop. User can n number of products inside thier template. These created products are used to add into the tray inside the rack.</p><p> &#8226; On the Click of the pen icon navigates to edit product page where user can edit thier product name and other fields added by the user and update its latest name and quantity.</p><p>&#8226; With on Click of the delete icon(Dustbin) user can able to delete the product. Once the product is deleted it also gets deleted in its associted rack as well as tray.</p></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       	\N	2024-02-02 12:28:43.022125+05:30	2024-02-02 12:28:43.022125+05:30
8	trayview_support	<html> <head><style>p {  color: navy;  text-indent: 20px;  text-transform: initial;}</style></head><body><h3>About Trays View</h3><p>This section shows the Trays view in which the user created while creating the rack. when the user clicks the tray i.e r0c0 User can do some certain operation i.e Add product to thier tray shows the quantity of product, Copy thier tray, Delete thier tray, Add picture to thier tray, Add color to thier tray, Rename thier tray and change thier tray layout by dragging here and there in the screen</p></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              	\N	2024-02-02 12:28:43.022125+05:30	2024-02-02 12:28:43.022125+05:30
9	notification_support	<html> <head><style>p {  color: navy;  text-indent: 20px;  text-transform: initial;}</style></head><body><h3>About Notification Settings Listing</h3><p>This section shows the list of notification settings added to the corresponding store. To add a notification user can click on the Add Notification button. Users have to fill in the fields to save notification settings i.e. setting name - the name of the notification, To - email address, No. of remainders and time interval bw, days choose days. After creating a notification settings to the store it acts like a notification to the store while adding the products inside the tray user can select notification to the product so that the user will get mail if the quantity of the the products becomes low based on the notification settings. For example, the user creates store and adds a notification to it i.e. Setting Name - Low on Apples, Email - user email, No.of.Remainder - 1 Day and Time interval between Remainders - 2 days. While creating products the tray user can able to see add notifications to the product. User adds notifications by entering the Upper limit, Lower limit and notification setting which is Low on Apples created by the user. If the products quantity goes below the lower limit user gets notified by mail. If the user didnt update the quantity user will get mail after 2 days which is based Time interval between Remainders. If the user updates the quantity the mail will be stopped.</p></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      	\N	2024-02-02 12:28:43.022125+05:30	2024-02-02 12:28:43.022125+05:30
10	trayedit_support	<html> <head><style>p {  color: navy;  text-indent: 20px;  text-transform: initial;}</style></head><body><h3>About Tray Edit</h3><p>This section shows the editing of tray section. The user can do some certain operations available on the top of the tray and inside the tray.</p><p> &#8226; Add - on click of the tray user can see some operations one of them is Add. On click of the add it navigates to another page where the user can choose the template and add products to the selected tray. After the product is added and the User comes back to the tray screen user can see the number of quantities he added to the outside of the tray.</p><p> &#8226; Copy - With the click of the tray, the user can see some operations one of them is Copy. On click of the copy the corresponding rack is duplicated and creates copy of the tray. It only copies the properties of the tray but not the product inside the tray. For Eg: The user clicks on the tray r0c0 and clicks on the copy it will create another tray with the name r0c0 with its properties.</p><p> &#8226; Delete - With the click of the tray, the user can see some operations one of them is Delete. On click of the delete, the corresponding rack is deleted with its properties and products inside the tray.</p><p> &#8226; Searchable - With the click of the tray, the user can see some operations one of them is Searchable. Default it will be searchable so that the user can able to search the tray. If the user unchecks the checkbox user cannot able to search the tray.</p><p> &#8226; Save Layout - With the click of the tray, the user can see some operations one of them is Save Layout. The user can arrange the trays by dragging them here and there on the screen once the user sets the trays layout and clicks on save layout the tray layout will be saved and remain the same as the user arranged it.</p><p> &#8226; Some of the operations present inside the tray are renaming your tray,Uploading pictures to your tray, and adding color to the tray. To rename the tray user can click on the existing name (Eg: r0c0) rename the tray and click outside of the tray, tray name gets saved. To upload a picture to the tray user has to enlargethe tray and click on the default image tray the user can upload a picture. To add color to the tray user has to click on the default color(blue) present in the tray the color picker pops up and the user can pick the color he likes and the color will be changed.</p></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               	\N	2024-02-02 12:28:43.022125+05:30	2024-02-02 12:28:43.022125+05:30
11	ToolTip1	<html> <head><style>p {  color: navy;  text-indent: 20px;  text-transform: initial;}</style></head><body><h3>About dashboard section</h3><p>This section shows the location of the stores.</p><p> &#8226; In search box search for an item and click on the search icon it will shows the location of the stores which that item is present</p><p>&#8226; On the right hand side it will shows the storename, trayname and rackname , if you click on the eye icon it shows the tray where that searched item is present , if you click on the rack icon it will shows the rack of searched icon</p></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              	\N	2024-02-02 12:28:43.022125+05:30	2024-02-02 12:28:43.022125+05:30
12	ToolTip2	<html> <head><style>p {  color: navy;  text-indent: 20px;  text-transform: initial;}</style></head><body><h3>About dashboard section</h3><p>This section shows the location of the stores.</p><p> &#8226; In search box search for an item and click on the search icon it will shows the location of the stores which that item is present</p><p>&#8226; On the right hand side it will shows the storename, trayname and rackname , if you click on the eye icon it shows the tray where that searched item is present , if you click on the rack icon it will shows the rack of searched icon</p></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              	\N	2024-02-02 12:28:43.022125+05:30	2024-02-02 12:28:43.022125+05:30
13	ToolTip3	<html> <head><style>p {  color: navy;  text-indent: 20px;  text-transform: initial;}</style></head><body><h3>About dashboard section</h3><p>This section shows the location of the stores.</p><p> &#8226; In search box search for an item and click on the search icon it will shows the location of the stores which that item is present</p><p>&#8226; On the right hand side it will shows the storename, trayname and rackname , if you click on the eye icon it shows the tray where that searched item is present , if you click on the rack icon it will shows the rack of searched icon</p></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              	\N	2024-02-02 12:28:43.022125+05:30	2024-02-02 12:28:43.022125+05:30
14	ToolTip4	<html> <head><style>p {  color: navy;  text-indent: 20px;  text-transform: initial;}</style></head><body><h3>About dashboard section</h3><p>This section shows the location of the stores.</p><p> &#8226; In search box search for an item and click on the search icon it will shows the location of the stores which that item is present</p><p>&#8226; On the right hand side it will shows the storename, trayname and rackname , if you click on the eye icon it shows the tray where that searched item is present , if you click on the rack icon it will shows the rack of searched icon</p></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              	\N	2024-02-02 12:28:43.022125+05:30	2024-02-02 12:28:43.022125+05:30
15	ToolTip5	<html> <head><style>p {  color: navy;  text-indent: 20px;  text-transform: initial;}</style></head><body><h3>About dashboard section</h3><p>This section shows the location of the stores.</p><p> &#8226; In search box search for an item and click on the search icon it will shows the location of the stores which that item is present</p><p>&#8226; On the right hand side it will shows the storename, trayname and rackname , if you click on the eye icon it shows the tray where that searched item is present , if you click on the rack icon it will shows the rack of searched icon</p></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              	\N	2024-02-02 12:28:43.022125+05:30	2024-02-02 12:28:43.022125+05:30
\.

--
-- Name: menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rms_tester
--

SELECT pg_catalog.setval('public.menus_id_seq', 6, true);

--
-- Name: supports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rms_tester
--

SELECT pg_catalog.setval('public.supports_id_seq', 15, true);

--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: escalations escalations_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.escalations
    ADD CONSTRAINT escalations_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: itemforms itemforms_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.itemforms
    ADD CONSTRAINT itemforms_pkey PRIMARY KEY (id);


--
-- Name: itemtemplatepropertys itemtemplatepropertys_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.itemtemplatepropertys
    ADD CONSTRAINT itemtemplatepropertys_pkey PRIMARY KEY (id);


--
-- Name: itemtemplates itemtemplates_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.itemtemplates
    ADD CONSTRAINT itemtemplates_pkey PRIMARY KEY (id);


--
-- Name: menus menus_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_pkey PRIMARY KEY (id);


--
-- Name: notificationSettings notificationSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."notificationSettings"
    ADD CONSTRAINT "notificationSettings_pkey" PRIMARY KEY (id);


--
-- Name: notificationsSettings notificationsSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."notificationsSettings"
    ADD CONSTRAINT "notificationsSettings_pkey" PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);


--
-- Name: racks racks_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.racks
    ADD CONSTRAINT racks_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: stores stores_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY ("storeId");


--
-- Name: supports supports_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.supports
    ADD CONSTRAINT supports_pkey PRIMARY KEY (id);


--
-- Name: templates templates_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT templates_pkey PRIMARY KEY (id);


--
-- Name: trayItems trayItems_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."trayItems"
    ADD CONSTRAINT "trayItems_pkey" PRIMARY KEY (id);


--
-- Name: trays trays_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.trays
    ADD CONSTRAINT trays_pkey PRIMARY KEY (id);


--
-- Name: userPreferences userPreferences_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."userPreferences"
    ADD CONSTRAINT "userPreferences_pkey" PRIMARY KEY (id);


--
-- Name: userStores userStores_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."userStores"
    ADD CONSTRAINT "userStores_pkey" PRIMARY KEY (id);


--
-- Name: userprofiles userprofiles_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.userprofiles
    ADD CONSTRAINT userprofiles_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: userstores userstores_pkey; Type: CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.userstores
    ADD CONSTRAINT userstores_pkey PRIMARY KEY (id);


--
-- Name: clients clients_planFk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT "clients_planFk_fkey" FOREIGN KEY ("planFk") REFERENCES public.plans(id) ON UPDATE CASCADE;


--
-- Name: escalations escalations_notificationSettngFk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.escalations
    ADD CONSTRAINT "escalations_notificationSettngFk_fkey" FOREIGN KEY ("notificationSettngFk") REFERENCES public."notificationSettings"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: files files_tray_fk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_tray_fk_fkey FOREIGN KEY (tray_fk) REFERENCES public.trays(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: files files_user_fk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_user_fk_fkey FOREIGN KEY (user_fk) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: itemforms itemforms_itemTempId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.itemforms
    ADD CONSTRAINT "itemforms_itemTempId_fkey" FOREIGN KEY ("itemTempId") REFERENCES public.templates(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: menus menus_clientFk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "menus_clientFk_fkey" FOREIGN KEY ("clientFk") REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: menus menus_menu_fk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_menu_fk_fkey FOREIGN KEY (menu_fk) REFERENCES public.menus(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: menus menus_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "menus_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: menus menus_templateID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "menus_templateID_fkey" FOREIGN KEY ("templateID") REFERENCES public.templates(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notificationSettings notificationSettings_storeFk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."notificationSettings"
    ADD CONSTRAINT "notificationSettings_storeFk_fkey" FOREIGN KEY ("storeFk") REFERENCES public.stores("storeId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_userFk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_userFk_fkey" FOREIGN KEY ("userFk") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: racks racks_client_fk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.racks
    ADD CONSTRAINT racks_client_fk_fkey FOREIGN KEY (client_fk) REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: racks racks_storeFk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.racks
    ADD CONSTRAINT "racks_storeFk_fkey" FOREIGN KEY ("storeFk") REFERENCES public.stores("storeId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: stores stores_client_fk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_client_fk_fkey FOREIGN KEY (client_fk) REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: templates templates_clientFk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT "templates_clientFk_fkey" FOREIGN KEY ("clientFk") REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: trayItems trayItems_notificationSettngFk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."trayItems"
    ADD CONSTRAINT "trayItems_notificationSettngFk_fkey" FOREIGN KEY ("notificationSettngFk") REFERENCES public."notificationSettings"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: trayItems trayItems_rackId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."trayItems"
    ADD CONSTRAINT "trayItems_rackId_fkey" FOREIGN KEY ("rackId") REFERENCES public.racks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: trayItems trayItems_tempId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."trayItems"
    ADD CONSTRAINT "trayItems_tempId_fkey" FOREIGN KEY ("tempId") REFERENCES public.templates(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: trayItems trayItems_trayId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."trayItems"
    ADD CONSTRAINT "trayItems_trayId_fkey" FOREIGN KEY ("trayId") REFERENCES public.trays(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: trayItems trayItems_userFk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."trayItems"
    ADD CONSTRAINT "trayItems_userFk_fkey" FOREIGN KEY ("userFk") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: trays trays_rack_fk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.trays
    ADD CONSTRAINT trays_rack_fk_fkey FOREIGN KEY (rack_fk) REFERENCES public.racks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userPreferences userPreferences_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."userPreferences"
    ADD CONSTRAINT "userPreferences_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public.templates(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userPreferences userPreferences_userFk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."userPreferences"
    ADD CONSTRAINT "userPreferences_userFk_fkey" FOREIGN KEY ("userFk") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userStores userStores_storeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."userStores"
    ADD CONSTRAINT "userStores_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES public.stores("storeId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userStores userStores_userFk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public."userStores"
    ADD CONSTRAINT "userStores_userFk_fkey" FOREIGN KEY ("userFk") REFERENCES public.users(id) ON UPDATE CASCADE ;


--
-- Name: userprofiles userprofiles_user_fk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.userprofiles
    ADD CONSTRAINT userprofiles_user_fk_fkey FOREIGN KEY (user_fk) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_clientFk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_clientFk_fkey" FOREIGN KEY ("clientFk") REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_storeFk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rms_tester
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_storeFk_fkey" FOREIGN KEY ("storeFk") REFERENCES public.users(id) ON UPDATE CASCADE ;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO rms_tester;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

