import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
// import './LoginPage.css';

const LoginPage = ({ api, setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const data = await api.login(email, password);

            if (!data || !data.token) {
                throw new Error("Invalid response from server");
            }

            // Save token to state + localStorage
            setToken(data.token);
            localStorage.setItem("authToken", data.token);

            // Build a safe username
            const first = data.firstname ? data.firstname.trim() : "";
            const last = data.lastname ? data.lastname.trim() : "";
            const fullName = `${first} ${last}`.trim() || "User";

            // Store username only once
            localStorage.setItem("username", fullName);

            // Store full user object
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: data.id,
                    firstname: first,
                    lastname: last,
                    email: data.email,
                    role: data.role,
                })
            );

            // Role redirect
            switch (data.role) {
                case 'SUPER_ADMIN':
                    navigate('/super-admin-dashboard');
                    break;
                case 'ADMIN':
                    navigate('/admin-dashboard');
                    break;
                default:
                    navigate('/');
                    break;
            }

        } catch (err) {
            console.error(err);
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form-container">
                <h2 className="page-title">Login</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <p className="error-message">{error}</p>}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="button auth-button">
                        Login
                    </button>
                </form>
                <div className="auth-extra">
                    New here? <Link to="/register">Create Account</Link>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
