// pages/AssignedProposalsPage.jsx
import AssignedItemsPage from '../../components/Reviewer/AssignedItemsPage';
import { useOutletContext } from 'react-router-dom';

const proposals = [
  { id: 'PR-2025-101', title: 'Green Hydrogen for Urban Transportation Systems', due: 'March 18, 2025' },
  { id: 'PR-2025-102', title: 'AI-Driven Drug Discovery for Rare Diseases', due: 'March 25, 2025' },
  { id: 'PR-2025-103', title: 'Cybersecurity Threat Modeling Using Quantum Simulation', due: 'April 1, 2025' }
];

const AssignedProposalsPage = () => {
  const { toggleSidebar } = useOutletContext(); // optional use

  return (
    <AssignedItemsPage
      title="Assigned Proposals"
      description="Review and manage your assigned research proposals"
      items={proposals}
      reviewPathPrefix="/ReviewerDashboard/review/"
    />
  );
};

export default AssignedProposalsPage;
