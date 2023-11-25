export const getAllEcosystem = async (req, res) => {
  try {
    res.status(200).json({ message: "Retrieved ecosystem details" });
  } catch (err) {
    console.error("Error while retrieving ecosystem details", err);
    return res
      .status(500)
      .json({ error: "Error while retrieving ecosystem details" });
  }
};
