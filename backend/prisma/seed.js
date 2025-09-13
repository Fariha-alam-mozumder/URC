// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   console.log("Start seeding userdomain...");

//   // Map of domain names to their IDs in the database
//   const domains = await prisma.domain.findMany();
//   const domainMap = {};
//   for (const d of domains) domainMap[d.domain_name] = d.domain_id;

//   // User domains based on department
//   const userDomains = [
//     // user_id 2: CSE
//     { user_id: 2, domain_ids: [
//       domainMap["Artificial Intelligence"],
//       domainMap["Machine Learning"],
//       domainMap["Data Science"],
//       domainMap["Software Engineering"],
//     ]},

//     // user_id 3: EEE
//     { user_id: 3, domain_ids: [
//       domainMap["Artificial Intelligence"],
//       domainMap["Computer Vision"],
//       domainMap["Robotics"],
//       domainMap["Embedded Systems"],
//       domainMap["Power Electronics"],
//     ]},

//     // user_id 4: CSE
//     { user_id: 4, domain_ids: [
//       domainMap["Artificial Intelligence"],
//       domainMap["Machine Learning"],
//       domainMap["Data Science"],
//       domainMap["Software Engineering"],
//     ]},

//     // user_id 5: CSE
//     { user_id: 5, domain_ids: [
//       domainMap["Artificial Intelligence"],
//       domainMap["Machine Learning"],
//       domainMap["Data Science"],
//       domainMap["Software Engineering"],
//     ]},

//     // user_id 6: CSE
//     { user_id: 6, domain_ids: [
//       domainMap["Artificial Intelligence"],
//       domainMap["Machine Learning"],
//       domainMap["Data Science"],
//       domainMap["Software Engineering"],
//     ]},

//     // user_id 7: EEE
//     { user_id: 7, domain_ids: [
//       domainMap["Artificial Intelligence"],
//       domainMap["Computer Vision"],
//       domainMap["Robotics"],
//       domainMap["Embedded Systems"],
//       domainMap["Power Electronics"],
//     ]},

//     // user_id 8: EEE
//     { user_id: 8, domain_ids: [
//       domainMap["Artificial Intelligence"],
//       domainMap["Computer Vision"],
//       domainMap["Robotics"],
//       domainMap["Embedded Systems"],
//       domainMap["Power Electronics"],
//     ]},

//     // user_id 9: CSE
//     { user_id: 9, domain_ids: [
//       domainMap["Artificial Intelligence"],
//       domainMap["Machine Learning"],
//       domainMap["Data Science"],
//       domainMap["Software Engineering"],
//     ]},

//     // user_id 10: EEE
//     { user_id: 10, domain_ids: [
//       domainMap["Artificial Intelligence"],
//       domainMap["Computer Vision"],
//       domainMap["Robotics"],
//       domainMap["Embedded Systems"],
//       domainMap["Power Electronics"],
//     ]},
//   ];

//   // Insert userdomain rows
//   for (const ud of userDomains) {
//     for (const domain_id of ud.domain_ids) {
//       await prisma.userdomain.upsert({
//         where: {
//           user_id_domain_id: {
//             user_id: ud.user_id,
//             domain_id,
//           },
//         },
//         update: {},
//         create: {
//           user_id: ud.user_id,
//           domain_id,
//         },
//       });
//       console.log(`Inserted domain ${domain_id} for user ${ud.user_id}`);
//     }
//   }

//   console.log("Userdomain seeding completed.");
// }

// main()
//   .catch((e) => {
//     console.error("Seeding failed:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
