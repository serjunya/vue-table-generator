
create TABLE entity(
    _id SERIAL PRIMARY KEY,
    "_createUser" TEXT,
    "_updateUser" TEXT,
    "_createDt" DATE,
    "_updateDt" DATE,
    "Login" TEXT,
    "Name" TEXT,
    "Password" TEXT,
    "Lang" TEXT,
    "LoginsCount" INT
);