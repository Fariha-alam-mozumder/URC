Project Overview:

   The University Research Cell Management System (URCMS) is a full-stack web application designed to streamline research workflows in academic institutions. It provides a centralized platform for students, teachers, reviewers, and administrators to manage research proposals, papers, and team collaborations.

Key highlights:

   1. Role-based access (Admin, Teacher, Reviewer, Student, General User).
   2. Secure authentication and email verification.
   3. Proposal and paper submission with reviewer assignment.
   4. Team collaboration and supervision features.
   5. Proposal and paper review process ensures quality standards: all submitted proposals and papers are evaluated by assigned reviewers and are either accepted for publication or rejected based on adherence to academic and institutional standards.

Technology Stack:

   Frontend -
    * React + Vite → Fast and modular frontend development
    * Tailwind CSS → Utility-first responsive styling

   Backend -
    * Node.js + Express.js → RESTful API and server-side logic
    * Prisma ORM → Type-safe database interactions
    * PostgreSQL → Relational database
    * Redis → Caching and background jobs
    * Brevo → Mail Verificatiob

Tools & Deployment:

   * VS Code → Primary development environment
   * Thunder Client / REST Client → API testing
   * Git & GitHub → Version control and collaboration
   * Deployment: Vercel (frontend), Render (backend), Neondb (Database)

Prerequisites:

   *Node.js (>= 18.x)
   *PostgreSQL
   *Redis

Installation:

   ```bash
   # Clone repository
   git clone https://github.com/Fariha-alam-mozumder/URC/
   cd urc

   # Backend setup
   cd backend
   npm install
   npx prisma migrate dev
   npm run dev

   # Frontend setup
   cd ../frontend
   npm install
   npm run dev
