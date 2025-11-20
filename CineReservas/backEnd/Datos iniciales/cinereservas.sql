-- ===========================================
-- BASE DE DATOS CineReservas (LIMPIADA)
-- Lista para importación desde Node/MySQL2
-- ===========================================

-- ===========================================
-- TABLA: funcion
-- ===========================================

CREATE TABLE IF NOT EXISTS `funcion` (
  `id_funcion` int(11) NOT NULL,
  `id_pelicula` int(11) NOT NULL,
  `id_sala` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `precio` decimal(8,2) NOT NULL,
  `asientos_disponibles` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `funcion`
--

INSERT IGNORE INTO `funcion` (`id_funcion`, `id_pelicula`, `id_sala`, `fecha`, `hora`, `precio`, `asientos_disponibles`) VALUES
(17, 19, 1, '2025-11-20', '17:00:00', '15000.00', 47),
(18, 6, 2, '2025-11-20', '11:00:00', '10000.00', 65),
(19, 1, 3, '2025-11-21', '18:00:00', '20000.00', 67);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pelicula`
--

CREATE TABLE IF NOT EXISTS `pelicula` (
  `id_pelicula` int(11) NOT NULL,
  `titulo` varchar(150) COLLATE utf8_spanish_ci NOT NULL,
  `img` varchar(255) COLLATE utf8_spanish_ci NOT NULL,
  `sinopsis` text COLLATE utf8_spanish_ci,
  `duracion` int(11) DEFAULT NULL,
  `clasificacion` varchar(10) COLLATE utf8_spanish_ci DEFAULT NULL,
  `genero` varchar(50) COLLATE utf8_spanish_ci DEFAULT NULL,
  `idioma` varchar(30) COLLATE utf8_spanish_ci DEFAULT NULL,
  `estado` enum('activa','inactiva') COLLATE utf8_spanish_ci DEFAULT 'activa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `pelicula`
--

INSERT IGNORE INTO `pelicula` (`id_pelicula`, `titulo`, `img`, `sinopsis`, `duracion`, `clasificacion`, `genero`, `idioma`, `estado`) VALUES
(1, 'Avatar 2', '/img/Avatar.jpeg', 'Regresa a Pandora con espectaculares efectos visuales y una historia emocionante.', 192, 'PG-13', 'Ciencia ficción', 'Español', 'activa'),
(2, 'Avengers: Endgame', '/img/endgame.jpg', 'Los Vengadores se enfrentan a Thanos en la batalla final por el destino del universo.', 181, 'PG-13', 'Acción', 'Español', 'inactiva'),
(3, 'Joker', '/img/joker.jpg', 'La historia oscura y psicológica del origen del icónico villano de Gotham.', 122, 'R', 'Drama', 'Español', 'inactiva'),
(4, 'Coco', '/img/coco.jpg', 'Miguel viaja al Mundo de los Muertos para descubrir la verdad sobre su familia.', 105, 'PG', 'Animación', 'Español', 'inactiva'),
(5, 'Interestelar', '/img/interestelar.jpg', 'Un grupo de astronautas viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.', 169, 'PG-13', 'Ciencia ficción', 'Español', 'inactiva'),
(6, 'Toy Story 4', '/img/toystory4.jpg', 'Woody, Buzz y los demás juguetes viven una nueva aventura llena de emoción, humor y nostalgia.', 100, 'G', 'Animación', 'Español', 'activa'),
(7, 'Rápidos y Furiosos 9', '/img/rapidos9.jpg', 'Dom Toretto y su familia enfrentan nuevos enemigos en explosivas escenas de acción.', 145, 'PG-13', 'Acción', 'Español', 'inactiva'),
(8, 'It: Capítulo Dos', '/img/it2.jpg', 'Los perdedores regresan 27 años después para enfrentarse nuevamente a Pennywise.', 169, 'R', 'Terror', 'Español', 'inactiva'),
(10, 'Spider-Man: No Way Home', '/img/spiderman.jpg', 'Peter Parker enfrenta las consecuencias de que su identidad sea revelada mientras abre el multiverso.', 148, 'PG-13', 'Acción', 'Español', 'inactiva'),
(11, 'Oppenheimer', '/img/oppenheimer.jpg', 'La historia del científico detrás de la creación de la bomba atómica.', 180, 'R', 'Drama', 'Español', 'inactiva'),
(12, 'La Monja 2', '/img/lamonja2.jpg', 'La demoníaca Valak regresa para sembrar el terror en un internado europeo.', 110, 'R', 'Terror', 'Español', 'inactiva'),
(13, 'Dune: Parte Dos', '/img/dune2.jpg', 'Paul Atreides une fuerzas con los Fremen mientras busca vengarse de quienes destruyeron a su familia.', 166, 'PG-13', 'Ciencia ficción', 'Español', 'inactiva'),
(14, 'Guardianes de la Galaxia Vol. 3', '/img/guardianes3.jpg', 'Los Guardianes unen fuerzas por una misión que podría poner en riesgo sus vidas mientras enfrentan el pasado de Rocket.', 150, 'PG-13', 'Acción', 'Español', 'inactiva'),
(15, 'Barbie', '/img/barbie.jpg', 'Barbie emprende un viaje al mundo real luego de experimentar una crisis que altera su vida perfecta en Barbieland.', 114, 'PG-13', 'Comedia', 'Español', 'inactiva'),
(16, 'Mario Bros: La Película', '/img/mario.jpg', 'Mario y Luigi llegan al Reino Champiñón donde deben enfrentar a Bowser para salvar a la princesa Peach.', 92, 'PG', 'Animación', 'Español', 'inactiva'),
(17, 'John Wick 4', '/img/johnwick4.jpg', 'John Wick enfrenta a los asesinos más letales del mundo mientras busca su libertad definitiva de la Mesa Alta.', 169, 'R', 'Acción', 'Español', 'inactiva'),
(18, 'Wonka', '/img/wonka.jpg', 'La historia del joven Willy Wonka antes de convertirse en el excéntrico chocolatero que todos conocen.', 112, 'PG', 'Aventura', 'Español', 'inactiva'),
(19, 'Kung Fu Panda 4', '/img/kfp4.jpg', 'Po debe encontrar y entrenar al nuevo Guerrero Dragón mientras enfrenta a una villana que roba poderes.', 94, 'PG', 'Animación', 'Español', 'activa'),
(20, 'El Exorcista del Papa', '/img/exorcistapapa.jpg', 'El exorcista principal del Vaticano investiga un caso de posesión que revela una antigua conspiración.', 103, 'R', 'Terror', 'Español', 'inactiva'),
(21, 'Napoleón', '/img/napoleon.jpg', 'La vida militar y amorosa de Napoleón Bonaparte, mostrando su ascenso y caída como emperador.', 158, 'R', 'Drama', 'Español', 'inactiva'),
(22, 'Godzilla Minus One', '/img/godzilla1.jpg', 'Japón intenta recuperarse tras la guerra, pero un nuevo terror emerge: Godzilla.', 124, 'PG-13', 'Ciencia ficción', 'Español', 'inactiva'),
(23, 'Meg 2: El Gran Abismo', '/img/meg2.jpg', 'Un equipo de exploración submarina enfrenta criaturas gigantes liberadas de una fosa oceánica desconocida.', 116, 'PG-13', 'Acción', 'Español', 'inactiva'),
(24, 'The Marvels', '/img/marvels.jpg', 'Carol Danvers une fuerzas con Kamala Khan y Monica Rambeau cuando sus poderes se entrelazan misteriosamente.', 105, 'PG-13', 'Acción', 'Español', 'inactiva'),
(25, 'El Conjuro: Últimos Ritos', '/img/conjuro.jpg', 'Ed y Lorraine Warren enfrentan un nuevo caso relacionado con fuerzas demoníacas.', 111, 'R', 'Terror', 'Español', 'inactiva');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

CREATE TABLE IF NOT EXISTS `reserva` (
  `id_reserva` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_funcion` int(11) NOT NULL,
  `fecha_reserva` date NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` enum('pendiente','confirmado','confirmada','cancelada') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'pendiente',
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `reserva`
--

INSERT IGNORE INTO `reserva` (`id_reserva`, `id_usuario`, `id_funcion`, `fecha_reserva`, `total`, `estado`, `cantidad`) VALUES
(16, 18, 18, '2025-11-20', '10000.00', 'confirmado', 1),
(17, 18, 19, '2025-11-20', '40000.00', 'confirmado', 2),
(18, 18, 17, '2025-11-20', '15000.00', 'confirmado', 1),
(19, 2, 18, '2025-11-20', '10000.00', 'confirmado', 1),
(20, 21, 18, '2025-11-20', '20000.00', 'confirmado', 2),
(21, 3, 19, '2025-11-20', '60000.00', 'confirmado', 3),
(22, 5, 17, '2025-11-20', '15000.00', 'confirmado', 1),
(24, 5, 18, '2025-11-20', '10000.00', 'confirmado', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva_asiento`
--

CREATE TABLE IF NOT EXISTS `reserva_asiento` (
  `id_reserva` int(11) NOT NULL,
  `id_asiento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salas`
--

CREATE TABLE IF NOT EXISTS `salas` (
  `id_sala` int(11) NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `salas`
--

INSERT IGNORE INTO `salas` (`id_sala`, `nombre`) VALUES
(1, 'Sala 1'),
(2, 'Sala 2'),
(3, 'Sala 3'),
(4, 'Sala 4'),
(5, 'Sala 5');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seats`
--

CREATE TABLE `seats` (
  `id` int(11) NOT NULL,
  `seat_number` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reserved` tinyint(1) DEFAULT '0',
  `id_sala` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `seats`
--

INSERT IGNORE INTO `seats` (`id`, `seat_number`, `reserved`, `id_sala`) VALUES
(61, 'A1', 0, 4),
(62, 'A2', 0, 4),
(63, 'A3', 0, 4),
(64, 'A4', 0, 4),
(65, 'A5', 0, 4),
(66, 'A6', 0, 4),
(67, 'A7', 0, 4),
(68, 'A8', 0, 4),
(69, 'A9', 0, 4),
(70, 'A10', 0, 4),
(71, 'A11', 0, 4),
(72, 'A12', 0, 4),
(73, 'B1', 0, 4),
(74, 'B2', 0, 4),
(75, 'B3', 0, 4),
(76, 'B4', 0, 4),
(77, 'B5', 0, 4),
(78, 'B6', 0, 4),
(79, 'B7', 0, 4),
(80, 'B8', 0, 4),
(81, 'B9', 0, 4),
(82, 'B10', 0, 4),
(83, 'B11', 0, 4),
(84, 'B12', 0, 4),
(85, 'C1', 0, 4),
(86, 'C2', 0, 4),
(87, 'C3', 0, 4),
(88, 'C4', 0, 4),
(89, 'C5', 0, 4),
(90, 'C6', 0, 4),
(91, 'C7', 0, 4),
(92, 'C8', 0, 4),
(93, 'C9', 0, 4),
(94, 'C10', 0, 4),
(95, 'C11', 0, 4),
(96, 'C12', 0, 4),
(97, 'D1', 0, 4),
(98, 'D2', 0, 4),
(99, 'D3', 0, 4),
(100, 'D4', 0, 4),
(101, 'D5', 0, 4),
(102, 'D6', 0, 4),
(103, 'D7', 0, 4),
(104, 'D8', 0, 4),
(105, 'D9', 0, 4),
(106, 'D10', 0, 4),
(107, 'D11', 0, 4),
(108, 'D12', 0, 4),
(109, 'E1', 0, 4),
(110, 'E2', 0, 4),
(111, 'E3', 0, 4),
(112, 'E4', 0, 4),
(113, 'E5', 0, 4),
(114, 'E6', 1, 4),
(115, 'E7', 1, 4),
(116, 'E8', 0, 4),
(117, 'E9', 0, 4),
(118, 'E10', 0, 4),
(119, 'E11', 0, 4),
(120, 'E12', 0, 4),
(121, 'F1', 0, 4),
(122, 'F2', 0, 4),
(123, 'F3', 0, 4),
(124, 'F4', 0, 4),
(125, 'F5', 0, 4),
(126, 'F6', 0, 4),
(127, 'F7', 0, 4),
(128, 'F8', 0, 4),
(129, 'F9', 0, 4),
(130, 'F10', 0, 4),
(131, 'F11', 0, 4),
(132, 'F12', 0, 4),
(133, 'G1', 0, 4),
(134, 'G2', 0, 4),
(135, 'G3', 0, 4),
(136, 'G4', 0, 4),
(137, 'G5', 0, 4),
(138, 'G6', 0, 4),
(139, 'G7', 0, 4),
(140, 'G8', 0, 4),
(141, 'G9', 0, 4),
(142, 'G10', 0, 4),
(143, 'G11', 0, 4),
(144, 'G12', 0, 4),
(145, 'H1', 0, 4),
(146, 'H2', 0, 4),
(147, 'H3', 0, 4),
(148, 'H4', 0, 4),
(149, 'H5', 0, 4),
(150, 'H6', 0, 4),
(151, 'H7', 0, 4),
(152, 'H8', 0, 4),
(153, 'H9', 0, 4),
(154, 'H10', 0, 4),
(155, 'H11', 0, 4),
(156, 'H12', 0, 4),
(157, 'A1', 0, 5),
(158, 'A2', 0, 5),
(159, 'A3', 0, 5),
(160, 'A4', 0, 5),
(161, 'A5', 0, 5),
(162, 'A6', 0, 5),
(163, 'A7', 0, 5),
(164, 'A8', 0, 5),
(165, 'A9', 0, 5),
(166, 'A10', 0, 5),
(167, 'B1', 0, 5),
(168, 'B2', 0, 5),
(169, 'B3', 0, 5),
(170, 'B4', 0, 5),
(171, 'B5', 0, 5),
(172, 'B6', 0, 5),
(173, 'B7', 0, 5),
(174, 'B8', 0, 5),
(175, 'B9', 0, 5),
(176, 'B10', 0, 5),
(177, 'C1', 0, 5),
(178, 'C2', 0, 5),
(179, 'C3', 0, 5),
(180, 'C4', 0, 5),
(181, 'C5', 0, 5),
(182, 'C6', 0, 5),
(183, 'C7', 0, 5),
(184, 'C8', 0, 5),
(185, 'C9', 0, 5),
(186, 'C10', 0, 5),
(187, 'D1', 0, 5),
(188, 'D2', 0, 5),
(189, 'D3', 0, 5),
(190, 'D4', 0, 5),
(191, 'D5', 0, 5),
(192, 'D6', 0, 5),
(193, 'D7', 0, 5),
(194, 'D8', 0, 5),
(195, 'D9', 0, 5),
(196, 'D10', 0, 5),
(197, 'E1', 0, 5),
(198, 'E2', 0, 5),
(199, 'E3', 0, 5),
(200, 'E4', 0, 5),
(201, 'E5', 0, 5),
(202, 'E6', 0, 5),
(203, 'E7', 0, 5),
(204, 'E8', 0, 5),
(205, 'E9', 0, 5),
(206, 'E10', 0, 5),
(207, 'F1', 0, 5),
(208, 'F2', 0, 5),
(209, 'F3', 0, 5),
(210, 'F4', 0, 5),
(211, 'F5', 0, 5),
(212, 'F6', 0, 5),
(213, 'F7', 0, 5),
(214, 'F8', 0, 5),
(215, 'F9', 0, 5),
(216, 'F10', 0, 5),
(217, 'G1', 0, 5),
(218, 'G2', 0, 5),
(219, 'G3', 0, 5),
(220, 'G4', 0, 5),
(221, 'G5', 0, 5),
(222, 'G6', 0, 5),
(223, 'G7', 0, 5),
(224, 'G8', 0, 5),
(225, 'G9', 0, 5),
(226, 'G10', 0, 5),
(227, 'H1', 0, 5),
(228, 'H2', 0, 5),
(229, 'H3', 0, 5),
(230, 'H4', 1, 5),
(231, 'H5', 1, 5),
(232, 'H6', 0, 5),
(233, 'H7', 0, 5),
(234, 'H8', 0, 5),
(235, 'H9', 0, 5),
(236, 'H10', 0, 5),
(237, 'I1', 0, 5),
(238, 'I2', 0, 5),
(239, 'I3', 0, 5),
(240, 'I4', 0, 5),
(241, 'I5', 0, 5),
(242, 'I6', 0, 5),
(243, 'I7', 0, 5),
(244, 'I8', 0, 5),
(245, 'I9', 0, 5),
(246, 'I10', 0, 5),
(247, 'J1', 0, 5),
(248, 'J2', 0, 5),
(249, 'J3', 0, 5),
(250, 'J4', 0, 5),
(251, 'J5', 0, 5),
(252, 'J6', 0, 5),
(253, 'J7', 0, 5),
(254, 'J8', 0, 5),
(255, 'J9', 0, 5),
(256, 'J10', 0, 5),
(257, 'A1', 0, 1),
(258, 'A2', 0, 1),
(259, 'A3', 0, 1),
(260, 'A4', 0, 1),
(261, 'A5', 0, 1),
(262, 'A6', 0, 1),
(263, 'A7', 0, 1),
(264, 'A8', 0, 1),
(265, 'A9', 0, 1),
(266, 'A10', 0, 1),
(267, 'B1', 0, 1),
(268, 'B2', 0, 1),
(269, 'B3', 0, 1),
(270, 'B4', 0, 1),
(271, 'B5', 0, 1),
(272, 'B6', 0, 1),
(273, 'B7', 0, 1),
(274, 'B8', 0, 1),
(275, 'B9', 0, 1),
(276, 'B10', 0, 1),
(277, 'C1', 0, 1),
(278, 'C2', 0, 1),
(279, 'C3', 0, 1),
(280, 'C4', 0, 1),
(281, 'C5', 0, 1),
(282, 'C6', 0, 1),
(283, 'C7', 0, 1),
(284, 'C8', 0, 1),
(285, 'C9', 0, 1),
(286, 'C10', 0, 1),
(287, 'D1', 0, 1),
(288, 'D2', 0, 1),
(289, 'D3', 1, 1),
(290, 'D4', 0, 1),
(291, 'D5', 0, 1),
(292, 'D6', 1, 1),
(293, 'D7', 0, 1),
(294, 'D8', 0, 1),
(295, 'D9', 0, 1),
(296, 'D10', 0, 1),
(297, 'E1', 0, 1),
(298, 'E2', 0, 1),
(299, 'E3', 0, 1),
(300, 'E4', 0, 1),
(301, 'E5', 1, 1),
(302, 'E6', 0, 1),
(303, 'E7', 0, 1),
(304, 'E8', 0, 1),
(305, 'E9', 0, 1),
(306, 'E10', 0, 1),
(307, 'A1', 0, 2),
(308, 'A2', 0, 2),
(309, 'A3', 0, 2),
(310, 'A4', 0, 2),
(311, 'A5', 0, 2),
(312, 'A6', 0, 2),
(313, 'A7', 0, 2),
(314, 'A8', 0, 2),
(315, 'A9', 0, 2),
(316, 'A10', 0, 2),
(317, 'B1', 0, 2),
(318, 'B2', 0, 2),
(319, 'B3', 0, 2),
(320, 'B4', 0, 2),
(321, 'B5', 0, 2),
(322, 'B6', 0, 2),
(323, 'B7', 0, 2),
(324, 'B8', 0, 2),
(325, 'B9', 0, 2),
(326, 'B10', 0, 2),
(327, 'C1', 0, 2),
(328, 'C2', 0, 2),
(329, 'C3', 0, 2),
(330, 'C4', 0, 2),
(331, 'C5', 0, 2),
(332, 'C6', 0, 2),
(333, 'C7', 0, 2),
(334, 'C8', 0, 2),
(335, 'C9', 0, 2),
(336, 'C10', 0, 2),
(337, 'D1', 0, 2),
(338, 'D2', 0, 2),
(339, 'D3', 1, 2),
(340, 'D4', 0, 2),
(341, 'D5', 0, 2),
(342, 'D6', 0, 2),
(343, 'D7', 1, 2),
(344, 'D8', 0, 2),
(345, 'D9', 0, 2),
(346, 'D10', 0, 2),
(347, 'E1', 0, 2),
(348, 'E2', 0, 2),
(349, 'E3', 0, 2),
(350, 'E4', 0, 2),
(351, 'E5', 1, 2),
(352, 'E6', 1, 2),
(353, 'E7', 0, 2),
(354, 'E8', 0, 2),
(355, 'E9', 0, 2),
(356, 'E10', 0, 2),
(357, 'F1', 0, 2),
(358, 'F2', 0, 2),
(359, 'F3', 0, 2),
(360, 'F4', 0, 2),
(361, 'F5', 1, 2),
(362, 'F6', 0, 2),
(363, 'F7', 0, 2),
(364, 'F8', 0, 2),
(365, 'F9', 0, 2),
(366, 'F10', 0, 2),
(367, 'G1', 0, 2),
(368, 'G2', 0, 2),
(369, 'G3', 0, 2),
(370, 'G4', 0, 2),
(371, 'G5', 0, 2),
(372, 'G6', 0, 2),
(373, 'G7', 0, 2),
(374, 'G8', 0, 2),
(375, 'G9', 0, 2),
(376, 'G10', 0, 2),
(449, 'A1', 0, 3),
(450, 'A2', 0, 3),
(451, 'A3', 0, 3),
(452, 'A4', 0, 3),
(453, 'A5', 0, 3),
(454, 'A6', 0, 3),
(455, 'A7', 0, 3),
(456, 'A8', 0, 3),
(457, 'A9', 0, 3),
(458, 'A10', 0, 3),
(459, 'A11', 0, 3),
(460, 'A12', 0, 3),
(461, 'B1', 0, 3),
(462, 'B2', 0, 3),
(463, 'B3', 1, 3),
(464, 'B4', 1, 3),
(465, 'B5', 1, 3),
(466, 'B6', 0, 3),
(467, 'B7', 0, 3),
(468, 'B8', 0, 3),
(469, 'B9', 0, 3),
(470, 'B10', 0, 3),
(471, 'B11', 0, 3),
(472, 'B12', 0, 3),
(473, 'C1', 0, 3),
(474, 'C2', 0, 3),
(475, 'C3', 0, 3),
(476, 'C4', 0, 3),
(477, 'C5', 0, 3),
(478, 'C6', 0, 3),
(479, 'C7', 0, 3),
(480, 'C8', 0, 3),
(481, 'C9', 0, 3),
(482, 'C10', 0, 3),
(483, 'C11', 0, 3),
(484, 'C12', 0, 3),
(485, 'D1', 0, 3),
(486, 'D2', 0, 3),
(487, 'D3', 0, 3),
(488, 'D4', 0, 3),
(489, 'D5', 0, 3),
(490, 'D6', 1, 3),
(491, 'D7', 1, 3),
(492, 'D8', 0, 3),
(493, 'D9', 0, 3),
(494, 'D10', 0, 3),
(495, 'D11', 0, 3),
(496, 'D12', 0, 3),
(497, 'E1', 0, 3),
(498, 'E2', 0, 3),
(499, 'E3', 0, 3),
(500, 'E4', 0, 3),
(501, 'E5', 0, 3),
(502, 'E6', 0, 3),
(503, 'E7', 0, 3),
(504, 'E8', 0, 3),
(505, 'E9', 0, 3),
(506, 'E10', 0, 3),
(507, 'E11', 0, 3),
(508, 'E12', 0, 3),
(509, 'F1', 0, 3),
(510, 'F2', 0, 3),
(511, 'F3', 0, 3),
(512, 'F4', 0, 3),
(513, 'F5', 0, 3),
(514, 'F6', 0, 3),
(515, 'F7', 0, 3),
(516, 'F8', 0, 3),
(517, 'F9', 0, 3),
(518, 'F10', 0, 3),
(519, 'F11', 0, 3),
(520, 'F12', 0, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `nombre_usuario` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `correo` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `contrasena` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `rol` enum('cliente','administrador') COLLATE utf8_spanish_ci DEFAULT 'cliente',
  `telefono` varchar(20) COLLATE utf8_spanish_ci DEFAULT NULL,
  `reset_pin` varchar(6) COLLATE utf8_spanish_ci DEFAULT NULL,
  `reset_expiration` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT IGNORE INTO `usuario` (`id_usuario`, `nombre`, `nombre_usuario`, `correo`, `contrasena`, `rol`, `telefono`, `reset_pin`, `reset_expiration`) VALUES
(1, 'Juan Ascanio', 'juanA', 'jascanio412@gmail.com', '12345juan', 'administrador', '3001234567', '956167', '2025-11-12 21:27:09'),
(2, 'María López', 'marial', 'maria.lopez@gmail.com', 'maria2025', 'cliente', '3019876543', NULL, NULL),
(3, 'Carlos Pérez', 'carlosp', 'carlos.perez@gmail.com', 'car123', 'cliente', '3025551122', NULL, NULL),
(4, 'Laura Gómez', 'laurag', 'laura.gomez@gmail.com', 'laura321', 'cliente', '3108887766', NULL, NULL),
(5, 'Andrés Torres', 'andrest', 'andres.torres@gmail.com', 'torres555', 'cliente', '3129992233', NULL, NULL),
(7, 'Juan José', 'Juajo', 'juan.jose@gmail.com', '12345', 'cliente', '3124578945', NULL, NULL),
(18, 'Cristian', 'Cristian', 'cristianjacobquintero@gmail.com', 'loquesea', 'cliente', NULL, NULL, NULL),
(20, 'Admin', 'admin', 'cinereservasoficial@gmail.com', 'admin123', 'administrador', NULL, NULL, NULL),
(21, 'Sofía Herrera', 'sofiH', 'sofia.herrera@gmail.com', 'sofia321', 'cliente', '3009876543', NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `funcion`
--
ALTER TABLE `funcion`
  ADD PRIMARY KEY (`id_funcion`),
  ADD KEY `id_pelicula` (`id_pelicula`),
  ADD KEY `id_sala` (`id_sala`);

--
-- Indices de la tabla `pelicula`
--
ALTER TABLE `pelicula`
  ADD PRIMARY KEY (`id_pelicula`);

--
-- Indices de la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`id_reserva`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_funcion` (`id_funcion`);

--
-- Indices de la tabla `reserva_asiento`
--
ALTER TABLE `reserva_asiento`
  ADD PRIMARY KEY (`id_reserva`,`id_asiento`),
  ADD KEY `id_asiento` (`id_asiento`);

--
-- Indices de la tabla `salas`
--
ALTER TABLE `salas`
  ADD PRIMARY KEY (`id_sala`);

--
-- Indices de la tabla `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `funcion`
--
ALTER TABLE `funcion`
  MODIFY `id_funcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `pelicula`
--
ALTER TABLE `pelicula`
  MODIFY `id_pelicula` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id_reserva` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `salas`
--
ALTER TABLE `salas`
  MODIFY `id_sala` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `seats`
--
ALTER TABLE `seats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=521;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `funcion`
--
ALTER TABLE `funcion`
  ADD CONSTRAINT `funcion_ibfk_1` FOREIGN KEY (`id_pelicula`) REFERENCES `pelicula` (`id_pelicula`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `funcion_ibfk_2` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `reserva_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reserva_ibfk_2` FOREIGN KEY (`id_funcion`) REFERENCES `funcion` (`id_funcion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `reserva_asiento`
--
ALTER TABLE `reserva_asiento`
  ADD CONSTRAINT `reserva_asiento_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reserva_asiento_ibfk_2` FOREIGN KEY (`id_asiento`) REFERENCES `seats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;