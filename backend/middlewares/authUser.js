import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    console.log(`Token received: ${token}`);
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Decoded token: ${JSON.stringify(token_decode)}`);

    req.userId = token_decode.id;
    req.user = token_decode;

    console.log(`User ID from token: ${req.userId}`);

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
