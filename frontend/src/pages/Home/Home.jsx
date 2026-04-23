import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trophy, Activity, ArrowRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            {}
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold tracking-tight text-slate-900 border-b-2 border-brand-500 pb-1">
                    Impact<span className="text-brand-500">Play</span>
                </div>
                <div className="space-x-4">
                    <Link to="/login" className="text-slate-600 font-medium hover:text-slate-900">Log in</Link>
                    <Link to="/signup" className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-slate-800 transition-colors">Get Started</Link>
                </div>
            </nav>

            {}
            <section className="container mx-auto px-6 py-16 md:py-32 text-center max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="inline-block bg-brand-50 text-brand-700 px-4 py-2 rounded-full font-semibold tracking-wide text-sm mb-6 border border-brand-100">
                        A new way to give back.
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-8">
                        Every Score Makes A <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-accent-blue">Difference.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Track your performance. Join exclusive monthly prize pools. Empower charities worldwide by simply subscribing to your passion.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/signup" className="bg-brand-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-500 transition-colors shadow-lg shadow-brand-500/30 flex items-center justify-center">
                            Join The Movement <ArrowRight className="ml-2" size={20} />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {}
            <section className="bg-slate-50 py-24">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center"
                        >
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Direct Impact</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Choose your charity. A minimum of 10% of your subscription goes directly to funding life-changing initiatives.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center relative origin-top z-10 md:-translate-y-8"
                        >
                            <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Trophy size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Win Together</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Enter your scores. Engage in our algorithmic monthly draws. Match your scores and win huge rewards.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center"
                        >
                            <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Activity size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Track Progress</h3>
                            <p className="text-slate-500 leading-relaxed">
                                We keep your last 5 scores. See how you evolve while continuously contributing to a better world.
                            </p>
                        </motion.div>

                    </div>
                </div>
            </section>

            {}
            <footer className="bg-slate-900 py-12 text-center text-slate-400">
                 <p>&copy; 2026 ImpactPlay Platform. Building a better world, one score at a time.</p>
            </footer>
        </div>
    );
};

export default Home;
