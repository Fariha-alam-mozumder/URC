-- =========================================
-- 1) Core Users
-- =========================================
INSERT INTO public."user" (user_id, name, email, password, role, "isVerified", "isMainAdmin", "verifyToken", created_at, profile_image) VALUES
(1,'Umme Maimuna Tishma','fahmida.csecu@gmail.com','$2b$10$9YTDap34YNQJY1rB4TUmpu6yqk4E5St4Vr1sV4eVDcHc1OnhznE4u','GENERALUSER',TRUE,FALSE,NULL,'2025-09-12 15:07:33.946',NULL),
(2,'Dr. Humayratul Ekra','ekrahumayratul@gmail.com','$2b$10$xzgs1.Vvrd15CVbfYs8zR.jsNQ.dn6Q29hacRYpiIcwaryICAeora','TEACHER',TRUE,FALSE,NULL,'2025-09-12 15:54:42.719','images/4dfe974e-e8bb-45de-bee0-083bdb1f8ecc.png'),
(3,'Dr. Fahmida Rahman','fahmidarahman027@gmail.com','$2b$10$9H0lC3KMmJVoLx7z0biK2ubugW6Vc.XEsvXd6uyMf3oiWUybPMpaO','TEACHER',TRUE,FALSE,NULL,'2025-09-12 16:38:03.631',NULL),
(4,'Toasean Elmah Tasean','tushu.016@gmail.com','$2b$10$bW3njuBZzvgDXOaFY9BzrOhV.5ihuOQqdiDBmX.kcZ7wpcAWfEYey','STUDENT',TRUE,FALSE,NULL,'2025-09-12 16:40:43.135',NULL),
(5,'Fariha Alam Mazumder','toaseanelmah@gmail.com','$2b$10$eGvBicy3f1wgjXdsuK0vm.h9knvnS..bB.imQz2Tqq1.YAWumcmVS','STUDENT',TRUE,FALSE,NULL,'2025-09-12 16:44:07.207',NULL),
(6,'Mohammad Rokan Uddin Faruqi','urcms.cu@gmail.com','$2b$10$VWs26xz8xfLErPm.LqSbjeAJV.II8PNzVX43K7NFuok8dZD.mEv8K','TEACHER',TRUE,FALSE,NULL,'2025-09-12 16:47:42.77',NULL),
(7,'Umme Fahmida','tushu.rs7@gmail.com','$2b$10$tTHAfPaXro/76v0KUtyXe.I51P0COXjsMhczr6vSQLHWrQ5qfjEi.','STUDENT',TRUE,FALSE,NULL,'2025-09-12 16:49:35.065',NULL),
(8,'Dipannita Das','fatimashome258@gmail.com','$2b$10$sPHnZJ7Z7rgFPphOgAzP2.m5ltYA8dtV49EtOf9eMyHqyRnznJ71G','TEACHER',TRUE,FALSE,NULL,'2025-09-12 16:56:48.907',NULL),
(9,'Dr. Elmah','toaseanafnan0208@gmail.com','$2b$10$t8oqkTPhg3TGNXDI3UqTJe1nzSW/sCCUQbmhFWm2uciRF/bueNvIC','TEACHER',TRUE,FALSE,NULL,'2025-09-12 17:00:48.458',NULL),
(10,'Mst. Erina Akter','fatima.tushu@gmail.com','$2b$10$HwhGa46K2rjOozPFosQYDeioz5kkghSdWhA8LgtrA8DLhmEwef7y','STUDENT',TRUE,FALSE,NULL,'2025-09-12 17:07:09.828',NULL),
(11,'Main Admin','admin@example.com','$2b$10$WNB0/49wxFvdf2tU7PSJMezjNk4PJgPXAlj8fYnlOjGvz0/MsLZdq','ADMIN',TRUE,TRUE,NULL,'2025-09-12 17:12:56.277','images/75eb4e61-4412-490d-9f84-cb89b06eea6d.png');

-- Update user_id sequence
SELECT pg_catalog.setval('public.user_user_id_seq', 11, TRUE);

-- =========================================
-- 2) Departments
-- =========================================
INSERT INTO public.department (department_id, department_name) VALUES
(1,'CSE'),
(2,'EEE');
SELECT pg_catalog.setval('public.department_department_id_seq', 2, TRUE);

-- =========================================
-- 3) Domains
-- =========================================
INSERT INTO public.domain (domain_id, domain_name) VALUES
(1,'Artificial Intelligence'),
(2,'Machine Learning'),
(3,'Computer Vision'),
(4,'Data Science'),
(5,'Robotics'),
(6,'Embedded Systems'),
(7,'Power Electronics'),
(8,'Control Systems'),
(9,'Renewable Energy Systems'),
(10,'Signal Processing'),
(11,'Microelectronics'),
(12,'VLSI Design'),
(13,'Software Engineering'),
(14,'Cybersecurity'),
(15,'Computer Networks'),
(16,'Databases and Information Systems'),
(17,'Human-Computer Interaction'),
(18,'Operating Systems'),
(19,'Distributed Systems');
SELECT pg_catalog.setval('public.domain_domain_id_seq', 19, TRUE);

-- =========================================
-- 4) User ↔ Domain interests (skip sequence)
-- =========================================
INSERT INTO public.userdomain (user_id, domain_id) VALUES
(2,1),(2,4),(2,17),(2,2),(2,13),
(3,1),(3,3),(3,5),(3,6),(3,7),
(4,1),(4,2),(4,4),(4,13),
(5,1),(5,2),(5,4),(5,13),
(6,1),(6,2),(6,4),(6,13),
(7,1),(7,3),(7,5),(7,6),(7,7),
(8,1),(8,3),(8,5),(8,6),(8,7),
(9,1),(9,2),(9,4),(9,13),
(10,1),(10,3),(10,5),(10,6),(10,7);

-- =========================================
-- 5) Department ↔ Domain mapping
-- =========================================
INSERT INTO public.departmentdomain (department_id, domain_id) VALUES
(1,1),(1,2),(1,4),(1,13),(1,14),(1,15),(1,16),(1,17),(1,18),(1,19),
(2,1),(2,3),(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11);

-- =========================================
-- 6) Students
-- =========================================
INSERT INTO public.student (student_id, roll_number, department_id, user_id) VALUES
(1,'20701051',1,4),
(2,'21701039',1,5),
(3,'20702027',2,7),
(4,'21702016',2,10);
SELECT pg_catalog.setval('public.student_student_id_seq', 4, TRUE);

-- =========================================
-- 7) Teachers
-- =========================================
INSERT INTO public.teacher (teacher_id, designation, department_id, user_id, "isReviewer") VALUES
(1,'Professor',1,2,FALSE),
(2,'Associate Professor',2,3,FALSE),
(3,'Professor',1,6,TRUE),
(4,'Professor',2,8,TRUE),
(5,'Lecturer',1,9,FALSE);
SELECT pg_catalog.setval('public.teacher_teacher_id_seq', 5, TRUE);

-- =========================================
-- 8) Admins
-- =========================================
INSERT INTO public.admin (admin_id, user_id) VALUES
(1,11);
SELECT pg_catalog.setval('public.admin_admin_id_seq', 1, TRUE);

-- =========================================
-- 9) General Users
-- =========================================
INSERT INTO public.generaluser (generaluser_id, user_id) VALUES
(1,1);
SELECT pg_catalog.setval('public.generaluser_generaluser_id_seq', 1, TRUE);

-- =========================================
-- 10) Teams
-- =========================================
INSERT INTO public.team (team_id, team_name, team_description, domain_id, status, visibility, max_members, "isHiring", created_at, created_by_user_id) VALUES
(1,'DeepVision Innovators','A collaborative research team focusing on advanced computer vision, deep learning, and AI-driven solutions for real-world applications.',1,'ACTIVE','PUBLIC',3,TRUE,'2025-09-12 19:17:36.1',2);
SELECT pg_catalog.setval('public.team_team_id_seq', 2, TRUE);

-- =========================================
-- 11) Team Members (skip sequence)
-- =========================================
INSERT INTO public.teammember (team_id, user_id, role_in_team) VALUES
(1,2,'LEAD'),
(1,4,'ASSISTANT');

-- =========================================
-- 12) Proposals
-- =========================================
INSERT INTO public.proposal (proposal_id, title, abstract, team_id, submitted_by, pdf_path, file_size, created_at, status) VALUES
(1,'Smart Traffic Monitoring Using Deep Learning','This research proposal aims to develop an intelligent traffic monitoring system using deep learning techniques to detect and analyze vehicles, pedestrians, and traffic patterns in real-time. The system will leverage convolutional neural networks (CNNs) and object detection algorithms to enhance traffic management and safety.',NULL,1,'documents/b9a5dd82-4387-4b7b-a614-6a7b2ed332c1.pdf',1850417,'2025-09-12 19:26:24.433','PENDING'),
(2,'Smart Traffic Monitoring Using Deep Learning','This research proposal aims to develop an intelligent traffic monitoring system using deep learning techniques to detect and analyze vehicles, pedestrians, and traffic patterns in real-time. The system will leverage convolutional neural networks (CNNs) and object detection algorithms to enhance traffic management and safety.',1,1,'documents/ab27f488-e43b-4b34-a932-c7c3a426c697.pdf',94464,'2025-09-12 19:30:32.03','PENDING');
SELECT pg_catalog.setval('public.proposal_proposal_id_seq', 2, TRUE);

-- =========================================
-- 13) Reviewers
-- =========================================
INSERT INTO public.reviewer (reviewer_id, teacher_id, status) VALUES
(3,3,'PENDING'),
(4,4,'ACTIVE');
