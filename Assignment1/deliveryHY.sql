ALTER TABLE "Seller" DROP CONSTRAINT "OwnersSeller";
ALTER TABLE "Service" DROP CONSTRAINT "SellersServices";
ALTER TABLE "Contact" DROP CONSTRAINT "SellersContracts";
ALTER TABLE "Contact" DROP CONSTRAINT "BuyersContracts";
ALTER TABLE "Payment" DROP CONSTRAINT "BuyersPayment";
ALTER TABLE "Destination" DROP CONSTRAINT "BuyersDestination";
ALTER TABLE "Contact" DROP CONSTRAINT "AgencysContracts";
ALTER TABLE "Order" DROP CONSTRAINT "OrdersPayment";
ALTER TABLE "Order" DROP CONSTRAINT "OrdersDestination";
ALTER TABLE "Order" DROP CONSTRAINT "OrdersService";
ALTER TABLE "Order" DROP CONSTRAINT "OrdersAgency";

ALTER TABLE "Owner" DROP CONSTRAINT "";
ALTER TABLE "Buyer" DROP CONSTRAINT "";
ALTER TABLE "Agency" DROP CONSTRAINT "";
ALTER TABLE "Contact" DROP CONSTRAINT "";

DROP TABLE "Seller";
DROP TABLE "Service";
DROP TABLE "Owner";
DROP TABLE "Buyer";
DROP TABLE "Agency";
DROP TABLE "Order";
DROP TABLE "Contact";
DROP TABLE "Payment";
DROP TABLE "Destination";

CREATE TABLE "Seller" (
"id" serial4 NOT NULL,
"name" varchar(255) NOT NULL,
"location" point NOT NULL,
"address_city" varchar(16) NOT NULL,
"address_county" varchar(16),
"address_district" varchar(16),
"service" varchar(255) NOT NULL,
"createdAt" time(0) NOT NULL,
"business_day" varchar(255),
"business_hour" varchar(255),
"ownerId" int4 NOT NULL,
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "Service" (
"id" serial4 NOT NULL,
"name" varchar(64) NOT NULL,
"price" int4 NOT NULL,
"events" varchar(255),
"sellerId" int4 NOT NULL,
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "Owner" (
"id" serial4 NOT NULL,
"login_id" varchar(255) NOT NULL,
"login_pw" varchar(255) NOT NULL,
"email" varchar(255) NOT NULL,
PRIMARY KEY ("id") ,
UNIQUE ("login_id", "email")
)
WITHOUT OIDS;
CREATE TABLE "Buyer" (
"id" serial4 NOT NULL,
"login_id" varchar(255) NOT NULL,
"login_pw" varchar(255) NOT NULL,
"email" varchar(255) NOT NULL,
PRIMARY KEY ("id") ,
UNIQUE ("login_id", "email")
)
WITHOUT OIDS;
CREATE TABLE "Agency" (
"id" serial4 NOT NULL,
"login_id" varchar(255) NOT NULL,
"login_pw" varchar(255) NOT NULL,
"email" varchar(255) NOT NULL,
"location" point,
"updatedAt" timestamp(0),
"activity_location" varchar(8) NOT NULL,
"status" bool NOT NULL,
"queue" int NOT NULL,
"fee" int NOT NULL,
PRIMARY KEY ("id") ,
UNIQUE ("login_id", "email")
)
WITHOUT OIDS;
CREATE TABLE "Order" (
"id" serial4 NOT NULL,
"expected_time" timestamp(0),
"createdAt" timestamp(0) NOT NULL,
"destinationId" int4 NOT NULL,
"paymentId" int4 NOT NULL,
"serviceId" int4 NOT NULL,
"agencyId" int4 NOT NULL,
"count" int4 NOT NULL,
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "Contact" (
"number" varchar(16) NOT NULL,
"carrier" varchar(32),
"sellerId" int4,
"buyerId" int4,
"agencyId" int4,
UNIQUE ("buyerId", "number")
)
WITHOUT OIDS;
CREATE TABLE "Payment" (
"id" serial4 NOT NULL,
"type" varchar(255) NOT NULL,
"number" varchar(64) NOT NULL,
"buyerId" int4,
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "Destination" (
"id" serial4 NOT NULL,
"name" int4 NOT NULL,
"location_city" varchar(255) NOT NULL,
"location_county" varchar(255) NOT NULL,
"location_district" varchar(255) NOT NULL,
"lastUsed" timestamp(0) NOT NULL,
"primary" bool,
"buyerId" int4,
PRIMARY KEY ("id") 
)
WITHOUT OIDS;

ALTER TABLE "Seller" ADD CONSTRAINT "OwnersSeller" FOREIGN KEY ("ownerId") REFERENCES "Owner" ("id");
ALTER TABLE "Service" ADD CONSTRAINT "SellersServices" FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id");
ALTER TABLE "Contact" ADD CONSTRAINT "SellersContracts" FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id");
ALTER TABLE "Contact" ADD CONSTRAINT "BuyersContracts" FOREIGN KEY ("buyerId") REFERENCES "Buyer" ("id");
ALTER TABLE "Payment" ADD CONSTRAINT "BuyersPayment" FOREIGN KEY ("buyerId") REFERENCES "Buyer" ("id");
ALTER TABLE "Destination" ADD CONSTRAINT "BuyersDestination" FOREIGN KEY ("buyerId") REFERENCES "Buyer" ("id");
ALTER TABLE "Contact" ADD CONSTRAINT "AgencysContracts" FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id");
ALTER TABLE "Order" ADD CONSTRAINT "OrdersPayment" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id");
ALTER TABLE "Order" ADD CONSTRAINT "OrdersDestination" FOREIGN KEY ("destinationId") REFERENCES "Destination" ("id");
ALTER TABLE "Order" ADD CONSTRAINT "OrdersService" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id");
ALTER TABLE "Order" ADD CONSTRAINT "OrdersAgency" FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id");

