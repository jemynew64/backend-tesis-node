BEGIN;

-- Crear tabla Course (Curso)
CREATE TABLE course (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_src VARCHAR(255) NOT NULL
);

-- Crear tabla Unit (Unidad)
CREATE TABLE unit (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    order_num INTEGER NOT NULL,
    course_id INTEGER NOT NULL REFERENCES course(id) ON DELETE CASCADE
);

-- Crear tabla Lesson (Lección)
CREATE TABLE lesson (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    order_num INTEGER NOT NULL,
    unit_id INTEGER NOT NULL REFERENCES unit(id) ON DELETE CASCADE
);

-- Crear tabla User (Usuario)
CREATE TABLE user_account (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    profile_image VARCHAR(255) NOT NULL DEFAULT '/default_user.png',
    hearts INTEGER NOT NULL DEFAULT 5,
    points INTEGER NOT NULL DEFAULT 0,
    experience INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    user_type VARCHAR(10) NOT NULL DEFAULT 'student'
);

-- Crear tabla Challenge (Reto)
CREATE TABLE challenge (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    question TEXT NOT NULL,
    image_src VARCHAR(255),
    order_num INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL REFERENCES lesson(id) ON DELETE CASCADE
);

-- Crear tabla ChallengeOption (Opción de Reto)
CREATE TABLE challenge_option (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    image_src VARCHAR(255),
    audio_src VARCHAR(255),
    challenge_id INTEGER NOT NULL REFERENCES challenge(id) ON DELETE CASCADE
);

-- Crear tabla UserProgress (Progreso del Usuario)
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    active_course_id INTEGER NOT NULL REFERENCES course(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES user_account(id) ON DELETE CASCADE
);

-- Crear tabla ChallengeProgress (Progreso del Reto)
CREATE TABLE challenge_progress (
    id SERIAL PRIMARY KEY,
    completed BOOLEAN NOT NULL,
    challenge_id INTEGER NOT NULL REFERENCES challenge(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES user_account(id) ON DELETE CASCADE
);

-- Crear tabla Achievement (Logro)
CREATE TABLE achievement (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    image_src VARCHAR(255) NOT NULL,
    required_experience INTEGER NOT NULL,
    required_level INTEGER NOT NULL
);

-- Crear tabla EarnedAchievement (Logro Obtenido)
CREATE TABLE earned_achievement (
    id SERIAL PRIMARY KEY,
    obtained_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    achievement_id INTEGER NOT NULL REFERENCES achievement(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES user_account(id) ON DELETE CASCADE
);

-- Crear tabla Mission (Misión)
CREATE TABLE mission (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    granted_experience INTEGER NOT NULL DEFAULT 0
);

-- 🆕 Crear tabla DailyMission (Misiones del día)
CREATE TABLE daily_mission (
    id SERIAL PRIMARY KEY,
    mission_id INTEGER NOT NULL REFERENCES mission(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    UNIQUE (mission_id, date)
);

-- 🔄 MODIFICADA: tabla UserMission (ahora relacionada con daily_mission)
CREATE TABLE user_mission (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,
    daily_mission_id INTEGER NOT NULL REFERENCES daily_mission(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP
);

-- Crear tabla LessonProgress (Progreso de la Lección)
CREATE TABLE lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,
    lesson_id INTEGER NOT NULL REFERENCES lesson(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT FALSE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_challenge_lesson ON challenge (lesson_id);
CREATE INDEX idx_challenge_option_challenge ON challenge_option (challenge_id);
CREATE INDEX idx_unit_course ON unit (course_id);
CREATE INDEX idx_lesson_unit ON lesson (unit_id);
CREATE INDEX idx_user_progress_course ON user_progress (active_course_id);
CREATE INDEX idx_user_progress_user ON user_progress (user_id);
CREATE INDEX idx_challenge_progress_challenge ON challenge_progress (challenge_id);
CREATE INDEX idx_challenge_progress_user ON challenge_progress (user_id);
CREATE INDEX idx_earned_achievement_achievement ON earned_achievement (achievement_id);
CREATE INDEX idx_earned_achievement_user ON earned_achievement (user_id);
CREATE INDEX idx_user_mission_user ON user_mission (user_id);
CREATE INDEX idx_user_mission_daily ON user_mission (daily_mission_id);
CREATE INDEX idx_lesson_progress_user ON lesson_progress (user_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress (lesson_id);

COMMIT;