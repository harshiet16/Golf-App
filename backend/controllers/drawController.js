const supabase = require('../config/supabase');

const generateRandomNumbers = () => {
    const nums = [];
    while(nums.length < 5) {
        const r = Math.floor(Math.random() * 45) + 1;
        if(nums.indexOf(r) === -1) nums.push(r);
    }
    return nums;
};

exports.runDraw = async (req, res) => {
    try {
        const { type } = req.body; // 'random' or 'algorithmic'
        const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM

        // Check if draw already ran for this month
        const { data: existingDraw } = await supabase
            .from('draws')
            .select('id')
            .eq('month', currentMonth)
            .single();

        if (existingDraw) {
            return res.status(400).json({ error: 'Draw already ran for this month.' });
        }

        const winningNumbers = generateRandomNumbers(); // Always random for now

        // Create draw entry
        const { data: draw, error: drawError } = await supabase
            .from('draws')
            .insert([{ month: currentMonth, numbers: winningNumbers, type: type || 'random', status: 'completed' }])
            .select()
            .single();

        if (drawError) {
            return res.status(500).json({ error: 'Failed to create draw' });
        }

        // Calculate winners
        // Fetch ALL users and their LATEST 5 scores to compare.
        // Actually, PRD says "enters their last 5 golf scores"
        // And algorithm matches these 5 scores.
        
        const { data: allUsers } = await supabase
            .from('users')
            .select('id, subscription_status')
            .eq('subscription_status', 'active');
        
        const winnersList = [];

        // For each active user, get their scores
        if (allUsers) {
            for (let user of allUsers) {
                const { data: userScores } = await supabase
                    .from('scores')
                    .select('score')
                    .eq('user_id', user.id)
                    .order('date', { ascending: false })
                    .limit(5);

                if (userScores && userScores.length > 0) {
                    const userNumArray = userScores.map(s => s.score);
                    let matches = 0;
                    for (let n of userNumArray) {
                        if (winningNumbers.includes(n)) {
                            matches++;
                        }
                    }

                    if (matches >= 3) {
                        winnersList.push({
                            user_id: user.id,
                            draw_id: draw.id,
                            match_type: matches,
                            prize: matches === 5 ? 1000 : matches === 4 ? 350 : 250, // Arbitrary prize split representation
                            status: 'pending'
                        });
                    }
                }
            }
        }

        if (winnersList.length > 0) {
            await supabase.from('winners').insert(winnersList);
        }

        res.status(201).json({
            message: 'Draw executed successfully',
            draw,
            winnersCount: winnersList.length
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getDrawResults = async (req, res) => {
    try {
        const { data: draws, error } = await supabase
            .from('draws')
            .select('*')
            .order('month', { ascending: false });
        
        if (error) {
           return res.status(500).json({ error: 'Failed to fetch draws' });
        }
        res.json(draws);
    } catch(err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getWinners = async (req, res) => {
    try {
        const { data: winners, error } = await supabase
            .from('winners')
            .select(`
                id, match_type, prize, status, proof_url, created_at,
                users ( name, email ),
                draws ( month )
            `)
            .order('created_at', { ascending: false });
        
        if (error) {
           return res.status(500).json({ error: 'Failed to fetch winners' });
        }
        res.json(winners);
    } catch(err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.verifyProof = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'paid'

        const { data, error } = await supabase
            .from('winners')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: 'Failed to update winner status' });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
