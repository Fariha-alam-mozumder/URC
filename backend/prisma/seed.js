import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const user = await prisma.user.create({
      data: {
        name: "Main Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true,
        isMainAdmin: true,
        admin: {
          create: {},
        },
      },
      include: {
        admin: true,
      },
    });

    console.log(`Admin user created: ${user.email}`);
  } else {
    console.log(`Admin user already exists: ${existingAdmin.email}`);
  }

  // Seed Departments (NEW CODE)
  const departments = [
    "CSE", "EEE",
  ];

  const data = departments.map((name) => ({ department_name: name }));

  const result = await prisma.department.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`Inserted ${result.count} departments.`);

   // Create domains (example domains including common domain)
  const domainsData = [
    { domain_name: "Artificial Intelligence" },    // common domain
    { domain_name: "Machine Learning" },
    { domain_name: "Computer Vision" },
    { domain_name: "Data Science" },
    { domain_name: "Robotics" },
    { domain_name: "Embedded Systems" },          // EEE only
    { domain_name: "Power Electronics" },         // EEE only
    { domain_name: "Software Engineering" },      // CSE only
  ];

  // Upsert domains to avoid duplicates
  const domains = [];
  for (const domainData of domainsData) {
    const domain = await prisma.domain.upsert({
      where: { domain_name: domainData.domain_name },
      update: {},
      create: domainData,
    });
    domains.push(domain);
  }

  // Map domain names to IDs for convenience
  const domainMap = {};
  for (const d of domains) domainMap[d.domain_name] = d.domain_id;

  // Create departmentdomain links
  // CSE (id=1) has these domains:
  // Artificial Intelligence (common), Machine Learning, Data Science, Software Engineering
  // EEE (id=2) has these domains:
  // Artificial Intelligence (common), Computer Vision, Robotics, Embedded Systems, Power Electronics

  const departmentDomainData = [
    // CSE dept_id=1
    { department_id: 1, domain_id: domainMap["Artificial Intelligence"] },
    { department_id: 1, domain_id: domainMap["Machine Learning"] },
    { department_id: 1, domain_id: domainMap["Data Science"] },
    { department_id: 1, domain_id: domainMap["Software Engineering"] },

    // EEE dept_id=2
    { department_id: 2, domain_id: domainMap["Artificial Intelligence"] },
    { department_id: 2, domain_id: domainMap["Computer Vision"] },
    { department_id: 2, domain_id: domainMap["Robotics"] },
    { department_id: 2, domain_id: domainMap["Embedded Systems"] },
    { department_id: 2, domain_id: domainMap["Power Electronics"] },
  ];

  // Upsert departmentdomain to avoid duplicates
  for (const dd of departmentDomainData) {
    await prisma.departmentdomain.upsert({
      where: {
        department_id_domain_id: {
          department_id: dd.department_id,
          domain_id: dd.domain_id,
        },
      },
      update: {},
      create: dd,
    });
  }

  console.log(" Domains and DepartmentDomain seeded!");
  console.log('Start seeding userdomain...');

  // userdomain demo data based on your example, including zero domain for some users

  const userDomains = [
    // user_id 1: ADMIN - zero domains, skip

    // user_id 2: TEACHER - 4 domains
    { user_id: 2, domain_ids: [1, 2, 4, 8] },

    // user_id 3: STUDENT - 3 domains
    { user_id: 3, domain_ids: [1, 2, 4] },

    // user_id 4: GENERALUSER - zero domains, skip or assign 1 domain optionally
    // { user_id: 4, domain_ids: [] }, // no insert needed

    // user_id 5: TEACHER - 4 domains
    { user_id: 5, domain_ids: [1, 2, 4, 8] },

    // user_id 6: TEACHER - 5 domains
    { user_id: 6, domain_ids: [1, 3, 5, 6, 7] },

    // user_id 7: TEACHER - 4 domains
    { user_id: 7, domain_ids: [1, 2, 4, 8] },

    // user_id 8: STUDENT - 3 domains
    { user_id: 8, domain_ids: [3, 5, 6] },

    // user_id 9: STUDENT - 3 domains
    { user_id: 9, domain_ids: [2, 4, 8] },

    // user_id 10: STUDENT - 2 domains
    { user_id: 10, domain_ids: [6, 7] },
  ];

  // Insert userdomain rows
  for (const ud of userDomains) {
    for (const domain_id of ud.domain_ids) {
      await prisma.userdomain.create({
        data: {
          user_id: ud.user_id,
          domain_id: domain_id,
        },
      });
      console.log(`Inserted domain ${domain_id} for user ${ud.user_id}`);
    }
  }

  console.log('Userdomain seeding completed.');
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });