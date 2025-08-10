import React, { useState } from 'react';

const Comments = () => {
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([
    { id: 1, name: 'Alex Chen', text: 'Please review the proposal by tomorrow.', time: '2 hours ago' },
    { id: 2, name: 'Maria Rodriguez', text: 'Added new document for literature review.', time: '5 hours ago' },
  ]);

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: allComments.length + 1,
      name: 'You',
      text: comment,
      time: 'Just now',
    };

    setAllComments([newComment, ...allComments]);
    setComment('');
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      {/* Add Comment */}
      <div className="flex items-start gap-2 mb-4">
        <textarea
          className="w-full p-2 border border-gray-300 rounded resize-none"
          rows={2}
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAddComment}
        >
          Post
        </button>
      </div>

      {/* Comment List */}
      {allComments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-3">
          {allComments.map((c) => (
            <div key={c.id} className="border border-gray-200 p-3 rounded bg-gray-50">
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-sm text-gray-700">{c.text}</p>
              <p className="text-xs text-gray-400 mt-1">{c.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
