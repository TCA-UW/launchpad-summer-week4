const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

router.get('/getall', async (req, res) => {
  try {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { text } = req.body;
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ text, completed: false }])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;