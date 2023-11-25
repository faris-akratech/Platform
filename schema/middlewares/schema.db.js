import { prisma } from "../../services/prisma.js";

export const schemaExists = async (schemaName, schemaVersion) => {
  try {
    const existingSchemas = await prisma.schema.findMany({
      where: {
        name: {
          contains: schemaName,
          mode: "insensitive",
        },
        version: {
          contains: schemaVersion,
          mode: "insensitive",
        },
      },
    });

    return existingSchemas;
  } catch (error) {
    console.error(`Error in schemaExists: ${error}`);
    throw error;
  }
};

export const newSchema = async (
  schemaName,
  schemaVersion,
  attributes,
  orgId
) => {
  try {
    const createdSchema = await prisma.schema.create({
      data: {
        name: schemaName,
        version: schemaVersion,
        attributes: JSON.stringify(attributes),
        orgId,
      },
    });
    return createdSchema;
  } catch (error) {
    console.error("Error while creating schema in the database", error);
    throw error;
  }
};

export const allSchemas = async (orgId, payload) => {
  const sortingField = payload.sorting || "createDateTime";
  const orderByDirection = payload.sortByValue === "DESC" ? "desc" : "asc";
  const searchByText = payload.searchByText ?? "";

  const schemasResult = await prisma.schema.findMany({
    where: {
      orgId: orgId,
      OR: [
        { name: { contains: searchByText, mode: "insensitive" } },
        { version: { contains: searchByText, mode: "insensitive" } },
      ],
    },
    select: {
      createDateTime: true,
      name: true,
      version: true,
      attributes: true,
      createdBy: true,
      orgId: true,
    },
    orderBy: {
      [sortingField]: orderByDirection,
    },
    take: isNaN(payload.pageSize) ? 10 : Number(payload.pageSize),
    skip: isNaN(payload.pageNumber)
      ? 0
      : (payload.pageNumber - 1) * Number(payload.pageSize),
  });

  const schemasCount = await prisma.schema.count({
    where: {
      orgId: orgId,
    },
  });

  return { schemasCount, schemasResult };
};

export const getSpecificSchema = async (schemaName, orgId) => {
  try {
    const specificSchema = await prisma.schema.findFirst({
      where: {
        name: {
          equals: schemaName,
          mode: "insensitive",
        },
        orgId: {
          equals: orgId,
        },
      },
      select: {
        createDateTime: true,
        name: true,
        version: true,
        attributes: true,
        createdBy: true,
        orgId: true,
      },
    });

    return specificSchema;
  } catch (error) {
    console.error(`Error while retrieving specific schema: ${error}`);
    throw error;
  }
};

export const doesOrganizationExist = async (orgId) => {
  const organizationExists = await prisma.organisation.findUnique({
    where: { id: orgId },
  });
  return organizationExists;
};
