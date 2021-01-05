var equal = document.getElementById('equal')
var clr = document.getElementById('clr')
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

clr.addEventListener ('click', event => {
    document.calc.txt.value = ''
})

function update() {
    val = ''
    try {
        val = eval(document.calc.txt.value)
    }
    catch {
        val = ''
        alert('Please Enter a valid input')
    }
    
    document.calc.txt.value = val
}

equal.addEventListener('click', event => {
    update()
})

document.onkeydown = function (e) {
  e = e || window.event;
  switch (e.which || e.keyCode) {
        case 13 : {
            e.preventDefault()
            update() 
        }
            break;
  }
}
