// src/components/teacher/MyPapers/SubmitPaperModal.jsx
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const SubmitPaperModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [team, setTeam] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !team || !file) return alert('All fields are required');
    onSubmit({ title, team, file });
    setTitle('');
    setTeam('');
    setFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="text-xl font-bold mb-4">Submit New Paper</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Paper Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Team Name</label>
            <input
              type="text"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Upload File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm mt-1"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitPaperModal;
