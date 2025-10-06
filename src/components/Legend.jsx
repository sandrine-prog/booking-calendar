import React from 'react';

const Legend = () => {
  const statusItems = [
    { status: 'available', label: 'Available', color: 'bg-green-200 border-green-400' },
    { status: 'pending', label: 'Pending Approval', color: 'bg-yellow-200 border-yellow-400' },
    { status: 'approved', label: 'Booked', color: 'bg-red-200 border-red-400' },
    { status: 'waiting', label: 'Waitlist Request', color: 'bg-pink-200 border-pink-400' }
  ];

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold text-gray-800 mb-3">Status Legend</h3>
      <div className="space-y-2">
        {statusItems.map(item => (
          <div key={item.status} className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded border-2 ${item.color}`}></div>
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;