// pages/AssignedPapersPage.jsx
import AssignedItemsPage from '../../components/Reviewer/AssignedItemsPage';
import { useOutletContext } from 'react-router-dom';

const papers = [
  { id: 'RP-2025-001', title: 'Machine Learning Applications in Climate Change Prediction Models', due: 'March 15, 2025' },
  { id: 'RP-2025-002', title: 'Quantum Computing Algorithms for Cryptographic Security Enhancement', due: 'March 20, 2025' },
  { id: 'RP-2025-003', title: 'Biomedical Data Analysis Using Deep Learning Neural Networks', due: 'March 25, 2025' },
  { id: 'RP-2025-004', title: 'Sustainable Energy Systems: A Comprehensive Review of Solar Panel Efficiency', due: 'March 30, 2025' },
  { id: 'RP-2025-005', title: 'Artificial Intelligence in Healthcare: Diagnostic Accuracy and Patient Outcomes', due: 'April 5, 2025' },
  { id: 'RP-2025-006', title: 'Blockchain Technology Applications in Supply Chain Management Systems', due: 'April 10, 2025' }
];

const AssignedPapersPage = () => {
  const { toggleSidebar } = useOutletContext(); // optional use

  return (
    <AssignedItemsPage
      title="Assigned Papers"
      description="Review and manage your assigned research papers"
      items={papers}
      reviewPathPrefix="/ReviewerDashboard/review/"
    />
  );
};

export default AssignedPapersPage;
