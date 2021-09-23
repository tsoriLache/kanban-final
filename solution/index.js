if(!JSON.parse(localStorage.getItem("tasks"))){
    const tasks = {
    "todo": [],
    "in-progress": [],
    "done": []
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}else{
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    updateDOMfromLocalStorage(tasks)
}

function addTask({target}){
    if(target.className==="add-button"){
        const task = target.previousSibling.previousSibling.value;  //try to find better js path
        const listId = target.parentElement.parentElement.id;   //try to find better js path
        if(task!==""){
            //create DOM element
            const taskEl = createElement("li",[task],["task"],{contenteditable:"true"},{"mouseover": moveTask,"mouseout":stopMove})
            target.parentElement.after(taskEl);
            //Update local storage
            const tasksObj = JSON.parse(localStorage.getItem("tasks"));
            tasksObj[listIdToObjKey(listId)].push(task);
            localStorage.setItem("tasks", JSON.stringify(tasksObj));
            //nullify add input
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
        const task = target.innerText; 
        target.addEventListener("blur",(event)=>updateEditToLocalStorage(event,task))
    }
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
        moveInLocalStorage("todo")
        document.getElementById("first-to-do-li").after(moveTaskEl);
    }
    if(keyCode===50&&altKey){
        moveInLocalStorage("in-progress")
        document.getElementById("first-in-progress-li").after(moveTaskEl);

    }
    if(keyCode===51&&altKey){
        moveInLocalStorage("done")
        document.getElementById("first-done-li").after(moveTaskEl);

    }
}

document.querySelector("body").addEventListener("click",addTask);
document.querySelector("body").addEventListener("dblclick",editTask);


//support functions:

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

function listIdToObjKey(id){
    if(id==="to-do-list"){
        return "todo";
    }
    if(id==="in-progress-list"){
        return "in-progress";
    }
    if(id==="done-list"){
        return "done";
    }
}

function updateEditToLocalStorage({target},taskText){
    const tasksObj = JSON.parse(localStorage.getItem("tasks"));
    const objKey = listIdToObjKey(target.parentElement.id);
    const editTaskIndex = tasksObj[objKey].indexOf(taskText)
    tasksObj[objKey][editTaskIndex]=target.innerText;
    localStorage.setItem("tasks", JSON.stringify(tasksObj));
    document.querySelector("body").addEventListener("dblclick",editTask);
    target.removeAttribute("contenteditable")
}

function moveInLocalStorage(listKey){
    const tasksObj = JSON.parse(localStorage.getItem("tasks"));
    tasksObj[listKey].unshift(moveTaskEl.innerText)
    const objKey = listIdToObjKey(moveTaskEl.parentElement.id);
    tasksObj[objKey].splice(tasksObj[objKey].indexOf(moveTaskEl.innerText),1)
    localStorage.setItem("tasks", JSON.stringify(tasksObj));
}

function updateDOMfromLocalStorage(){
    updateList("todo","to-do-list");
    updateList("in-progress","in-progress-list")
    updateList("done","done-list")
}

function updateList(key,id){
    const tasksObj = JSON.parse(localStorage.getItem("tasks"));
    for(let task of tasksObj[key]){
        const taskEl = createElement("li",[task],["task"],{contenteditable:"false"},{"mouseover": moveTask,"mouseout":stopMove})
        document.getElementById(id).append(taskEl);
    }
}
//**********/ Not used yet /**********//

// not needed at the moment
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
            tasksObj.todo.unshift(task.innerText);
        }
        if(list==="in-progress-list"){
            tasksObj.inProgress.unshift(task.innerText);
        }
        if(list==="done-list"){
            tasksObj.done.unshift(task.innerText);
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasksObj));
}

//not done
function searching(){
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
