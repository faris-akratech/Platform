import { prisma } from "../../services/prisma.js";

export const fetchAllUsers = async (currentUserId) => {
  try {
    const allUsersExceptCurrent = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
        },
      },
    });
    return allUsersExceptCurrent;
  } catch (err) {
    console.error("Error while retrieving all users", err);
    throw new Error("Error while retrieving all users");
  }
};
