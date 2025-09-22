// components/Teacher/TeamActivity.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { resolveApiUrl } from "../../config/api";

const TeamActivity = ({ scope = "teacher", limit = 12 }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const didFetch = useRef(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const commentsEndpoint =
    scope === "student"
      ? resolveApiUrl("/student/my-teams/comments")
      : resolveApiUrl("/teacher/my-teams/comments");

  useEffect(() => {
    if (didFetch.current) return; // avoid double-fetch in StrictMode
    didFetch.current = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(commentsEndpoint, { headers });
        const items = (res.data?.data || [])
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, limit);
        setComments(items);
      } catch (e) {
        console.error("TeamActivity comments fetch error:", e);
        setError("Failed to load recent comments");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [commentsEndpoint, limit]);

  const timeAgo = (d) => {
    const now = Date.now();
    const t = new Date(d).getTime();
    const mins = Math.floor((now - t) / 60000);
    if (mins < 60) return `${Math.max(mins, 1)} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  if (loading){
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Loading papers...</p>
      </div>
    );
  }
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <div className="bg-white rounded-lg p-4 shadow-md flex-1">
      <h3 className="font-bold text-lg mb-4">Team Activity</h3>

      {!loading && !error && (
        <>
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500">No recent comments</p>
          ) : (
            <ul className="space-y-2">
              {comments.map((c) => (
                <li
                  key={c.comment_id}
                  className="text-sm text-gray-700 border rounded p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="truncate">
                      <span className="font-medium">{c.user?.name || "Unknown"}</span>{" "}
                      commented on{" "}
                      <span className="font-medium">
                        {c.team?.team_name || "Team"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">
                      {timeAgo(c.created_at)}
                    </span>
                  </div>
                  <div className="mt-1 text-gray-600 line-clamp-2">
                    {c.comment}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default TeamActivity;
