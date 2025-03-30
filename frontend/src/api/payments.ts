import axios from "axios";

export const initiatePayment = async (bookingId: string, paymentMethod: string, authToken: string | null) => {
  if (!authToken) throw new Error("User not authenticated");

  const response = await axios.post(
    `http://127.0.0.1:8000/api/payments/initiate/${bookingId}/`,
    { payment_method: paymentMethod },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
