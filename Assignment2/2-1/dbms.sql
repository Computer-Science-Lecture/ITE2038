CREATE TABLE contacts (sid CHAR(32), phone CHAR(32), email CHAR(64));

INSERT INTO contacts VALUES ('2013004394','01056256058','amaclead@gmail.com');
INSERT INTO contacts VALUES ('2010499349','01058712131','art@venere.org');
INSERT INTO contacts VALUES ('2011040404','01078554051','donette.foller@cox.net');
INSERT INTO contacts VALUES ('2014505050','01062384210','fletcher.flosi@yahoo.com');
INSERT INTO contacts VALUES ('2014019493','01056662093','gladys.rim@rim.org');
INSERT INTO contacts VALUES ('2013040051','01064989926','gruta@cox.net');
INSERT INTO contacts VALUES ('2009003125','01095434668','jbutt@gmail.com');
INSERT INTO contacts VALUES ('2010004052','01022215104','josephine_darakjy@darakjy.org');
INSERT INTO contacts VALUES ('2013030128','01058290113','kiley.caldarera@aol.com');
INSERT INTO contacts VALUES ('2013001445','01089941847','kris@gmail.com');
INSERT INTO contacts VALUES ('2012030303','01060294130','leota@hotmail.com');
INSERT INTO contacts VALUES ('2011004533','01080969723','lpaprocki@hotmail.com');
INSERT INTO contacts VALUES ('2014002331','01043813720','mattie@aol.com');
INSERT INTO contacts VALUES ('2014005004','01096385105','meaghan@hotmail.com');
INSERT INTO contacts VALUES ('2013004004','01092039494','minna_amigon@yahoo.com');
INSERT INTO contacts VALUES ('2012004203','01094753033','mitsue_tollner@yahoo.com');
INSERT INTO contacts VALUES ('2012394929','01020374564','sage_wieser@cox.net');
INSERT INTO contacts VALUES ('2012004003','01035039847','simona@morasca.com');
INSERT INTO contacts VALUES ('2014040404','01085931087','yuki_whobrey@aol.com');

SELECT * FROM contacts;

CREATE TABLE stdents (sid CHAR(16), password CHAR(16), sname CHAR(16), sex CHAR(8), major_id INTEGER, tutor_id CHAR(16), grade INTEGER);

INSERT INTO students VALUES ('2009003125','125125125','정남아','female',44,'2001032011',4);
INSERT INTO students VALUES ('2010004052','39nnf2','김관유','male',4,'2001032064',3);
INSERT INTO students VALUES ('2010499349','2bn4','이현주','female',5,'2001032031',4);
INSERT INTO students VALUES ('2011004533','35234','한준희','male',3,'2001032070',3);
INSERT INTO students VALUES ('2011040404','x17171771','김다미','female',15,'2001032068',3);
INSERT INTO students VALUES ('2012004003','banila','김동관','male',33,'2001032030',3);
INSERT INTO students VALUES ('2012004203','qwe123','오든솔','male',5,'2001032007',3);
INSERT INTO students VALUES ('2012030303','arandomkey','최다비드','male',34,'2001032031',2);
INSERT INTO students VALUES ('2012394929','3425nn5','이지은','female',1,'2001032085',3);
INSERT INTO students VALUES ('2013001445','7007','노선영','female',4,'2001032010',2);
INSERT INTO students VALUES ('2013004004','foxfoxfox','윤준영','male',22,'2001032004',2);
INSERT INTO students VALUES ('2013004394','goodboy','윤인욱','male',1,'2001032004',2);
INSERT INTO students VALUES ('2013030128','food','윤지형','male',44,'2001032078',2);
INSERT INTO students VALUES ('2013040051','zeroone234','최아랑','female',19,'2001032078',2);
INSERT INTO students VALUES ('2014001303','192939','김다현','female',3,'2001032009',1);
INSERT INTO students VALUES ('2014002331','wer234','이상덕','male',2,'2001032008',1);
INSERT INTO students VALUES ('2014005004','hexahed','장두호','male',5,'2001032081',1);
INSERT INTO students VALUES ('2014019493','zerozero','임지훈','male',17,'2001032003',1);
INSERT INTO students VALUES ('2014040404','donkey','권지현','female',22,'2001032053',1);
INSERT INTO students VALUES ('2014505050','hellobaby','권희조','female',44,'2001032078',1);

SELECT * FROM students;

INSERT INTO students VALUES ('2016001234', 'xxx', '홍길동', 'male', 6, '1999002345', 1);
INSERT INTO contacts VALUES ('2016001234', '01088884444', 'hong@hanyang.ac.kr');
UPDATE contacts SET email='kwon@hanyang.ac.kr' WHERE sid = (SELECT sid FROM students WHERE sname='권희조');
DELETE FROM contacts WHERE sid = (SELECT sid FROM students WHERE sname='김다현');

CREATE TABLE pContacts1 (name CHAR(32), phone CHAR(32), email CHAR(32), type CHAR(32));
CREATE TABLE pContacts2 (name CHAR(32), phone CHAR(32), email CHAR(32), type CHAR(32));
CREATE TABLE pContacts3 (name CHAR(32), phone CHAR(32), email CHAR(32), type CHAR(32));

INSERT INTO pContacts1 VALUES('파이리', '01052340004', 'charmander@fire.poke', '사장');
INSERT INTO pContacts1 VALUES('날쌩마', '01020607709', 'rapidash@fire.poke', '부장');
INSERT INTO pContacts1 VALUES('브케인', '01041553104', 'cyndaquil@fire.poke', '과장');
INSERT INTO pContacts1 VALUES('푸호꼬', '01086530042', 'fennekin@fire.poke', '사원');
INSERT INTO pContacts1 VALUES('화살꼬빈', '01066162014', 'fletchling@normal.poke', '인턴');

INSERT INTO pContacts2 VALUES('이상해씨', '01023140011', 'bulbasaur@grass.poke', '사장');
INSERT INTO pContacts2 VALUES('치코리타', '01051522001', 'chikorita@grass.poke', '부장');
INSERT INTO pContacts2 VALUES('주리비안', '01064950101', 'snivy@grass.poke', '과장');
INSERT INTO pContacts2 VALUES('나무지기', '01032540033', 'sceptile@grass.poke', '사원');

INSERT INTO pContacts3 VALUES('꼬부기', '01030072322', 'squirtle@water.poke', '사장');
INSERT INTO pContacts3 VALUES('리아코', '01021580073', 'totodile@water.poke', '부장');
INSERT INTO pContacts3 VALUES('팽도리', '01039340079', 'piplup@water.poke', '차장');
INSERT INTO pContacts3 VALUES('샤미드', '01061344185', 'vaporeon@water.poke', '과장');
INSERT INTO pContacts3 VALUES('잉어킹', '01091290760', 'magikarp@water.poke', '사원');

DELETE FROM pContacts1 WHERE phone = '01066162014';
INSERT INTO pContacts1 VALUES('파이어로', '01066162014', 'talonflame@fire.poke', '대리');

UPDATE pContacts2 SET name='이상해풀',email='ivysaur@grass.poke',type='이사' WHERE phone='01023140011';
UPDATE pContacts2 SET email='meganium@grass.poke', type='사장' WHERE phone='01051522001';
INSERT INTO pContacts2 VALUES('리피아', '01061344185', 'leafeon@grass.poke', '부장');

UPDATE pContacts3 SET name='갸라도스',email='gyarados@water.poke',type='과장' WHERE phone='01091290760';
DELETE FROM pContacts3 WHERE phone='01061344185';
INSERT INTO pContacts3 VALUES('마릴', '01029818318', 'marill@water.poke', '사원');

DELETE FROM pContacts1 WHERE phone = (SELECT phone FROM pContacts1 ORDER BY RANDOM() LIMIT 1);
DELETE FROM pContacts2 WHERE phone = (SELECT phone FROM pContacts2 ORDER BY RANDOM() LIMIT 1);
DELETE FROM pContacts3 WHERE phone = (SELECT phone FROM pContacts3 ORDER BY RANDOM() LIMIT 1);

SELECT
    split_part(email, '@', 2) AS domain
    count(*) AS scount
FROM contacts
GROUP BY split_part(email, '@', 2);
