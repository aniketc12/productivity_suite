var submitButton = document.getElementById('submit-button')

submitButton.addEventListener('click', event => {
    event.preventDefault()
    var xhr = new XMLHttpRequest();
    var apiURL = '/login'
    xhr.open("post", apiURL, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    var username = document.getElementById('username').value 
    var pwd = document.getElementById('pwd').value
    xhr.onload = function() {
        var reply = JSON.parse(xhr.responseText)
        if (reply.auth == false) {
            alert(reply.message)
            return
        }
        else {
            localStorage.setItem("username", reply.result)
            localStorage.setItem("token", reply.token)
            alert('Logged In')
            window.location.replace('/')
        }

    }
    xhr.send(JSON.stringify({
        username: username,
        password: pwd
    }))
})



