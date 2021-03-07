const $faceMouth = document.querySelector('.face .mouth')
const $voice = document.querySelector('.voice')

let textClearTimer
let recRestartTimer
let isRec
let isSpeech = false

const recognition = new (webkitSpeechRecognition || SpeechRecognition)()
recognition.lang = 'ja'
recognition.interimResults = true

const mouthAnime = $faceMouth.animate({ strokeWidth: ['50', '0'] }, 300)
mouthAnime.finish()

function animeMouth() {
  mouthAnime.finish()
  mouthAnime.play()
}

recognition.onresult = (e) => {
  clearTimeout(textClearTimer)
  textClearTimer = setTimeout(() => ($voice.dataset.text = ''), 2000)
  $voice.dataset.text = e.results[0][0].transcript
  if (isSpeech) {
    animeMouth()
  }
}

recognition.onend = () => {
  if (isRec) {
    recRestartTimer = setTimeout(() => recognition.start(), 100)
  }
}

recognition.onspeechstart = () => {
  animeMouth()
  isSpeech = true
}

recognition.onspeechend = () => {
  isSpeech = false
}

export function start() {
  if (!isRec) {
    isRec = true
    recognition.start()
  }
}

export function stop() {
  if (isRec) {
    isRec = false
    clearTimeout(recRestartTimer)
    clearTimeout(textClearTimer)
    recognition.abort()
    $voice.dataset.text = ''
  }
}

document.head.insertAdjacentHTML('beforeend', `
<style>
  .voice {
    position: absolute;
    bottom: 20px;
    left: 10px;
    right: 10px;
    height: 2.6em;
    color: var(--color-red);
    font-size: 60px;
    font-weight: bold;
    text-align: center;
    line-height: 1.3;
    overflow: hidden;
    backface-visibility: hidden;
  }

  .voice::before,
  .voice::after {
    content: attr(data-text);
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .voice::before {
    -webkit-text-stroke: #fff 8px;
  }
</style>
`)
