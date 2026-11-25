CREATE TABLE genres (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE titles (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    type        VARCHAR(10)  NOT NULL CHECK (type IN ('movie', 'series')),
    year        INTEGER      NOT NULL CHECK (year BETWEEN 1888 AND 2100),
    rating      NUMERIC(3,1) CHECK (rating BETWEEN 0 AND 10),
    genre_id    INTEGER      REFERENCES genres(id) ON DELETE SET NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE episodes (
    id         SERIAL PRIMARY KEY,
    title_id   INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    season     INTEGER NOT NULL CHECK (season > 0),
    episode    INTEGER NOT NULL CHECK (episode > 0),
    name       VARCHAR(200),
    UNIQUE (title_id, season, episode)
);