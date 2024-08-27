// import * as readline from 'readline-sync'
interface Task {
    id: string,
    title: string,
    completed: boolean,
    description: string
}

const tasks: Task[] = []
 
// retrieving the updated list of tasks from local browser
const savedTasks = localStorage.getItem("tasks")
if(savedTasks){
    tasks.push(...JSON.parse(savedTasks))
    console.log(savedTasks)
}

// updating form values for creating a new task
const form = document.querySelector<HTMLFormElement>('.form')
const input = document.getElementById('input') as HTMLInputElement | null
const description = document.getElementById('desc') as HTMLInputElement | null
const list = document.querySelector<HTMLDivElement>('.list')
const editPage = document.querySelector<HTMLDivElement>('.edit-page')

// creating a new task
form?.addEventListener('submit', e => {
    e.preventDefault()
    if(input?.value == null || input?.value == "") return
    if(description?.value == null || description?.value == "") return
    const now = new Date()
    const time = now.toLocaleString('en-US', {hour12: true})
    const newTask = {
        id: time,
        completed: false,
        title: input.value,
        description: description.value
    }
    addTask(newTask);

    input.value = ''
    description.value = ''
});

// adding each task created to the list
const addTask = (task: Task) => {
    tasks.push(task)
    console.log(tasks)
    listTasks();

    localStorage.setItem('tasks', JSON.stringify(tasks))
    
}

// check if task is completed or not
const completeTask = (id: string): void => {
    const task = tasks.find(task => task.id === id)
    if(task){
        task.completed = !task.completed
    }
    else{
        console.log('task not found')
    }
    console.log(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    listTasks();
}


// edit task

const editTask = (id: string) => {
    list?.classList.add('active')
    editPage?.classList.remove('active')
    const task = tasks.find(task => task.id === id);
    if (!task)return

    if (list) {
        
        if (editPage) {
            editPage.innerHTML = `
            <div class='form'>
                <input type="text" id="edit-title-${id}" value="${task.title}">
                <textarea id="edit-desc-${id}">${task.description}</textarea>
                <button id="save-${id}">Update</button>
                <button id="cancel-${id}">Cancel</button>
            </div>
            `;

            document.getElementById(`save-${id}`)?.addEventListener('click', () => {
                const updatedTitle = (document.getElementById(`edit-title-${id}`) as HTMLInputElement).value;
                const updatedDesc = (document.getElementById(`edit-desc-${id}`) as HTMLTextAreaElement).value;
                task.title = updatedTitle;
                task.description = updatedDesc;
                
                list.classList.remove('active')
                editPage.classList.add('active')
                localStorage.setItem('tasks', JSON.stringify(tasks));
                listTasks(); // Refresh the task list display
            });

            document.getElementById(`cancel-${id}`)?.addEventListener('click', () => {
                list?.classList.remove('active')
                editPage?.classList.add('active')
                listTasks(); // Revert changes if cancel is clicked
            });
        }
    }
};

// deleting task
const deleteTask = (id: string) => {
    const taskIndex = tasks.findIndex(task => task.id === id)
    tasks.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks))
    listTasks()
}

// displaying all tasks
const listTasks = () => {
    if (list){

        list.innerHTML = tasks.map((task, index) => {
            return (
                `
                    <div class="task">
                        <h1>${task.title}</h1>
                        <div class='details'>
                            <input class="completed" type="checkbox" name="" id="${task.id}" >
                            <button class='delete-btn'  id="${task.id}">Delete</button>
                            <button class='edit-btn' id="edit-${task.id}">Edit</button>
                        </div>
                    </div>
                `
            )
        }).join('')
    }

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {  
            const target = e.target as HTMLElement
            console.log(target.id)
            deleteTask(target.id)
        })
    })

    document.querySelectorAll('.completed').forEach((btn) => {
        btn.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement
            
            completeTask(target.id)
        })
    })
     // Attach event listeners to edit buttons for editing tasks
     document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const target = e.target as HTMLElement;
            
            editTask(target.id.replace('edit-', ''));
        });
    });
}
listTasks();






