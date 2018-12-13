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
  "37.566876",
  "127.0292",
  "{ \"name\": \"Value\"}",
  1
);

INSERT INTO Stores (
  sname, address, phone_nums, lat, lng, schedules, seller_id
) VALUES (
  "Maybe-Store2",
  "AFKWWWW",
  "10-111-1171",
  "37.5669",
  "127.0298",
  "{ \"name\": \"Value\"}",
  1
);

INSERT INTO Stores (
  sname, address, phone_nums, lat, lng, schedules, seller_id
) VALUES (
  "Jihye-Store1",
  "ADDRESS_ADFX",
  "10-231-3333",
  "37.568007",
  "127.029245",
  "{ \"name\": \"Value\"}",
  2
);

INSERT INTO Menus (
  name, price, store_id
) VALUES (
  "Maybe-Store1 Menu1",
  1230,
  1
);

INSERT INTO Menus (
  name, price, store_id
) VALUES (
  "Maybe-Store1 Menu2",
  12350,
  1
);

INSERT INTO Menus (
  name, price, store_id
) VALUES (
  "Menu3",
  999,
  3
);

INSERT INTO Customers (
  name, phone, local, domain, passwd, lat, lng, payments
) VALUES (
  "Jiun-Com",
  "10-3804-5996",
  "maytryark",
  "gmail.com",
  "548623",
  "37.5666666",
  "127.029222",
  "{\"key\": \"value\"}"
);

INSERT INTO Deliveries (
  name, phone, local, domain, passwd, lat, lng
) VALUES (
  "Jiun-qwe",
  "10-3804-9996",
  "alice.maydev",
  "gmail.com",
  "548623",
  "37.56789789",
  "127.033333"
);

INSERT INTO Destinations (
  lat, lng, customer_id
) VALUES (
  "37.561111",
  "237.03555",
  1
);

INSERT INTO Orders (
  customer_id, delivery_id, store_id, destination_id
) VALUES (
  1,
  1,
  1,
  1
);

