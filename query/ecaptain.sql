INSERT INTO islands
    (id, name, capacity, created_at, updated_at)
VALUES
    (1, 'comida seca', 50, '2018-07-18 18:43:02', '2018-07-18 18:43:02'),
    (2, 'comida caliente', 65, '2018-07-18 18:43:02', '2018-07-18 18:43:02'),
    (3, 'isla no 3', 25, '2018-07-18 18:43:02', '2018-07-18 18:43:02');

-- --------------------------------------------------------

INSERT INTO containers
    (id, number_on_island, capacity, island_id, created_at, updated_at)
VALUES
    (1, 1, 12.00, 1, '2018-07-18 18:47:50', '2018-07-18 18:47:50'),
    (2, 2, 12.00, 1, '2018-07-18 18:47:50', '2018-07-18 18:47:50'),
    (3, 3, 6.00, 1, '2018-07-18 18:47:50', '2018-07-18 18:47:50'),
    (4, 4, 10.00, 1, '2018-07-18 18:47:50', '2018-07-18 18:47:50'),
    (5, 5, 10.00, 1, '2018-07-18 18:47:50', '2018-07-18 18:47:50');

-- --------------------------------------------------------

INSERT INTO dishes
    (id, name, created_at, updated_at)
VALUES
    (1, 'arroz', '2018-07-09 07:00:00', '2018-07-09 07:00:00'),
    (2, 'pollo', '2018-07-18 18:33:30', '2018-07-18 18:33:30'),
    (3, 'CAMARONES', '2018-07-18 18:34:07', '2018-07-18 18:34:07'),
    (4, 'caldo', '2018-07-18 18:34:07', '2018-07-18 18:34:07');

-- --------------------------------------------------------

INSERT INTO containers_status
    (id, actual_weight, container_id, dish_id, created_at, updated_at)
VALUES
    (1, 10, 1, 1, '2018-07-18 18:50:11', '2018-07-18 18:50:11');

-- --------------------------------------------------------