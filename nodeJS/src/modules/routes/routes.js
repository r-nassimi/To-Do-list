const express = require('express');
const router = express.Router();

const {
  getAllTasks,
  createNewTask,
  changeTaskInfo,
  deleteTask
} = require('/home/user/Documents/Work/new/To-Do-list/nodeJS/src/modules/controllers/task-controller');

router.get('/allTasks', getAllTasks);
router.post('/createTask', createNewTask);
router.patch('/updateTask', changeTaskInfo);
router.delete('/deleteTask', deleteTask);

module.exports = router;