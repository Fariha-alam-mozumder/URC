

const ResearchStats = ({ stats }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col h-80 gap-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
      Research Stats
      </h3>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`flex justify-between items-center h-20 p-3 rounded-lg ${stat.color}`}
        >
          <span className="flex items-center gap-2"> {stat.label}</span>
          <span className="font-bold">{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

export default ResearchStats;
