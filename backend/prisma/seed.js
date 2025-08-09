import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  /*if (existingAdmin) {
    console.log(JSON.stringify({
      success: false,
      message: "Admin user already exists. Skipping seed.",
      userId: existingAdmin.user_id,
      email: existingAdmin.email
    }, null, 2));
    return;
  }

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

  console.log(JSON.stringify({
    success: true,
    message: "Admin user created successfully.",
    user: {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isMainAdmin: user.isMainAdmin,
      adminId: user.admin[0]?.admin_id || null
    }
  }, null, 2));
}

main()
  .catch((e) => {
    console.error(JSON.stringify({
      success: false,
      message: "Seeding failed due to an error.",
      error: e.message,
    }, null, 2));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  */


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
    "CSE", "EEE", "Pharmacy", "Law", "Economics",
    "English", "Mathematics", "Physics", "Chemistry", "Statistics", "Sociology",
    "Political Science", "Psychology", "Journalism & Media Studies", "Anthropology",
    "Finance", "Marketing", "Accounting", "Environmental Science", "Geography",
    "Public Administration", "Islamic Studies", "History", "International Relations",
  ];

  const data = departments.map((name) => ({ department_name: name }));

  const result = await prisma.department.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`Inserted ${result.count} departments.`);
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });