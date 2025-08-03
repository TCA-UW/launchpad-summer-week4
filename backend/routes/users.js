const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

// GET /users/:username - get user data
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /users/theme/:username - update user's dark mode preference
router.put('/theme/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { dark_mode } = req.body;
    
    const { data, error } = await supabase
      .from('users')
      .update({ dark_mode })
      .eq('username', username)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;