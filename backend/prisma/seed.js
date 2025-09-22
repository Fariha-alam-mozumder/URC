import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const adminPasswordPlain = 'admin123';
  const adminHashed = bcrypt.hashSync(adminPasswordPlain, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      isVerified: true,
      isMainAdmin: true,
    },
    create: {
      name: 'Main Admin',
      email: adminEmail,
      password: adminHashed,
      role: 'ADMIN',
      isVerified: true,
      isMainAdmin: true,
    },
  });

  const existingAdmin = await prisma.admin.findFirst({
    where: { user_id: adminUser.user_id },
  });
  if (!existingAdmin) {
    await prisma.admin.create({ data: { user_id: adminUser.user_id } });
  }

  await prisma.department.createMany({
    data: [{ department_name: 'CSE' }, { department_name: 'EEE' }],
    skipDuplicates: true,
  });

  const domains = [
    'Artificial Intelligence',
    'Machine Learning',
    'Computer Vision',
    'Data Science',
    'Robotics',
    'Embedded Systems',
    'Power Electronics',
    'Control Systems',
    'Renewable Energy Systems',
    'Signal Processing',
    'Microelectronics',
    'VLSI Design',
    'Software Engineering',
    'Cybersecurity',
    'Computer Networks',
    'Databases and Information Systems',
    'Human-Computer Interaction',
    'Operating Systems',
    'Distributed Systems',
  ];

  await prisma.domain.createMany({
    data: domains.map((domain_name) => ({ domain_name })),
    skipDuplicates: true,
  });

  const wanted = ['Software Engineering', 'Cybersecurity'];
  const found = await prisma.domain.findMany({
    where: { domain_name: { in: wanted } },
    select: { domain_id: true },
  });

  if (found.length) {
    await prisma.userdomain.createMany({
      data: found.map(({ domain_id }) => ({
        user_id: adminUser.user_id,
        domain_id,
      })),
      skipDuplicates: true,
    });
  }

  console.log(' Seed complete');
}

main()
  .catch((e) => {
    console.error(' Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
