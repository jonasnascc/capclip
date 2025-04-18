const playIcon = `<i class="bi bi-play-fill"></i>`
const pauseIcon = `<i class="bi bi-pause-fill"></i>`

document.addEventListener("DOMContentLoaded",() => {
    const preview = document.getElementById("video_preview")

    const playerBarContainer = document.getElementById("player_bar")
    const bar = document.createElement("div")
    const progress = document.createElement("div")
    const buttonsDiv = document.createElement("div")
    const playPauseButton = document.createElement("button")

    playerBarContainer.appendChild(bar)
    bar.className = "plyr_bar"

    bar.appendChild(progress)
    progress.className = "plyr_progress"
    
    playerBarContainer.appendChild(buttonsDiv)
    buttonsDiv.id = "plyr_buttons"

    buttonsDiv.appendChild(playPauseButton)
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

    preview.addEventListener("timeupdate", () => {
        const {currentTime, duration} = preview
        const {width} = bar.getBoundingClientRect()

        const resultWidth = (currentTime/ duration) * width
        progress.style.width = `${resultWidth.toFixed(2)}px`
    })
})