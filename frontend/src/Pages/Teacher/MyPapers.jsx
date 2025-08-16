import React, { useRef, useState } from 'react';  // ✅ Added useState
// import PaperCard from '../../components/teacher/MyPapers/PaperCard';
// import FilterBar from '../../components/common/FilterBar';
// import UploadDocModal from '../../components/teacher/CreateTeam/UploadModal';
import PaperCard from '../../components/Common/PaperCard';
import UploadDocModal from '../../components/Teacher/CreateTeam/UploadModal';
import FilterBar from '../../components/Common/FilterBar';

const MyPapers = () => {
  // filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [yearFilter, setYearFilter] = useState('All Years');
  const [sortFilter, setSortFilter] = useState('Latest First');

  // list
  const [papers, setPapers] = useState([
    {
      title: 'Sustainable Energy Solutions for Smart Cities',
      team: 'Green Tech Initiative',
      date: '2024-08-01',
      lastEditor: 'Dr. Robert Chen',
      status: 'Draft',
      role: 'Mentor',
      reviewers: [],
      comments: 0,
    },
    {
      title: 'Machine Learning Applications in Healthcare Diagnostics',
      team: 'AI Healthcare Team',
      date: '2024-07-15',
      lastEditor: 'Dr. Robert Chen',
      status: 'Under Review',
      role: 'Lead Author',
      reviewers: ['Dr. Sarah Johnson', 'Prof. Michael Chen'],
      comments: 1,
    },
  ]);

  // upload modal
  const [showUpload, setShowUpload] = useState(false);

  const filters = [
    { type: 'input', name: 'search', placeholder: 'Search papers by title...' },
    { type: 'select', name: 'status', options: ['All Status', 'Draft', 'Under Review', 'Published'] },
    { type: 'select', name: 'role', options: ['All Roles', 'Mentor', 'Lead Author', 'Reviewer'] },
    { type: 'select', name: 'year', options: ['All Years', '2025', '2024'] },
    { type: 'select', name: 'sort', options: ['Latest First', 'Oldest First'] },
  ];

  const onFilterChange = {
    search: setSearchQuery,
    status: setStatusFilter,
    role: setRoleFilter,
    year: setYearFilter,
    sort: setSortFilter,
  };

  // basic filtering (title only for demo)
  const filteredPapers = papers.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // add new paper from modal
  const handleUploadSubmit = ({ title, abstract, file }) => {
    const now = new Date();
    const newPaper = {
      title,
      team: 'My Research Group',
      date: now.toISOString().slice(0, 10),
      lastEditor: 'You',
      status: 'Draft',
      role: 'Lead Author',
      reviewers: [],
      comments: 0,
      _abstract: abstract,
      _filename: file?.name,
    };
    setPapers((prev) => [newPaper, ...prev]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">My Papers</h2>
          {/* <p className="text-gray-500 text-sm">Manage all your research papers and submissions</p> */}
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          + Submit New Paper
        </button>
      </div>

      {/* Filters */}
      <FilterBar filters={filters} onFilterChange={onFilterChange} />

      {/* Paper List */}
      <div className="space-y-4">
        {filteredPapers.map((paper, index) => (
          <PaperCard
  role="teacher"
  paper={{
    id: 'ml-2025-01',
    title: 'Machine Learning Applications in Healthcare Diagnostics',
    team: 'AI Healthcare Team',
    date: '2024-07-15',
    lastEditor: 'Dr. Robert Chen',
    status: 'Under Review',
    role: 'Lead Author',
    // reviewers: ['Dr. Sarah Johnson', 'Prof. Michael Chen'],
    comments: 1,
    fileUrl: '/files/healthcare-ml.pdf',
  }}
/>

        ))}
      </div>

      {/* Upload Modal */}
      <UploadDocModal
        open={showUpload}
        kind="paper"
        onClose={() => setShowUpload(false)}
        onSubmit={handleUploadSubmit}
      />
    </div>
  );
};
export default MyPapers;
