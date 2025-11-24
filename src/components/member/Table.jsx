const Table = ({ members }) => {
  return (
    <>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-3 py-3">No.</th>
              <th className="px-3 py-3">Unique Number</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Club</th>
              <th className="px-3 py-3">Chapter</th>
              <th className="px-3 py-3">Campus</th>
              <th className="px-3 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={member.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-3 py-4 font-medium">{index + 1}</td>
                <td className="px-3 py-4">{member.unique_number}</td>
                <td className="px-3 py-4">{member.name}</td>
                <td className="px-3 py-4">{member.club}</td>
                <td className="px-3 py-4">{member.chapter}</td>
                <td className="px-3 py-4">{member.campus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
