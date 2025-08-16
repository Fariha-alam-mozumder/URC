-- Data Insert Script - PostgreSQL Database
-- Clean data inserts without schema creation or migrations

-- Insert Admin data
INSERT INTO admin (admin_id, user_id) VALUES
(1, 1);

-- Insert Department data
INSERT INTO department (department_id, department_name) VALUES
(1, 'CSE'),
(2, 'EEE');

-- Insert Domain data
INSERT INTO domain (domain_id, domain_name) VALUES
(1, 'Artificial Intelligence'),
(2, 'Machine Learning'),
(3, 'Computer Vision'),
(4, 'Data Science'),
(5, 'Robotics'),
(6, 'Embedded Systems'),
(7, 'Power Electronics'),
(8, 'Software Engineering'),
(9, 'Cybersecurity'),
(10, 'Internet of Things'),
(11, 'Signal Processing'),
(12, 'Natural Language Processing'),
(13, 'Cloud Computing'),
(14, 'Big Data Analytics'),
(15, 'Human-Computer Interaction'),
(16, 'Algorithms and Complexity'),
(17, 'Control Systems'),
(18, 'Renewable Energy Systems'),
(19, 'VLSI Design'),
(20, 'Electrical Machines'),
(21, 'High Voltage Engineering');

-- Insert Department-Domain relationships
INSERT INTO departmentdomain (department_id, domain_id) VALUES
(1, 1), (1, 2), (1, 4), (1, 8), (1, 3), (1, 9), (1, 10), (1, 12), (1, 13), (1, 14), (1, 15), (1, 16), (1, 5),
(2, 1), (2, 3), (2, 5), (2, 6), (2, 7), (2, 2), (2, 10), (2, 11), (2, 17), (2, 18), (2, 19), (2, 20), (2, 21);

-- Insert General User data
INSERT INTO generaluser (generaluser_id, user_id) VALUES
(1, 4);

-- Insert User data
INSERT INTO "user" (user_id, name, email, password, role, "isVerified", "isMainAdmin", "verifyToken", created_at) VALUES
(1, 'Main Admin', 'admin@example.com', '$2b$10$dqkI0SscRw7NWSD62.ABI.BAIgWK6qkWqQZfrNPyE1M3esb/KXOo6', 'ADMIN', true, true, NULL, '2025-08-09 20:09:08.127'),
(2, 'Dr. Fahmida Khanam', 'fahmida.csecu@gmail.com', '$2b$10$hPBNmWCyVTl5DGa2LBiOueddUWzx8LnLFNmy4Ja8BcLOUo/C8p0na', 'TEACHER', true, false, '7a151075c08bc5c95860828446d081d4c08542d6eb2f6481b90883577e877f31', '2025-08-09 20:11:12.867'),
(3, 'Toasean Elmah', 'toasean.csecu@gmail.com', '$2b$10$WvJyWoVRsMMpOyCohYpm6evRMMIO1LmPgEMtohA0gxVpKSfSg9bYa', 'STUDENT', true, false, 'ccbb94a0e53838f262a235977fab85b99c35609b093a1ced41e9661f57c7545b', '2025-08-09 20:17:03.368'),
(4, 'Fariha Rabbi', 'tushu.rs7@gmail.com', '$2b$10$/WbCV1nK37KWjvh1BUUxtulTFxbwY7DoXKhQae5mAyjS1sELNlJJO', 'GENERALUSER', true, false, '1bf39fb3fdb2419045c4e66aba1641ca05c12bb74dfc1f2c69b017de03eb36a2', '2025-08-09 20:26:45.135'),
(5, 'Dr. Toasean Elmah Tasean', 'tushu.016@gmail.com', '$2b$10$6yQfvcM7/GA/cQ9uyo5c7ulFwDuHVaSa/Gr8auZCvoqRF3gs6PpJ2', 'REVIEWER', true, false, 'bd73398b3c022be3ed6290b175be1571b7f5f7cd50ad1af3e799b5bbdb6aa8f8', '2025-08-09 20:34:12.421'),
(6, 'Dr. Humayratul Ekra', 'ekrahumayratul@gmail.com', '$2b$10$vhWK0sww/y1E2Q7aT7NSSOc/XGMAniODelBsNpgGRYN2At.diC0mS', 'REVIEWER', true, false, 'f0fbf43b60d5fc8e96c8313b9ce337194f3bfe37681b06cb06906029e037dd33', '2025-08-09 20:36:58.746'),
(7, 'Rokan Uddin', 'fahmidafahmi115@gmail.com', '$2b$10$1WOT7TCSEOUYdy2BDm1w5Oq7HnDMtsE25sp8qEoHxQ9CiBGCegCym', 'TEACHER', true, false, '4ed72e03a816fca528dc8739ced1cc10de22335766268469a05dfe768994c4aa', '2025-08-09 20:38:52.522'),
(8, 'Fariha Mazumder Sinthy', 'toaseanelmah@gmail.com', '$2b$10$KuxdiBn/aVwnB60Lvi6Qf..nPFj5Eh.q5FFC6RdaDPnQZX0DLjIDO', 'STUDENT', true, false, '073b1230fc6747e7313486ec5e4c84dcf974542a0f9ecd29faca4c50c9f55402', '2025-08-09 20:41:22.195'),
(9, 'Dipannita Das', 'fahmidarahman027@gmail.com', '$2b$10$zisjDCwM7RarQuDki0kzie/L3XiB.4BJw64oFg..RO22W3U1ngHXu', 'STUDENT', true, false, '17837808bd82fe22ee7cfdb9c52b42d3ad471034ea3e7322487128ad1e16e796', '2025-08-09 20:43:03.726'),
(10, 'Erina Akter', 'urcms.cu@gmail.com', '$2b$10$yMNfYgyRDIPL.khkQRe95eUQdbqQ97CFuoiu3sYRXEi34oMRhBHKy', 'STUDENT', true, false, '3d70cd893be74c11cc14e19243d28ebd73c8f17916e574143b85766123bebb12', '2025-08-09 20:57:17.799');

-- Insert Student data
INSERT INTO student (student_id, roll_number, department_id, user_id) VALUES
(1, '20701051', 1, 3),
(2, '20701001', 2, 8),
(3, '21701027', 1, 9),
(4, '21701016', 2, 10);

-- Insert Teacher data
INSERT INTO teacher (teacher_id, designation, department_id, user_id, "isReviewer") VALUES
(1, 'Lecturer', 1, 2, false),
(2, 'Associate Professor', 1, 5, true),
(3, 'Professor', 2, 6, true),
(4, 'Associate Professor', 1, 7, false);

-- Insert Reviewer data
INSERT INTO reviewer (reviewer_id, teacher_id, status) VALUES
(2, 2, 'ACTIVE');

-- Insert User-Domain relationships
INSERT INTO userdomain (user_id, domain_id) VALUES
(2, 1), (2, 2), (2, 4), (2, 8),
(3, 1), (3, 2), (3, 4),
(5, 1), (5, 2), (5, 4), (5, 8),
(6, 1), (6, 3), (6, 5), (6, 6), (6, 7),
(7, 1), (7, 2), (7, 4), (7, 8),
(8, 3), (8, 5), (8, 6),
(9, 2), (9, 4), (9, 8),
(10, 6), (10, 7);

-- Insert Team data
INSERT INTO team (team_id, team_name, team_description, domain_id, status, visibility, max_members, "isHiring", created_at, created_by_user_id) VALUES
(1, 'AI Research 2025', 'AI Research Team Description', 1, 'RECRUITING', 'PUBLIC', 4, true, '2025-08-12 14:34:40.161', 6),
(2, 'ETL Process team with AI', 'ETL Process team description', 1, 'RECRUITING', 'PUBLIC', 5, true, '2025-08-12 17:03:09.773', 6),
(3, 'New Research in AI', 'New Research in AI explores the living probability of human beings on the Mars. But the limitations urges us to not be hopeful of something like this.', 1, 'ACTIVE', 'PRIVATE', 4, false, '2025-08-12 17:37:18.616', 6),
(4, 'AI in predicting market value', 'AI in predicting market value ......', 1, 'RECRUITING', 'PUBLIC', 1, true, '2025-08-12 21:22:36.637', 6),
(5, 'New Research on Solar Energy', 'Solar energy is one of most sustainable renewable energy on earth. This research is conducted to deliver more efficient way to generate solar energy.', 7, 'INACTIVE', 'PRIVATE', 10, false, '2025-08-13 09:37:24.274', 6),
(6, 'Research in Robotics for helping in cooking', 'Robots helps us in various purposes in our life. This research is aimed to build a robot to help in making recipes and cooking.', 5, 'RECRUITING', 'PUBLIC', 10, true, '2025-08-13 19:10:04.542', 6),
(7, 'Research in Robotics for helping in cooking', 'Robots helps us in various purposes in our life. This research is aimed to build a robot to help in making recipes and cooking.', 5, 'RECRUITING', 'PUBLIC', 3, true, '2025-08-13 19:10:48.243', 6);

-- Insert Team Member data
INSERT INTO teammember (team_id, user_id, role_in_team) VALUES
(1, 8, NULL), (1, 10, NULL),
(2, 6, NULL), (2, 8, NULL), (2, 10, NULL),
(3, 6, NULL), (3, 8, NULL),
(4, 6, NULL), (4, 8, NULL), (4, 10, NULL),
(5, 6, NULL), (5, 10, NULL),
(6, 6, NULL), (6, 8, NULL),
(7, 6, NULL), (7, 8, NULL), (7, 10, NULL);

-- Insert Team Comment data
INSERT INTO teamcomment (comment_id, team_id, user_id, comment, created_at) VALUES
(1, 2, 6, 'Dear fellows! This is our first day in our research program! Welcome to all!', '2025-08-13 23:50:07.97'),
(2, 7, 6, 'This is a comment', '2025-08-14 05:00:10.054'),
(3, 7, 6, 'ppl;]', '2025-08-14 05:21:48.183'),
(4, 7, 6, 'p', '2025-08-14 06:36:50.78');

-- Insert Proposal data
INSERT INTO proposal (proposal_id, title, abstract, team_id, submitted_by, domain_id, pdf_path, file_size, created_at, status) VALUES
(1, 'AI Research Proposal Title', 'AI Research Abstract', 1, 3, 1, 'public\\files\\eb99e5fb-8d39-44b5-bc7b-56a70eb52cb2.pdf', 86583, '2025-08-12 14:34:40.22', 'PENDING'),
(2, 'ETL Process AI title', 'ETL Process team abstract', 2, 3, 1, 'public\\files\\c90e9fee-ee27-42f1-a760-a24269cd4654.pdf', 76145, '2025-08-12 17:03:09.82', 'PENDING'),
(3, 'New Research in AI  on Mars', 'New Research in AI abstract', 3, 3, 1, 'public\\files\\8a78fc92-71ee-4150-bc3b-718b315e77f0.pdf', 76145, '2025-08-12 17:37:18.671', 'PENDING'),
(4, 'AI in predicting market value', 'AI in predicting market value abc ......', 4, 3, 1, 'public\\files\\ac9cbcb9-ff43-4616-9bde-e3e51d9404b9.pdf', 3956212, '2025-08-12 21:22:36.73', 'PENDING'),
(5, 'This is the title of our reserach', 'This is the abstract of our reserach', 5, 3, 7, 'public\\files\\98cdfd1f-c31a-4cc8-befd-7d3ebcb81a1d.pdf', 4354200, '2025-08-13 09:37:24.566', 'PENDING'),
(6, 'AI Research Paper', 'AI Research Paper Abstract', 3, 3, NULL, 'public\\files\\a8d31ce9-b5e1-4739-9004-c5e7f5b1cd4f.pdf', 61444, '2025-08-13 14:41:31.598', 'PENDING'),
(7, 'abcd', 'abcd', 7, 3, 5, 'documents/d6ac8186-e321-4464-8783-6f02d25ccdfc.pdf', 4357277, '2025-08-13 19:10:48.27', 'PENDING'),
(8, 'Research proposal', 'Research abstract', 7, 3, NULL, 'documents/3aef6a6c-11df-4d7e-aa7b-a8d794e0ab89.pdf', 5290126, '2025-08-14 05:32:45.523', 'PENDING'),
(9, 'proposal', 'abstract', 7, 3, NULL, 'documents/d6e24627-53c2-4491-bed6-2b9ec495fa19.pdf', 778652, '2025-08-14 06:36:17.619', 'PENDING');

-- Insert Paper data
INSERT INTO paper (paper_id, title, abstract, team_id, submitted_by, domain_id, pdf_path, file_size, created_at, status) VALUES
(1, 'Research Paper on Solar Energy', 'Research Paper Abstract on Solar Energy', 5, 3, NULL, 'public\\files\\8a826c98-a57f-45c4-9f44-f4f80441ba5f.pdf', 69321, '2025-08-13 14:40:18.367', 'PENDING'),
(2, 'AI Research Paper on Living Probability', 'AI Research Abstract on Living Probability', 3, 3, NULL, 'public\\files\\64adb058-2296-4e45-80c3-7096d8efe002.pdf', 18025084, '2025-08-13 14:46:26.894', 'PENDING'),
(3, 'abcd paper', 'abcd abstract paper', 6, 3, NULL, 'documents/51eb830c-d5f2-4b00-af57-e1cce46ca5ee.pdf', 4319250, '2025-08-13 19:11:22.186', 'PENDING'),
(4, 'title', 'abstract', 7, 3, NULL, 'documents/24cde354-2e97-417f-a77a-7e92ac16e917.pdf', 5264671, '2025-08-14 05:33:35.24', 'PENDING');

-- Update sequences to match the inserted data
SELECT setval('admin_admin_id_seq', 1, true);
SELECT setval('department_department_id_seq', 4, true);
SELECT setval('domain_domain_id_seq', 21, true);
SELECT setval('generaluser_generaluser_id_seq', 1, true);
SELECT setval('paper_paper_id_seq', 4, true);
SELECT setval('proposal_proposal_id_seq', 9, true);
SELECT setval('review_review_id_seq', 1, false);
SELECT setval('reviewerassignment_assignment_id_seq', 1, false);
SELECT setval('student_student_id_seq', 4, true);
SELECT setval('teacher_teacher_id_seq', 4, true);
SELECT setval('team_team_id_seq', 7, true);
SELECT setval('teamapplication_application_id_seq', 1, false);
SELECT setval('teamcomment_comment_id_seq', 4, true);
SELECT setval('user_user_id_seq', 10, true);