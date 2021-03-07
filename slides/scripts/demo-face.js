const $video = document.querySelector('video')
const $face = document.querySelector('.face')

const faceDetector = new FaceDetector()

let timerId
let hideCount = 0

async function detect() {
  timerId = setTimeout(detect, 100)

  if ($video.readyState !== 4) return

  const face = (await faceDetector.detect($video))[0]

  if (face && timerId) {
    const rect = face.boundingBox
    $face.style.right = (rect.left / $video.videoWidth * 100) + '%'
    $face.style.top = (rect.top / $video.videoHeight * 100) + '%'
    $face.style.width = (rect.width / $video.videoWidth * 100) + '%'
    $face.style.height = (rect.height / $video.videoHeight * 100) + '%'

    const rate = (rect.left + rect.width / 2) / $video.videoWidth - 0.5
    $face.style.setProperty('--rotate', rate / -2 + 'turn')
    $face.classList.add('show')

    hideCount = 5
  } else {
    hideCount--

    if (hideCount < 0) {
      $face.classList.remove('show')
    }
  }
}

export function start() {
  clearTimeout(timerId)
  timerId = setTimeout(detect, 100)
}

export function stop() {
  clearTimeout(timerId)
  timerId = null
  $face.classList.remove('show')
}

document.head.insertAdjacentHTML('beforeend', `
<style>
  .face {
    position: absolute;
    transition: all 50ms;
    transform-origin: 50% 76%;
    transform: scale(2.2) translate(2%, -15%) rotate(var(--rotate));
  }

  .face:not(.show) {
    display: none;
  }

  .face .mouth {
    stroke: #fff;
    transform-origin: 50% 80%;
  }
</style>
`)
