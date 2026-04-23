import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, TrendingUp, Heart, Trophy, Trash2, Edit3 } from 'lucide-react';

const Dashboard = () => {
    const { user, checkAuthStatus, logout } = useAuth();
    const navigate = useNavigate();
    const [scores, setScores] = useState([]);
    const [newScore, setNewScore] = useState('');
    const [scoreDate, setScoreDate] = useState(new Date().toISOString().substring(0, 10));
    const [editScoreId, setEditScoreId] = useState(null);
    const [error, setError] = useState(null);
    const [winners, setWinners] = useState([]);
    const [proofUploadUrl, setProofUploadUrl] = useState('');

    useEffect(() => {
        fetchScores();
        fetchWinners();
    }, []);

    const fetchScores = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/scores', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setScores(res.data);
        } catch (err) {
            console.error("Failed to fetch scores", err);
        }
    };

    const fetchWinners = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/user/winners', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWinners(res.data);
        } catch (err) {
            console.error("Failed to fetch winners", err);
        }
    };

    const handleAddScore = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (editScoreId) {
                await axios.put(`/api/scores/${editScoreId}`, 
                    { score: parseInt(newScore) },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setEditScoreId(null);
            } else {
                await axios.post('/api/scores', 
                    { score: parseInt(newScore), date: scoreDate },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            setNewScore('');
            setScoreDate(new Date().toISOString().substring(0, 10));
            fetchScores();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to save score");
        }
    };

    const handleDeleteScore = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/scores/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchScores();
        } catch(err) {
            alert('Failed to delete score');
        }
    };

    const triggerEditScore = (score) => {
        setEditScoreId(score.id);
        setNewScore(score.score.toString());
        setScoreDate(score.date);
    };

    const handleSubscribeMock = async (planType) => {

        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/user/profile', 
                { subscription_status: 'active' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            checkAuthStatus(); 
            alert(`Subscription to ${planType} successful!`);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUploadProof = async (winnerId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/user/winners/${winnerId}/proof`, 
                { proof_url: proofUploadUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProofUploadUrl('');
            fetchWinners();
            alert("Proof uploaded successfully!");
        } catch(err) {
            alert("Failed to upload proof");
        }
    };

    const totalWinnings = winners.reduce((sum, w) => sum + parseFloat(w.prize), 0).toFixed(2);
    const pendingWins = winners.filter(w => w.status === 'pending');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {}
            <nav className="bg-white border-b border-slate-200 px-6 md:px-12 py-4 flex justify-between items-center mb-8">
                <div className="font-extrabold text-2xl text-brand-900 tracking-tight">Impact<span className="text-brand-500">Play</span></div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600 hidden sm:inline-block">Hi, {user?.name}</span>
                    <button 
                        onClick={handleLogout} 
                        className="text-sm text-red-600 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 transition-colors px-4 py-2 rounded-lg font-semibold"
                    >
                        Log out
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto space-y-8 px-6 md:px-12 pb-12">

                {}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
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
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button onClick={() => handleSubscribeMock('Monthly')} className="bg-white text-brand-600 font-bold py-3 px-6 rounded-xl hover:bg-brand-50 transition-colors shadow-sm whitespace-nowrap">
                                Subscribe Monthly ($10/mo)
                            </button>
                            <button onClick={() => handleSubscribeMock('Yearly')} className="bg-brand-800 text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-900 transition-colors shadow-sm whitespace-nowrap border border-brand-700">
                                Subscribe Yearly ($100/yr)
                            </button>
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {}
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
                                    <label className="text-xs text-slate-500 uppercase font-semibold mb-1 block">Date {editScoreId && "(cannot change on edit)"}</label>
                                    <input 
                                        type="date" required disabled={!!editScoreId}
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none disabled:bg-slate-100"
                                        value={scoreDate} onChange={(e) => setScoreDate(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <button disabled={user?.subscription_status !== 'active'} type="submit" className="w-full sm:w-auto bg-slate-900 text-white font-semibold p-3 px-8 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors">
                                        {editScoreId ? 'Update' : 'Save'}
                                    </button>
                                    {editScoreId && (
                                        <button type="button" onClick={() => { setEditScoreId(null); setNewScore(''); setScoreDate(new Date().toISOString().substring(0, 10)); }} className="p-3 px-4 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50">Cancel</button>
                                    )}
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
                                            <div className="flex items-center gap-3">
                                                {index === 0 && <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded font-semibold tracking-wide mr-2">LATEST</span>}
                                                <button onClick={() => triggerEditScore(score)} className="text-slate-400 hover:text-blue-500 transition-colors tooltip" title="Edit Score">
                                                    <Edit3 size={18} />
                                                </button>
                                                <button onClick={() => handleDeleteScore(score.id)} className="text-slate-400 hover:text-red-500 transition-colors tooltip" title="Delete Score">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {}
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
                            <p className="text-slate-300 text-sm mb-4">You have earned ${totalWinnings} in total prizes from matches.</p>

                            {pendingWins.length > 0 && (
                                <div className="mt-4 bg-white/10 p-4 rounded-xl text-left">
                                    <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-2">Pending Wins ({pendingWins.length})</p>
                                    <div className="space-y-3">
                                        {pendingWins.map(win => (
                                            <div key={win.id} className="text-sm">
                                                <div className="mb-2">Match: {win.match_type} | Prize: ${win.prize}</div>
                                                {!win.proof_url ? (
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="text" placeholder="Proof Image URL..." 
                                                            className="w-full text-xs p-2 rounded text-slate-900 focus:outline-none"
                                                            value={proofUploadUrl} onChange={e => setProofUploadUrl(e.target.value)}
                                                        />
                                                        <button onClick={() => handleUploadProof(win.id)} className="bg-brand-500 text-white px-3 rounded font-bold hover:bg-brand-400">Send</button>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs bg-slate-800 p-2 rounded text-slate-300 border border-slate-700">Proof submitted. Awaiting Admin verification.</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
