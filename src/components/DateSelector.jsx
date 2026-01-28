import { format } from 'date-fns';

const DateSelector = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 mx-auto max-w-md">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label htmlFor="start-date" className="block text-xs text-gray-600 mb-1">
            From
          </label>
          <input
            id="start-date"
            type="date"
            value={format(startDate, 'yyyy-MM-dd')}
            onChange={(e) => onStartDateChange(new Date(e.target.value))}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="end-date" className="block text-xs text-gray-600 mb-1">
            To
          </label>
          <input
            id="end-date"
            type="date"
            value={format(endDate, 'yyyy-MM-dd')}
            onChange={(e) => onEndDateChange(new Date(e.target.value))}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="text-[10px] text-gray-500 pb-1.5 whitespace-nowrap">
          Click map to search
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
