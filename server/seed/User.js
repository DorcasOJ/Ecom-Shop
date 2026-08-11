const User = require("../models/User");

const users = [
  {
    _id: "6858d789c110c1d4c315c44d",
    name: "dcas",
    email: "dcas@test1.com",
    password: "$2b$10$GHt2NFCcHfDy22iKeTQNcO/KJhpSkxLIcxuWgY2tu4vOohuDKMxaC",
    isVerified: true,
    isAdmin: false,
    __v: 0,
  },
  {
    _id: "68488683e46ff6594463757e",
    name: "D cas",
    email: "dcas@email.com",
    password: "$2b$10$f1hppGXbsdURNW/R3wLpLOqZiN2N8VPa0P6.bqDqk.ALKt1PmNstq",
    isVerified: true,
    __v: 0,
    isAdmin: true,
  },
  {
    _id: "6856b7a963ebe352c633a0cc",
    name: "dcas",
    email: "dcas@test.com",
    password: "$2b$10$YKQ8uNi9.6KKFD0uk1Jtoeds.eNf0cNTCHpjna6Hqk9qf8PSiuzGy",
    isVerified: true,
    isAdmin: true,
    __v: 0,
  },
];

exports.seedUser = async () => {
  try {
    await User.deleteMany();
    await User.insertMany(users);
    console.log("User seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
