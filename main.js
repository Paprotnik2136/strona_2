
let addText = document.getElementById("add-text");
let addDate = document.getElementById("add-date");

let searchText = document.getElementById("search");

let searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener("click",findTask);

let addBtn = document.getElementById("add-btn");
addBtn.addEventListener("click",()=>{
    addTask();
})

let now = new Date()
addDate.setAttribute("min",now.toISOString().split('T')[0]);

let next = 0;
loadTask();

//tasks
function addTask(taskId,taskText,taskDate)
{
    let task =  document.getElementById("task").content.cloneNode(true);
    task = task.children[0];
    let id = -1;
    if(taskId)
        id = taskId;
    else
        id = ++next;
    task.setAttribute("data-id",id);

    let text = task.children[0];
    let date = task.children[1];
    let deleteBtn = task.children[2];
    deleteBtn.addEventListener("click",()=>{
        deleteTask(id);
    })

    if(taskText)
        text.value = taskText;
    else
        text.value = addText.value;

    if(taskDate)
        date.innerText = taskDate;
    else
        date.innerText =  addDate.value;
    
    if(text.value.length < 3 || text.value.length > 255 || date.innerText=="")
    {
        alert("not oke");
        return;
    }

    task.addEventListener("click",()=>{
        editTask(task);
    })

    let parent =  document.getElementById("list");

    parent.appendChild(task);

    saveTasks();
}
function findTask()
{
    let parent =  document.getElementById("list");

    for(let task of parent.children)
    {
        let text = task.getElementsByClassName("task-text")[0].value;
        if(!text.includes(searchText.value) && searchText.value!="")
            task.classList.add("hide");
        else
            task.classList.remove("hide");
    }
}

function saveTasks()
{
    let parent =  document.getElementById("list");

    for(let task of parent.children)
    {
        let text = task.children[0];
        let date = task.children[1];

        localStorage.setItem(task.getAttribute("data-id"),JSON.stringify({
            text: text.value,
            date: date.innerText
        }))
    }
}

function loadTask()
{
    for (let i = 0; i < localStorage.length; i++)
    {
        let id = localStorage.key(i);
        next = id > next ? id : next;
        let data = JSON.parse(localStorage.getItem(id));
        console.log(id,data.text,data.date);
        addTask(id,data.text,data.date);
    }
}

function deleteTask(delId)
{
    let parent =  document.getElementById("list");
    for(let task of parent.children)
    {
        if(task.getAttribute("data-id") == delId)
        {
            parent.removeChild(task);
            localStorage.removeItem(delId);
            return;
        }
    }
}

function editTask(task)
{
    let text = task.children[0];
    text.removeAttribute("disabled");

    //disable item editing
    text.addEventListener("mouseout",(event)=>{
        event.preventDefault();
        text.disabled = true;
        text.classList.remove("is-active");

        //update storage
        saveTasks();
    });
}