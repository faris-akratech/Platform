import {
  checkOrganizationNameExist,
  createOrganization,
  getOrganization,
  getOrganizations,
} from "./middlewares/organization.db.js";

const createOrgSlug = (orgName, userId) => {
  const baseSlug = orgName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-");
  const uniqueSlug = `${baseSlug}-${userId}`;
  return uniqueSlug;
};

export const newOrganization = async (req, res) => {
  try {
    const { name, description, logo, website } = req.body;
    const userId = req.user.id;
    if (!name) {
      return res
        .status(404)
        .json({ message: "Organization details are empty" });
    }
    const organizationExist = await checkOrganizationNameExist(name, userId);
    if (organizationExist) {
      return res.status(409).json({ message: "Organization already exists" });
    }
    const orgSlug = createOrgSlug(name, userId);
    const orgDetails = {
      name,
      description,
      logo,
      website,
      orgSlug,
    };
    await createOrganization(orgDetails, userId);
    // Organization becomes the university. So API call to be made to indy to register this university.

    res.status(200).json({ message: "Organization created succesfully" });
  } catch (err) {
    console.error("Error while creating new organization", err);
    return res
      .status(500)
      .json({ error: "Error while creating new organization" });
  }
};

export const getAllOrganizations = async (req, res) => {
  try {
    let { search, pageNumber, pageSize } = req.query;
    if (!pageNumber || !pageSize) {
      pageNumber = 1;
      pageSize = 10;
    }
    search = search || "";
    const userId = req.user.id;
    const query = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
      createdBy: userId,
    };

    const filterOptions = {
      userId,
    };
    const data = await getOrganizations(
      query,
      filterOptions,
      parseInt(pageNumber),
      parseInt(pageSize)
    );
    return res
      .status(200)
      .json({ message: "Retrieved all organizations", data });
  } catch (error) {
    console.error("Error while retrieving organization details");
    return res
      .status(500)
      .json({ error: "Error while retrieving organization details" });
  }
};

export const specificOrganization = async (req, res) => {
  try {
    const orgId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const data = await getOrganization(orgId, userId);
    if (!data) {
      return res
        .status(404)
        .json({ message: "No organization found with the specified ID" });
    }

    return res
      .status(200)
      .json({ message: "Retrieved specific organization", data });
  } catch (err) {
    console.error("Error while retrieving specific organization details");
    return res
      .status(500)
      .json({ error: "Error while retrieving specific organization details" });
  }
};

export const editOrganization = async (req, res) => {
  try {
    const userId = req.user.id;
    const orgId = req.params.id;

    res.status(200).json({ message: "Organization updated succesfully" });
  } catch (err) {
    console.error("Error while retrieving specific organization details", err);
    return res
      .status(500)
      .json({ error: "Error while retrieving specific organization details" });
  }
};
