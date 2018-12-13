USE ITE2038;

INSERT INTO Sellers (
  name, phone, local, domain, passwd
) VALUES (
  "Bae Jiun",
  "10-3804-4496",
  "maybe",
  "hanyang.ac.kr",
  "548623"
);

INSERT INTO Sellers (
  name, phone, local, domain, passwd
) VALUES (
  "Jihye Jegal",
  "10-2222-4444",
  "jihye",
  "hanyang.ac.kr",
  "1234"
);

INSERT INTO Sellers (
  name, phone, local, domain, passwd
) VALUES (
  "Hanyang",
  "10-9999-2222",
  "hanyang",
  "hanyang.ac.kr",
  "1234"
);

INSERT INTO Stores (
  sname, address, phone_nums, lat, lng, schedules, seller_id
) VALUES (
  "Maybe-Store1",
  "ADDRESS_ADF",
  "10-231-1111",
  "lat:v:123",
  "lng:v:123",
  "{ \"name\": \"Value\"}",
  1
);

INSERT INTO Stores (
  sname, address, phone_nums, lat, lng, schedules, seller_id
) VALUES (
  "Maybe-Store2",
  "AFKWWWW",
  "10-111-1171",
  "lat:v:12345",
  "lng:v:12345",
  "{ \"name\": \"Value\"}",
  1
);

INSERT INTO Stores (
  sname, address, phone_nums, lat, lng, schedules, seller_id
) VALUES (
  "Jihye-Store1",
  "ADDRESS_ADFX",
  "10-231-3333",
  "lat:v:1123",
  "lng:v:1123",
  "{ \"name\": \"Value\"}",
  2
);