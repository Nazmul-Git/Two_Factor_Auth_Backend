const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../middleware/task');
const verificationMiddleware = require('../middleware/verification');

const router = express.Router();

router.use(verificationMiddleware); 
router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;