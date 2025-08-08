import React, { useMemo, useState } from 'react';
// import FilterBar from '../components/FilterBar';
// import SubmissionTable from '../components/SubmissionTable';
import FilterBar from '../../components/Common/FilterBar';
import SubmissionTable from '../../components/Teacher/SubmissionTable';

const RAW = [
  { id: 1, code: 'P-2024-001', title: 'Advanced Machine Learning Techniques in Medical Imaging', authors: 3, field: 'AI & Healthcare', submitted: 'Aug 15, 2024', status: 'Under Review', updated: 'Aug 18, 2024' },
  { id: 2, code: 'P-2024-002', title: 'Blockchain Applications in Supply Chain Security', authors: 2, field: 'Blockchain Technology', submitted: 'Jul 22, 2024', status: 'Accepted', updated: 'Aug 10, 2024' },
  { id: 3, code: 'P-2024-003', title: 'Quantum Computing Algorithms for Optimization Problems', authors: 3, field: 'Quantum Computing', submitted: 'Jun 30, 2024', status: 'Needs Revision', updated: 'Jul 25, 2024' },
  { id: 4, code: 'P-2024-004', title: 'Sustainable Energy Systems for Smart Cities', authors: 3, field: 'Sustainability', submitted: 'May 15, 2024', status: 'Rejected', updated: 'Jun 20, 2024' },
  { id: 5, code: 'P-2024-005', title: 'Natural Language Processing in Educational Technology', authors: 2, field: 'AI & Education', submitted: 'Apr 20, 2024', status: 'Submitted', updated: 'Apr 20, 2024' },
  { id: 6, code: 'P-2024-006', title: 'Cybersecurity Frameworks for IoT Networks', authors: 3, field: 'Cybersecurity', submitted: 'Mar 10, 2024', status: 'Accepted', updated: 'Apr 15, 2024' },
  { id: 7, code: 'P-2024-007', title: 'Data Mining Techniques for Social Media Analysis', authors: 2, field: 'Data Science', submitted: 'Feb 28, 2024', status: 'Under Review', updated: 'Aug 5, 2024' },
  { id: 8, code: 'P-2024-008', title: 'Reinforcement Learning in Autonomous Vehicle Navigation', authors: 3, field: 'AI & Robotics', submitted: 'Jan 15, 2024', status: 'Needs Revision', updated: 'Mar 20, 2024' },
];

const parseDate = (s) => new Date(s + ' 00:00:00');

const SubmissionHistory = () => {
  const [filters, setFilters] = useState([
    { name: 'search', type: 'input', inputType: 'text', placeholder: 'Search by title or team member...', value: '' },
    { name: 'time', type: 'select', options: ['All Time', 'Last 30 Days', 'Last 90 Days', 'This Year'], value: 'All Time' },
    { name: 'status', type: 'select', options: ['All Status', 'Submitted', 'Under Review', 'Accepted', 'Needs Revision', 'Rejected'], value: 'All Status' },
    { name: 'field', type: 'select', options: ['All Fields', 'AI & Healthcare', 'Blockchain Technology', 'Quantum Computing', 'Sustainability', 'AI & Education', 'Cybersecurity', 'Data Science', 'AI & Robotics'], value: 'All Fields' },
  ]);

  const [sort, setSort] = useState({ key: 'submitted', dir: 'desc' });

  const onFilterChange = (name, value) => {
    setFilters((prev) => prev.map((f) => (f.name === name ? { ...f, value } : f)));
  };

  const filtered = useMemo(() => {
    let data = [...RAW];
    const f = Object.fromEntries(filters.map(({ name, value }) => [name, value]));

    // search in title or code
    if (f.search?.trim()) {
      const q = f.search.toLowerCase();
      data = data.filter((x) => x.title.toLowerCase().includes(q) || x.code.toLowerCase().includes(q));
    }

    // status
    if (f.status && f.status !== 'All Status') {
      data = data.filter((x) => x.status === f.status);
    }

    // field
    if (f.field && f.field !== 'All Fields') {
      data = data.filter((x) => x.field === f.field);
    }

    // time window
    const now = new Date();
    if (f.time === 'Last 30 Days') {
      const from = new Date(now); from.setDate(now.getDate() - 30);
      data = data.filter((x) => parseDate(x.submitted) >= from);
    } else if (f.time === 'Last 90 Days') {
      const from = new Date(now); from.setDate(now.getDate() - 90);
      data = data.filter((x) => parseDate(x.submitted) >= from);
    } else if (f.time === 'This Year') {
      const y = new Date(now.getFullYear(), 0, 1);
      data = data.filter((x) => parseDate(x.submitted) >= y);
    }

    // sorting
    const { key, dir } = sort;
    data.sort((a, b) => {
      let va = a[key], vb = b[key];
      if (key === 'submitted' || key === 'updated') {
        va = parseDate(va).getTime();
        vb = parseDate(vb).getTime();
      } else {
        va = String(va).toLowerCase();
        vb = String(vb).toLowerCase();
      }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return dir === 'asc' ? cmp : -cmp;
    });

    return data;
  }, [filters, sort]);

  const handleSort = (key) => {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );
  };

  return (
    <div className="p-6 sm:p-6">
      <h1 className="text-2xl font-bold mb-2">Submission History</h1>
      {/* <p className="text-sm text-gray-600 mb-4">Track all your submitted papers and their current status.</p> */}

      <FilterBar filters={filters} onFilterChange={onFilterChange} />
      <SubmissionTable items={filtered} sort={sort} onSort={handleSort} />
    </div>
  );
};

export default SubmissionHistory;
