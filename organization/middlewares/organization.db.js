import { prisma } from "../../services/prisma.js";

export const checkOrganizationNameExist = (name, userId) => {
  try {
    return prisma.organisation.findFirst({
      where: {
        name,
        createdBy: userId,
      },
    });
  } catch (error) {
    console.error("Error while checking for organization");
  }
};

export const createOrganization = (createOrgDto, createdBy) => {
  try {
    return prisma.organisation.create({
      data: {
        name: createOrgDto.name,
        logoUrl: createOrgDto.logo,
        description: createOrgDto.description,
        website: createOrgDto.website,
        orgSlug: createOrgDto.orgSlug,
        publicProfile: true,
        createdBy: createdBy,
      },
    });
  } catch (error) {
    console.error("Error while creating new organization");
  }
};

export const getOrganizations = async (
  queryObject,
  filterOptions,
  pageNumber,
  pageSize
) => {
  try {
    const result = await prisma.$transaction([
      prisma.organisation.findMany({
        where: {
          ...queryObject,
        },
        include: {
          userOrgRoles: {
            include: {
              orgRole: true,
            },
            where: {
              ...filterOptions,
            },
          },
        },
        take: pageSize,
        skip: (pageNumber - 1) * pageSize,
        orderBy: {
          createDateTime: "desc",
        },
      }),
      prisma.organisation.count({
        where: {
          ...queryObject,
        },
      }),
    ]);

    const organizations = result[0];
    const totalCount = result[1];
    const totalPages = Math.ceil(totalCount / pageSize);
    return { totalPages, organizations };
  } catch (error) {
    console.error("Error while retrieving all organizations", error);
  }
};

export const getOrganization = (orgId, userId) => {
  try {
    return prisma.organisation.findFirst({
      where: {
        id: orgId,
        createdBy: userId,
      },
      include: {
        org_agents: {
          include: {
            agents_type: true,
            agent_invitations: true,
            org_agent_type: true,
            ledgers: true,
          },
        },
        userOrgRoles: {
          include: {
            user: true,
            orgRole: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(
      "Error while retrieving the details of a specific organization"
    );
  }
};
