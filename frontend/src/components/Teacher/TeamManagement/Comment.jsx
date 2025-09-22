// components/Teacher/TeamManagement/Comment.jsx
import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { resolveApiUrl } from '../../../config/api';

const Comments = ({ teamId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (teamId) {
      fetchComments();
      fetchCurrentUser();
    }
  }, [teamId]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(resolveApiUrl("/profile"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(response.data.data);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(resolveApiUrl(`/teams/${teamId}/comments`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(response.data.data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      setPosting(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.post(resolveApiUrl(`/teams/${teamId}/comments`), {
        comment: comment.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Add new comment to the beginning of the list
      const newComment = {
        comment_id: response.data.data.comment_id,
        comment: comment.trim(),
        created_at: new Date().toISOString(),
        user: {
          name: currentUser?.name || 'You',
          email: currentUser?.email || ''
        }
      };

      setComments(prev => [newComment, ...prev]);
      setComment('');
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return commentDate.toLocaleDateString();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAddComment();
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4">
        Team Comments ({comments.length})
      </h3>

      {/* Add Comment */}
      <div className="mb-4 border-b pb-4">
        <div className="flex items-start gap-3">
          <FaUserCircle className="text-2xl text-gray-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Write a comment... (Ctrl+Enter to post)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={posting}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {comment.length}/500 characters
              </span>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  comment.trim() && !posting
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleAddComment}
                disabled={!comment.trim() || posting}
              >
                {posting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Post Comment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <FaSpinner className="animate-spin text-gray-400 mr-2" />
            <span className="text-gray-500">Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <FaUserCircle className="text-4xl mb-2 text-gray-300" />
            <p>No comments yet.</p>
            <p className="text-sm mt-1">Be the first to start the discussion!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <div 
                key={c.comment_id} 
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaUserCircle className="text-xl text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">
                      {c.user?.name || 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(c.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {c.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Show load more if there are many comments */}
      {comments.length > 10 && (
        <div className="pt-4 border-t mt-4">
          <button className="w-full text-sm text-blue-600 hover:text-blue-800 py-2">
            Load more comments
          </button>
        </div>
      )}
    </div>
  );
};

export default Comments;