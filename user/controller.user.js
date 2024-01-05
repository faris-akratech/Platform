import { fetchAllUsers } from "./middlewares/user.db.js";

export const getAllUsers = async (req, res) => {
  const currentUserId = req.user.id;
  try {
    const data = await fetchAllUsers(currentUserId)
    if(data) res.status(200).json({ message: 'Retrieved all users excpet currently logged one succesfully', data})
  } catch (err) {
    console.error("Error while retrieving all users", err);
    return res.status(500).json({ error: "Error while retrieving all users" });
  }
};
