const papers = [
  {
    title: 'Machine Learning Applications in Healthcare',
    author: 'John Smith',
    status: 'Pending',
    due: 'Jan 25, 2025',
    Actions: 'Review'
  },
  {
    title: 'Data Mining Techniques for Social Networks',
    author: 'Emily Johnson',
    status: 'Completed',
    due: 'Jan 20, 2025',
    Actions: 'View'
  },
];

const AssignedPapersTable = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Assigned Papers</h2>
      <table className="w-full table-auto text-left">
        <thead>
          <tr className="text-gray-600">
            <th className="py-2">Paper Title</th>
            <th className="py-2">Author</th>
            <th className="py-2">Status</th>
            <th className="py-2">Due Date</th>
             <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {papers.map((paper, i) => (
            <tr key={i} className="border-t">
              <td className="py-2">{paper.title}</td>
              <td className="py-2">{paper.author}</td>
              <td className="py-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  paper.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {paper.status}
                </span>
              </td>
              <td className="py-2">{paper.due}</td>
               <td className="py-2">{paper.Actions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedPapersTable;
