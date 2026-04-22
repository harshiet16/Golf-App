import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Settings, Plus, PlayCircle, Trophy } from 'lucide-react';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [drawResults, setDrawResults] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    const handleRunDraw = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/draws/run', { type: 'random' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDrawResults(res.data);
            alert("Draw executed successfully!");
        } catch (err) {
            alert(err.response?.data?.error || "Failed to run draw. It may have already run this month.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center"><Settings className="mr-3" /> Admin Control Center</h1>
                        <p className="text-slate-500">Manage users, draws, and platform operations.</p>
                    </div>
                </div>

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
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                             <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center">
                                <Trophy className="text-brand-500 mr-2" size={20} /> Verify Winners
                             </h3>
                             <p className="text-slate-500 text-sm font-medium">Coming soon: Upload verification UI and manual approval tracking.</p>
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
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Admin;
