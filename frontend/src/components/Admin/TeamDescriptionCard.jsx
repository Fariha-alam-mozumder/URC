import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import Card from "./Card";

const TeamDescriptionCard = ({ description, createdBy, creatorEmail }) => (
  <Card icon={<FaInfoCircle size={24} />} title="Team Description">
    <p className="mb-2 text-gray-700">{description || "No description available."}</p>
    <p className="text-sm text-gray-500">
      Created by: <strong>{createdBy || "Unknown"}</strong> <br />
      Email:{" "}
      {creatorEmail ? (
        <a href={`mailto:${creatorEmail}`} className="text-blue-600 underline">
          {creatorEmail}
        </a>
      ) : (
        "-"
      )}
    </p>
  </Card>
);

export default TeamDescriptionCard;
