import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Payment Failed</h2>
      <p>Unfortunately, your payment was not successful. Please try again.</p>
      <button onClick={() => navigate("/payment")} className="btn btn-danger">Retry Payment</button>
    </div>
  );
};

export default PaymentFailed;
