import React from "react";
import { FaUserFriends } from "react-icons/fa";
import Card from "./Card";

const TeamMembersCard = ({ members }) => (
  <Card icon={<FaUserFriends size={24} />} title={`Team Members (${members.length})`}>
    {members.length ? (
      <ul className="list-disc list-inside text-gray-700">
        {members.map((m) => (
          <li key={m.id}>{m.name}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No members found.</p>
    )}
  </Card>
);

export default TeamMembersCard;
