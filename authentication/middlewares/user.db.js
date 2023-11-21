import { prisma } from "../../services/prisma.js";

export const checkUserExist = (email) => {
  try {
    return prisma.user.findFirst({
      where: {
        email,
      },
    });
  } catch (error) {
    console.error(`checkUserExist: ${JSON.stringify(error)}`);
  }
};

export const createUsername = (email, verifyCode) => {
  try {
    const emailTrim = email.split("@")[0];
    const cleanedUsername = emailTrim
      .toLowerCase()
      .replace(/[^a-zA-Z0-9_]/g, "-");
    const uuid = verifyCode.split("-")[0];
    const uniqueUsername = `${cleanedUsername}-${uuid}`;
    return uniqueUsername;
  } catch (error) {
    console.error(`Error in createUsername`);
    return false;
  }
};

export const createUser = async (email, verifyCode, username) => {
  try {
    const saveResponse = await prisma.user.create({
      data: {
        username: username,
        email: email,
        verificationCode: verifyCode.toString(),
        publicProfile: true,
      },
    });

    return saveResponse;
  } catch (error) {
    console.error(`Error while creating user`);
    return false;
  }
};

export const verifyUser = async (email) => {
  try {
    const updateUserDetails = await prisma.user.update({
      where: {
        email,
      },
      data: {
        isEmailVerified: true,
      },
    });
    return updateUserDetails;
  } catch (error) {
    console.error(`Error in update isEmailVerified: ${error.message} `);
    return false;
  }
};

export const updateUserInfo = async (email, userInfo) => {
  try {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        password: userInfo.password,
      },
    });
    return true;
  } catch (err) {
    console.error(`Error while updating user`, err);
    return false;
  }
};
