import { prisma } from "./prisma.js";
import jwt from "jsonwebtoken";

export const checkToken = async (token, iv) => {
  try {
    if (token && iv) {
      const decryptedToken = decryptPassword(token, iv);
      jwt.verify(
        decryptedToken,
        process.env.JWT_SECRET,
        async (err, decoded) => {
          if (err) {
            return false;
          }
          const user = await findUser(decoded.email);
          if (!user) return false;
        }
      );
      return true;
    } else return false;
  } catch (error) {
    console.error("Error in decryptPassword:", error);
    return false;
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
