import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';


const RegisterPage = ({ api, setToken }) => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await api.register(formData);
            setToken(data.token);
            localStorage.setItem('authToken', data.token);
            navigate('/'); // Redirect to homepage on successful registration
        } catch (err) {
            setError('Registration failed. The email might already be in use.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form-container">
                <h2 className="page-title">Create Account</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-group">
                        <label htmlFor="firstname">First Name</label>
                        <input type="text" id="firstname" name="firstname" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">Last Name</label>
                        <input type="text" id="lastname" name="lastname" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="button auth-button">Register</button>
                </form>
                <div className="auth-extra">
                    Already have an account? <Link to="/login">Login</Link>
                </div>

            </div>
        </div>
    );
};

export default RegisterPage;
