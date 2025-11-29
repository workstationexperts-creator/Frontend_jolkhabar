import React, { useState, useEffect, useCallback } from 'react';

const ProductManager = ({ api, token }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false); // New state to control form visibility

    // State for the form, including edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        categoryId: '',
    });

    const fetchProducts = useCallback(async () => {
        try {
            const data = await api.getAllProducts();
            setProducts(data);
        } catch (err) {
            setError('Could not fetch products.');
        }
    }, [api]);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await api.getCategories();
            setCategories(data);
            if (data.length > 0 && !formData.categoryId) {
                setFormData(prev => ({ ...prev, categoryId: data[0].id }));
            }
        } catch (err) {
            setError('Could not fetch categories.');
        }
    }, [api, formData.categoryId]);

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchProducts(), fetchCategories()]).finally(() => setLoading(false));
    }, [fetchProducts, fetchCategories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentProductId(null);
        setShowForm(false); // Hide the form on cancel or submit
        setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            imageUrl: '',
            categoryId: categories[0]?.id || '',
        });
        setError(null);
    };

    const handleAddNewClick = () => {
        setIsEditing(false); // Ensure we are not in edit mode
        setFormData({ // Clear the form for the new entry
            name: '',
            description: '',
            price: '',
            stock: '',
            imageUrl: '',
            categoryId: categories[0]?.id || '',
        });
        setShowForm(true); // Show the form
        window.scrollTo(0, 0);
    };

    const handleEditClick = (product) => {
        setIsEditing(true);
        setCurrentProductId(product.id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl,
            categoryId: product.categoryId,
        });
        setShowForm(true); // Show the form for editing
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            categoryId: parseInt(formData.categoryId)
        };

        try {
            if (isEditing) {
                await api.updateProduct(currentProductId, productData, token);
            } else {
                await api.addProduct(productData, token);
            }
            resetForm(); // This will now hide the form and clear it
            await fetchProducts(); // Refresh the product list
        } catch (err) {
            setError(isEditing ? 'Failed to update product.' : 'Failed to add product.');
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.deleteProduct(productId, token);
                await fetchProducts(); // Refresh the product list
            } catch (err) {
                setError('Failed to delete product.');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-section">
            {showForm && (
                <>
                    <h3 className="admin-section-title">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                    <form onSubmit={handleSubmit} className="admin-form product-form">
                        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
                        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
                        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} step="0.01" required />
                        <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
                        <input type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} required />
                        <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                            <option value="" disabled>Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <div className="form-actions">
                            <button type="submit" className="button">{isEditing ? 'Update Product' : 'Add Product'}</button>
                            <button type="button" onClick={resetForm} className="button secondary-button">Cancel</button>
                        </div>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                </>
            )}
            
            <div className="list-header">
                <h3 className="list-title">Existing Products</h3>
                {!showForm && (
                    <button onClick={handleAddNewClick} className="button">Add New Product</button>
                )}
            </div>
            <div className="admin-list">
                {products.map(product => (
                    <div key={product.id} className="admin-list-item">
                        <span>{product.name}</span>
                        <div className="item-actions">
                           <button onClick={() => handleEditClick(product)} className="button edit-button">Edit</button>
                           <button onClick={() => handleDelete(product.id)} className="button delete-button">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductManager;

