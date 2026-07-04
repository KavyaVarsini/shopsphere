import "../styles/topCustomers.css"; // Import CSS

const TopCustomers = ({ customers }) => {
  if (!customers || customers.length === 0) {
    return (
      <div className="empty-state-container">
        <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="empty-state-text">No customer data available</p>
      </div>
    );
  }

  return (
    <div className="top-customers-container">
      <div className="customers-list">
        {customers.map((c, i) => (
          <div key={i} className="customer-rank-item">
            <div className="customer-rank-left">
              <div className={`rank-badge ${i === 0 ? 'rank-badge-1' : i === 1 ? 'rank-badge-2' : i === 2 ? 'rank-badge-3' : ''}`}>
                {i + 1}
              </div>
              <span className="customer-name-text">{c.name}</span>
            </div>
            <div className="customer-amount-text">₹ {c.totalSpent.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCustomers;