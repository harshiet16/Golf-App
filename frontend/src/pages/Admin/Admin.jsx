import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Settings, Plus, PlayCircle, Trophy, BarChart3, Activity, Heart, Trash2 } from 'lucide-react';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [drawResults, setDrawResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [winners, setWinners] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [charities, setCharities] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchWinners();
        fetchAnalytics();
        fetchCharities();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    const fetchWinners = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/draws/winners', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWinners(res.data);
        } catch (err) {
            console.error("Failed to fetch winners", err);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/user/analytics', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalytics(res.data);
        } catch (err) {
            console.error("Failed to fetch analytics", err);
        }
    };

    const fetchCharities = async () => {
        try {
            const res = await axios.get('/api/charities');
            setCharities(res.data);
        } catch (err) {
            console.error("Failed to fetch charities", err);
        }
    };

    const handleRunDraw = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/draws/run', { type: 'random' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDrawResults(res.data);
            fetchWinners(); // Refresh winners
            alert("Draw executed successfully!");
        } catch (err) {
            alert(err.response?.data?.error || "Failed to run draw. It may have already run this month.");
        }
        setLoading(false);
    };

    const handleVerifyWinner = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/draws/winners/${id}/verify`, { status: 'paid' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchWinners();
        } catch(err) {
            alert('Failed to verify winner');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center"><Settings className="mr-3" /> Admin Control Center</h1>
                        <p className="text-slate-500">Manage users, draws, charities, and platform operations.</p>
                    </div>
                </div>

                {/* Analytics Widget */}
                {analytics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="text-slate-500 text-sm font-semibold mb-1 flex items-center"><Users size={16} className="mr-2"/> Total Users</div>
                            <div className="text-3xl font-bold text-slate-800">{analytics.totalUsers}</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="text-slate-500 text-sm font-semibold mb-1 flex items-center"><Activity size={16} className="mr-2 text-green-500"/> Subscriptions</div>
                            <div className="text-3xl font-bold text-slate-800">{analytics.activeSubscribers}</div>
                            <div className="text-xs font-medium text-green-600 mt-1">${analytics.totalRevenueMonthly}/mo Rev</div>
                        </div>
                        <div className="bg-gradient-to-br from-brand-900 flex-col to-brand-800 p-6 rounded-2xl shadow-sm border border-slate-100 text-white">
                            <div className="text-brand-100 text-sm font-semibold mb-1 flex items-center"><Heart size={16} className="mr-2 text-red-400"/> Monthly Charity Goal</div>
                            <div className="text-3xl font-bold">${parseFloat(analytics.totalCharityRaisedMonthly).toFixed(2)}</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="text-slate-500 text-sm font-semibold mb-1 flex items-center"><Trophy size={16} className="mr-2 text-yellow-500"/> Prizes Paid</div>
                            <div className="text-3xl font-bold text-slate-800">${analytics.totalPrizePool}</div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Draw execution */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="text-xl font-bold mb-2 flex items-center"><PlayCircle className="mr-2" /> Monthly Draw</h3>
                            <p className="text-brand-100 text-sm mb-6">Executes the algorithm across all active subscribers' recent 5 scores.</p>
                            <button 
                                onClick={handleRunDraw} disabled={loading}
                                className="w-full bg-brand-500 hover:bg-brand-400 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                            >
                                {loading ? "Running Simulation..." : "Execute Draw Now"}
                            </button>

                            {drawResults && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 bg-brand-950 p-4 rounded-xl text-sm border border-brand-800">
                                    <p className="font-semibold text-brand-100 mb-1">Results Generated</p>
                                    <p>Draw ID: <span className="font-mono text-xs">{drawResults.draw.id}</span></p>
                                    <p>Winners Picked: <b>{drawResults.winnersCount}</b></p>
                                </motion.div>
                            )}
                        </div>

                        {/* Summary Widget */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                                <Trophy className="text-brand-500 mr-2" size={20} /> Winner Approvals
                             </h3>
                             <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                {winners.length === 0 && <p className="text-sm text-slate-500">No pending winners.</p>}
                                {winners.map(w => (
                                    <div key={w.id} className="border border-slate-100 p-3 rounded-lg bg-slate-50 text-sm">
                                        <div className="flex justify-between font-bold text-slate-800">
                                            <span>{w.users?.name || 'Unknown'}</span>
                                            <span className="text-green-600">${w.prize}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mb-2">Draw: {w.draws?.month} | Match: {w.match_type} | Status: {w.status}</div>
                                        {w.proof_url ? (
                                            <div className="mt-2 text-xs">
                                                <a href={w.proof_url} target="_blank" rel="noreferrer" className="text-brand-500 hover:underline block mb-2 font-medium">View Proof Image</a>
                                                {w.status === 'pending' && <button onClick={() => handleVerifyWinner(w.id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded w-full font-bold">Verify & Mark Paid</button>}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-amber-600 font-semibold mt-2">Waiting for user to upload proof...</div>
                                        )}
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>

                    {/* User Management */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                                    <Users className="mr-2 text-brand-500" /> Platform Users
                                </h3>
                                <div className="text-sm bg-white px-3 py-1 rounded-full border border-slate-200 font-semibold text-slate-600">
                                    Total: {users.length}
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-100 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">User</th>
                                            <th className="px-6 py-4 font-semibold">Role</th>
                                            <th className="px-6 py-4 font-semibold">Subscription</th>
                                            <th className="px-6 py-4 font-semibold">Charity Split</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {users.map(u => (
                                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-800">{u.name}</div>
                                                    <div className="text-slate-500 text-xs">{u.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        u.subscription_status === 'active' ? 'bg-green-100 text-green-700' : 
                                                        u.subscription_status === 'expired' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {u.subscription_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 font-medium">
                                                    {parseFloat(u.charity_percentage).toFixed(0)}%
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-brand-600 hover:text-brand-800 font-semibold text-xs">Edit</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Charity Management Widget */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-8">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                                    <Heart className="mr-2 text-red-500" /> Platform Charities
                                </h3>
                                <button className="bg-brand-500 hover:bg-brand-600 text-white text-sm px-4 py-2 rounded-lg font-bold flex items-center">
                                    <Plus size={16} className="mr-1"/> Add Charity
                                </button>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {charities.map(c => (
                                    <div key={c.id} className="border border-slate-100 rounded-xl p-4 flex gap-4 bg-slate-50 relative group">
                                        <button className="absolute top-2 right-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                        <img src={c.image_url} alt={c.name} className="w-16 h-16 rounded-lg object-cover bg-slate-200" />
                                        <div>
                                            <h4 className="font-bold text-slate-800">{c.name}</h4>
                                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">{c.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Admin;
