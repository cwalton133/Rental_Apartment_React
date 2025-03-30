import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const transactionId = searchParams.get("transaction_id");

      if (!transactionId) {
        navigate("/payment-failed");
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/payments/verify/?transaction_id=${transactionId}`
        );

        if (response.data.success) {
          navigate("/dashboard"); // Redirect user after successful payment
        } else {
          navigate("/payment-failed");
        }
      } catch (error) {
        console.error("Payment verification failed", error);
        navigate("/payment-failed");
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return <h2>Verifying Payment...</h2>;
};

export default PaymentSuccess;
