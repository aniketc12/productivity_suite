var minContainer = document.getElementById('min')
var secContainer = document.getElementById('sec')
var startButton = document.getElementById('play')
var resetButton = document.getElementById('reset')
var timeSubmit = document.getElementById('time-submit')



var minutes = 25
var seconds = 0
var isPlaying = false
var workMinutes = 25
var workSeconds = 0
var sbreakMinutes = 5
var sbreakSeconds = 0
var bbreakMinutes = 15
var bbreakSeconds = 0
var current = "work"
var iter = 0

renderClock = () => {
    minContainer.innerHTML = ''
    secContainer.innerHTML = ''
    if (minContainer <= 9) {
        minContainer.innerHTML = 0
    }
    minContainer.innerHTML += minutes
    if (seconds <= 9) {
        secContainer.innerHTML = 0
    }
    secContainer.innerHTML += seconds
    var currHeader = document.getElementById('current')
    currHeader.innerHTML = ''
    if (current == 'work') {
        currHeader.innerHTML = 'Time for work'
    }
    else if (current == 'sbreak') {
        currHeader.innerHTML = 'Time for a small break'
    }
    else if (current == 'bbreak') {
        currHeader.innerHTML = 'Time for a big break'
    }
}

renderClock()

timeSubmit.addEventListener('click', event => {
    var wmin = document.getElementById('work-min')
    var wsec = document.getElementById('work-sec')
    var smin = document.getElementById('s-break-min')
    var ssec = document.getElementById('s-break-sec')
    var bmin = document.getElementById('b-break-min')
    var bsec = document.getElementById('b-break-sec')
    if (checkTime(wmin, 0, 59)) {
        workMinutes = wmin.value
    }
    if (checkTime(smin, 0, 59)) {
        sbreakMinutes = smin.value
    }
    if (checkTime(bmin, 0, 59)) {
        bbreakMinutes = bmin.value
    }
    if (checkTime(wsec, 0, 59)) {
        workSeconds = wsec.value
    }
    if (checkTime(ssec, 0, 59)) {
        sbreakSeconds = ssec.value
    }
    if (checkTime(bsec, 0, 59)) {
        bbreakSeconds = bsec.value
    }

    current = "work"
    minutes = workMinutes
    seconds = workSeconds
    isPlaying = true
    play()
    renderClock()

})

function checkTime(min, low, high) {
    if (min.value) {
        if (min.value < low || min.value > high) {
            alert('Enter a correct time')
        }
        else {
            return true
        }
    }
    return false
}

function play() {
    isPlaying = !isPlaying
    if (isPlaying) {
        startButton.innerHTML = ''
        startButton.innerHTML += '<span class="glyphicon glyphicon-pause">'
    }
    else {
        startButton.innerHTML = ''
        startButton.innerHTML += '<span class="glyphicon glyphicon-play">'
    }

}

startButton.addEventListener('click', event=> {
    play()
})


var updateClock = setInterval(update, 1000)
function update(){
    if (isPlaying) {
        seconds --
        if (seconds < 0) {
            seconds = 59
            minutes -- 
            if (minutes < 0) {
                if (current == 'work') {
                    iter++
                    if (iter == 4) {
                        iter = 0
                        current = 'bbreak'
                    }
                    else {
                        current = 'sbreak'
                    }
                }
                else if (current == 'sbreak') {
                    current = 'work'
                }
                else {
                    current = 'work'
                }
                if (current == 'work') {
                    minutes = workMinutes
                    seconds = workSeconds
                }
                else if (current == 'sbreak') {
                    minutes = sbreakMinutes
                    seconds = sbreakSeconds
                }
                else {
                    minutes = bbreakMinutes
                    seconds = bbreakSeconds
                }
            }
        }
        renderClock()
    }
}

resetButton.addEventListener('click', event => {
    location.reload()
})
