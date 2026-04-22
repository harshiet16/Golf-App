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
        if (subscription_status) updates.subscription_status = subscription_status; // Mocking subscription update mostly

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

// Admin Endpoints
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
