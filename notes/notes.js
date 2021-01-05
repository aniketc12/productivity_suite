var lists = document.getElementById('lists')
var addNewListInput = document.getElementById('add-new-list-input')
var addNewList = document.getElementById('add-new-list')
var deleteLists = document.getElementById('delete-lists')
var saveButton = document.getElementById('save')
var notesArea = document.getElementById('notes-input')
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
var apiURL = 'http://localhost:8000/api/notes/' + localStorage.getItem("username")
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
}
xhr.send()

if (allLists == null) {
    allLists = []
}

saveButton.addEventListener('click', event => {
    event.preventDefault()
    console.log(notesArea.value)
    for (var b = 0; b < allLists.length; b++) {
        if (allLists[b].isSelected) {
            allLists[b].notes = notesArea.value
            writeToDisk()
            return
        }
    }
})

deleteLists.addEventListener('click', event => {
    event.preventDefault()
    allLists = []
})



addNewList.addEventListener('submit', event => {
    event.preventDefault()
    let newListName = addNewListInput.value
    if (newListName == '') {
        return
    }
    const newListElement = {id:Date.now().toString(), 
        name: newListName, 
        notes: [],
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
            notesArea.innerHTML = allLists[i].notes
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

