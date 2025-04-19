const playIcon = `<i class="bi bi-play-fill"></i>`
const pauseIcon = `<i class="bi bi-pause-fill"></i>`
const editIcon = `<i class="bi bi-pencil-square"></i>`

let mouseX;
let mouseY;

let clickingBar = false;

document.addEventListener("DOMContentLoaded",() => {
    const preview = document.getElementById("video_preview")

    const playerBarContainer = document.getElementById("player_bar")
    const bar = document.createElement("div")
    const progress = document.createElement("div")
    const buttonsDiv = document.createElement("div")
    const playButtonDiv = document.createElement("div")
    const playPauseButton = document.createElement("button")
    const timeDiv = document.createElement("div")
    const rightButtonsDiv = document.createElement("div")
    const editButton = document.createElement("button")

    playerBarContainer.appendChild(bar)
    bar.className = "plyr_bar"

    bar.appendChild(progress)
    progress.className = "plyr_progress"
    
    playerBarContainer.appendChild(buttonsDiv)
    buttonsDiv.id = "plyr_buttons"

    buttonsDiv.append(timeDiv)
    timeDiv.id = "time"

    buttonsDiv.appendChild(playButtonDiv)
    playButtonDiv.id = "play_button_div"

    playButtonDiv.appendChild(playPauseButton)
    playPauseButton.id = "play_pause_btn"
    playPauseButton.innerHTML = playIcon
    playPauseButton.type = "button"
    playPauseButton.addEventListener("click", () => {
        if(!preview) return;
        
        if(preview.paused) {
            preview.play()
            playPauseButton.innerHTML = pauseIcon
        } else {
            preview.pause()
            playPauseButton.innerHTML = playIcon
        }
    })

    buttonsDiv.appendChild(rightButtonsDiv)
    rightButtonsDiv.id = "right_buttons_div"

    rightButtonsDiv.appendChild(editButton)
    editButton.id = "video_edit_button"
    editButton.type = "button"
    // editButton.innerHTML = editIcon

    preview.addEventListener("loadedmetadata", () => {
        timeDiv.textContent = `${secsToHours(0)}/${secsToHours(Math.floor(preview.duration))}`
        playPauseButton.innerHTML = preview.paused ? playIcon : pauseIcon
    })

    preview.addEventListener("timeupdate", () => {
        const {currentTime, duration} = preview
        const {width} = bar.getBoundingClientRect()
        const windowWidth = window.innerWidth;
        playPauseButton.innerHTML = preview.paused ? playIcon : pauseIcon

        const resultWidth = (currentTime/ duration) * width
        progress.style.width = `${resultWidth*100/windowWidth}vw`

        timeDiv.textContent = `${secsToHours(Math.floor(preview.currentTime))}/${secsToHours(Math.floor(preview.duration))}`
    })

    bar.addEventListener("mousedown", () => {
        const {x, width} = bar.getBoundingClientRect() 
        clickingBar = true
        
        preview.currentTime = ((mouseX - x)/width) * preview.duration
    })

    bar.addEventListener("mouseup", () => {
        clickingBar = false
    })

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    
        if(clickingBar) {
            const {x, width} = bar.getBoundingClientRect()
            const windowWidth = window.innerWidth;
            
            const time = ((mouseX - x)/width) * preview.duration

            const resultWidth = (time/ preview.duration) * width
            progress.style.width = `${resultWidth*100/windowWidth}vw`

            preview.currentTime = time

        }
    })
})

function secsToHours(segundos) {
    const hours = Math.floor(segundos / 3600);
    const min = Math.floor((segundos % 3600) / 60);
    const seg = segundos % 60;
  
    const h = String(hours).padStart(2, '0');
    const m = String(min).padStart(2, '0');
    const s = String(seg).padStart(2, '0');
  
    return `${h}:${m}:${s}`;
  }
