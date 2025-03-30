import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import countryList from "../data/countries";
import { getCsrfToken } from "../api/csrf";
import "./Payment.css";

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cardFlipped, setCardFlipped] = useState<boolean>(false);
  const authToken = localStorage.getItem("authToken");

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;

    if (name === "card_number") {
      value = value.replace(/\D/g, "").slice(0, 16);
    }
    if (name === "expiry_date") {
      value = value.replace(/[^0-9/]/g, "").slice(0, 7);
    }
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
      setCardFlipped(value.length === 4);
    }
    if (name === "full_name") {
      setCardFlipped(value.length > 0);
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/payments/",
        { payment_method: paymentMethod, ...formData },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "X-CSRFToken": getCsrfToken(),
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.approval_url) {
        window.location.href = response.data.approval_url;
      } else if (response.data.success) {
        navigate("/payment-success");
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Verify Your Payment Method</h2>

       <div className="alert alert-info">
        <strong>To ensure a secure experience, we need to verify your payment method.</strong>
        A temporary authorization request may be sent to your bank. These preauthorization holds may appear on your statement for up to 7 days, but no funds will be transferred.
        <a href="/billing-info" className="text-primary">Learn more about billing.</a>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card p-4 shadow-lg">
        <h5>Select Payment Method</h5>
        <select className="form-control form-select-lg mb-3" onChange={handlePaymentMethodChange}>
          <option value="">-- Select Payment Method --</option>
          <option value="credit_card">💳 Credit Card</option>
          <option value="paystack">💰 Paystack</option>
          <option value="paypal">🅿 PayPal</option>
        </select>

        {paymentMethod === "credit_card" ? (
          <div className="credit-card-container">
            <div className={`credit-card ${cardFlipped ? "flipped" : ""}`}>
              <div className="front">
                <h5>**** **** **** {formData.card_number?.slice(-4) || "0000"}</h5>
                <p>Expiry: {formData.expiry_date || "MM/YYYY"}</p>
              </div>
              <div className="back">
                <p>{formData.full_name || "Cardholder Name"}</p>
                <p>CVV: {formData.cvv || "***"}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <label>Card Number</label>
                <input type="text" className="form-control" name="card_number" onChange={handleInputChange} placeholder="1234 5678 9012 3456" />
              </div>
              <div className="col-md-4">
                <label>Expiry Date (MM/YYYY)</label>
                <input type="text" className="form-control" name="expiry_date" onChange={handleInputChange} placeholder="MM/YYYY" />
              </div>
              <div className="col-md-4">
                <label>CVV</label>
                <input type="text" className="form-control" name="cvv" onChange={handleInputChange} placeholder="****" />
              </div>
            </div>

            <label>Full Name</label>
            <input type="text" className="form-control" name="full_name" onChange={handleInputChange} />

            <label>Country</label>
            <select className="form-control" name="country" onChange={handleInputChange}>
              <option value="">-- Select Country --</option>
              {countryList.map((country) => (
                <option key={country.code} value={country.code}>{country.name}</option>
              ))}
            </select>

            <label>Address</label>
            <input type="text" className="form-control" name="address" onChange={handleInputChange} />
          </div>
        ) : (
          <div className="payment-details">
            <label>Full Name</label>
            <input type="text" className="form-control" name="full_name" onChange={handleInputChange} />

            <label>Country</label>
            <select className="form-control" name="country" onChange={handleInputChange}>
              <option value="">-- Select Country --</option>
              {countryList.map((country) => (
                <option key={country.code} value={country.code}>{country.name}</option>
              ))}
            </select>

            <label>Address</label>
            <input type="text" className="form-control" name="address" onChange={handleInputChange} />
          </div>
        )}

        <button className="btn btn-success btn-block mt-3" onClick={handleSubmit} disabled={loading || !paymentMethod}>
          {loading ? "Processing..." : "Submit Payment"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
