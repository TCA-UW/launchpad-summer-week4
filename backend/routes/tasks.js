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

// PUT /tasks/update/:id - update a task
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    console.log('Received update for task id:', id, 'completed:', completed);

    const { data, error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(400).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      console.log('No task found with id:', id);
      return res.status(404).json({ error: 'Task not found' });
    }

    console.log('Task updated:', data[0]);
    res.json(data[0]);
  } catch (error) {
    console.error('Unexpected error in update route:', error);
    res.status(500).json({ error: error.message });
  }
});


// DELETE /tasks/delete/:id - delete a task
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;