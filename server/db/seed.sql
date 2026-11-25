INSERT INTO genres (name) VALUES
    ('Драма'),
    ('Комедия'),
    ('Фантастика'),
    ('Триллер');

INSERT INTO titles (title, type, year, rating, genre_id) VALUES
    ('Интерстеллар', 'movie', 2014, 8.6, 3),
    ('Начало', 'movie', 2010, 8.8, 4),
    ('Побег из Шоушенка', 'movie', 1994, 9.3, 1),
    ('Друзья', 'series', 1994, 8.9, 2),
    ('Breaking Bad', 'series', 2008, 9.5, 1),
    ('Черное зеркало', 'series', 2011, 8.8, 3),
    ('Офис', 'series', 2005, 8.9, 2),
    ('Форрест Гамп', 'movie', 1994, 8.8, 1);

INSERT INTO episodes (title_id, season, episode, name) VALUES
    (4, 1, 1, 'The One Where Monica Gets a Roommate'),
    (4, 1, 2, 'The One with the Sonogram at the End'),
    (5, 1, 1, 'Pilot'),
    (5, 1, 2, 'Cat''s in the Bag...'),
    (6, 1, 1, 'The National Anthem');