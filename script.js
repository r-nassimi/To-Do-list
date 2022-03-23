let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;

window.onload = async function init() {
  input = document.getElementById('add-task');
  input.addEventListener('change', updateValue);
  const response = await fetch('http://localhost:8000/allTasks', {
    method: 'GET'
  });
  let result = await response.json();
  allTasks = result.data;
  render();
}

onClickButton = async () => {
  if (valueInput.length > 0) {
    allTasks.push({
      text: valueInput,
      isCheck: false,
    });
    const response = await fetch('http://localhost:8000/createTask', {
      method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: valueInput,
      isCheck: false,
    })
  });
  let result = await response.json();
  allTasks = result.data;
    valueInput = '';
    input.value = '';
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render();
  } else {
    alert('Input something!')
  }
}

updateValue = (event) => {
  valueInput = event.target.value;
}

render = () => {
  const content = document.getElementById('content-page');
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  allTasks.sort((a, b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0);
  allTasks.map((item, index) => {
    const container = document.createElement('div');
    container.id = `task-${index}`;
    container.className = 'task-container';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.isCheck;
    checkbox.onchange = function () {
      onChangeCheckbox(index);
    }
    container.appendChild(checkbox);

    const text = document.createElement('p');
    text.innerText = item.text;
    text.className = item.isCheck ? 'text-task done-text' : 'text-task';
    container.appendChild(text);

    const imageEdit = document.createElement('img');
    imageEdit.src = "https://icons.veryicon.com/png/o/internet--web/billion-square-cloud/rename-5.png";
    imageEdit.onclick = () => {
      editTask(item, index, container);
    }
    container.appendChild(imageEdit);

    const imageDelete = document.createElement('img');
    imageDelete.src = "https://www.pngplay.com/wp-content/uploads/7/Delete-Icon-Background-PNG-Image.png";
    imageDelete.onclick = () => {
      deleteTask(index);
    }
    container.appendChild(imageDelete);
    content.appendChild(container);
  })
}

const onChangeCheckbox = async (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}

const updateTaskText = (event) => {
  allTasks[activeEditTask].text = event.target.value;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}

const editTask = async (item, index, container) => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.value = item.text;
  editInput.id = `input-${index}`;
  container.appendChild(editInput);

  const editButton = document.createElement('input');
  editButton.type = "button";
  editButton.value = "Save";
  editButton.id = `button-${index}`;

  const cancelButton = document.createElement('input');
  cancelButton.type = "button";
  cancelButton.value = "cancel";
  cancelButton.onclick = () => {
    cancel();
  }
  container.appendChild(cancelButton);

  editButton.onclick = () => { //
    saveValue(index)

  }
  container.appendChild(editButton);
  localStorage.setItem('tasks', JSON.stringify(allTasks));
}

const cancel = async () => {
  render();
}

const saveValue = async (index) => {
  const oldText = document.getElementById(`input-${index}`);
  allTasks[index].text = oldText.value;
  const response = await fetch(`http://localhost:8000/updateTask`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: valueInput,
      isCheck: false,
    }),
  });
  let result = await response.json();
  allTasks[index].text = result.data;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}

const deleteTask = async (index) => {
  allTasks.splice(index, 1);
  const response = await fetch(`http://localhost:8000/deleteTask`, {
    method: 'DELETE',
  });
  let result = await response.json();
  allTasks = result.data;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}

