import { genSalt, hash } from "bcryptjs";

export const hashPassword = async (password) => {
  const salt = await genSalt(8);
  const hashedPassword = await hash(password, salt);

  localStorage.setItem("pass", hashedPassword);
};