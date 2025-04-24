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

let currentVideoBitrate;
let videoMetrics = {}

let setProgressTimeImpl = (time) => {}

document.addEventListener("DOMContentLoaded",() => {
    const preview = document.getElementById("video_preview")
    const videoPlayer = document.querySelector(".videoPlayer")
    const playerBarContainer = document.getElementById("player_bar")
    const bar = document.createElement("div")
    const progressContainer = document.createElement("div")
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

    bar.appendChild(progressContainer)
    progressContainer.className = "plyr_progress_container"

    progressContainer.appendChild(progress)
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

    buttonsDiv.appendChild(rightButtonsDiv)
    rightButtonsDiv.id = "right_buttons_div"

    rightButtonsDiv.appendChild(editButton)
    editButton.id = "video_edit_button"
    editButton.type = "button"

    const handleLoadedMetadata = () => {
        previewEmpty = false
        timeDiv.textContent = `${secsToHours(0)}/${secsToHours(preview.duration.toFixed(3))}`
        playPauseButton.innerHTML = preview.paused ? playIcon : pauseIcon

        start = 0;
        end = preview.duration;
    }
    
    const handleTimeUpdate = () => {
        if(start === undefined || end === undefined) return;
        const {currentTime} = preview

        if((currentTime.toFixed(4) < start.toFixed(4) )|| (currentTime.toFixed(4) > end.toFixed(4))) {
            preview.currentTime = start;
        }

        setProgressTime(currentTime)
    }

    const playPauseVideo = async () => {
        if(!preview) return;

        if(await preview.paused) {
            await preview.play()
            playPauseButton.innerHTML = pauseIcon
        } else {
            await preview.pause()
            playPauseButton.innerHTML = playIcon
        }
    }

    const renderVideoOverlay = () => {
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
        overlay.addEventListener("mousedown", (e) => {
            if (closeVideoButton.contains(e.target)) return

            playPauseVideo()
        })

        overlayHeader.appendChild(closeVideoButton)
        closeVideoButton.id = "close_video_btn"
        closeVideoButton.type = "button"
        closeVideoButton.innerHTML = closeIcon
        closeVideoButton.addEventListener("click", handleCloseVideo)

        videoOverlay = overlay
        isOverlayVisible = true
    }

    const removeVideoOverlay =  () => {
        if(videoOverlay){
            videoOverlay.remove()
            videoOverlay = null
        }
        isOverlayVisible = false
    }
    
    const handleProgressContainerMouseDown = () => {
        clickingBar = true
        
        if(grabbingStartCursor || grabbingEndCursor) return

        setTimeToMouseCursor()
    }

    const handleDocMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    
        if(clickingBar && !(grabbingStartCursor || grabbingEndCursor)) {
            const time = setTimeToMouseCursor()
            setProgressTime(time)
        }
    }

    const handleCloseVideo = () => {
        const dropZone = document.querySelector('.dropZone');
        const videoMetricsDiv = document.getElementById("video_metrics")

        dropZone.classList.remove("hidden")

        resetPreview()
        resetVideoVariables()

        videoOverlay.remove()
        videoOverlay = null
        isOverlayVisible = false
        
        videoMetricsDiv.textContent = ""
        setEditing(false)
        setProgressTime(0)
    }


    const setProgressTime = (time) => {
        if(previewEmpty) {
            timeDiv.textContent = `${secsToHours(0)}/${secsToHours(0)}`
            progress.style.width = `0px`
            return
        }
        let resultWidth = ((time-start) * 100/ (end-start))

        if(time < start) time = start

        progress.style.width = `${resultWidth}%`
        
        timeDiv.textContent = `${secsToHours(time.toFixed(3) - start.toFixed(3))}/${secsToHours(end.toFixed(3)-start.toFixed(3))}`
    }

    const setTimeToMouseCursor = () => {
        const {x, width} = progressContainer.getBoundingClientRect()

        const time = ((mouseX - x)/width) * (end-start)
        preview.currentTime = time + start

        return time + start
    }

    const handleClickEditButton = () => {
        if(previewEmpty) return;
        editMode = !editMode
        setEditing(editMode)
    }

    const setEditing = (state) => {
        if(state) {
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
    }

    const resetPreview = () => {
        preview.removeAttribute("src")
        preview.classList.add("hidden")
        preview.innerHTML = ""
        preview.load()
        previewEmpty = true
    }

    preview.addEventListener("loadedmetadata", handleLoadedMetadata)
    preview.addEventListener("timeupdate", handleTimeUpdate)
    videoPlayer.addEventListener("mouseenter", renderVideoOverlay)
    videoPlayer.addEventListener("mouseleave", removeVideoOverlay)  
    progressContainer.addEventListener("mousedown", handleProgressContainerMouseDown)
    document.addEventListener("mouseup", () => clickingBar = false)
    document.addEventListener("mousemove", handleDocMouseMove)
    editButton.addEventListener("click", handleClickEditButton)
    playPauseButton.addEventListener("mousedown", playPauseVideo)

    setProgressTimeImpl = setProgressTime
})

const renderEditCursors = () => {
    const bar = document.querySelector(".plyr_bar")
    const editContainer = document.createElement("div")
    const startCursor = document.createElement("div")
    const endCursor = document.createElement("div")
    
    const progressContainer = document.querySelector(".plyr_progress_container")
    const progress = document.querySelector(".plyr_progress")
    const preview = document.getElementById("video_preview")

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

    document.addEventListener("mousemove", () => {
        const {x:barX, width:barWidth} = bar.getBoundingClientRect()
        const {width} = progressContainer.getBoundingClientRect()
        const {x} = progress.getBoundingClientRect()
        const {width:cursorWidth} = startCursor.getBoundingClientRect()

        if(mouseX < barX || mouseX > (barX+barWidth)) return;

        if(grabbingEndCursor || grabbingStartCursor){
            if(grabbingStartCursor) {
                const startLeft = (mouseX - barX)
                const startVal = startLeft/barWidth * preview.duration

                if(startVal > end - 1) return;
    
                startCursor.style.left = `${(startLeft - (cursorWidth/2)) * 100/barWidth}%`;
                bar.style.paddingLeft = `${startLeft*100/barWidth}%`
    
                setProgressTimeImpl(startVal)
                preview.currentTime = startVal

                start = startVal
            }
            else if(grabbingEndCursor) {
                const endRight = barWidth - (mouseX - barX)
                const endVal = preview.duration - (endRight/barWidth * preview.duration)

                if(endVal < start + 1) return;
    
                endCursor.style.right = `${(endRight - (cursorWidth/2)) * 100/barWidth}%`;
                bar.style.paddingRight = `${endRight*100/barWidth}%`
    
                end = endVal
                document.getElementById("time").textContent = `${secsToHours(preview.currentTime.toFixed(3) - start.toFixed(3))}/${secsToHours(end.toFixed(3)-start.toFixed(3))}`
            }
            setVideoMetrics({duracao_de_corte: secsToHours((end-start))})
            if(start!==0 || end!== preview.duration) {
                setVideoMetrics({tamanho_estimado_de_corte: `${(currentVideoBitrate * (end-start) / (8 * 1024)).toFixed(2)} MB`})
            }
        }
        
    })

    return editContainer;
}


const setVideoMetrics = (metrics) => {
    const videoMetricsDiv = document.getElementById("video_metrics")
    const {tamanho, duracao, tamanho_estimado_de_corte, duracao_de_corte} = metrics

    videoMetrics = {
        tamanho: tamanho ? tamanho : videoMetrics.tamanho,
        duracao: duracao ? duracao : videoMetrics.duracao,
        tamanho_estimado_de_corte: tamanho_estimado_de_corte ? tamanho_estimado_de_corte : videoMetrics.tamanho_estimado_de_corte,
        duracao_de_corte: duracao_de_corte ? duracao_de_corte : videoMetrics.duracao_de_corte
    }

    videoMetricsDiv.innerHTML = ""
    for(let key of Object.keys(videoMetrics)) {
        const val = videoMetrics[key];
        if(val) videoMetricsDiv.innerHTML = videoMetricsDiv.innerHTML + `<p>${key.split("_").join(" ")}: ${val}</p>`
    }
}

const setCurrentVideoBitrate = (bitrate) => {
    currentVideoBitrate = bitrate
}

function secsToHours(segundos) {
    const hours = Math.floor(segundos / 3600);
    const min = Math.floor((segundos % 3600) / 60);
    const seg = segundos % 60;

    const h = String(hours).padStart(2, '0');
    const m = String(min).padStart(2, '0');
    const s = String(seg.toFixed(3)).padStart(2, '0');

    return `${h}:${m}:${s}`;
}

const resetVideoVariables = () => {
    clickingBar = false;
    grabbingStartCursor = false;
    grabbingEndCursor = false;
    start = undefined;
    end = undefined;
    editMode = false;
    previewEmpty = true
    isOverlayVisible = false
    currentVideoBitrate = undefined;
    videoMetrics = {}
}