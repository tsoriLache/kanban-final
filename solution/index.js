const tasks = {
    "todo": [],
    "inProgress": [],
    "done": []
}
localStorage.setItem("tasks", JSON.stringify(tasks));

function createElement(tagName, children = [], classes = [], attributes = {}, eventListeners = {}) {
    const el = document.createElement(tagName);
    // Children
    for(const child of children) {
        el.append(child);
    }
    // Classes
    for(const cls of classes) {
      el.classList.add(cls);
    }
    // Attributes
    for (const attr in attributes) {
      el.setAttribute(attr, attributes[attr]);
    }
    // Event Listeners
    for (const listener in eventListeners) {
        el.addEventListener(listener, eventListeners[listener]);
      }
    return el;
}

function addTask({target}){
    if(target.className==="add-button"){
        const task = target.previousSibling.previousSibling.value;
        if(task!==""){
            const taskEl = createElement("li",[task],["task"],{},{"mouseover": moveTask,"mouseout":stopMove})
            target.parentElement.after(taskEl);
            target.previousSibling.previousSibling.value="";
        }else{
            alert("Empty Task")
        }
        target.blur();

    }
}

function editTask({target}){
    if(target.className==="task"){
        document.querySelector("body").removeEventListener("dblclick",editTask);
        editEl = createElement("input",[],[],{type:"text" ,id :"edit-task"});
        editEl.value = target.innerText;
        target.after(editEl);
        editEl.focus();
        target.remove();
        editEl.addEventListener("blur",updateTask)
    }
}

function updateTask({target},task=editEl.value){
    if(task!==""){
        const taskEl = createElement("li",[task],["task"],{},{"mouseover": moveTask,"mouseout":stopMove})
        document.getElementById("edit-task").after(taskEl);
        target.remove();
    }else{
        alert("Empty Task")
    }
    document.querySelector("body").addEventListener("dblclick",editTask);
}
let moveTaskEl;
function moveTask({target}){
    moveTaskEl = target;
    document.addEventListener("keydown",whereToMove);
}

function stopMove(){
    document.removeEventListener("keydown",whereToMove);
}

function whereToMove({which,altKey}) {
    const keyCode = which;
    if(keyCode===49&&altKey){
        document.getElementById("to-do-list").append(moveTaskEl);
    }
    if(keyCode===50&&altKey){
        document.getElementById("in-progress-list").append(moveTaskEl);
    }
    if(keyCode===51&&altKey){
        document.getElementById("done-list").append(moveTaskEl);
    }
}

document.querySelector("body").addEventListener("click",addTask);
document.querySelector("body").addEventListener("dblclick",editTask);


function updateLocalStorageFromDOM(){
    const tasksObj = {
        "todo": [],
        "inProgress": [],
        "done": []
    };
    const tasksArray = document.querySelectorAll("li.task");
    for(let task of tasksArray){
        const list = task.parentElement.id;
        if(list==="to-do-list"){
            tasksObj.todo.push(task.innerText);
        }
        if(list==="in-progress-list"){
            tasksObj.inProgress.push(task.innerText);
        }
        if(list==="done-list"){
            tasksObj.done.push(task.innerText);
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasksObj));
}


function serching(){
    let allLi = document.querySelectorAll("li.task")
    for(let li of allLi){
        if(li.innerText.includes(document.querySelector("#search").value)){
            li.classList.add("vvv")
            console.log(li)
        }else{
            li.classList.add("uuu")
            console.log(li)
        }
    }
}