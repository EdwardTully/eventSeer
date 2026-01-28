import { format } from 'date-fns';

const DateSelector = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  const containerStyle = {
    position: 'fixed',
    bottom: '16px',
    left: '16px',
    right: '16px',
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '12px',
    maxWidth: '490px',
    margin: '0 auto',
  };

  const flexContainerStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  };

  const inputGroupStyle = {
    flex: 1,
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    color: '#6B7280',
    marginBottom: '4px',
    fontWeight: '500',
  };

  const inputStyle = {
    width: '90%',
    padding: '6px 8px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none',
  };

  const hintStyle = {
    fontSize: '10px',
    color: '#9CA3AF',
    paddingBottom: '6px',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={containerStyle}>
      <div style={flexContainerStyle}>
        <div style={inputGroupStyle}>
          <label htmlFor="start-date" style={labelStyle}>
            From
          </label>
          <input
            id="start-date"
            type="date"
            value={format(startDate, 'yyyy-MM-dd')}
            onChange={(e) => onStartDateChange(new Date(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="end-date" style={labelStyle}>
            To
          </label>
          <input
            id="end-date"
            type="date"
            value={format(endDate, 'yyyy-MM-dd')}
            onChange={(e) => onEndDateChange(new Date(e.target.value))}
            style={inputStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
