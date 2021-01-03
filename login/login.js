var submitButton = document.getElementById('submit-button')

submitButton.addEventListener('click', event => {
    event.preventDefault()
    console.log('Hello')
    var xhr = new XMLHttpRequest();
    var apiURL = '/login'
    xhr.open("post", apiURL, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    var username = document.getElementById('username').value 
    var pwd = document.getElementById('pwd').value
    xhr.onload = function() {
        console.log(xhr.responseText)
    }
    xhr.send(JSON.stringify({
        username: username,
        password: pwd
    }))
})



