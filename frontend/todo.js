getAllTodos(0);
var page = 0;
function getAllTodos(offset){
  fetch("/todo?offset="+offset)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    for(d in data){
      printTodo(data[d]);
    } 
  })
  .catch((err) => {
    console.log(err);
  });
}

function printTodo(data){
  var task = document.createElement("div");
  task.classList.add("task");
  task.id = "task" + taskCounter;
  taskCounter++;
  task.draggable = true;
  task.addEventListener("dragstart", drag);
  var sdate =new Date(data.sdate).toISOString().split('T')[0]
  var edate = new Date(data.edate).toISOString().split('T')[0]

  var s1time = data.stime.split(':')[0];
  var s2time = data.stime.split(':')[1];
  var stime = `${s1time}:${s2time}`;
  var e1time = data.etime.split(':')[0];
  var e2time = data.etime.split(':')[1];
  var etime = `${e1time}:${e2time}`;
  // console.log(etime);
  task.innerHTML = `
            <div class="task-header" style="font-size:25px;"><b>${data.name}</b></div>
            <div class="task-description">${data.description}</div>
            <div class="task-dates">${sdate} to ${edate}</div>
            <div class="task-times">${stime} to ${etime}</div>
            <button onclick="openEditModal(this.parentElement)">Edit</button>
            <button onclick="deleteTask(this.parentElement)">Delete</button>
            `;

  task.setAttribute("id", data.id);
  document.getElementById(data.status).appendChild(task);
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event, status) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  var columnId = status + "Column";
  var column = document.getElementById(columnId);
  var task = document.getElementById(data);

  fetch("/todo",{
    method:'PUT',
    headers: {
      'Content-Type': 'application/json'
  },
  body: JSON.stringify({
      'status':columnId,
      'id':task.getAttribute('id')
    })
  })
  .then((response) => {
    if(response.status==200)
    column.appendChild(task);
}).catch((err) => {
  console.log(err);
});
}

function openEditModal(task) {
  var taskHeader = task.querySelector(".task-header").innerText;
  var taskDescription = task.querySelector(".task-description").innerText;
  var taskDates = task.querySelector(".task-dates").innerText.split(" to ");
  var taskTimes = task.querySelector(".task-times").innerText.split(" to ");

  var startDate = taskDates[0];
  var endDate = taskDates[1];
  
  var startTime = taskTimes[0];
  var endTime = taskTimes[1];
  
  
  document.getElementById("editedTaskName").value = taskHeader;
  document.getElementById("editedTaskDescription").value = taskDescription;
  document.getElementById("editedStartDate").value = startDate;
  document.getElementById("editedEndDate").value = endDate;
  document.getElementById("editedStartTime").value = startTime;
  document.getElementById("editedEndTime").value = endTime;
  
  document.getElementById("taskModal").style.display = "block";
  document.getElementById("saveChanges").onclick = function () {
    
    fetch("/updateDetails", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name': document.getElementById("editedTaskName").value,
        'desc': document.getElementById("editedTaskDescription").value,
        'sdate': document.getElementById("editedStartDate").value,
        'edate': document.getElementById("editedEndDate").value,
        'stime': document.getElementById("editedStartTime").value,
        'etime': document.getElementById("editedEndTime").value,
        'id': task.getAttribute("id"),
      })
    })
      .then((response) => {
        console.log(response);
        task.querySelector(".task-header").innerText = document.getElementById("editedTaskName").value;
        task.querySelector(".task-description").innerText = document.getElementById("editedTaskDescription").value;
        task.querySelector(".task-dates").innerText = document.getElementById("editedStartDate").value + " to " + document.getElementById("editedEndDate").value;
        task.querySelector(".task-times").innerText = document.getElementById("editedStartTime").value + " to " + document.getElementById("editedEndTime").value;
        closeModal();
        
      }).catch((err) => {
        console.log(err);
      });
      
  }
}

function closeModal() {
  document.getElementById("taskModal").style.display = "none";
}

window.onclick = function (event) {
  var modal = document.getElementById("taskModal");
  if (event.target == modal) {
    closeModal();
  }
}

var taskCounter = 0;

function createTask() {
  var taskName = document.getElementById("taskName").value;
  var taskDescription = document.getElementById("taskDescription").value;
  var startDate = document.getElementById("startDate").value;
  var endDate = document.getElementById("endDate").value;
  var startTime = document.getElementById("startTime").value;
  var endTime = document.getElementById("endTime").value;

  var task = document.createElement("div");
  task.classList.add("task");
  task.id = "task" + taskCounter;
  taskCounter++;
  task.draggable = true;
  task.addEventListener("dragstart", drag);
  task.innerHTML = `
  <div class="task-header" style="font-size:25px;"><b>${taskName}</b></div>
            <div class="task-description">${taskDescription}</div>
            <div class="task-dates">${startDate} to ${endDate}</div>
            <div class="task-times">${startTime} to ${endTime}</div>
            <button onclick="openEditModal(this.parentElement)">Edit</button>
            <button onclick="deleteTask(this.parentElement)">Delete</button>
            `;

  const id = Math.random();
  task.setAttribute("id",id);
  // console.log(task);
  fetch("/todo", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'name': taskName,
      'desc': taskDescription,
      'sdate': startDate,
      'edate': endDate,
      'stime': startTime,
      'etime': endTime,
      'status': "pendingColumn",
      'id': id,
    })
  })
  .then((response) => {
    console.log(response);
    document.getElementById("pendingColumn").appendChild(task);
    document.getElementById("createForm").style.display = "none";
      document.getElementById("createTaskButton").style.display = "block";
    }).catch((err) => {
      console.log(err);
    });

}

function deleteTask(task) {
  let id = task.getAttribute('id');
  fetch("/todo?id=" + id,{
    method:'DELETE',
  })
  .then((result) => {
    if(result.status==200)
      task.remove();
  }).catch((err) => {
    console.log(err);
  });
}
function closeForm() {
  document.getElementById("createForm").style.display = "none";
  document.getElementById("createTaskButton").style.display = "block";
}

function toggleTaskForm() {
  var form = document.getElementById("createForm");
  var button = document.getElementById("createTaskButton");
  if (form.style.display === "none") {
    form.style.display = "block";
    button.style.display = "none";
  } else {
    form.style.display = "none";
    button.style.display = "block";
    // body.style.display = "flex";
  }
}

function loadPrevious(){
  if(page>=1){
    document.querySelectorAll(".task").forEach(e => e.remove());  
    page--;
    getAllTodos(page);
  }
  else{
    alert("This is starting of the list!");
  } 
}

function  loadNext(){
  fetch("/todoLength?offset="+(page+1))
  .then((result) => {
    if(result.status==200){
      document.querySelectorAll(".task").forEach(e => e.remove());
      page++;
      getAllTodos(page);
    }
    else{
      alert("This is ending of the list!");
    }
  }).catch((err) => {
    console.log(err);
  });
}
