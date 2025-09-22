# File Tree: backend

Generated on: 9/15/2025, 4:59:24 PM
Root path: `d:\WebDev\Project\URCMS\URC\backend`

```
├── DB/
│   ├── db.config.js
├── config/
│   ├── filesystem.js
│   ├── logger.js
│   ├── mailer.js
│   └── ratelimiter.js
├── controllers/
│   ├── admin/
│   │   ├── AdminPaperController.js
│   │   ├── AssignmentController.js
│   │   ├── DepartmentController.js
│   │   ├── RecentSubmission.js
│   │   ├── ReviewerController.js
│   │   ├── ReviewerWorkloadController.js
│   │   ├── StatsController.js
│   │   ├── StatusDistributionController.js
│   │   ├── SubmissionTrendsController.js
│   │   └── TeamController.js
│   ├── landing/
│   │   └── landingControlleer.js
│   ├── reviewer/
│   │   ├── AssignedController.js
│   │   ├── ReviewController.js
│   │   └── reviewAssignController.js
│   ├── student/
│   │   └── StudentTeamController.js
│   ├── teacher/
│   │   ├── PaperController.js
│   │   ├── ProposalController.js
│   │   ├── SubmissionsController.js
│   │   ├── TeamApplicationController.js
│   │   ├── TeamCommentController.js
│   │   ├── TeamController.js
│   │   └── TeamDetails.js
│   ├── AuthController.js
│   ├── NewsController.js
│   └── ProfileController.js
├── jobs/
│   ├── SendEmailJob.js
│   └── index.js
├── middleware/
│   ├── Authenticate.js
│   ├── adminOnly.js
│   └── reviewerOnly.js
├── node_modules/ 🚫 (auto-hidden)
├── prisma/
│   ├── migrations/
│   │   ├── 20250912211835_init/
│   │   │   └── migration.sql
│   │   ├── 20250913211136_reviewdata/
│   │   │   └── migration.sql
│   │   ├── 20250914183041_add_reviewer_max_assignments/
│   │   │   └── migration.sql
│   │   ├── 20250914191243_add_capacity_and_self_pause/
│   │   │   └── migration.sql
│   │   ├── 20250914225409_removed_status_and_max/
│   │   │   └── migration.sql
│   │   ├── 20250915104236_updated_paper_status/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   ├── seed.js
│   ├── seed.sql
│   └── urcms.sql
├── public/
│   ├── documents/
│   │   ├── 1adbb05c-ca99-4514-9de6-2e897afaafd1.pdf
│   │   ├── 1d268f79-5ebe-4184-98a9-099ed6abb310.docx
│   │   ├── 24cde354-2e97-417f-a77a-7e92ac16e917.pdf
│   │   ├── 264eee2d-c4c2-4c89-9af9-60f5f9a7cd94.pdf
│   │   ├── 35905e90-b7b7-4f68-9390-75a300ad79bc.pdf
│   │   ├── 3aef6a6c-11df-4d7e-aa7b-a8d794e0ab89.pdf
│   │   ├── 42231253-103a-411b-a404-1aa865cf1dbc.pdf
│   │   ├── 4eeed85f-48b1-4750-ab33-e5c71ba9b9a5.pdf
│   │   ├── 51eb830c-d5f2-4b00-af57-e1cce46ca5ee.pdf
│   │   ├── 5cc6eb23-9299-4005-992b-b13083b973d6.pdf
│   │   ├── 617747eb-068b-4237-b5a7-427a05763fea.docx
│   │   ├── 68d2e34e-af0d-4114-bc6b-e041803ec481.pdf
│   │   ├── 696b541d-8baf-4899-a0ed-09801e1e02de.pdf
│   │   ├── 7c7a555d-9a3e-4d04-a286-8ba3e9258785.pdf
│   │   ├── 8fa69380-7efb-4266-8a15-73b8ca80196b.pdf
│   │   ├── 9f5c72a9-323d-4e45-9467-fbe095b7c81f.pdf
│   │   ├── a24561e9-2329-4ffb-b54a-68c7b437b749.pdf
│   │   ├── a55e5eaa-9182-459b-a9f8-a27587b139d7.pdf
│   │   ├── ab27f488-e43b-4b34-a932-c7c3a426c697.pdf
│   │   ├── ac912912-97c5-4166-ac8b-fde78a8311bb.pdf
│   │   ├── b0a831e2-a342-4f73-892d-c09e856acf69.pdf
│   │   ├── b9a5dd82-4387-4b7b-a614-6a7b2ed332c1.pdf
│   │   ├── becfa323-3917-441b-b298-9c05507bfb52.pdf
│   │   ├── d6ac8186-e321-4464-8783-6f02d25ccdfc.pdf
│   │   ├── d6e24627-53c2-4491-bed6-2b9ec495fa19.pdf
│   │   ├── d91e6a27-2075-4d85-966c-bfc78ca693f5.pdf
│   │   ├── dd88f5f3-2228-4e0b-9343-f26da2548292.pdf
│   │   ├── df22c55b-ac3c-4693-beef-e2efb552dbdb.pdf
│   │   ├── e1262e9f-fe31-4c83-a194-8c8fcab79b0b.pdf
│   │   ├── eae7874f-606c-47ab-8fdd-6a21abce6989.pdf
│   │   ├── eb99e5fb-8d39-44b5-bc7b-56a70eb52cb2.pdf
│   │   ├── f6ee2a4b-dbee-4e0a-a5ae-f7270650e5eb.pdf
│   │   ├── f8469b15-9890-4f38-bcf8-6e81c7298aef.pdf
│   │   ├── fa95f85a-a22c-474b-873d-1a08bfcf589f.pdf
│   │   └── ffc9b266-1536-4a14-947e-8941c9fbc04c.pdf
│   └── images/
│       ├── 10856182-61de-4e23-8ddc-313c6a084dec.png
│       ├── 269bfda1-6785-4a47-a9a5-a0c4aa9d9324.jpg
│       ├── 3e738892-e3c9-4864-b5d9-f3bc7634d739.png
│       ├── 3f6be434-7138-4f10-88f9-6e09e7391ef7.png
│       ├── 3ff2e553-34ee-412b-b491-f7712d7f38c1.png
│       ├── 42641479-20ec-489e-8aa8-2b59d06d02a0.png
│       ├── 45b0201d-cadb-4c81-afd2-97ee3d4851db.jpg
│       ├── 4faa4a5d-648d-424c-8014-edb611616de1.jpg
│       ├── 5a367d47-cd12-444a-bf0d-ddcd33bd4784.png
│       ├── 5e7de077-6963-4cc4-b1a2-b4288db4fac8.png
│       ├── 75eb4e61-4412-49d0-9f84-cb89b06eea6d.png
│       ├── 7fb20705-59ea-4a50-b771-d02da7c2a553.jpg
│       ├── 83cada90-ec67-41b8-8c5a-ba95630e6991.png
│       ├── 8ec481b1-c76f-4015-83bc-cbf671f84f11.jpg
│       ├── 97ecb145-8fe1-44b8-9aae-b41978cf31eb.jpg
│       ├── a9d66a2f-0689-4f82-afed-2950465f91d4.jpg
│       ├── b219fc9f-eed8-4690-974b-8c68b2cbfb26.png
│       ├── c2ffd94e-763d-43d4-a545-cabed34acdab.png
│       ├── d38aa44b-932d-452e-84b3-1712b32c6053.jpg
│       ├── d8e814b2-3903-45c6-b420-c1c173b6f787.jpg
│       ├── dc5e2851-951f-4ec7-a9d4-3c3192f21c85.jpg
│       ├── ddab2f7b-dbe7-4fe7-a302-9b50b34e98a6.jpg
│       ├── deafc12a-bb6b-4f25-af7a-dec369b914e8.jpg
│       ├── e9c22b6f-a0d9-4b62-bb28-25abb8c71062.jpg
│       ├── f2f4a064-c291-4442-bec7-e6f85be0e124.png
│       ├── f62fb50c-2ab4-4151-85fe-3db0809372c3.jpg
│       └── image.png
├── routes/
│   └── api.js
├── test/
│   ├── files/
│   │   └── proposal.pdf
│   ├── images/
│   │   ├── cat3.jpg
│   │   ├── images2.jpg
│   │   └── sample.jpg
│   ├── paper.http
│   ├── pdfUpload.http
│   ├── review.http
│   ├── sample-team.http
│   ├── team.http
│   └── upload-news.http
├── transform/
│   └── newApiTransform.js
├── utils/
│   ├── assignmentAggregate.js
│   ├── decisionAggregate.js
│   ├── finalizeIfCompleted.js
│   └── helper.js
├── validations/
│   ├── admin/
│   │   ├── RecentSubmissionValidation.js
│   │   ├── assignmentValidation.js
│   │   └── reviewerValidation.js
│   ├── reviewer/
│   │   └── reviewValidation.js
│   ├── teacher/
│   │   ├── paperValidation.js
│   │   ├── proposalValidation.js
│   │   └── teamValidation.js
│   ├── CustomErrorReporter.js
│   ├── authValidation.js
│   └── newsValidation.js
├── .env 🚫 (auto-hidden)
├── README.md
├── combined.log 🚫 (auto-hidden)
├── error.log 🚫 (auto-hidden)
├── login.http
├── package-lock.json
├── package.json
└── server.js
```

---
*Generated by FileTree Pro Extension*