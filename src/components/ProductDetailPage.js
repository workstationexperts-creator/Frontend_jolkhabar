import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetailPage.css'; // Make sure to import the CSS

const ProductDetailPage = ({ api, token }) => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await api.getProductById(productId);
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [api, productId]);

    const handleAddToCart = async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            await api.addToCart(product.id, quantity, token);
            setSuccessMessage(`${quantity} x ${product.name} added to cart!`);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to add to cart.');
        }
    };

    if (loading) return <div className="loading-message">Loading product...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    if (!product) return <div className="container page-content"><p>Product not found.</p></div>;

    // This JSX now matches your new CSS classes
    return (
        <div className="product-container">
            <div className="image-section">
                <img src={product.imageUrl || 'https://placehold.co/600x600/f0f0f0/333?text=No+Image'} alt={product.name} />
            </div>
            <div className="details-section">
                <h1>{product.name}</h1>
                <p className="product-price">₹{product.price.toFixed(2)}</p>
                <div className="stars">
                    {/* Placeholder for star ratings */}
                    <span>★★★★☆</span>
                </div>
                <p className="description">{product.description}</p>
                
                {/* This section can be used if you add a 'features' field to your product model */}
                {/* <ul className="features">
                    <li>Feature one</li>
                    <li>Feature two</li>
                    <li>Feature three</li>
                </ul> */}
                
                <div className="product-actions">
                    <div className="quantity-selector">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)}>+</button>
                    </div>
                    <button onClick={handleAddToCart} className="button add-to-cart-btn">Add to Cart</button>
                </div>
                {successMessage && <p className="success-message">{successMessage}</p>}
                 {/* This button corresponds to your .check-availability class if needed */}
                {/* <button className="check-availability">Check Availability</button> */}
            </div>
        </div>
    );
};

export default ProductDetailPage;

