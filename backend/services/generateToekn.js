import jwt from "jsonwebtoken";
export const generateToken = (id) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1h" });
};
