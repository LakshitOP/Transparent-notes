const fs = require("fs")

let tasks = JSON.parse(fs.readFileSync("tasks.json"))

const taskContainer = document.getElementById("tasks")
const completedContainer = document.getElementById("completed")
const input = document.getElementById("newTask")

const clearBtn = document.getElementById("clearCompleted")
const deleteAllBtn = document.getElementById("deleteAll")

const completedPanel = document.getElementById("completedPanel")
const completedToggle = document.getElementById("completedToggle")
const completedCount = document.getElementById("completedCount")

let isCompletedDrawerOpen = false

function syncCompletedDrawer(count){
    const hasCompletedTasks = count > 0

    completedToggle.style.display = hasCompletedTasks ? "flex" : "none"
    completedPanel.style.display = hasCompletedTasks ? "block" : "none"

    if(!hasCompletedTasks){
        isCompletedDrawerOpen = false
    }

    completedPanel.classList.toggle("open", isCompletedDrawerOpen && hasCompletedTasks)
    completedToggle.classList.toggle("rotated", isCompletedDrawerOpen && hasCompletedTasks)
}

function save(){
    fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2))
}

function render(){

    taskContainer.innerHTML=""
    completedContainer.innerHTML=""

    tasks.forEach((task, i) => {

        const div = document.createElement("div")
        div.className = "task"
        
        // Add completed class for styling
        if(task.done){
            div.classList.add("completed")
        }

        const check = document.createElement("input")
        check.type = "checkbox"
        check.checked = task.done

        check.onclick = () => {
            tasks[i].done = check.checked
            save()
            render()
        }

        const text = document.createElement("span")
        text.innerText = task.text
        text.contentEditable = true

        text.onblur = () => {
            tasks[i].text = text.innerText
            save()
        }

        // Prevent checkbox toggle when editing text
        text.onkeydown = (e) => {
            if(e.key === "Enter") {
                e.preventDefault()
                text.blur()
            }
        }

        div.appendChild(check)
        div.appendChild(text)

        if(task.done){
            completedContainer.appendChild(div)
        } else {
            taskContainer.appendChild(div)
        }

    })

    // Update completed count
    const completedCount_value = tasks.filter(t => t.done).length
    completedCount.innerText = completedCount_value
    
    syncCompletedDrawer(completedCount_value)
}

input.addEventListener("keydown", (e) => {

    if(e.key === "Enter"){

        e.preventDefault()

        if(input.value.trim() !== ""){

            tasks.push({
                text: input.value.trim(),
                done: false
            })

            input.value = ""

            save()
            render()
        }
    }

})

completedToggle.onclick = () => {
    isCompletedDrawerOpen = !isCompletedDrawerOpen
    syncCompletedDrawer(tasks.filter(t => t.done).length)
}

clearBtn.onclick = () => {

    tasks = tasks.filter(t => !t.done)

    save()
    render()

}

deleteAllBtn.onclick = () => {
    if(tasks.length === 0){
        return
    }

    tasks = []
    isCompletedDrawerOpen = false
    input.value = ""

    save()
    render()
}

render()

new Sortable(taskContainer, {
    animation: 150,
    onEnd: function(evt){

        const moved = tasks.splice(evt.oldIndex, 1)[0]
        tasks.splice(evt.newIndex, 0, moved)

        save()
    }
})