import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Charities = () => {
    const [charities, setCharities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCharities = async () => {
            try {
                const res = await axios.get('/api/charities');
                setCharities(res.data);
            } catch (err) {
                console.error("Failed to fetch charities", err);
            }
        };
        fetchCharities();
    }, []);

    const filteredCharities = charities.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <nav className="border-b border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-extrabold text-brand-900 tracking-tight">Impact<span className="text-brand-500">Play</span></Link>
                    <div className="hidden md:flex gap-8 font-semibold text-sm">
                        <Link to="/" className="text-slate-600 hover:text-brand-500 transition-colors tracking-wide">The Platform</Link>
                        <Link to="/charities" className="text-brand-500 transition-colors tracking-wide">Our Charities</Link>
                    </div>
                    <Link to="/login" className="bg-slate-900 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-slate-800 transition-colors shadow-sm">Sign In</Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 font-bold text-sm tracking-wide mb-6">
                        <Heart size={16} className="text-red-500 fill-red-500" />
                        Impact First
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                        The causes we <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-700">champion.</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-slate-500 leading-relaxed">
                        Every swing drives change. Explore the charities supported by our player network. A portion of every subscription goes directly to the foundation of your choice.
                    </motion.p>
                </div>

                <div className="mb-12 relative max-w-xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm shadow-sm transition-shadow"
                        placeholder="Search charities by name or cause..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCharities.length === 0 && (
                        <div className="col-span-full text-center text-slate-500 py-12">No charities found matching your search.</div>
                    )}
                    {filteredCharities.map((charity, i) => (
                        <motion.div 
                            key={charity.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group flex flex-col"
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <h3 className="absolute bottom-4 left-6 right-6 text-xl font-bold text-white leading-tight">{charity.name}</h3>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{charity.description}</p>
                                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Partner</span>
                                    <Link to="/signup" className="text-brand-500 font-bold text-sm hover:text-brand-700 transition-colors flex items-center gap-1">
                                        Support <ExternalLink size={14} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Charities;
