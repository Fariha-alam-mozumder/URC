import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';


const PaperReviewPage = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 p-6">
      {/* Back Button Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 text-xl mr-4 hover:text-gray-800"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-2xl font-semibold">Research Proposal Review</h2>
      </div>

      {/* Proposal Info */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Research ID: {paperId}</h3>
          <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded">Pending Review</span>
        </div>

        <h3 className="text-lg font-semibold">Research Title</h3>
        <p className="mb-4">
          Example Research Title for {paperId}
        </p>

        <h3 className="text-lg font-semibold">Abstract</h3>
        <p className="text-sm text-gray-600 mb-4">
          Example abstract for research paper {paperId}. You can load real data here later.
        </p>

        <button className="flex items-center gap-2 border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 text-gray-700">
          📥 Download Research Proposal <span className="text-xs">(PDF · 2.4 MB)</span>
        </button>
      </div>

      {/* Evaluation Form */}
      <div className="bg-white p-6 rounded shadow">
  <h3 className="text-lg font-semibold mb-4">Evaluation Criteria</h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {['Originality', 'Methodology', 'Clarity', 'Relevance', 'Presentation'].map((criterion) => (
      <div key={criterion}>
        <label className="block text-sm font-medium mb-1">{criterion}</label>
        <select className="w-full border border-gray-300 rounded px-3 py-2">
          <option>Select Rating</option>
          <option>1 - Poor</option>
          <option>2 - Fair</option>
          <option>3 - Good</option>
          <option>4 - Very Good</option>
          <option>5 - Excellent</option>
        </select>
      </div>
    ))}
  </div>



        <div className="mb-4">
          <label className="block text-sm font-medium">Qualitative Feedback</label>
          <textarea rows="4" placeholder="Provide detailed feedback..." className="w-full border border-gray-300 rounded px-3 py-2 mt-1"></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Decision</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 mt-1">
            <option>Select Decision</option>
            <option>Accept</option>
            <option>Minor Revisions</option>
            <option>Major Revisions</option>
            <option>Reject</option>
          </select>
        </div>

        <h3 className="text-lg font-semibold mb-4">Upload Review File</h3>
  <input
    type="file"
    className="block w-full text-sm text-gray-700
      file:mr-4 file:py-2 file:px-4
      file:rounded file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-50 file:text-blue-700
      hover:file:bg-blue-100 mb-6"
  />

        <button className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700">
          ✅ Submit Review
        </button>
      </div>
    </div>
  );
};

export default PaperReviewPage;
