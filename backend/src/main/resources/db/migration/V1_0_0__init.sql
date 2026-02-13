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
    total_points INT NOT NULl DEFAULT 0,
    CONSTRAINT fk_users_family FOREIGN KEY  (family_id) REFERENCES family (id)
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

CREATE TABLE week (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 0,
    name VARCHAR(255) NOT NULL,
    week_number INTEGER NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP
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
    year INTEGER NOT NULL,
    fast_type VARCHAR(255) NOT NULL,
    team_name VARCHAR(255) NOT NULL,
    team_code VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    CONSTRAINT fk_team_profile_family FOREIGN KEY (family_id) REFERENCES family (id),
    CONSTRAINT uq_team_profile_family_year_fast UNIQUE (family_id, year, fast_type)
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
    CONSTRAINT fk_student_logs_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_student_logs_event FOREIGN KEY (event_id) REFERENCES event (id),
    CONSTRAINT fk_student_logs_week FOREIGN KEY (week_id) REFERENCES week (id),
    CONSTRAINT uq_student_logs_user_event UNIQUE (user_id, event_id, week_id)
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

INSERT INTO family (grade, name) VALUES (7, 'Saint Karas');
INSERT INTO team_profile (family_id, year, fast_type, team_name, team_code, logo_url) VALUES (1, 2026, 'GREAT_LENT', 'McLaren', 'MCL', '/');

INSERT INTO family (grade, name) VALUES (8, 'Saint George');
INSERT INTO team_profile (family_id, year, fast_type, team_name, team_code, logo_url) VALUES (2, 2026, 'GREAT_LENT', 'Red Bull Racing', 'RBR', '/');

INSERT INTO family (grade, name) VALUES (9, 'Saint Moses');
INSERT INTO team_profile (family_id, year, fast_type, team_name, team_code, logo_url) VALUES (3, 2026, 'GREAT_LENT', 'Mercedes', 'MER', '/');

INSERT INTO week (name, week_number, start_date, end_date) VALUES
('Preparation Week', 1, '2026-02-13 00:00:00', '2026-02-19 23:59:59'),
('Temptation Sunday', 2, '2026-02-20 00:00:00', '2026-02-26 23:59:59'),
('Prodigal Son', 3, '2026-02-27 00:00:00', '2026-03-05 23:59:59'),
('Samaritan Woman', 4, '2026-03-06 00:00:00', '2026-03-12 23:59:59'),
('Paralytic Man', 5, '2026-03-13 00:00:00', '2026-03-19 23:59:59'),
('Born Blind', 6, '2026-03-20 00:00:00', '2026-03-26 23:59:59'),
('Palm Sunday', 7, '2026-03-27 00:00:00', '2026-04-02 23:59:59'),
('Holy Week', 8, '2026-04-03 00:00:00', '2026-04-12 23:59:59');