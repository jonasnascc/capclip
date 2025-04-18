const playIcon = `<i class="bi bi-play-fill"></i>`
const pauseIcon = `<i class="bi bi-pause-fill"></i>`

document.addEventListener("DOMContentLoaded",() => {
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
        if(playPauseButton.innerHTML == playIcon) {
            playPauseButton.innerHTML = pauseIcon
        }
        else playPauseButton.innerHTML = playIcon
    })
    
})