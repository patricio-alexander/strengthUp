-- ============================================
-- StrengthUp - Supabase Database Schema
-- ============================================

-- Tabla: users
-- Se crea automáticamente via trigger cuando un usuario se registra en auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'personal'
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);


-- Tabla: settings
-- Se crea automáticamente via trigger cuando se crea un usuario
CREATE TABLE IF NOT EXISTS public.settings (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  hour_to_train TEXT NOT NULL DEFAULT '19:00'
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON public.settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON public.settings FOR UPDATE
  USING (auth.uid() = user_id);


-- Tabla: routines
CREATE TABLE IF NOT EXISTS public.routines (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own routines"
  ON public.routines FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routines"
  ON public.routines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routines"
  ON public.routines FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own routines"
  ON public.routines FOR DELETE
  USING (auth.uid() = user_id);


-- Tabla: workout_sessions
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  day TEXT NOT NULL,
  routine_id BIGINT NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  sorted INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workout sessions"
  ON public.workout_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.routines
      WHERE routines.id = workout_sessions.routine_id
        AND routines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own workout sessions"
  ON public.workout_sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.routines
      WHERE routines.id = workout_sessions.routine_id
        AND routines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workout sessions"
  ON public.workout_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.routines
      WHERE routines.id = workout_sessions.routine_id
        AND routines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workout sessions"
  ON public.workout_sessions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.routines
      WHERE routines.id = workout_sessions.routine_id
        AND routines.user_id = auth.uid()
    )
  );


-- Tabla: user_exercises
CREATE TABLE IF NOT EXISTS public.user_exercises (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  default_exercise BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.user_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view default exercises"
  ON public.user_exercises FOR SELECT
  USING (default_exercise = true);

CREATE POLICY "Users can view own exercises"
  ON public.user_exercises FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercises"
  ON public.user_exercises FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercises"
  ON public.user_exercises FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercises"
  ON public.user_exercises FOR DELETE
  USING (auth.uid() = user_id);


-- Tabla: workout_sessions_exercises (join table)
CREATE TABLE IF NOT EXISTS public.workout_sessions_exercises (
  id BIGSERIAL PRIMARY KEY,
  workout_id BIGINT NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id BIGINT NOT NULL REFERENCES public.user_exercises(id) ON DELETE CASCADE,
  sorted INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.workout_sessions_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workout exercises"
  ON public.workout_sessions_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions ws
      JOIN public.routines r ON r.id = ws.routine_id
      WHERE ws.id = workout_sessions_exercises.workout_id
        AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own workout exercises"
  ON public.workout_sessions_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_sessions ws
      JOIN public.routines r ON r.id = ws.routine_id
      WHERE ws.id = workout_sessions_exercises.workout_id
        AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workout exercises"
  ON public.workout_sessions_exercises FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions ws
      JOIN public.routines r ON r.id = ws.routine_id
      WHERE ws.id = workout_sessions_exercises.workout_id
        AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workout exercises"
  ON public.workout_sessions_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions ws
      JOIN public.routines r ON r.id = ws.routine_id
      WHERE ws.id = workout_sessions_exercises.workout_id
        AND r.user_id = auth.uid()
    )
  );


-- Tabla: exercise_sets
CREATE TABLE IF NOT EXISTS public.exercise_sets (
  id BIGSERIAL PRIMARY KEY,
  workout_session_exercise_id BIGINT NOT NULL REFERENCES public.workout_sessions_exercises(id) ON DELETE CASCADE,
  weight NUMERIC NOT NULL DEFAULT 0,
  reps NUMERIC NOT NULL DEFAULT 0,
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exercise sets"
  ON public.exercise_sets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions_exercises wse
      JOIN public.workout_sessions ws ON ws.id = wse.workout_id
      JOIN public.routines r ON r.id = ws.routine_id
      WHERE wse.id = exercise_sets.workout_session_exercise_id
        AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own exercise sets"
  ON public.exercise_sets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_sessions_exercises wse
      JOIN public.workout_sessions ws ON ws.id = wse.workout_id
      JOIN public.routines r ON r.id = ws.routine_id
      WHERE wse.id = exercise_sets.workout_session_exercise_id
        AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own exercise sets"
  ON public.exercise_sets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions_exercises wse
      JOIN public.workout_sessions ws ON ws.id = wse.workout_id
      JOIN public.routines r ON r.id = ws.routine_id
      WHERE wse.id = exercise_sets.workout_session_exercise_id
        AND r.user_id = auth.uid()
    )
  );


-- Tabla: catalog_routines (read-only, catálogo de rutinas para importar)
CREATE TABLE IF NOT EXISTS public.catalog_routines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  days JSONB NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE public.catalog_routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view catalog routines"
  ON public.catalog_routines FOR SELECT
  USING (true);


-- ============================================
-- Triggers
-- ============================================

-- Función: crear perfil + settings cuando un usuario se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );

  INSERT INTO public.settings (user_id, hour_to_train)
  VALUES (NEW.id, '19:00');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: se ejecuta al crear un usuario en auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ============================================
-- Seed: ejercicios por defecto
-- ============================================
INSERT INTO public.user_exercises (name, default_exercise) VALUES
  ('Press de banca', true),
  ('Press inclinado con barra', true),
  ('Press inclinado con mancuernas', true),
  ('Aperturas con mancuernas', true),
  ('Fondos en paralelas', true),
  ('Dominadas', true),
  ('Dominadas supinas', true),
  ('Remo con barra', true),
  ('Remo con mancuernas', true),
  ('Jalón al pecho', true),
  ('Curl de bíceps con barra', true),
  ('Curl de bíceps con mancuernas', true),
  ('Curl martillo', true),
  ('Curl concentrado', true),
  ('Extensión de tríceps en polea', true),
  ('Fondos de tríceps en banco', true),
  ('Press francés', true),
  ('Press militar', true),
  ('Elevaciones laterales', true),
  ('Elevaciones frontales', true),
  ('Pájaros', true),
  ('Sentadilla', true),
  ('Sentadilla frontal', true),
  ('Prensa de piernas', true),
  ('Extensión de piernas', true),
  ('Curl femoral', true),
  ('Peso muerto convencional', true),
  ('Peso muerto rumano', true),
  ('Zancadas', true),
  ('Hip thrust', true),
  ('Elevaciones de talones', true),
  ('Pantorrillas en prensa', true),
  ('Plancha', true),
  ('Crunch abdominal', true),
  ('Elevaciones de piernas', true),
  ('Russian twist', true),
  ('Curl de muñeca', true),
  ('Farmer walk', true)
ON CONFLICT DO NOTHING;
