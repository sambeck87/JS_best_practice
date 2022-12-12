// eslint-disable-next-line max-classes-per-file
import './style.css';
import './images/refresh.svg';
import './images/enter.svg';
import './images/dots.svg';
import './images/trash.svg';

/* *************************************************************** */
function getData() {
  let data = localStorage.getItem('tasks');
  data = JSON.parse(data);
  return data;
}

function setData(data) {
  const allData = JSON.stringify(data);
  localStorage.setItem('tasks', allData);
}
/* *************************************************************** */

const Display = () => {
  let fill = '';
  if (getData() === null) {
    return 0;
  }
  for (let i = 0; i < getData().length; i += 1) {
    const { description, index } = getData()[i];
    fill += `<div draggable="true" class="center" id="cont${i}"><input class='check' type="checkbox" name="tasks" id="task${index}" value="${i}"><label for="task${index}" class = "description"><input type="text" class = "description" id="${i}" value="${description}"></label><button type="button" class="icon dot${i}" value="${i}">&#8942</button><button type="button" id="trash${i}" value="${i}" class="btn hide"><img src="./images/trash.svg" alt="trash"></button></div>`;
  }
  document.getElementById('tasks').innerHTML = `${fill}`;
  return 0;
};

Display();
/* **************************************************** */
class NewTask {
  constructor(description, complete, index) {
    this.description = description;
    this.complete = complete;
    this.index = index;
  }
}
/* **************************************************** */
class Tasks {
  constructor(newTask, storage, index) {
    this.newTask = newTask;
    this.myTasks = storage;
    this.index = index;
  }

  add() {
    if (this.myTasks === null) {
      this.myTasks = [];
    }
    const data = this.myTasks;
    data.push(this.newTask);
    setData(data);
  }

  remove() {
    if (!this.storage) {
      const filtr = getData().filter((done) => done.complete === false);
      setData(filtr);
    }
  }

  deleteOne() {
    const allTasks = getData();
    allTasks.splice(this.index, 1);
    setData(allTasks);
  }
}
/* *************************************************************** */
const taskBackgroud = () => {
  const containers = document.querySelectorAll('.description');
  containers.forEach((element) => {
    element.addEventListener('focus', () => {
      const indexContainer = `cont${element.id}`;
      const taskContainer = document.getElementById(indexContainer);
      taskContainer.classList.add('yellow');
      taskContainer.classList.remove('white');
      const dots = `.dot${element.id}`;
      const toHide = document.querySelector(dots);
      toHide.classList.add('hide');
      const btn = `trash${element.id}`;
      const trashBtn = document.getElementById(btn);
      trashBtn.classList.remove('hide');
    });
  });

  containers.forEach((element) => {
    element.addEventListener('blur', () => {
      const indexContainer = `cont${element.id}`;
      const taskContainer = document.getElementById(indexContainer);
      taskContainer.classList.add('white');
      taskContainer.classList.remove('yellow');
      const dots = `.dot${element.id}`;
      const toHide = document.querySelector(dots);
      toHide.classList.remove('hide');
      const btn = `trash${element.id}`;
      const hide = () => {
        const trashBtn = document.getElementById(btn);
        trashBtn.classList.add('hide');
      };
      setTimeout(hide, 150);
    });
  });

  containers.forEach((element) => {
    element.addEventListener('keypress', (event) => {
      const indexContainer = `cont${element.id}`;
      const taskContainer = document.getElementById(indexContainer);
      if (event.key === 'Enter') {
        taskContainer.classList.remove('yellow');
        const dots = `.dot${element.id}`;
        const toHide = document.querySelector(dots);
        toHide.classList.remove('hide');
        const btn = `trash${element.id}`;
        const trashBtn = document.getElementById(btn);
        trashBtn.classList.add('hide');
      }
    });
  });
};
/* *********************************************************** */
const checkbox = () => {
  const checkIn = document.querySelectorAll('.check');
  checkIn.forEach((element) => {
    element.addEventListener('change', () => {
      const text = document.getElementById(element.value);
      text.classList.toggle('cross_out');
      const inputValue = element.value;
      const allData = getData();
      if (text.classList.contains('cross_out')) {
        allData[inputValue].complete = true;
        setData(allData);
      } else {
        allData[inputValue].complete = false;
        setData(allData);
      }
    });
  });
};
/* *************************************************************** */
function restIndex() {
  const check = getData();
  for (let i = 0; i < check.length; i += 1) {
    check[i].index = i + 1;
  }
  setData(check);
}
/* ************************************************************** */
function setup() {
  const allTasks = getData();
  for (let i = 0; i < allTasks.length; i += 1) {
    const num = allTasks[i].index;
    if (allTasks[i].complete === true) {
      const text = document.getElementById(i);
      text.classList.add('cross_out');
      const box = document.getElementById(`task${num}`);
      box.checked = true;
    }
  }
}
/* ************************************************************** */

let index;
const check = getData();
if (check === null) {
  index = 0;
} else {
  index = check.length;
}

const inTask = document.getElementById('add');

inTask.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const task = inTask.value;
    const taskDesc = task;
    index += 1;
    const newTask = new NewTask(taskDesc, false, index);
    const call = new Tasks(newTask, getData(), index);
    call.add();
  }
});

const clear = document.getElementById('clear_btn');
clear.addEventListener('click', () => {
  const call = new Tasks(null, true, index);
  call.remove();
  restIndex();
  // eslint-disable-next-line no-restricted-globals
  location.reload();
});

const modify = document.querySelectorAll('.description');
modify.forEach((element) => {
  element.addEventListener('input', () => {
    const index = parseInt(element.id, 10);
    const allTasks = getData();
    allTasks[index].description = element.value;
    setData(allTasks);
  });
});

const trash = document.querySelectorAll('.btn');
trash.forEach((element) => {
  element.addEventListener('click', () => {
    const buttonValue = element.value;
    const justOne = new Tasks(null, null, buttonValue);
    justOne.deleteOne();
    restIndex();
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  });
});

const eraseBtn = document.getElementById('refres_icon');
eraseBtn.addEventListener('click', () => {
  localStorage.clear();
  // eslint-disable-next-line no-restricted-globals
  location.reload();
});

const dragBtn = document.querySelectorAll('.icon');
dragBtn.forEach((btn) => {
  btn.addEventListener('mousedown', () => {
    const buttonValue = btn.value;

    const sibilings = document.querySelectorAll('.center');
    sibilings.forEach((element) => {
      element.addEventListener('dragover', (e) => {
        e.preventDefault();
      });
      element.addEventListener('drop', () => {
        const sibilingId = element.id;
        const index = sibilingId.replace(/[^0-9]/g, '');
        const allData = getData();
        const taskMoved = allData.splice(buttonValue, 1);
        const arr1 = [...allData];
        let arr2 = [...allData];
        arr2 = arr1.splice(0, index);
        const arr = [...arr2, ...taskMoved, ...arr1];
        setData(arr);
        restIndex();
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      });
    });
  });
});

taskBackgroud();
checkbox();
window.addEventListener('load', setup);
