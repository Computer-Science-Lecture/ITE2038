SELECT building_id, name, admin, rooms
FROM Buildings
    LEFT JOIN Rooms
    ON Rooms.building_id = Buildings.building_id
GROUP BY building_id
HAVING COUNT(*) >= 20;

INSERT INTO Students
VALUES ('2015004584', 'passWord', '배지운', 'male', 44, '2015004555', 4);

UPDATE Buildings SET name='정보통신관' WHERE name='IT/BT';

SELECT Buildings.building_id, Buildings.name
FROM Buildings
    FULL OUTER JOIN Rooms
    ON Rooms.building_id = Buildings.building_id
WHERE Rooms.capacity >= 100;

SELECT course_id
FROM Classes

SELECT SUBSTRING(course_id, 1, 3) AS major
FROM Classes
GROUP BY SUBSTRING(course_id, 1, 3)
LIMIT 10;
