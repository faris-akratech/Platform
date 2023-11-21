import jwt from "jsonwebtoken";
import { prisma } from "../../services/prisma.js";
import CryptoJS from "crypto-js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.body["authorization"];
    const iv = req.body["value"];
    if (authHeader && iv) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
      const decryptedToken = decryptPassword(token, iv).replace(/"/g, "");
      jwt.verify(
        decryptedToken,
        process.env.JWT_SECRET,
        async (err, decoded) => {
          if (err) {
            return res
              .status(401)
              .json({ message: "Failed to verify token or token expired" });
          }
          req.user = await findUser(decoded.email);
          next();
        }
      );
    } else return res.status(404).json({ message: "Token not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error while decoding session" });
  }
};

const decryptPassword = (encrypted, IV) => {
  try {
    const passwordBytes = CryptoJS.AES.decrypt(
      encrypted,
      process.env.CRYPTO_PRIVATE_KEY,
      { iv: CryptoJS.enc.Hex.parse(IV) }
    );

    const decryptedPassword = passwordBytes.toString(CryptoJS.enc.Utf8);
    return decryptedPassword;
  } catch (error) {
    console.error("Error in decryptPassword:", error);
    return null;
  }
};

const findUser = (email) => {
  try {
    const user = prisma.user.findFirst({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.error("Error while finding user");
  }
};
