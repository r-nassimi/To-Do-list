const tasks = require('/home/user/Documents/Work/new/To-Do-list/nodeJS/src/db/models/task/Index');

module.exports.getAllTasks = async (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  tasks.find().then(result => {
    res.send({ data: result });
  });
}

module.exports.createNewTask = (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  const body = req.body;
  if ((body.hasOwnProperty('text') && body.hasOwnProperty('isCheck'))) {
    const task = new tasks({
      text: body.text,
      isCheck: body.isCheck
    })
    task.save().then(result => {
      res.send(result);
    })
  } else {
    res.status(422).send('Error! Params not correct');
  }
};

module.exports.changeTaskInfo = (req, res, next) => {
  const body = req.body;
  if ((body.hasOwnProperty('_id')) || (body.hasOwnProperty('text')) || (body.hasOwnProperty('isCheck'))) {
    tasks.updateOne(
      {id: body._id}, 
      {$set: {body}
    }).then(result => {
      tasks.find().then(result => {
        res.send(result)
      })
    });
  } else {
    res.status(422).send('Error! Params not correct');
  };
};

module.exports.deleteTask = (req, res, next) => {
  const id = req.query.id;
  if (id) {
    tasks.deleteOne({_id: id}).then(result => {
        tasks.find().then(result => {
          res.send(result);
        })
    });
  } else {
    res.status(404).send('Error! Params not found');
  };
};
