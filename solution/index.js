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
            target.after(taskEl);
            target.previousSibling.previousSibling.value="";
        }else{
            alert("Empty Task")
        }
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

// function handleBodyEventListeners(event){
//     if(event.target.className==="add-button") addTask(event);
//     if(event.target.className==="task") editTask(event);
// }
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
  