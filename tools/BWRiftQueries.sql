-- Get BWR population data from Jack's DB dumps

-- Known Issues:
-- Buffs/Curses are not being tracked - Portal Paladin & Portal Pursuer are problematic
-- Chamber Cleaver only attracted after 20% completion

-- Select Mice And Sample sizes
-- Change Charm =/!= based on requirements
SELECT
  l.name       AS location,
  s.name       AS phase,
  c.name       AS cheese,
#   ch.name      AS charm,
  m.name       AS mouse,
  count(*)     AS attractions
FROM hunts h
  INNER JOIN locations l ON l.id = h.location_id
  INNER JOIN hunt_stage hs ON h.id = hs.hunt_id
  INNER JOIN stages s ON hs.stage_id = s.id
  INNER JOIN cheese c ON h.cheese_id = c.id
  INNER JOIN mice m ON h.mouse_id = m.id
#   INNER JOIN charms ch ON h.charm_id = ch.id
WHERE h.location_id = 55 AND
      h.charm_id != 2322 #--Rift Anti Skele
GROUP BY h.location_id, hs.stage_id, c.id, m.id;

-- Select Sample Sizes without mice
SELECT
  l.name   AS location,
  s.name   AS stage,
  c.name   AS cheese,
  count(*) AS sample
FROM hunts h
  INNER JOIN locations l ON l.id = h.location_id
  INNER JOIN hunt_stage hs ON h.id = hs.hunt_id
  INNER JOIN stages s ON hs.stage_id = s.id
  INNER JOIN cheese c ON h.cheese_id = c.id
WHERE location_id = 55 AND
      h.charm_id != 2322 #--Rift Anti Skele
GROUP BY h.location_id, hs.stage_id, c.id;


