var lists = document.getElementById('lists')
var addNewListInput = document.getElementById('add-new-list-input')
var addNewList = document.getElementById('add-new-list')
var todoHeader = document.getElementById('list-header')
var addTodoList = document.getElementById('add-todo-list')
var addTodoListInput = document.getElementById('add-todo-list-input')
var tasksContainer = document.getElementById('tasks')
var deleteLists = document.getElementById('delete-lists')
var clearTasks = document.getElementById('clear-tasks')
var auth = document.getElementById('auth')

var isNotAuth = '\
    <li><a href="/login/signup.html"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li> \
    \n <li><a href="/login/login.html"><span class="glyphicon glyphicon-log-in"></span> Login</a></li> \
'

var isAuth = '\
    <li><a href="/login/logout.html"><span class="glyphicon glyphicon-user"></span> Log out </a></li> \
'


var xhr = new XMLHttpRequest();
var username = ''
var apiURL = 'http://localhost:8000/auth/isAuth/' + localStorage.getItem("username")
var allLists = []

xhr.open("get", apiURL, false)
xhr.setRequestHeader('Content-Type', 'application/json')
xhr.setRequestHeader("authorization", "Bearer " + localStorage.getItem("token"))
xhr.onload = function() {
    var res = JSON.parse(xhr.responseText) 
    if (res.auth == false) {
        auth.innerHTML = isNotAuth
    }
    else {
        auth.innerHTML = isAuth
    }
}
xhr.send()

var currentListTasks = []


var xhr = new XMLHttpRequest();
var username = ''
var apiURL = 'http://localhost:8000/api/todo/' + localStorage.getItem("username")
var allLists = []

xhr.open("get", apiURL, false)
xhr.setRequestHeader('Content-Type', 'application/json')
xhr.setRequestHeader("authorization", "Bearer " + localStorage.getItem("token"))
console.log(localStorage.getItem("token"))
xhr.onload = function() {
    var res = JSON.parse(xhr.responseText) 
    if (res.auth == false) {
        window.location.replace("/login/login.html")
    }
    allLists = res.lists
    console.log(allLists)
}
xhr.send()

if (allLists == null) {
    allLists = []
}

deleteLists.addEventListener('click', event => {
    event.preventDefault()
    allLists = []
})

clearTasks.addEventListener('click', event => {
    event.preventDefault()
    for (let a = 0; a < allLists.length; a++) {
        if (allLists[a].isSelected) {
            allLists[a].tasks = []
            break
        }
    }
    displayListsSelected()

})

addTodoList.addEventListener('submit', event => {
    event.preventDefault()
    let newTodoName = addTodoListInput.value
    if (newTodoName == '') {
        return
    }
    if (allLists.length == 0) {
        alert('Please Create a Tasks List')
        return
    }
    addTodoListInput.value = ''
    displayListsSelected(null, newTodoName)

})

addNewList.addEventListener('submit', event => {
    event.preventDefault()
    let newListName = addNewListInput.value
    if (newListName == '') {
        return
    }
    const newListElement = {id:Date.now().toString(), 
        name: newListName, 
        tasks: [],
        isSelected: false}
    allLists.push(newListElement)
    if (allLists.length == 1) {
        allLists[0].isSelected = true
    }
    addNewListInput.value = ''
    displayListsSelected(newListElement, null)
})


writeToDisk = () => {
    var chr = new XMLHttpRequest();
    chr.open("put", apiURL, true)
    chr.setRequestHeader('Content-Type', 'application/json')
    chr.setRequestHeader("authorization", "Bearer " + localStorage.getItem("token"))
    chr.onload = function() {
        if (xhr.responseText.auth == false) {
            window.location.replace("/login/login.html")
        }
    }
    chr.send(JSON.stringify(allLists))
}

clearChildObjects = () => {
    while(lists.firstChild) {
        lists.removeChild((lists.firstChild))
    }
    while(todoHeader.firstChild) {
        todoHeader.removeChild((todoHeader.firstChild))
    }
    while(tasksContainer.firstChild) {
        tasksContainer.removeChild((tasksContainer.firstChild))
    }

}

displayListsSelected = (target, newTodo) => {

    clearChildObjects()

    var toDelete = -1
    var redo = false

    if (allLists.length == 0) {
        //removeTodoInput()
    }

    for (var i = 0; i <allLists.length; i++) {
        var listObject = document.createElement('li')
        var listDeleteButton = document.createElement('BUTTON')
        listDeleteButton.innerHTML = " - "
        listDeleteButton.classList.add("btn")
        listDeleteButton.classList.add("delete-list-button")
        if (target != null) {
            if (target.className == 'btn delete-list-button') {
                if (allLists[i].id == target.id) {
                    toDelete = i
                    if (allLists.length > 1) {
                        if (i == (allLists.length-1)) {
                            allLists[i-1].isSelected = true
                            redo = true
                        }
                        else {
                            allLists[i+1].isSelected = true
                        }
                    }
                    continue
                }
            }
            else {
                if (allLists[i].id == target.id) {
                    allLists[i].isSelected = true
                }
                else {
                    allLists[i].isSelected = false
                }
            }
        }
        /*
         * Render all necessary objects for the
         * currently selected todo list
         */
        if (allLists[i].isSelected == true) {
            listObject.classList.add('selected-list')
            var todoHeaderObject = document.createElement('h2')
            todoHeaderObject.classList.add('current-list-title')
            todoHeaderObject.innerHTML = allLists[i].name
            todoHeader.appendChild(todoHeaderObject)
            if (newTodo != null) {
                var task = {isCompleted: false, todo:newTodo}
                allLists[i].tasks.push(task)
            }
            currentListTasks = allLists[i].tasks
            /*
             * Render the todos for the selected task
             */
            for (var j = 0; j<currentListTasks.length; j++) {
                var todoObject = document.createElement('div')
                todoObject.classList.add('todo')
                // Create Checkbox and add to todoObject
                var checkboxObject = document.createElement('INPUT')
                checkboxObject.setAttribute('type', 'checkbox')
                var todoId = "todo-"+j
                checkboxObject.id = todoId
                todoObject.appendChild(checkboxObject)
                //Create todo label and child objects
                var todoLabel = document.createElement('LABEL')
                todoLabel.htmlFor = todoId
                var spanObject = document.createElement('SPAN')
                spanObject.classList.add('todo-check')
                todoLabel.innerHTML += "&nbsp"
                todoLabel.appendChild(spanObject)
                todoLabel.innerHTML +=  "&nbsp  "+currentListTasks[j].todo
                todoObject.appendChild(todoLabel)
                var deleteTodoButton = document.createElement('BUTTON')
                deleteTodoButton.classList.add('delete-todo')
                deleteTodoButton.innerHTML += ' - '
                deleteTodoButton.id = 'del-todo-'+j
                deleteTodoButton.addEventListener('click', event => {
                    var deleteId = parseInt(event.target.id.substring(9))
                    currentListTasks.splice(deleteId, 1)
                    displayListsSelected()
                })
                todoObject.appendChild(deleteTodoButton)
                tasksContainer.appendChild(todoObject)
                if (currentListTasks[j].isCompleted == true) {
                    checkboxObject.checked = true
                }
                checkboxObject.addEventListener('click', event => {
                    var checkId = event.target.id
                    var taskIndex = parseInt(checkId.substring(5))
                    var checkbox = document.getElementById(checkId)
                    if (checkbox.checked == true) {
                        currentListTasks[taskIndex].isCompleted = true
                        var currIndex = taskIndex
                        for (var k = 0; k<currentListTasks.length; k++) {
                            if (currentListTasks[k].isCompleted) {
                                continue
                            }
                            else {
                                if (k >= taskIndex) {
                                    break
                                }
                                var toPush = currentListTasks[k]
                                currentListTasks[k] = currentListTasks[taskIndex]
                                for (var l = k+1; l <= taskIndex; l++) {
                                    [currentListTasks[l], toPush] = [toPush, currentListTasks[l]]
                                }
                                break
                            }
                        }
                    }
                    else {
                        currentListTasks[taskIndex].isCompleted = false
                    }
                    displayListsSelected()
                })
            }

        }
        else {
            /*
             * If list is not selected we do not need to add the
             * selected-list class
             */
            listObject.classList.add('todo-list')
        }
        /*
         * Render all lists
         */
        listObject.id = allLists[i].id
        listDeleteButton.id = allLists[i].id
        listObject.addEventListener('click', event => {
            displayListsSelected(event.target)
        })
        listObject.appendChild(listDeleteButton)
        lists.appendChild(listObject)
        listObject.innerHTML += " "+allLists[i].name

    }
    if (toDelete >= 0) {
        allLists.splice(toDelete, 1)
    }
    if (redo == true) {
        clearChildObjects()
        displayListsSelected(null)
    }
    writeToDisk()
}



displayListsSelected(null)

