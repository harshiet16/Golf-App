import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', charity_id: '', charity_percentage: 10 });
    const [charities, setCharities] = useState([]);
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/charities')
            .then(res => setCharities(res.data))
            .catch(err => console.error("Could not fetch charities", err));
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (formData.charity_percentage < 10) {
            return setError('Minimum contribution to charity is 10%');
        }
        try {
            const res = await axios.post('/api/auth/signup', formData);
            login(res.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-brand-900 mb-2">Join the Movement</h2>
                    <p className="text-slate-500">Play, win, and give back to causes you care about.</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input 
                            type="text" name="name" 
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="email" name="email" 
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input 
                            type="password" name="password" 
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            onChange={handleChange} required
                        />
                    </div>

                    <div className="p-4 bg-brand-50 rounded-lg border border-brand-100">
                        <h4 className="font-semibold text-brand-900 mb-3">Charity Contribution</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select A Charity</label>
                                <select 
                                    name="charity_id" 
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                                    onChange={handleChange} required
                                >
                                    <option value="">-- Select a Charity --</option>
                                    {charities.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Contribution Percentage (%)</label>
                                <input 
                                    type="number" name="charity_percentage" min="10" max="100"
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    value={formData.charity_percentage} onChange={handleChange} required
                                />
                                <p className="text-xs text-slate-500 mt-1">Minimum 10% of subscription goes to charity.</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-brand-600 text-white font-semibold p-3 pos rounded-lg mt-4 hover:bg-brand-500 transition-colors"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Log in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
