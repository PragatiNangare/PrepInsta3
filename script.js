// Initial References
const newTaskInput = document.querySelector("#new-task input[type='text']");
const dueDateInput = document.querySelector("#due-date");
const tasksDiv = document.querySelector("#tasks");
let tasks = []; // Array to store tasks
let updateNote = "";
let filterStatus = 'all'; // Add filter status

// Function on window load
window.onload = () => {
  displayTasks();
};

// Function to Display The Tasks
const displayTasks = () => {
  // Clear the tasks
  tasksDiv.innerHTML = "";
  

  if (tasks.length > 0) {
    tasksDiv.style.display = "block";
  } else {
    tasksDiv.style.display = "none";
  }

  // Filter tasks based on filterStatus
  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'completed') {
      return task.completed;
    } else if (filterStatus === 'incomplete') {
      return !task.completed;
    }
    return true;
  });

  filteredTasks.forEach(task => {
    let taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("id", task.id);

    taskInnerDiv.innerHTML = `
      <span id="taskname">${task.name}</span>
      <div class="due-date">Due: ${new Date(task.dueDate).toDateString()}</div>
      <div class="remaining-time">${calculateRemainingTime(new Date(task.dueDate))}</div>
    `;

    // Add completed class if needed
    if (task.completed) {
      taskInnerDiv.classList.add("completed");
    }

    // Create edit button
    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    if (task.completed) {
      editButton.style.visibility = "hidden";
    } else {
      editButton.style.visibility = "visible";
    }
    taskInnerDiv.appendChild(editButton);

    // Create delete button
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    taskInnerDiv.appendChild(deleteButton);

    // Append task to the tasks container
    tasksDiv.appendChild(taskInnerDiv);
  });

  // Tasks completed
  tasksDiv.querySelectorAll(".task").forEach(element => {
    element.onclick = () => {
      const taskId = element.id;
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        displayTasks();
      }
    };
  });

  // Edit Tasks
  document.querySelectorAll(".edit").forEach(element => {
    element.addEventListener("click", (e) => {
      e.stopPropagation(); // Stop propagation to outer elements
      disableButtons(true); // Disable other edit buttons
      let parent = element.parentElement;
      const task = tasks.find(t => t.id === parent.id);
      if (task) {
        newTaskInput.value = task.name;
        dueDateInput.value = new Date(task.dueDate).toISOString().split('T')[0];
        updateNote = parent.id; // Set updateNote to the task being edited
        tasks = tasks.filter(t => t.id !== parent.id); // Remove task from array
        displayTasks(); // Update the view
      }
    });
  });

  // Delete Tasks
  document.querySelectorAll(".delete").forEach(element => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      let parent = element.parentElement;
      tasks = tasks.filter(t => t.id !== parent.id); // Remove task from array
      displayTasks(); // Update the view
    });
  });
};

// Disable Edit Button
const disableButtons = (bool) => {
  document.querySelectorAll(".edit").forEach(element => {
    element.disabled = bool;
  });
};

// Add tasks to in-memory storage
const addTask = () => {
  disableButtons(false);
  if (newTaskInput.value.length === 0) {
    alert("Please Enter A Task");
  } else {
    let dueDate = new Date(dueDateInput.value);
    if (isNaN(dueDate.getTime())) {
      alert("Please Enter a Valid Due Date");
      return;
    }

    if (updateNote === "") {
      // New task
      tasks.push({
        id: `task_${Date.now()}`,
        name: newTaskInput.value,
        completed: false,
        dueDate: dueDate.toISOString()
      });
    } else {
      // Update task
      let task = tasks.find(t => t.id === updateNote);
      if (task) {
        task.name = newTaskInput.value;
        task.dueDate = dueDate.toISOString();
        updateNote = "";
      }
    }
    newTaskInput.value = "";
    dueDateInput.value = "";
    displayTasks();
  }
};

// Add event listener for the "Add" button
document.querySelector("#push").addEventListener("click", addTask);

// Add event listener for the Enter key in the input field
newTaskInput.addEventListener("keydown", (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevent default Enter key action
    addTask();
  }
});

// Function to filter tasks
const filterTasks = (status) => {
  filterStatus = status;
  displayTasks();
};

// Function to calculate remaining time
const calculateRemainingTime = (dueDate) => {
  const now = new Date();
  const timeDiff = dueDate - now;
  if (timeDiff <= 0) {
    return 'Overdue';
  }
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${days}d ${hours}h ${minutes}m`;
};


