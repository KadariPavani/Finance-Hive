const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  const saltRounds = 12; // Use a fixed number of rounds to generate the salt
  const salt = await bcrypt.genSalt(saltRounds); // Generate the salt once
  return await bcrypt.hash(password, salt); // Hash the password with the salt
};

module.exports = { hashPassword };
