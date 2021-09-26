if(!JSON.parse(localStorage.getItem("tasks"))){
    const tasks = {
    "todo": [],
    "in-progress": [],
    "done": []
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}else{
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    updateDOMfromLocalStorage()
}

function createTask(task){
    const deleteBtnEl = createElement("button",["✖"],["delete-btn"],{},{"click": deleteTask});
    const taskP = createElement("p",[task],["task-p"],{contenteditable:"false"},{"mouseover": moveTask,"mouseout":stopMove})
    const taskEl = createElement("li",[taskP,deleteBtnEl],["task","draggable"],{draggable:"true"})
    return taskEl;
}

function addTask({target}){
    if(target.className==="add-button"){
        const task = target.previousSibling.previousSibling.value;  //try to find better js path
        const listId = target.parentElement.parentElement.id;   //try to find better js path
        if(task!==""){
            //create DOM element
            const taskEl = createTask(task);
            target.parentElement.after(taskEl);
            addDragAndDropEventListeners();
            //Update local storage
            const tasksObj = JSON.parse(localStorage.getItem("tasks"));
            tasksObj[listIdToObjKey(listId)].unshift(task);
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
    if(target.classList.contains("task-p")){
        target.setAttribute("contenteditable",true);
        target.click();
        document.querySelector("body").removeEventListener("dblclick",editTask);
        const task = target.innerText; 
        target.addEventListener("blur",(event)=>{updateEditToLocalStorage(event,task);
        target.setAttribute("contenteditable",false)} )
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
        document.getElementById("first-to-do-li").after(moveTaskEl.closest("li"));
    }
    if(keyCode===50&&altKey){
        moveInLocalStorage("in-progress")
        document.getElementById("first-in-progress-li").after(moveTaskEl.closest("li"));

    }
    if(keyCode===51&&altKey){
        moveInLocalStorage("done")
        document.getElementById("first-done-li").after(moveTaskEl.closest("li"));

    }
}

function search(){
    const allTasks = document.querySelectorAll("li.task")
    for(let task of allTasks){
        if(task.firstChild.innerText.toLowerCase().includes(document.querySelector("#search").value.toLowerCase())){
            task.classList.add("searched")
        }else{
            task.classList.add("not-searched")
        }
    }
}

function removeSearchClass() {
    const allTasks = document.querySelectorAll("li.task")
    for(let task of allTasks){
        task.classList.remove("searched","not-searched")
    }
}

function handleSearchEvent(){
    document.addEventListener("input",
    ()=>{removeSearchClass();
        search();
        });
    if(document.querySelector("#search").value===""){
        const tasks = document.querySelectorAll("li.task")
        tasks.forEach((task)=>task.classList.remove("close"));
    }
}

function disableSearch(){
    if(document.querySelector("#search").value===""){
        removeSearchClass();   
    }
}

// Event listeners:
document.querySelector("body").addEventListener("click",addTask);
document.querySelector("body").addEventListener("dblclick",editTask);
document.querySelector("#search").addEventListener("focus",handleSearchEvent);
document.querySelector("#search").addEventListener("blur",disableSearch);
document.querySelector("#api-buttons").addEventListener("click",apiSync);
document.addEventListener("click",({target})=>target.focus());
document.querySelector("#delete-all-btn").addEventListener("click",deleteAllTasks);
addLabelEventListener();
document.querySelector("#view-option").addEventListener("click",viewOption);


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
    const objKey = listIdToObjKey(target.closest("ul").id);
    const editTaskIndex = tasksObj[objKey].indexOf(taskText)
    tasksObj[objKey][editTaskIndex]=target.innerText;
    localStorage.setItem("tasks", JSON.stringify(tasksObj));
    document.querySelector("body").addEventListener("dblclick",editTask);
    target.removeAttribute("contenteditable")
}

function moveInLocalStorage(listKey){
    const tasksObj = JSON.parse(localStorage.getItem("tasks"));
    tasksObj[listKey].unshift(moveTaskEl.innerText)
    const objKey = listIdToObjKey(moveTaskEl.closest("ul").id);
    tasksObj[objKey].splice(tasksObj[objKey].indexOf(moveTaskEl.innerText),1)
    localStorage.setItem("tasks", JSON.stringify(tasksObj));
}

function updateDOMfromLocalStorage(){
    updateList("todo","to-do-list");
    updateList("in-progress","in-progress-list");
    updateList("done","done-list");
    addDragAndDropEventListeners();
}

function updateList(key,id){
    const tasksObj = JSON.parse(localStorage.getItem("tasks"));
    for(let task of tasksObj[key]){
        const taskEl = createTask(task);
        document.getElementById(id).append(taskEl);
    }
}

function deleteAllTasks(){
    const tasks = {
        "todo": [],
        "in-progress": [],
        "done": []
        }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    const allTasks = document.querySelectorAll("li.task");
    for( let task of allTasks){
        task.remove();
    }
}
// Drag and Drop:
addDragAndDropEventListeners();
let draggedEl,draggedFromListId,draggedFirstIndex;
function dragStart() {
    draggedEl = this.closest('li');
    draggedFromListId = draggedEl.closest("ul").id;
    draggedFirstIndex = findElementIndexInLocalStorage(draggedEl.firstChild,listIdToObjKey(draggedFromListId))
}

function dragEnter() {
  this.classList.add('over');
}

function dragLeave() {
  this.classList.remove('over');
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop({target}) {
  this.after(draggedEl);
  const objKey = listIdToObjKey(target.closest("ul").id);
  const tasksObj = JSON.parse(localStorage.getItem("tasks"));
  let taskIndex;
  try{
     taskIndex = tasksObj[objKey].indexOf(target.firstChild.innerText);
  }catch{
       taskIndex = -1;
  }
  tasksObj[objKey].splice(taskIndex+1, 0, draggedEl.firstChild.innerText);
  deleteDraggedTaskFromLocalStorage(tasksObj,objKey,target)
  this.classList.remove('over');
}

function deleteDraggedTaskFromLocalStorage(tasksObj,dropObjKey,dropEl){
    const dragObjKey = listIdToObjKey(draggedFromListId);
    let dropElP;
    try{
        dropElP = dropEl.firstChild;
    }catch{
        dropElP = dropEl;
    }
    if(dragObjKey===dropObjKey&&draggedFirstIndex>findElementIndexInLocalStorage(dropElP,dropObjKey)){
        tasksObj[dragObjKey].splice(tasksObj[dragObjKey].lastIndexOf(draggedEl.firstChild.innerText),1)
    }else{
        tasksObj[dragObjKey].splice(tasksObj[dragObjKey].indexOf(draggedEl.firstChild.innerText),1)
    }
    localStorage.setItem("tasks", JSON.stringify(tasksObj));
}

function findElementIndexInLocalStorage(element,objKey){
    const tasksObj = JSON.parse(localStorage.getItem("tasks"));
    try{
            return tasksObj[objKey].indexOf(element.innerText);
    }catch{
        return -1;
    }
}

function addDragAndDropEventListeners() {
  const draggables = document.querySelectorAll('.draggable');
  const dragListItems = document.querySelectorAll('.draggable-list li');

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart);
  });

  dragListItems.forEach(item => {
    item.addEventListener('dragover', dragOver);
    item.addEventListener('drop', dragDrop);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
  });
}


//  API

async function apiSync({target}){
    document.querySelector("#api-buttons").insertAdjacentHTML("afterbegin" ,'<div id ="loader" class="loader"><span class="circle"></span><span class="circle"></span><span class="circle"></span> </div>');
    if(target.id==="save-btn"){
            await putApi();
    }
    if(target.id==="load-btn"){
        deleteAllTasks();
        localStorage.setItem("tasks", JSON.stringify( (await getApi()).tasks));
        updateDOMfromLocalStorage();
        addDragAndDropEventListeners();
    }
    document.querySelector("#loader").remove();

}
async function putApi(){
    const tasksObj = JSON.parse(localStorage.getItem("tasks"));
    const requestObj = {
    "binId" : "614af9614021ac0e6c080cc1",
    "tasks" : tasksObj
    }
    await fetch("https://json-bins.herokuapp.com/bin/614af9614021ac0e6c080cc1", {
        method:"PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body : JSON.stringify(requestObj)
    })
}

async function getApi(){
    const apiTask=await fetch("https://json-bins.herokuapp.com/bin/614af9614021ac0e6c080cc1", {
        method:"GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
    })
    return await apiTask.json();
}

//  Bonus features:

function deleteTask({target}){
    //local storage update
    const tasksObj = JSON.parse(localStorage.getItem("tasks"));
    const objKey = listIdToObjKey(target.closest("ul").id);
    tasksObj[objKey].splice(tasksObj[objKey].indexOf(target.innerText),1)
    localStorage.setItem("tasks", JSON.stringify(tasksObj));
    //delete from DOM
    target.closest("li").remove();

}

function addLabelEventListener(){
    const labels=document.querySelectorAll(".label")
    for(let label of labels){
        label.addEventListener("click",toggleTaskList)
    }
}

function toggleTaskList({target}) {
    const tasks = document.querySelectorAll(`#${target.nextElementSibling.id} li.task`);
    tasks.forEach((task)=>task.classList.toggle("close"));
};

function viewOption(){
    document.querySelector("body > main").classList.toggle("default")
    document.querySelector("body > main").classList.toggle("row-view")
}

function alertNotificationToDoTask(date,time,notification){ //date format: dd/mm/yyyy ,time format: hh:mm 
    //checkDateAndTimeFormat
    const year = date.slice(6)
    const month = date.slice(3,5)
    const day = date.slice(0,2)
    let alertDate = new Date(`${year}-${month}-${day}T${time}`);
    let alertDateMil = alertDate.getTime();
    let currentTimeMil = new Date().getTime()
    let subtractMilliSecondsValue = alertDateMil - currentTimeMil;
    setTimeout(timeToAlert, subtractMilliSecondsValue);
    function timeToAlert() {
        alert(notification);
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
