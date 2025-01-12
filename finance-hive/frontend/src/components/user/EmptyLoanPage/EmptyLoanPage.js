import React from "react";
import { Link } from "react-router-dom";

const EmptyLoanPage = ({ userId }) => {
  return (
    <div style={styles.container}>
      <p style={styles.text}>
        You don't have taken any loans <br />
        click the <strong>money-matters</strong> to apply for a Loan
      </p>
      <img
        src="https://via.placeholder.com/100"
        alt="No loans"
        style={styles.image}
      />
      <Link
        to={`/money-matters`}
        style={styles.link}
      >
        Go to Money Matters
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f3f3f3",
  },
  text: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "18px",
    color: "#333",
  },
  image: {
    marginBottom: "20px",
    width: "100px",
    height: "100px",
  },
  link: {
    textDecoration: "none",
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    fontWeight: "bold",
  },
};

export default EmptyLoanPage;
