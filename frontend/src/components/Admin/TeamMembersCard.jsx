import React from "react";
import { FaUserFriends } from "react-icons/fa";
import Card from "./Card";

const TeamMembersCard = ({ members }) => (
  <Card icon={<FaUserFriends size={24} />} title={`Team Members (${members.length})`}>
    {members.length ? (
      <ul className="space-y-4">
        {members.map((m) => (
          <li key={m.id} className="border-b pb-3 last:border-none">
            <p className="font-medium text-gray-900">{m.name}</p>
            <p className="text-sm text-gray-600">{m.department}</p>
            <p className="text-sm text-gray-500">{m.email}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No members found.</p>
    )}
  </Card>
);

export default TeamMembersCard;