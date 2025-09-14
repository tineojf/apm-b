CREATE TABLE public.ai_request_errors (
  request_payload text,
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  status_code character varying,
  endpoint character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ai_request_errors_pkey PRIMARY KEY (id)
);

CREATE TABLE public.app_logs_starts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  app_version character varying,
  user text,
  device text,
  superwall text,
  CONSTRAINT app_logs_starts_pkey PRIMARY KEY (id)
);

CREATE TABLE public.feedback (
  message text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT feedback_pkey PRIMARY KEY (id)
);

CREATE TABLE public.phrase (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  phrase text NOT NULL,
  updated_at time without time zone NOT NULL DEFAULT '00:00:00'::time without time zone,
  CONSTRAINT phrase_pkey PRIMARY KEY (id)
);

CREATE TABLE public.phrase_history (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  phrase text NOT NULL,
  updated_at time without time zone NOT NULL,
  CONSTRAINT phrase_history_pkey PRIMARY KEY (id)
);

CREATE TABLE public.phrase_history_en (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  phrase text NOT NULL,
  CONSTRAINT phrase_history_en_pkey PRIMARY KEY (id)
);

CREATE TABLE public.phrase_history_es (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  phrase text NOT NULL,
  CONSTRAINT phrase_history_es_pkey PRIMARY KEY (id)
);

CREATE TABLE public.prayer (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  prayer text NOT NULL,
  answer character varying NOT NULL,
  CONSTRAINT prayer_pkey PRIMARY KEY (id)
);

CREATE TABLE public.profile (
  username character varying UNIQUE,
  id uuid NOT NULL,
  full_name text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  is_premium boolean DEFAULT true,
  photo_url text,
  CONSTRAINT profile_pkey PRIMARY KEY (id),
  CONSTRAINT profile_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE public.streak_activity (
  completed_at date NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  CONSTRAINT streak_activity_pkey PRIMARY KEY (id),
  CONSTRAINT streak_activity_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.user_streaks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  current_streak smallint NOT NULL DEFAULT '1'::smallint,
  last_completed_date date NOT NULL DEFAULT now(),
  longest_streak smallint NOT NULL DEFAULT '1'::smallint,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  remaining_lives smallint NOT NULL DEFAULT '3'::smallint,
  last_lives_reset date NOT NULL DEFAULT now(),
  timezone text,
  CONSTRAINT user_streaks_pkey PRIMARY KEY (id),
  CONSTRAINT prayer_streaks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);