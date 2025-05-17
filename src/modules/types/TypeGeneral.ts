// ✅ Tipos TypeScript literales derivados directamente de tu esquema Prisma

export type AchievementType = {
  id: number;
  title: string;
  description: string;
  image_src: string;
  stat_key: string;
  stat_condition: string;
  stat_value: number;
};

export type ChallengeType = {
  id: number;
  type: string;
  question: string;
  image_src: string | null;
  order_num: number;
  lesson_id: number;
};

export type ChallengeOptionType = {
  id: number;
  text: string;
  is_correct: boolean;
  image_src: string | null;
  audio_src: string | null;
  challenge_id: number;
};

export type ChallengeProgressType = {
  id: number;
  completed: boolean;
  challenge_id: number;
  user_id: number;
};

export type CourseType = {
  id: number;
  title: string;
  image_src: string;
};

export type EarnedAchievementType = {
  id: number;
  obtained_at: Date;
  achievement_id: number;
  user_id: number;
};

export type LessonType = {
  id: number;
  title: string;
  order_num: number;
  unit_id: number;
};

export type LessonProgressType = {
  id: number;
  user_id: number;
  lesson_id: number;
  completed: boolean;
};

export type MissionType = {
  id: number;
  title: string;
  description: string;
  granted_experience: number;
  stat_key: string;
  stat_condition: string;
  stat_value: number;
};

export type UnitType = {
  id: number;
  title: string;
  description: string;
  order_num: number;
  course_id: number;
};

export type UserAccountType = {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  profile_image: string;
  hearts: number;
  points: number;
  experience: number;
  level: number;
  user_type: string;
};

export type UserMissionType = {
  id: number;
  user_id: number;
  daily_mission_id: number;
  completed: boolean;
  completed_at: Date | null;
};

export type UserProgressType = {
  id: number;
  active_course_id: number;
  user_id: number;
};

export type DailyMissionType = {
  id: number;
  mission_id: number;
  date: Date;
};

export type DailyUserStatsType = {
  id: number;
  user_id: number;
  date: Date;
  lessons_completed: number;
  lessons_perfect: number;
  challenges_completed: number;
  correct_answers: number;
  wrong_answers: number;
  experience_gained: number;
  points_gained: number;
  time_spent_minutes: number;
  quizzes_completed: number;
};

export type UserGeneralStatsType = {
  id: number;
  user_id: number;
  total_lessons: number;
  total_lessons_perfect: number;
  total_challenges: number;
  total_correct_answers: number;
  total_wrong_answers: number;
  total_units_completed: number;
  total_missions: number;
  total_points: number;
  total_experience: number;
  quizzes_completed: number;
};
