const { remote, clipboard } = require('electron')
const electronContextMenu = require('electron-context-menu')
const YouTubePlayer = require('youtube-player')

const { BrowserWindow } = remote
const currentWindow = BrowserWindow.fromId(remote.getCurrentWindow().id)


let player = createPlayer()


addControlListeners({
    playButton: document.querySelector('#play'),
    closeButton: document.querySelector('#close'),
    fitButton: document.querySelector('#fit'),
})
createContextMenu()

function createContextMenu() {
    electronContextMenu({
        prepend: (params, browserWindow) => [{
            label: 'Copy video URL',
            // Only show it when right-clicking images
            // visible: params.mediaType === 'image'
            click: videoToClipboard
        }]
    })
}

async function videoToClipboard() {
    let url = await player.getVideoUrl()
    clipboard.writeText(url)
}

function createPlayer(video = 'EdFDJANJJLs') {
    return YouTubePlayer('player', {
        playerVars: {
            autoplay: 0,
            controls: 0, // hide controls
            showinfo: 1, // must show 
            modestbranding: 1,
            rel: 0 // hide related videos
        },
        videoId: video
    })
}

function addControlListeners(buttons) {
    const {
        playButton,
        closeButton,
        fitButton
    } = buttons

    const onClick = (button, callback) => button.addEventListener('click', callback)

    onClick(playButton, async () => {
        let state = await player.getPlayerState()
        if ([-1, 0, 2, 5].includes(state)) {
            player.playVideo()
        } else {
            player.pauseVideo()
        }
    })

    onClick(closeButton, () => {
        currentWindow.close()
    })

    onClick(fitButton, () => {
        let bounds = currentWindow.getContentBounds()
        bounds.height = bounds.width / 16 * 9
        currentWindow.setContentBounds(bounds)
    })
}

// -1 – unstarted
// 0 – ended
// 1 – playing
// 2 – paused
// 3 – buffering
// 5 – video cued