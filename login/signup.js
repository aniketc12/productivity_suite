var submitButton = document.getElementById('submit-button')
console.log('hello')

submitButton.addEventListener('click', event=> {
    event.preventDefault()
    console.log('here')
    var xhr = new XMLHttpRequest();
    var apiURL = '/auth/signup'
    xhr.open("post", apiURL, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    var username = document.getElementById('username').value 
    var pwd1 = document.getElementById('pwd1').value
    var pwd2 = document.getElementById('pwd2')
    if (pwd1 != pwd2.value) {
        alert('Passwords Do Not Match')
        pwd2.value = ''
    }
    xhr.onload = function() {
        if (xhr.responseText == 'Success') {
            window.location.replace('./login.html')
        }
        else {
            alert('That username already exists')
        }
    }
    xhr.send(JSON.stringify({
        username: username,
        password: pwd1
    }))
})
