import React, { useState } from "react";
import axios from "axios";
import "./TrackOrderPage.css";

const TrackOrderPage = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError("Please enter your order number.");
      return;
    }
    setError("");
    setLoading(true);
    setTrackingData(null);

    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/orders/track/${orderNumber}`
      );
      setTrackingData(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to fetch order details. Please check your order number."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="track-container">
      <div className="track-box">
        <h2>Track Your Order</h2>
        <form onSubmit={handleTrackOrder}>
          <input
            type="text"
            placeholder="Enter your order number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Track Order"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {trackingData && (
          <div className="tracking-result">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> {trackingData.orderNumber}</p>
            <p><strong>Status:</strong> {trackingData.status}</p>
            {trackingData.trackingUrl ? (
              <>
                <p><strong>AWB:</strong> {trackingData.awb}</p>
                <p>
                  <strong>Tracking Link:</strong>{" "}
                  <a
                    href={trackingData.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Track on Shiprocket
                  </a>
                </p>
              </>
            ) : (
              <p>{trackingData.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
