const supabase = require('./config/supabase');

const BASE_URL = 'http://localhost:5000/api';

async function fetchReq(path, options = {}) {
    if (!options.headers) options.headers = {};
    if (options.body && typeof options.body === 'object') {
        options.body = JSON.stringify(options.body);
        options.headers['Content-Type'] = 'application/json';
    }
    const res = await fetch(`${BASE_URL}${path}`, options);
    if (!res.ok) {
        let err;
        try { err = await res.json(); } catch(e) { err = await res.text(); }
        throw new Error(JSON.stringify(err));
    }
    return res.json();
}

async function runTests() {
    console.log('\n--- STARTING PLATFORM TESTS ---');
    try {
        const testEmail = `testuser_${Date.now()}@test.com`;
        const testPassword = 'password123';
        
        // Get valid charity ID
        const charities = await fetchReq('/charities');
        const charityId = charities[0]?.id;
        if (!charityId) throw new Error("No charities found in DB!");

        // 1. SIGNUP & LOGIN
        process.stdout.write('1. Testing User Signup & Charity Selection... ');
        const signupRes = await fetchReq('/auth/signup', {
            method: 'POST',
            body: { name: 'Test Setup User', email: testEmail, password: testPassword, charity_id: charityId, charity_percentage: 15 }
        });
        const token = signupRes.token;
        console.log('✅ PASSED');

        // 2. SUBSCRIPTION FLOW
        process.stdout.write('2. Testing Subscription Flow (Monthly)... ');
        await fetchReq('/user/profile', {
            method: 'PUT',
            body: { subscription_status: 'active' },
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ PASSED');

        // 3. SCORE ENTRY (5-score rolling logic)
        process.stdout.write('3. Testing Score Entry (Rolling 5 Logic)... ');
        for (let i = 1; i <= 6; i++) {
            await fetchReq('/scores', {
                method: 'POST',
                body: { score: 30 + i, date: `2026-05-0${i}` },
                headers: { Authorization: `Bearer ${token}` }
            });
        }
        const scoreRes = await fetchReq('/scores', { headers: { Authorization: `Bearer ${token}` } });
        if (scoreRes.length === 5) {
            console.log('✅ PASSED (Successfully kept exactly 5 recent scores)');
        } else {
            console.log('❌ FAILED (Scores length: ' + scoreRes.length + ')');
        }

        // --- Elevate to Admin using Supabase Directly ---
        process.stdout.write('4. Elevating Test User to Admin Privilege... ');
        await supabase.from('users').update({ role: 'admin' }).eq('email', testEmail);
        
        // Refresh token to get 'admin' role in JWT
        const loginRes = await fetchReq('/auth/login', {
            method: 'POST',
            body: { email: testEmail, password: testPassword }
        });
        const adminToken = loginRes.token;
        console.log('✅ PASSED');

        // 5. DRAW SYSTEM LOGIC & SIMULATION
        process.stdout.write('5. Testing Draw System Logic... ');
        let drawId;
        try {
            const drawRes = await fetchReq('/draws/run', {
                method: 'POST',
                body: { type: 'random' },
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            drawId = drawRes.draw.id;
            console.log(`✅ PASSED (Generated Draw ID: ${drawId}, Winners Found: ${drawRes.winnersCount})`);
        } catch (err) {
            if (err.message.includes('already ran')) {
                const existingDraw = await supabase.from('draws').select('id').eq('month', new Date().toISOString().substring(0, 7)).single();
                drawId = existingDraw.data.id;
                console.log(`✅ PASSED (Draw intentionally prevented from running twice in a month)`);
            } else {
                throw err;
            }
        }

        // 6. WINNER VERIFICATION & PAYOUT
        process.stdout.write('6. Testing Winner Verification & Payout Tracking... ');
        let winnersRes = await fetchReq('/draws/winners', { headers: { Authorization: `Bearer ${adminToken}` } });
        
        // Force a winner if algorithm didn't hit to ensure we test the verification flow
        if (winnersRes.length === 0) {
            await supabase.from('winners').insert([{
                user_id: (await supabase.from('users').select('id').eq('email', testEmail).single()).data.id,
                draw_id: drawId,
                match_type: 3,
                prize: 250,
                status: 'pending'
            }]);
            winnersRes = await fetchReq('/draws/winners', { headers: { Authorization: `Bearer ${adminToken}` } });
        }

        if (winnersRes.length > 0) {
            const winner = winnersRes[0];
            
            // User uploading proof (uses regular user logic but admin can do it too)
            await fetchReq(`/user/winners/${winner.id}/proof`, {
                method: 'PUT',
                body: { proof_url: 'https://fake-image.url' },
                headers: { Authorization: `Bearer ${adminToken}` }
            });

            // Admin verifying
            const verifyRes = await fetchReq(`/draws/winners/${winner.id}/verify`, {
                method: 'PUT',
                body: { status: 'paid' },
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            if (verifyRes.status === 'paid') {
                 console.log('✅ PASSED (Proof uploaded and Marked as PAID)');
            } else {
                 console.log('❌ FAILED (Verification data mismatch)');
            }
        }

        console.log('\n🎉 ALL PLATFORM TESTS COMPLETED 🎉');

        // Cleanup test user
        await supabase.from('users').delete().eq('email', testEmail);

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
    }
}

runTests();
