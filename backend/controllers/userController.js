const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, role, subscription_status, charity_id, charity_percentage')
            .eq('id', userId)
            .single();

        if (error) {
            return res.status(500).json({ error: 'Failed to fetch user profile' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, charity_id, charity_percentage, password, subscription_status } = req.body;

        let updates = {};
        if (name) updates.name = name;
        if (charity_id !== undefined) updates.charity_id = charity_id;
        if (charity_percentage) updates.charity_percentage = charity_percentage;
        if (subscription_status) updates.subscription_status = subscription_status; 

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updates.password_hash = await bcrypt.hash(password, salt);
        }

        const { data: user, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select('id, name, email, role, subscription_status, charity_id, charity_percentage')
            .single();

        if (error) {
            return res.status(500).json({ error: 'Failed to update profile' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getMyWinners = async (req, res) => {
    try {
        const userId = req.user.id;
        const { data: winners, error } = await supabase
            .from('winners')
            .select(`
                id, match_type, prize, status, proof_url, created_at,
                draws ( month )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(500).json({ error: 'Failed to fetch winners' });
        }
        res.json(winners);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.uploadProof = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { proof_url } = req.body;

        const { data: winner, error } = await supabase
            .from('winners')
            .update({ proof_url })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: 'Failed to upload proof' });
        }

        res.json(winner);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, name, email, role, subscription_status, charity_id, charity_percentage, created_at');

        if (error) {
            return res.status(500).json({ error: 'Failed to fetch users' });
        }

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { subscription_status, role } = req.body;

        const { data: user, error } = await supabase
            .from('users')
            .update({ subscription_status, role })
            .eq('id', id)
            .select('id, name, email, role, subscription_status')
            .single();

        if (error) {
            return res.status(500).json({ error: 'Failed to update user' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
        const { data: activeUsers } = await supabase.from('users').select('subscription_status, charity_percentage').eq('subscription_status', 'active');
        const activeCount = activeUsers ? activeUsers.length : 0;
        const totalRevenue = activeCount * 10;
        let totalCharity = 0;
        if (activeUsers) {
            activeUsers.forEach(u => {
                totalCharity += (10 * ((u.charity_percentage || 10) / 100));
            });
        }
        const { data: winners } = await supabase.from('winners').select('prize');
        const totalPrizes = winners ? winners.reduce((sum, w) => sum + parseFloat(w.prize), 0) : 0;

        res.json({
            totalUsers: totalUsers || 0,
            activeSubscribers: activeCount,
            totalRevenueMonthly: totalRevenue,
            totalCharityRaisedMonthly: totalCharity,
            totalPrizePool: totalPrizes
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
