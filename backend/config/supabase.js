const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// IN-MEMORY MOCK DB
const mockDb = {
    users: [],
    charities: [
        { id: 'c1', name: 'Global Clean Water' },
        { id: 'c2', name: 'Education for All' },
        { id: 'c3', name: 'Wildlife Conservation' }
    ],
    scores: [],
    draws: [],
    winners: []
};

// Simulate Supabase Builder
const createMockSupabase = () => {
    return {
        from: (table) => {
            return {
                select: (fields) => {
                    let data = [...mockDb[table]];
                    return {
                        eq: (field, value) => {
                            data = data.filter(d => d[field] === value);
                            return {
                                single: () => Promise.resolve({ data: data[0], error: null }),
                                order: () => ({ limit: (n) => Promise.resolve({ data: data.slice(0, n), error: null }) }),
                                then: (res) => res({ data, error: null })
                            };
                        },
                        order: () => ({ limit: (n) => Promise.resolve({ data: data.slice(0, n), error: null }) }),
                        single: () => Promise.resolve({ data: data[0] || null, error: null }),
                        then: (res) => res({ data, error: null })
                    };
                },
                insert: (rows) => {
                    const row = { id: Math.random().toString(36).substring(7), created_at: new Date(), ...rows[0] };
                    mockDb[table].push(row);
                    return {
                        select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }),
                        then: (res) => res({ data: [row], error: null })
                    };
                },
                update: (updates) => {
                    return {
                        eq: (field, value) => {
                            const index = mockDb[table].findIndex(d => d[field] === value);
                            if (index > -1) {
                                mockDb[table][index] = { ...mockDb[table][index], ...updates };
                                const row = mockDb[table][index];
                                return {
                                    select: () => ({ single: () => Promise.resolve({ data: row, error: null }) })
                                };
                            }
                            return { select: () => ({ single: () => Promise.resolve({ data: null, error: 'Not found' }) }) };
                        }
                    };
                },
                delete: () => {
                   return {
                       eq: (field, value) => {
                           mockDb[table] = mockDb[table].filter(d => d[field] !== value);
                           return {
                               eq: () => Promise.resolve({ data: null, error: null }), // For delete score chained eqs
                               then: (res) => res({ data: null, error: null })
                           }
                       }
                   }
                }
            };
        }
    };
};


let supabase;

if (supabaseUrl && supabaseUrl.includes("supabase.co") && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Connected to Real Supabase");
} else {
    supabase = createMockSupabase();
    console.warn("Using In-Memory Mock Supabase because credentials are missing.");
}

module.exports = supabase;
