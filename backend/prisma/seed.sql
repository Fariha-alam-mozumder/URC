
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

-- Optional: bump sequences so future inserts use the next IDs
SELECT pg_catalog.setval('public.admin_admin_id_seq', 1, true);
SELECT pg_catalog.setval('public.department_department_id_seq', 4, true);
SELECT pg_catalog.setval('public.domain_domain_id_seq', 8, true);
SELECT pg_catalog.setval('public.generaluser_generaluser_id_seq', 1, true);
SELECT pg_catalog.setval('public.student_student_id_seq', 4, true);
SELECT pg_catalog.setval('public.teacher_teacher_id_seq', 4, true);
SELECT pg_catalog.setval('public.user_user_id_seq', 10, true);
