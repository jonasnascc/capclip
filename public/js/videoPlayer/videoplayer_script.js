const playIcon = `<i class="bi bi-play-fill"></i>`
const pauseIcon = `<i class="bi bi-pause-fill"></i>`
const editIcon = `<i class="bi bi-pencil-square"></i>`
const closeIcon = `<i class="bi bi-x-lg"></i>`

let mouseX;
let mouseY;

let clickingBar = false;

let grabbingStartCursor = false;
let grabbingEndCursor = false;

let start;
let end;

let editMode = false;

let previewEmpty = true

let isOverlayVisible = false

document.addEventListener("DOMContentLoaded",() => {
    const preview = document.getElementById("video_preview")

    const videoPlayer = document.querySelector(".videoPlayer")
    const playerBarContainer = document.getElementById("player_bar")
    const bar = document.createElement("div")
    const progress = document.createElement("div")
    const buttonsDiv = document.createElement("div")
    const playButtonDiv = document.createElement("div")
    const playPauseButton = document.createElement("button")
    const timeDiv = document.createElement("div")
    const rightButtonsDiv = document.createElement("div")
    const editButton = document.createElement("button")

    let editDiv = null;
    let videoOverlay = null;

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
        previewEmpty = false
        timeDiv.textContent = `${secsToHours(0)}/${secsToHours(Math.floor(preview.duration))}`
        playPauseButton.innerHTML = preview.paused ? playIcon : pauseIcon

        start = 0;
        end = preview.duration;
    })

    preview.addEventListener("timeupdate", () => {
        const {currentTime, duration} = preview
        const {width} = bar.getBoundingClientRect()
        const windowWidth = window.innerWidth;
        playPauseButton.innerHTML = preview.paused ? playIcon : pauseIcon

        if(currentTime < start || currentTime > end) preview.currentTime = start;

        const resultWidth = ((currentTime-start)/ duration) * width
        progress.style.width = `${resultWidth*100/windowWidth}vw`

        timeDiv.textContent = `${secsToHours(Math.floor(currentTime - start))}/${secsToHours(Math.floor(end-start))}`
    })

    videoPlayer.addEventListener("mouseenter", () => {
        if(previewEmpty || isOverlayVisible) {
            return;
        }
        if(videoOverlay) videoOverlay.remove()

        const overlay = document.createElement("div")
        const overlayHeader = document.createElement("div")
        const closeVideoButton = document.createElement("button")

        videoPlayer.appendChild(overlay)
        overlay.id = "video_overlay"

        overlay.appendChild(overlayHeader)
        overlayHeader.id = "overlay_header"

        overlayHeader.appendChild(closeVideoButton)
        closeVideoButton.id = "close_video_btn"
        closeVideoButton.type = "button"
        closeVideoButton.innerHTML = closeIcon
        closeVideoButton.addEventListener("click", () => {
            const dropZone = document.querySelector('.dropZone');
            preview.removeAttribute("src")
            preview.classList.add("hidden")
            preview.innerHTML = ""
            preview.load()
            previewEmpty = true
            dropZone.classList.remove("hidden")
            videoOverlay.remove()
            videoOverlay = null
        })

        videoOverlay = overlay
        isOverlayVisible = true
    })

    videoPlayer.addEventListener("mouseleave", () => {
        if(videoOverlay){
            videoOverlay.remove()
            videoOverlay = null
        }
        isOverlayVisible = false
    })  

    bar.addEventListener("mousedown", () => {
        const {x, width} = bar.getBoundingClientRect() 
        clickingBar = true
        
        if(grabbingStartCursor || grabbingEndCursor) return
        preview.currentTime = ((mouseX - x)/width) * preview.duration
    })

    document.addEventListener("mouseup", () => {
        clickingBar = false
    })

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    
        if(clickingBar && !(grabbingStartCursor || grabbingEndCursor)) {
            const {x, width} = bar.getBoundingClientRect()
            const windowWidth = window.innerWidth;
            
            const time = ((mouseX - x)/width) * preview.duration

            const resultWidth = (time/ preview.duration) * width
            progress.style.width = `${resultWidth*100/windowWidth}vw`

            preview.currentTime = time

        }
    })

    editButton.addEventListener("click", () => {
        if(previewEmpty) return;
        editMode = !editMode
        
        if(editMode) {
            editDiv = renderEditCursors()
            preview.currentTime = 0
        }

        else {
            if(editDiv) editDiv.remove()
            editDiv = null;
        
            start = 0
            end = preview.duration
            preview.currentTime = 0
            preview.play()

            clickingBar = false;
            grabbingStartCursor = false;
            grabbingEndCursor = false;

            bar.style.padding = "0px"
        }
    })
})

const renderEditCursors = () => {
    const bar = document.querySelector(".plyr_bar")
    const editContainer = document.createElement("div")
    const startCursor = document.createElement("div")
    const endCursor = document.createElement("div")

    bar.appendChild(editContainer)
    editContainer.id = "edit_cursors_container"

    editContainer.append(startCursor)
    editContainer.append(endCursor)

    startCursor.id = "start_cursor"
    endCursor.id = "end_cursor"

    startCursor.addEventListener("mousedown", () => grabbingStartCursor = true)
    endCursor.addEventListener("mousedown", () => grabbingEndCursor = true)

    document.addEventListener("mouseup", () => {
        grabbingStartCursor = false
        grabbingEndCursor = false
    })

    document.addEventListener("mousemove", (e) => {
        const bar = document.querySelector(".plyr_bar")   
        const preview = document.getElementById("video_preview")
        const progress = document.querySelector(".plyr_progress")

        const {x, width, left} = bar.getBoundingClientRect()
        const {width:cursorWidth} = startCursor.getBoundingClientRect()
        const windowWidth = window.innerWidth;

        if(mouseX < x || mouseX > (x+width)) return;
        
        if(grabbingStartCursor) {
            const cursorLeft = mouseX - x
            const startVal = parseFloat((cursorLeft/width * preview.duration).toFixed(6))

            if(startVal > end - 1 ) return

            startCursor.style.left = `${(cursorLeft - (cursorWidth/2)) * 100/windowWidth}vw`;
            bar.style.paddingLeft = `${cursorLeft * 100/windowWidth}vw`;

            start = startVal
            preview.currentTime = start
        } 
        else if (grabbingEndCursor) {
            const cursorRight = x + width - mouseX
            const endVal = parseFloat((preview.duration * (1 - (cursorRight/width))).toFixed(6))
            
            if(endVal < start + 1) return;

            endCursor.style.right = `${(cursorRight - (cursorWidth/2)) * 100/windowWidth}vw`;
            bar.style.paddingRight = `${cursorRight * 100/windowWidth}vw`;

            end=endVal
        }

        if(grabbingEndCursor || grabbingStartCursor){
            const resultWidth = ((preview.currentTime-start)/ preview.duration) * width
            progress.style.width = `${resultWidth*100/windowWidth}vw`
        }
    })

    return editContainer;
}

function secsToHours(segundos) {
    const hours = Math.floor(segundos / 3600);
    const min = Math.floor((segundos % 3600) / 60);
    const seg = segundos % 60;
  
    const h = String(hours).padStart(2, '0');
    const m = String(min).padStart(2, '0');
    const s = String(seg).padStart(2, '0');
  
    return `${h}:${m}:${s}`;
  }
