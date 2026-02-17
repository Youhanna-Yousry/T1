CREATE TABLE family (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 0,
    grade INTEGER NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 0,
    family_id BIGINT NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    CONSTRAINT fk_users_family FOREIGN KEY (family_id) REFERENCES family (id)
);

CREATE TABLE refresh_token (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_refresh_token_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE competition (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 0,
    name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE week (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 0,
    competition_id BIGINT,
    name VARCHAR(255) NOT NULL,
    week_number INTEGER NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    CONSTRAINT fk_week_competition FOREIGN KEY (competition_id) REFERENCES competition (id) ON DELETE CASCADE
);

CREATE TABLE event (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 0,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    is_scannable BOOLEAN NOT NULL,
    weight INTEGER NOT NULL
);

CREATE TABLE team_profile (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 0,
    family_id BIGINT NOT NULL,
    competition_id BIGINT,
    team_name VARCHAR(255) NOT NULL,
    team_code VARCHAR(255) NOT NULL,
    team_color VARCHAR(255) NOT NULl,
    CONSTRAINT fk_team_profile_family FOREIGN KEY (family_id) REFERENCES family (id) ON DELETE CASCADE,
    CONSTRAINT fk_team_profile_competition FOREIGN KEY (competition_id) REFERENCES competition (id) ON DELETE CASCADE,
    CONSTRAINT uq_team_profile_per_competition UNIQUE (family_id, competition_id)
);

CREATE TABLE student_log (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    week_id BIGINT NOT NULL,
    points_earned INTEGER,
    CONSTRAINT fk_student_logs_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_student_logs_event FOREIGN KEY (event_id) REFERENCES event (id) ON DELETE CASCADE,
    CONSTRAINT fk_student_logs_week FOREIGN KEY (week_id) REFERENCES week (id) ON DELETE CASCADE,
    CONSTRAINT uq_student_logs_user_event UNIQUE (user_id, event_id, week_id)
);

CREATE TABLE weekly_result (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 0,
    competition_id BIGINT NOT NULL,
    week_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    family_id BIGINT NOT NULL,
    raw_attendance_score INTEGER DEFAULT 0,
    rank_in_week INTEGER,
    championship_points INTEGER DEFAULT 0,
    CONSTRAINT fk_result_comp FOREIGN KEY (competition_id) REFERENCES competition (id) ON DELETE CASCADE,
    CONSTRAINT fk_result_week FOREIGN KEY (week_id) REFERENCES week (id) ON DELETE CASCADE,
    CONSTRAINT fk_result_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT uq_weekly_result UNIQUE (week_id, user_id)
);

INSERT INTO event (name, type, is_scannable, weight) VALUES
('Service Liturgy', 'GRAND_PRIX', TRUE, 15),
('Sunday School', 'GRAND_PRIX', TRUE, 15),
('Vespers', 'GRAND_PRIX', TRUE, 15),
('Tasbeha', 'GRAND_PRIX', TRUE, 15),
('Bible Study', 'GRAND_PRIX', TRUE, 15),
('Deacons School', 'GRAND_PRIX', TRUE,15);

INSERT INTO event (name, type, is_scannable, weight) VALUES
('Speed Competition', 'PRACTICE', FALSE, 10),
('Paper Competition', 'PRACTICE', FALSE, 10),
 ('Coptic Language', 'PRACTICE', FALSE, 10);

INSERT INTO event (name, type, is_scannable, weight) VALUES
('Extra Liturgy', 'SPRINT', TRUE,5),
('Extra Tasbeha', 'SPRINT', TRUE, 5),
('Confession', 'SPRINT', TRUE, 5),
('Psalm Recitation', 'SPRINT', TRUE, 5);

DO $$
DECLARE
competition_id BIGINT;
    family_7_id BIGINT;
    family_8_id BIGINT;
    family_9_id BIGINT;
BEGIN
    INSERT INTO competition (name, year, type)
    VALUES ('Great Lent', 2026, 'GREAT_LENT')
    RETURNING id INTO competition_id;

    INSERT INTO family (grade, name) VALUES (7, 'Saint Karas') RETURNING id INTO family_7_id;
    INSERT INTO family (grade, name) VALUES (8, 'Saint George') RETURNING id INTO family_8_id;
    INSERT INTO family (grade, name) VALUES (9, 'Saint Moses') RETURNING id INTO family_9_id;

    INSERT INTO team_profile (family_id, competition_id, team_name, team_code, team_color) VALUES
    (family_7_id, competition_id, 'McLaren', 'MCL', '#FF8000'),
    (family_8_id, competition_id, 'Red Bull Racing', 'RBR', '#3671C6'),
    (family_9_id, competition_id, 'Mercedes', 'MER', '#27F4D2');

    INSERT INTO week (name, competition_id, week_number, start_date, end_date) VALUES
    ('Preparation Week',    competition_id, 1, '2026-02-14 00:00:00', '2026-02-19 23:59:59'),
    ('Week of Temptation',  competition_id, 2, '2026-02-20 00:00:00', '2026-02-26 23:59:59'),
    ('The Prodigal Son',    competition_id, 3, '2026-02-27 00:00:00', '2026-03-05 23:59:59'),
    ('The Samaritan Woman', competition_id, 4, '2026-03-06 00:00:00', '2026-03-12 23:59:59'),
    ('The Paralytic Man',   competition_id, 5, '2026-03-13 00:00:00', '2026-03-19 23:59:59'),
    ('The Man Born Blind',  competition_id, 6, '2026-03-20 00:00:00', '2026-03-26 23:59:59'),
    ('Palm Sunday Week',    competition_id, 7, '2026-03-27 00:00:00', '2026-04-02 23:59:59'),
    ('Holy Pascha Week',    competition_id, 8, '2026-04-03 00:00:00', '2026-04-11 23:59:59');
END $$;