const Task = require('../models/Task');

// Create a task
const createTask = async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  try {
    const task = new Task({ title, description, dueDate, priority, user: req.user._id });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all tasks for a user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    console.log(tasks)
    res.status(200).json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };