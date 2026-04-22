import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, TrendingUp, Heart, Trophy, CreditCard } from 'lucide-react';

const Dashboard = () => {
    const { user, checkAuthStatus } = useAuth();
    const [scores, setScores] = useState([]);
    const [newScore, setNewScore] = useState('');
    const [scoreDate, setScoreDate] = useState(new Date().toISOString().substring(0, 10));
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchScores();
    }, []);

    const fetchScores = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/scores', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setScores(res.data);
        } catch (err) {
            console.error("Failed to fetch scores", err);
        }
    };

    const handleAddScore = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/scores', 
                { score: parseInt(newScore), date: scoreDate },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewScore('');
            fetchScores();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to add score");
        }
    };

    const handleSubscribeMock = async () => {
        // Mocking the behavior of subscribing
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/user/profile', 
                { subscription_status: 'active' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            checkAuthStatus(); // refresh user
            alert("Subscription successful!");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header Profile Summary */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name}</h1>
                        <p className="text-slate-500">Your hub for impact and performance.</p>
                    </div>
                </div>

                {user?.subscription_status !== 'active' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-brand-500 rounded-2xl p-8 text-white flex flex-col md:flex-row justify-between items-center shadow-lg"
                    >
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-2xl font-bold mb-2">Unlock the Draw & Charity</h3>
                            <p className="text-brand-50 max-w-xl">You need an active subscription to participate in the monthly draws and support your selected charity. 10% or more goes directly to your cause.</p>
                        </div>
                        <button onClick={handleSubscribeMock} className="bg-white text-brand-600 font-bold py-3 px-6 rounded-xl hover:bg-brand-50 transition-colors shadow-sm whitespace-nowrap">
                            Subscribe Now - $10/mo
                        </button>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Score Entry & History (2 columns) */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center mb-6">
                                <TrendingUp className="mr-2 text-brand-500" /> Enter New Score
                            </h3>
                            {error && <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}
                            <form onSubmit={handleAddScore} className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 uppercase font-semibold mb-1 block">Score (1-45 Stableford)</label>
                                    <input 
                                        type="number" min="1" max="45" required
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                        value={newScore} onChange={(e) => setNewScore(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 uppercase font-semibold mb-1 block">Date</label>
                                    <input 
                                        type="date" required
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                        value={scoreDate} onChange={(e) => setScoreDate(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button disabled={user?.subscription_status !== 'active'} type="submit" className="w-full sm:w-auto bg-slate-900 text-white font-semibold p-3 px-8 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors">
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center mb-6">
                                <Calendar className="mr-2 text-brand-500" /> Recent Scores <span className="ml-2 text-xs font-normal text-slate-400">Rolling 5</span>
                            </h3>
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {scores.length === 0 && <p className="text-slate-500">No scores recorded yet.</p>}
                                    {scores.map((score, index) => (
                                        <motion.div 
                                            key={score.id}
                                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-brand-600 shadow-sm border border-slate-100">
                                                    {score.score}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700">Stableford Points</p>
                                                    <p className="text-sm text-slate-500">{new Date(score.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            {index === 0 && <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded font-semibold tracking-wide">LATEST</span>}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Overview (1 column) */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Your Impact</h3>
                            <p className="text-sm text-slate-500 mb-4">You are donating {user?.charity_percentage}% of your subscription to Charity ID: {user?.charity_id || 'None'}</p>
                            <button className="text-sm border border-slate-200 font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors w-full">Change Charity</button>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-sm p-6 text-white text-center">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-yellow-400">
                                <Trophy size={32} />
                            </div>
                            <h3 className="text-lg font-bold mb-1">Winnings Overview</h3>
                            <p className="text-slate-300 text-sm mb-4">You have earned $0.00 in total prizes from matches.</p>
                            <button className="text-sm bg-white/10 font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-colors w-full">View History</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
