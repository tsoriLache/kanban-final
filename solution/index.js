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
    return el;
}

function addTask({target}){
    if(target.className==="add-button"){
        const task = target.previousSibling.previousSibling.value;
        if(task!==""){
            const taskEl = createElement("li",[task],["task"])
            target.closest('ul').append(taskEl);
            target.previousSibling.previousSibling.value="";
        }else{
            alert("Empty Task")
        }
    }
}

document.querySelector("body").addEventListener("click",addTask);
  