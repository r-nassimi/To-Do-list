let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;

const getTasks = async () => {
  const response = await fetch('http://localhost:8000/allTasks', {
    method: 'GET'
  });
  let result = await response.json();
  allTasks = result.data;
  render();
}

onClickButton = async () => {
  if (valueInput.length > 0) {
    pushTasks();
  } else {
    alert('Input something!')
  }
}

const pushTasks = async () => {
  const response = await fetch('http://localhost:8000/createTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: valueInput,
      isCheck: false
    }),
  });
  const resultPOST = await response.json().then((response) => {
    allTasks.push(response);
    input.value = "";
    valueInput = "";
    render();
  })
}

updateValue = (event) => {
  valueInput = event.target.value;
}

render = () => {
  const content = document.getElementById('content-page');
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks
    .sort((a, b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0)
    .map(item => {
      const { _id, isCheck, text } = item;
      const container = document.createElement('div');
      container.id = `task-${_id}`;
      container.className = 'task-container';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = isCheck;
      checkbox.onclick = function (e) {
        onChangeCheckbox(e, _id);
      }
      container.appendChild(checkbox);

      const texts = document.createElement('p');
      texts.innerText = text;
      texts.id = `task-text-${_id}`;
      texts.className = isCheck ? 'text-task done-text' : 'text-task';
      container.appendChild(texts);

      const imageEdit = document.createElement('img');
      imageEdit.src = "https://icons.veryicon.com/png/o/internet--web/billion-square-cloud/rename-5.png";
      imageEdit.onclick = () => {
        editTask(item, id, container);
      }
      container.appendChild(imageEdit);

      const imageDelete = document.createElement('img');
      imageDelete.src = "https://www.pngplay.com/wp-content/uploads/7/Delete-Icon-Background-PNG-Image.png";
      imageDelete.onclick = () => {
        deleteTask(item._id);
      }
      container.appendChild(imageDelete);
      content.appendChild(container);
    })
}

const onChangeCheckbox = async (e, _id) => {
  const response = await fetch('http://localhost:8000/updateTask', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      _id,
      isCheck: e.target.checked
    })
  });
  const result = await response.json();
  allTasks = result;
  render();
}

const updateTaskText = (event) => {
  allTasks[activeEditTask].text = event.target.value;
  render();
}

const editTask = (container, _id, item) => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.value = item.text;
  editInput.id = `input-${_id}`;
  container.appendChild(editInput);

  const editButton = document.createElement('input');
  editButton.type = "button";
  editButton.value = "Save";
  editButton.id = `button-${_id}`;

  const cancelButton = document.createElement('input');
  cancelButton.type = "button";
  cancelButton.value = "cancel";
  cancelButton.onclick = () => {
    cancel();
  }
  container.appendChild(cancelButton);

  editButton.onclick = () => {
    saveValue(_id)
  }
  container.appendChild(editButton);
}

const cancel = async () => {
  render();
}

const saveValue = async (_id) => {
  const newText = document.getElementById(`input-${_id}`)
  const response = await fetch('http://localhost:8000/updateTask', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      _id: _id,
      text: newText.value
    }),
  });
  const result = await response.json();
  allTasks = result;
  render();
}

const deleteTask = async (_id) => {
  console.log(_id)
  const response = await fetch(`http://localhost:8000/deleteTask?_id=${_id}`, {
    method: 'DELETE',
  })
  const resp = await response.json();
  allTasks = resp;
  render();
}