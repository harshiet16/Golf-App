const supabase = require('../config/supabase');

exports.getCharities = async (req, res) => {
    try {
        const { data: charities, error } = await supabase
            .from('charities')
            .select('*');

        if (error) {
            return res.status(500).json({ error: 'Failed to fetch charities' });
        }

        res.json(charities);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addCharity = async (req, res) => {
    try {
        const { name, description, image_url } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const { data: charity, error } = await supabase
            .from('charities')
            .insert([{ name, description, image_url }])
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: 'Failed to create charity' });
        }

        res.status(201).json(charity);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateCharity = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image_url } = req.body;

        const { data: charity, error } = await supabase
            .from('charities')
            .update({ name, description, image_url })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: 'Failed to update charity' });
        }

        res.json(charity);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
