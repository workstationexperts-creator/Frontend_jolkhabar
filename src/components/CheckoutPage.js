// src/components/CheckoutPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

const CheckoutPage = ({ api, token }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localOrder, setLocalOrder] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    recipientName: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/orders/place",
        address,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLocalOrder(data);
      console.log("✅ Local order created:", data);
      setStep(2);
    } catch (error) {
      console.error("❌ Error creating local order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateRazorpayOrder = async (localOrderId) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/payment/create-order",
        { orderId: localOrderId },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("✅ Razorpay order created:", data);
      return data;
    } catch (error) {
      console.error("❌ Error creating Razorpay order:", error);
      alert("Failed to create Razorpay order.");
      throw error;
    }
  };

  const openRazorpayPopup = async (orderData) => {
    return new Promise((resolve, reject) => {
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Jolkhabar",
        description: "Secure Payment",
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:8080/api/v1/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            console.log("✅ Payment verified:", verifyRes.data);
            setPaymentResult(verifyRes.data);
            setStep(3);
            resolve(verifyRes.data);
          } catch (err) {
            console.error("❌ Payment verification failed:", err);
            alert("Payment verification failed.");
            reject(err);
          }
        },
        theme: { color: "#528FF0" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const razorpayOrder = await handleCreateRazorpayOrder(localOrder.id);
      await openRazorpayPopup(razorpayOrder);
    } catch (err) {
      console.error("❌ Payment process failed:", err);
      alert("Payment could not be completed.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Step 3: Success screen
  const renderSuccess = () => (
    <div className="success-message">
      <h2>🎉 Payment Successful!</h2>
      <p>Your order has been placed and your shipment is being processed.</p>
      {paymentResult?.trackingUrl && (
        <p>
          <a
            href={paymentResult.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Track your order here
          </a>
        </p>
      )}
      <button
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/")}
      >
        Return to Home
      </button>
    </div>
  );

  return (
    <div className="checkout-form-container">
      {step === 1 && (
        <>
          <h2>Shipping Information</h2>
          <form className="checkout-form">
            <input name="recipientName" placeholder="Full Name" onChange={handleChange} />
            <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
            <input name="street" placeholder="Street Address" onChange={handleChange} />
            <input name="city" placeholder="City" onChange={handleChange} />
            <input name="state" placeholder="State" onChange={handleChange} />
            <input name="postalCode" placeholder="Postal Code" onChange={handleChange} />
            <input name="country" placeholder="Country" onChange={handleChange} />

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing ? "Creating Order..." : "Confirm Address"}
            </button>
          </form>
        </>
      )}

      {step === 2 && localOrder && (
        <>
          <h2>Confirm Your Order</h2>
          <div className="checkout-form">
            <p><strong>Name:</strong> {address.recipientName}</p>
            <p><strong>Phone:</strong> {address.phoneNumber}</p>
            <p>
              <strong>Address:</strong> {address.street}, {address.city},{" "}
              {address.state} - {address.postalCode}, {address.country}
            </p>
            <p><strong>Total Price:</strong> ₹{localOrder.totalPrice}</p>

            <div style={{ display: "flex", gap: "1rem", gridColumn: "1 / -1" }}>
              <button onClick={() => setStep(1)}>Back</button>
              <button onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? "Processing Payment..." : "Proceed to Pay"}
              </button>
            </div>
          </div>
        </>
      )}

      {step === 3 && renderSuccess()}
    </div>
  );
};

export default CheckoutPage;
