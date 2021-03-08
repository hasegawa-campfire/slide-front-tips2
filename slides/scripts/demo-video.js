const $video = document.querySelector('video')
const $face = document.querySelector('.face')

let timerId

async function capture() {
  if (!$video.srcObject || !$video.srcObject.active) {
    try {
      $video.srcObject = await navigator.mediaDevices.getUserMedia({ video: { aspectRatio: 1.778 }})
      $video.srcObject.oninactive = () => $face.classList.remove('show')
    } catch {
      // none
    }
  }
  timerId = setTimeout(capture, 500);
}

export async function start() {
  if (!timerId) {
    capture()
  }
}

export async function stop() {
  clearTimeout(timerId)
  timerId = null
  if ($video.srcObject) {
    $video.srcObject.getTracks().forEach(track => track.stop())
    $video.srcObject = null
  }
}

document.head.insertAdjacentHTML('beforeend', `
<style>
  .video-container {
    flex: none;
    position: relative;
    width: 1100px;
    border: 32px #fff solid;
    border-radius: var(--radius-card);
    background-color: #fff;
    box-shadow: var(--shadow-card);
    overflow: hidden;
  }

  video {
    width: 100%;
    transform: scaleX(-1);
    aspect-ratio: 16 / 9;
  }
</style>
`)
