import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import TeamDescriptionCard from "../../components/Admin/TeamDescriptionCard";
import TeamMembersCard from "../../components/Admin/TeamMembersCard";
import TeamPapersCard from "../../components/Admin/TeamsPapersCard";
import axios from "axios";

const AdminTeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:8000/api";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchTeamDetails();
  }, [id]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${BASE_URL}/admin/teams/${id}`, {
        headers,
        withCredentials: true
      });
      
      if (response.data.success) {
        // Transform the data to match component expectations
        const teamData = response.data.team;
        const transformedTeam = {
          ...teamData,
          // Create creator info from the first member with LEADER role or first member
          createdBy: teamData.members?.find(m => m.role === 'LEADER')?.name || 
                    teamData.members?.[0]?.name || 'Unknown',
          creatorEmail: teamData.members?.find(m => m.role === 'LEADER')?.email || 
                       teamData.members?.[0]?.email || '',
          
          // Transform papers and proposals into the expected format
          acceptedPapers: [
            ...(teamData.files?.papers || []).filter(p => p.status === 'ACCEPTED').map(p => ({
              id: p.id,
              title: p.title,
              date: new Date(p.created_at || p.submitted_at).toLocaleDateString(),
              type: 'paper'
            })),
            ...(teamData.files?.proposals || []).filter(p => p.status === 'ACCEPTED').map(p => ({
              id: p.id, 
              title: p.title,
              date: new Date(p.created_at || p.submitted_at).toLocaleDateString(),
              type: 'proposal'
            }))
          ],
          
          rejectedPapers: [
            ...(teamData.files?.papers || []).filter(p => p.status === 'REJECTED').map(p => ({
              id: p.id,
              title: p.title,
              date: new Date(p.created_at || p.submitted_at).toLocaleDateString(),
              type: 'paper'
            })),
            ...(teamData.files?.proposals || []).filter(p => p.status === 'REJECTED').map(p => ({
              id: p.id,
              title: p.title, 
              date: new Date(p.created_at || p.submitted_at).toLocaleDateString(),
              type: 'proposal'
            }))
          ],
          
          pendingPapers: [
            ...(teamData.files?.papers || []).filter(p => 
              p.status === 'PENDING' || p.status === 'UNDER_REVIEW'
            ).map(p => ({
              id: p.id,
              title: p.title,
              date: new Date(p.created_at || p.submitted_at).toLocaleDateString(),
              type: 'paper'
            })),
            ...(teamData.files?.proposals || []).filter(p => 
              p.status === 'PENDING' || p.status === 'UNDER_REVIEW'
            ).map(p => ({
              id: p.id,
              title: p.title,
              date: new Date(p.created_at || p.submitted_at).toLocaleDateString(), 
              type: 'proposal'
            }))
          ],

          // Transform members to include department info
          members: (teamData.members || []).map(member => ({
            ...member,
            department: member.department || 'Unknown Department'
          }))
        };
        
        setTeam(transformedTeam);
      } else {
        setError('Team not found');
      }
    } catch (err) {
      console.error('Error fetching team details:', err);
      setError(err.response?.data?.message || 'Failed to load team details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading team details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
        
        <div className="text-center py-12">
          <div className="text-red-600">
            <p className="text-xl font-semibold mb-2">Error Loading Team</p>
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchTeamDetails}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Team not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors cursor-pointer text-gray-700 hover:text-gray-900"
          aria-label="Go back"
        >
          <FaArrowLeft size={20} />
          {/* <span className="font-medium text-lg">Back</span> */}
        </button>
        
        <h2 className="text-3xl font-extrabold text-gray-900">
          {team.name} Overview
        </h2>
        
        <div style={{ width: 64 }} />
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Row 1: Team Description spans both columns */}
        <div className="md:col-span-2">
          <TeamDescriptionCard
            description={team.desc || team.description}
            createdBy={team.createdBy}
            creatorEmail={team.creatorEmail}
            className="h-full"
          />
        </div>

        {/* Row 2: Team Members and Pending Papers */}
        <TeamMembersCard members={team.members || []} className="h-full" />
        
        <TeamPapersCard
          title="Pending Papers & Proposals"
          papers={team.pendingPapers || []}
          icon={<FaHourglassHalf size={24} className="text-yellow-600" />}
          className="h-full"
        />

        {/* Row 3: Accepted Papers and Rejected Papers */}
        <TeamPapersCard
          title="Accepted Papers & Proposals"
          papers={team.acceptedPapers || []}
          icon={<FaCheckCircle size={24} className="text-green-600" />}
          className="h-full"
        />
        
        <TeamPapersCard
          title="Rejected Papers & Proposals"
          papers={team.rejectedPapers || []}
          icon={<FaTimesCircle size={24} className="text-red-600" />}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default AdminTeamDetails;