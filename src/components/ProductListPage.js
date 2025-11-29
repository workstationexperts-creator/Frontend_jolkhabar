import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductListPage.css';

const ProductListPage = ({ api }) => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null); // State for category details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                // Fetch both category details and products at the same time
                const [categoryData, productsData] = await Promise.all([
                    api.getCategoryById(categoryId),
                    api.getProductsByCategory(categoryId)
                ]);
                setCategory(categoryData);
                setProducts(productsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPageData();
    }, [categoryId, api]);

    if (loading) return <div className="loading-message">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="container page-content">
            {/* This is the new banner section */}
            {category && category.bannerImageUrl && (
                <div className="product-page-banner">
                    <img
                        src={category.bannerImageUrl}
                        alt={`${category.name} Banner`}
                        className="banner-image"
                    />
                </div>
            )}
            
            {/* <h2 className="page-title">{category ? category.name : 'Products'}</h2> */}

            <div className="product-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <Link to={`/product/${product.id}`}>
                            <img src={product.imageUrl || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'} alt={product.name} className="product-image" />
                        </Link>
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">₹{product.price.toFixed(2)}</p>
                            <Link to={`/product/${product.id}`} className="button view-details-btn">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductListPage;

