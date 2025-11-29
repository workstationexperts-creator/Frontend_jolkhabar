import React, { useState, useEffect, useCallback } from 'react';

const ShipmentManager = ({ api, token }) => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchShipments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.getShipments(token);
            // The data from Shiprocket is nested under a 'data' property
            setShipments(response.data || []);
            setError(null); // Clear previous errors on success
        } catch (err) {
            setError(err.message || 'Could not fetch shipments from Shiprocket.');
            setShipments([]); // Clear shipments on error
        } finally {
            setLoading(false);
        }
    }, [api, token]);

    useEffect(() => {
        if (token) { // Only fetch if the admin is logged in
            fetchShipments();
        } else {
            setLoading(false);
            setError("Authentication token not found.");
        }
    }, [fetchShipments, token]); // Add token as a dependency

    if (loading) return <p>Loading live shipments from Shiprocket...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="admin-section">
            <h3 className="admin-section-title">Live Shipments</h3>
            <div className="shipment-list">
                {shipments.length === 0 ? (
                    <p>No shipments found in Shiprocket.</p>
                ) : (
                    shipments.map(shipment => (
                        <div key={shipment.id} className="shipment-card">
                            <div className="shipment-header">
                                <h4>Order #{shipment.channelOrderId || 'N/A'}</h4>
                                <span className={`shipment-status status-${(shipment.status || 'unknown').toLowerCase().replace(/\s+/g, '-')}`}>
                                    {shipment.status || 'Unknown'}
                                </span>
                            </div>
                            <div className="shipment-details">
                                <p><strong>Customer:</strong> {shipment.customerName || 'N/A'}</p>
                                <p><strong>Courier:</strong> {shipment.courier_name || 'Not Assigned'}</p>
                                <p><strong>AWB:</strong> {shipment.awb_code || 'Not Assigned'}</p>
                                <p><strong>Amount:</strong> ₹{shipment.amount || '0.00'}</p>
                                <p><strong>Est. Delivery:</strong> {shipment.etd || 'N/A'}</p>
                            </div>
                            <div className="shipment-footer">
                                <a 
                                    href={shipment.awb_code ? `https://shiprocket.co/tracking/${shipment.awb_code}` : '#'} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className={`button ${!shipment.awb_code ? 'disabled' : ''}`}
                                    // Prevent click if disabled
                                    onClick={(e) => !shipment.awb_code && e.preventDefault()} 
                                >
                                    Track Shipment
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ShipmentManager;

