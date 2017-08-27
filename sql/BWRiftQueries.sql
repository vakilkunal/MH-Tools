SELECT
  l.name   AS location,
  s.name   AS stage,
  c.name   AS cheese,
  m.name   AS mouse,
  count(*) AS sample
FROM hunts h
  INNER JOIN locations l ON l.id = h.location_id
  INNER JOIN stages s ON h.stage_id = s.id
  INNER JOIN cheese c ON h.cheese_id = c.id
  INNER JOIN mice m ON h.mouse_id = m.id
WHERE location_id = 55 AND
      h.charm_id != 2322 #--Rift Anti Skele
GROUP BY h.location_id, h.stage_id, c.id, m.id;

SELECT * FROM charms WHERE name LIKE "Rift %"