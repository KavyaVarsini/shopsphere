const RevenueCard = ({ revenue }) => {
  return (
    <div style={styles.card}>
      <h3>Total Revenue</h3>
      <h1>₹ {revenue}</h1>
    </div>
  );
};

const styles = {
  card: {
    padding: "20px",
    background: "#0f172a",
    color: "#fff",
    borderRadius: "10px",
    width: "250px"
  }
};

export default RevenueCard;
