"use strict" 

// Selectores
const list = document.querySelector(".list"); 
const newTask = document.querySelector(".new__task");
const btnAdd = document.querySelector(".btn-add");
const btnFilter = document.querySelector(".btn-filter");
const modalFilter = document.querySelector(".modal__filter");
const btnClosed = document.querySelector(".closed__filter");
const completed = document.querySelector(".filter__completed");
const pending = document.querySelector(".filter__pending"); 
const all = document.querySelector(".filter__all");
const counter = document.querySelector(".counter");

// creando el array tasks, el filtro y los contadores
let tasks = JSON.parse(localStorage.getItem("tarea")) || [];
let currentFilter = "all";
let countTask = 0;
let countPending = 0;
let countCompleted = 0;

// funcion para crear mostrar o modificar las tareas 
const renderTask = ()=>{
    countTasks()
    list.innerHTML = "";
    if (tasks.length === 0){
        const li = document.createElement("li");
        li.classList.add("message");
        li.textContent = "No hay tareas pendientes";
        list.appendChild(li);
        counter.style.display = "none";
        return;
    }
    
    counter.style.display = "flex";
    countTask = tasks.length;
    counter.innerHTML="";
    
    const  tareas = document.createElement("p");
    const pendientes = document.createElement("p")
    const completadas = document.createElement("p")
    
    counter.appendChild(tareas);
    counter.appendChild(pendientes);
    counter.appendChild(completadas);
    
    tareas.textContent = `Tareas: ${countTask}`; 
    pendientes.textContent = `Pendientes: ${countPending}`; 
    completadas.textContent = `Completadas: ${countCompleted}`;
    
    
    if (currentFilter=== "pending" && countPending == 0) {
        const li = document.createElement("li");
        li.classList.add("message")
        li.textContent = "No hay tareas pendientes"; 
        list.appendChild(li);
        return;
    }
    
    if (currentFilter=== "completed" && countCompleted == 0) {
        const li = document.createElement("li");
        li.classList.add("message")
        li.textContent = "No hay tareas completadas"; 
        list.appendChild(li);
        return
    }

    tasks.forEach((task,index)=>{
    if(currentFilter === "pending" && task.completed) return;
    if(currentFilter === "completed" && !task.completed) return;

    const li = document.createElement("li"); 
    const text = document.createElement("p");
    const check = document.createElement("input"); 
    const btnDelete = document.createElement("button");

    check.type = "checkbox";
    btnDelete.textContent = "Eliminar";
    text.textContent= task.text;

    li.classList.add("task");
    check.classList.add("check");
    btnDelete.classList.add("btn-delete");

    li.dataset.index = index;
    
    li.appendChild(check);
    li.appendChild(text);
    li.appendChild(btnDelete);

    if (task.completed){
        text.classList.add("complete");
        check.checked = true;
    }

    text.addEventListener("click",()=>{
        const input = document.createElement("input");
        input.classList.add("modify");
        input.type = "text"
        input.value = text.textContent; 
        li.replaceChild(input,text)
        input.focus()
        let saved = false;

        input.addEventListener("keydown",e =>{
            if(e.key === "Enter"){
                const index = Number(li.dataset.index);
                if(input.value.trim() === "") {
                    deleteWithAnimation(li,index);
                    saved= true;
                    return
                }
                tasks[index].text = input.value;
                saved = true;
                saveTasks()
                renderTask()
                
            }
        })
        input.addEventListener("blur",()=>{
            const index = Number(li.dataset.index);
            if (!saved) {
                if(input.value.trim() === "") {
                    deleteWithAnimation(li,index);
                    return
                }else{
                    tasks[index].text = input.value;
                    saveTasks()
                    renderTask()
                }
        }})
    })


    btnDelete.addEventListener("click",()=>{
        const index = Number(li.dataset.index);
        deleteWithAnimation(li,index);
    })

    check.addEventListener("change",()=>{
        const index = Number(li.dataset.index)
        tasks[index].completed = check.checked;
        saveTasks();
        renderTask();
    })    

    list.appendChild(li);

    })

};

//Funcion para contar tareas

const countTasks = ()=> {
    countCompleted = 0;
    countPending = 0;
    for(let i=0; i<tasks.length;i++) {
        if(tasks[i].completed) {
            countCompleted++; 
        } else {
            countPending++;
        }
    }
}

// Funcion para guardar las tareas
const saveTasks = () => {
    localStorage.setItem("tarea",JSON.stringify(tasks));
};

//Funcion para crear una nueva tarea
const addNewTask = ()=>{
    const value = newTask.value.trim();

    if (value === "") return;

    tasks.push({
        text: value,
        completed: false
    });

    newTask.value = "";
    saveTasks();
    renderTask();
};

// Fundion para eliminar tareas con animacion 
const deleteWithAnimation = (li,index) =>{
    li.classList.add("animation__delete"); 

    li.addEventListener("animationend",()=>{
        tasks.splice(index,1);
        saveTasks();
        renderTask();
    }, {once: true})
}

//Evento cuando se presiona enter 
newTask.addEventListener("keydown",e=>{
    if(e.key==="Enter"){
        addNewTask();
    };
});

//Evento cuando se presiona el boton de agregar
btnAdd.addEventListener("click",addNewTask)

//Eventos cuando se presiona el boton del filtrar
btnFilter.addEventListener("click",()=>{
    modalFilter.style.display = "flex";
});
btnClosed.addEventListener("click",()=>{
    modalFilter.style.display = "none";
});

//Eventos cuando se presiona algun filtro 
pending.addEventListener("click",()=>{
    currentFilter = "pending";
    renderTask();
    modalFilter.style.display ="none";
});

completed.addEventListener("click",()=>{
    currentFilter = "completed";
    renderTask();
    modalFilter.style.display ="none";
});

all.addEventListener("click",()=>{
    currentFilter = "all";
    renderTask();
    modalFilter.style.display ="none";
});

renderTask();