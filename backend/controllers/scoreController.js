const supabase = require('../config/supabase');

exports.getScores = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: scores, error } = await supabase
            .from('scores')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(5);

        if (error) {
            return res.status(500).json({ error: 'Failed to fetch scores' });
        }

        res.json(scores);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addScore = async (req, res) => {
    try {
        const userId = req.user.id;
        const { score, date } = req.body;

        if (!score || !date) {
            return res.status(400).json({ error: 'Score and date are required' });
        }

        if (score < 1 || score > 45) {
            return res.status(400).json({ error: 'Score must be between 1 and 45' });
        }

        // Check if a score for this date already exists for this user
        const { data: existingScore } = await supabase
            .from('scores')
            .select('id')
            .eq('user_id', userId)
            .eq('date', date)
            .single();

        if (existingScore) {
            return res.status(400).json({ error: 'A score for this date already exists. You can edit it instead.' });
        }

        // Check current scores count
        const { data: currentScores, error: countError } = await supabase
            .from('scores')
            .select('id, date')
            .eq('user_id', userId)
            .order('date', { ascending: true }); // Oldest first

        if (countError) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (currentScores && currentScores.length >= 5) {
            // Delete the oldest score
            const oldestScoreId = currentScores[0].id;
            await supabase
                .from('scores')
                .delete()
                .eq('id', oldestScoreId);
        }

        // Insert new score
        const { data: newScore, error: insertError } = await supabase
            .from('scores')
            .insert([{ user_id: userId, score, date }])
            .select()
            .single();

        if (insertError) {
            return res.status(500).json({ error: insertError.message });
        }

        res.status(201).json(newScore);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteScore = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const { error } = await supabase
            .from('scores')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            return res.status(500).json({ error: 'Failed to delete score' });
        }

        res.json({ message: 'Score deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
