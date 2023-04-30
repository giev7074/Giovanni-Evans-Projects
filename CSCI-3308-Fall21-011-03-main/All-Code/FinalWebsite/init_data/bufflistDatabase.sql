CREATE TABLE IF NOT EXISTS Listings (
ListingID int NOT NULL PRIMARY KEY,
LType varchar(255),
ListedBy int,
LPostedTime timestamp,
LTitle varchar(255),
LDesc text,
LPrice numeric(10, 2),
LLat numeric(13, 10),
LLon numeric(13, 10),
LStatus boolean
);

CREATE TABLE IF NOT EXISTS Pics (
PicId int NOT NULL PRIMARY KEY,
ListingID int,
link varchar(255),
altText varchar(255)
);

CREATE TABLE IF NOT EXISTS Users (
UserID int NOT NULL PRIMARY KEY,
firstName varchar(255),
middleInitial varchar(255),
lastName varChar(255),
phoneNumber varChar(255),
email varchar(255),
screenname varchar(255),
pword varchar(255),
joinDate timestamp,
blacklisted_user_ids varchar(255), --comma separated list
hide_name_location boolean,
show_listings boolean
);

TRUNCATE TABLE listings;
TRUNCATE TABLE users;
TRUNCATE TABLE pics;

INSERT INTO Listings(ListingID, LType, ListedBy, LPostedTime, LTitle, LDesc, LPrice, LLat, LLon, LStatus)
VALUES
(1, 'Selling', 1, '20210901 10:30:05 AM', 'Physics Textbooks', 'I''m graduating and selling all of the textbooks a physics major would need for a standard 4 year track as a bundle.', 100, 40.005833, -105.257718, FALSE),
(2, 'Service', 2, '20211001 08:38:05 AM', 'Plumbing', 'I know getting a plumber to come in and fix a sink can be very expensive, so I am offering a cheap price to help anyone with their plumbing needs.', 80, 50.005833, -105.257718, FALSE),
(3, 'Selling', 3, '20211007 02:30:05 PM', 'Desk', 'I have a desk leftover from last year that I no longer need. It is in great shape and a fraction of the cost of your average desk.', 50, 30.005833, -115.257718, FALSE),
(4, 'Service', 4, '20211013 08:50:05 PM', 'Odd Job', 'I am very handy in most odd jobs. Whether it be car problems, a broken cabinet, or anything else, I can offer you a cheap price to fix whatever is bothering you.', 60, 45.005833, -108.257718, FALSE),
(5, 'Trading', 5, '20211018 11:10:05 AM', 'Calculus Textbooks', 'I recently changed majors from math to computer sceince, so I am looking to trade my calculus textbooks for any computer science textbooks.', 0, 42.005833, -107.257718, FALSE),
(6, 'Selling', 1, '20211023 02:50:05 PM', 'Toaster', 'I am moving out of my apartment soon and looking to get rid of virtually anything. I have a toaster that has been used a good amount, but that is still in very good shape for sale', 15, 40.005833, -105.257718, FALSE),
(7, 'Selling', 2, '20211028 12:20:05 AM', 'Car Mechanic', 'I have years of experience in the car mechanic industry and I can offer CU students a discount on the usually pricey car checkups.', 70, 50.005833, -105.257718, FALSE),
(8, 'Selling', 3, '20211003 04:50:05 PM', 'Bike', 'I am no longer in need of my bike, so I am looking to sell it for virtually nothing. It has been through a lot of wear and tear but still very usable', 15, 30.005833, -115.257718, FALSE),
(9, 'Service', 4, '20211024 09:10:05 AM', 'Interior Designer', 'I am looking to kick start my interior design career, so I am offering CU students the chance to get their new apartments fully decorated for cheap.', 80, 45.005833, -108.257718, FALSE),
(10, 'Selling', 5, '20211019 11:24:05 AM', 'Full Kitchen Utensil Set', 'I am moving out of my apartment and looking to sell my full set of kitchen utensils for a fraction of the original price.', 20, 42.005833, -107.257718, FALSE);

INSERT INTO Users(UserId, firstName, middleInitial, lastName, phoneNumber, screenName, email, pword, joinDate, blacklisted_user_ids, hide_name_location, show_listings)
VALUES
(1, 'John', 'a', 'Doe', '(888)888-8888', 'JohnDoe', 'john@doe.com', 'john123', '20210901 10:30:05 AM', '2', false, true),
(2, 'Sophie', 's', 'Smith', '(444)444-4444', 'Soph101', 'sophie@smith.com', 'Sophie357!', '20210908 11:30:05 AM', '1,3', true, true),
(3, 'Nick', 'c', 'Brown', '(123)456-7890', 'NickB123', 'nick@brown.com', 'nickb123', '211007 02:30:24 PM', '', false, false),
(4, 'Lisa', 'k', 'Sanders', '(313)313-3131', 'Skobuffs', 'lisa@sanders.com', 'Lis@1999', '20211013 08:50:38 PM', '1,2,3', true, false),
(5, 'Bob', 'j', 'Ross', '(999)246-1357', 'iLikeArt123', 'bob@ross.com', 'b0br0ss123', '20211018 11:10:55 AM', '1', false, false);

INSERT INTO Pics(PicID, ListingID, link, altText)
VALUES
    (1, 1, 'https://images-na.ssl-images-amazon.com/images/I/512yEu6OOPL._SX346_BO1,204,203,200_.jpg', 'physics textbook'),
    (2, 2, 'https://trusteyman.com/wp-content/uploads/2019/02/how-does-plumbing-work-e1548696261445.jpeg', 'plumbing'),
    (3, 3, 'https://i5.walmartimages.com/asr/3642a808-c507-44b3-8dac-be0457884606_1.321ec95aa2f61e4bcd07f36a7f66bf96.jpeg', 'desk'),
    (4, 4, 'http://www.jwslawncare.com/wp-content/uploads/2015/11/tools1-1.png', 'odd jobs'),
    (5, 5, 'https://images-na.ssl-images-amazon.com/images/I/51OxyAJdgJL._SX387_BO1,204,203,200_.jpg', 'calculus textbook');

--For Dev Purposes:
INSERT INTO Users(UserId, screenName, email, pword, joinDate)
VALUES
    (-1, 'RalphieDev', 'trevor.liss@colorado.edu', 'bufflistPass', '20211101 11:03:55 AM');
