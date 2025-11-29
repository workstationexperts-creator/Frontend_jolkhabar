import React, { useState, useEffect, useCallback } from 'react';

const CategoryManager = ({ api, token, refreshCategories }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        bannerImageUrl: '',
        layoutType: 'SQUARE',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await api.getCategories();
            setCategories(data);
        } catch (err) {
            setError('Could not fetch categories.');
        }
    }, [api]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (category) => {
        setIsEditing(true);
        setEditingId(category.id);
        setFormData({
            name: category.name,
            description: category.description,
            imageUrl: category.imageUrl || '',
            bannerImageUrl: category.bannerImageUrl || '',
            layoutType: category.layoutType || 'SQUARE',
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ name: '', description: '', imageUrl: '', bannerImageUrl: '', layoutType: 'SQUARE' });
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (isEditing) {
                await api.updateCategory(editingId, formData, token);
            } else {
                await api.addCategory(formData, token);
            }
            resetForm();
            if (refreshCategories) {
                refreshCategories(); // This is all we need to refresh everything
            }
        } catch (err) {
            setError(err.message || 'Failed to save category.');
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category? This cannot be undone.')) {
            try {
                await api.deleteCategory(categoryId, token);
                if (refreshCategories) {
                    refreshCategories(); // This is all we need to refresh everything
                }
            } catch (err) {
                setError(err.message || 'Failed to delete category.');
            }
        }
    };

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h3 className="admin-section-title">Manage Categories</h3>
                {!showForm && <button onClick={() => { resetForm(); setShowForm(true); }} className="button">Add New Category</button>}
            </div>

            {error && <p className="error-message">{error}</p>}
            
            {showForm && (
                <form onSubmit={handleSubmit} className="admin-form">
                    <h4>{isEditing ? 'Edit Category' : 'Add New Category'}</h4>
                    <input type="text" name="name" placeholder="Category Name" value={formData.name} onChange={handleChange} required />
                    <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
                    <input type="text" name="imageUrl" placeholder="Homepage Image URL (for card)" value={formData.imageUrl} onChange={handleChange} />
                    <input type="text" name="bannerImageUrl" placeholder="Product Page Banner URL (optional)" value={formData.bannerImageUrl} onChange={handleChange} />
                    
                    <div className="form-group">
                        <label htmlFor="layoutType">Homepage Layout</label>
                        <select id="layoutType" name="layoutType" value={formData.layoutType} onChange={handleChange}>
                            <option value="SQUARE">Square Layout (1:1)</option>
                            <option value="WIDE">Wide Layout (Full Width)</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="button">{isEditing ? 'Save Changes' : 'Add Category'}</button>
                        <button type="button" onClick={resetForm} className="button-secondary">Cancel</button>
                    </div>
                </form>
            )}

            <div className="admin-list">
                <h4>Existing Categories</h4>
                {(categories || []).map(cat => (
                    <div key={cat.id} className="admin-list-item">
                        <span>{cat.name} ({cat.layoutType || 'SQUARE'})</span>
                        <div className="item-actions">
                            <button onClick={() => handleEditClick(cat)} className="button-edit">Edit</button>
                            <button onClick={() => handleDelete(cat.id)} className="button-danger">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryManager;

