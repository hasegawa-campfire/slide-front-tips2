const $video = document.querySelector('video')
const $project = document.querySelector('.project')

const barcodeDetector = new BarcodeDetector()
const reProject = /^https?\:\/\/[^/]+\/projects\/view\/\d+/

let timerId
let hideCount = 0

async function detect() {
  timerId = setTimeout(detect, 100)

  if ($video.readyState !== 4) return

  const barcode = (await barcodeDetector.detect($video))[0]

  if (barcode && timerId && reProject.test(barcode.rawValue)) {
    const [lt, lb, rb, rt] = barcode.cornerPoints

    $project.style.right = (lt.x + lb.x + rb.x + rt.x) / 4 / $video.videoWidth * 100 + '%'
    $project.style.top = (lt.y + lb.y + rb.y + rt.y) / 4 / $video.videoHeight * 100 + '%'

    const width = Math.sqrt(((lt.x + lb.x) / 2 - (rt.x + rb.x) / 2) ** 2 + ((lt.y + lb.y) / 2 - (rt.y + rb.y) / 2) ** 2)
    $project.style.setProperty('--scale', width / 245 * ($video.offsetWidth / $video.videoWidth))

    const rad = Math.atan2((rt.y + rb.y) / 2 - (lt.y + lb.y) / 2, (rt.x + rb.x) / 2 - (lt.x + lb.x) / 2)
    $project.style.setProperty('--rotate', `${rad * -180 / Math.PI}deg`)

    const url = `${barcode.rawValue.match(reProject)[0].replace('/view', '')}/widget`
    if ($project.src !== url) {
      $project.src = url
    }

    $project.classList.add('show')
    hideCount = 5
  } else {
    hideCount--

    if (hideCount < 0) {
      $project.classList.remove('show')
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
  $project.classList.remove('show')
}

document.head.insertAdjacentHTML('beforeend', `
<style>
  .project {
    position: absolute;
    border: none;
    width: 245px;
    height: 365px;
    transform: translate(50%, -50%) scale(var(--scale)) rotate(var(--rotate));
    transition: all 50ms;
  }

  .project:not(.show) {
    display: none;
  }
</style>
`)
