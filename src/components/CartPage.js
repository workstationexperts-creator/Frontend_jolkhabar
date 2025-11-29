// src/components/CartPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
import axiosInstance from "../api/axiosInstance"; // ✅ global axios with baseURL

const CartPage = ({ api, token }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemErrors, setItemErrors] = useState({});
  const navigate = useNavigate();

  // ✅ Fetch cart items
  const fetchCart = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Please log in to view your cart.");
      return;
    }
    try {
      setLoading(true);
      const data = await api.getCart(token);
      setCart(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, api]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ✅ Update quantity
  const handleQuantityChange = async (productId, newQuantity) => {
    setItemErrors((prev) => ({ ...prev, [productId]: null }));
    try {
      const updatedCart = await api.updateItemQuantity(
        productId,
        newQuantity,
        token
      );
      setCart(updatedCart);
    } catch (err) {
      setItemErrors((prev) => ({
        ...prev,
        [productId]: err.message || "Failed to update quantity.",
      }));
    }
  };

  // ✅ Remove item
  const handleRemoveItem = async (productId) => {
    setItemErrors((prev) => ({ ...prev, [productId]: null }));
    try {
      const updatedCart = await api.removeItemFromCart(productId, token);
      setCart(updatedCart);
    } catch (err) {
      setItemErrors((prev) => ({
        ...prev,
        [productId]: err.message || "Failed to remove item.",
      }));
    }
  };

  // ✅ Razorpay Checkout (fully synced with backend)
  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      // Step 1️⃣: Create local order in backend
      const { data: localOrder } = await axiosInstance.post(
        "/orders/place",
        {
          recipientName: "Online Buyer",
          phoneNumber: "9999999999",
          street: "Online Order",
          city: "Auto",
          state: "Auto",
          postalCode: "000000",
          country: "India",
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Local order created:", localOrder);

      // Step 2️⃣: Create Razorpay order linked to local order
      const { data: orderData } = await axiosInstance.post(
        "/payment/create-order",
        { orderId: localOrder.id },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Razorpay order created:", orderData);

      // Step 3️⃣: Configure Razorpay popup
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Jolkhabar",
        description: "Order Payment",
        order_id: orderData.orderId,
        handler: async function (response) {
          console.log("✅ Payment Success:", response);

          try {
            // Step 4️⃣: Verify payment + auto-create shipment
            const verifyRes = await axiosInstance.post(
              "/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                withCredentials: true,
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json", // ✅ critical fix
                },
              }
            );

            console.log("🚚 Payment verified & shipment created:", verifyRes.data);
            alert("✅ Payment successful! Your order is being processed.");
            navigate("/order-success");
          } catch (verifyErr) {
            console.error("❌ Payment verification failed:", verifyErr);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "Online Buyer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        console.error("❌ Payment Failed:", response.error);
        alert("Payment failed. Please try again.");
      });
    } catch (err) {
      console.error("❌ Payment initialization failed:", err);
      alert("Unable to start payment. Please try again later.");
    }
  };

  // ✅ UI Rendering
  if (loading) return <div className="loading-message">Loading cart...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container page-content">
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container page-content">
      <h2 className="page-title">Your Shopping Cart</h2>

      <div className="cart-container">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-details">
                <h3 className="item-name">{item.productName}</h3>
                <p className="item-price">₹{item.price.toFixed(2)}</p>
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.productId, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.productId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                {itemErrors[item.productId] && (
                  <p className="cart-item-error">{itemErrors[item.productId]}</p>
                )}
              </div>
              <div className="cart-item-actions">
                <p className="item-total">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Total</span>
            <span>₹{cart.totalPrice.toFixed(2)}</span>
          </div>
          <button onClick={() => navigate("/checkout")} className="button checkout-btn">
            Proceed to Pay
          </button>

        </div>
      </div>
    </div>
  );
};

export default CartPage;
