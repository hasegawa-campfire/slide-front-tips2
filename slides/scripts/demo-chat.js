const $chat = document.querySelector('.chat')

let abortController

async function standby() {
  abortController = new AbortController()

  try {
    const res = await fetch('https://ppng.io/slide-chat-html', {
      signal: abortController.signal,
    })
    const value = await res.text()
    const isBottom = ($chat.scrollTop + $chat.clientHeight >= $chat.scrollHeight - 10)
    $chat.insertAdjacentHTML('beforeend', value)

    if (isBottom) {
      requestAnimationFrame(() => $chat.scrollTop = 9999999)
    }
  } catch (e) {
    console.log('[chat error]', e)
  }

  if (!abortController.signal.aborted) {
    standby()
  }
}


export function start() {
  standby()
}

export function stop() {
  abortController?.abort()
}

document.head.insertAdjacentHTML('beforeend', `
<style>
  .chat {
    flex: auto;
    height: 646px;
    position: relative;
    margin-left: 32px;
    border: 32px #fff solid;
    border-left-width: 24px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 30px #00000028;
    font-size: 24px;
    overflow: auto;
    scroll-behavior: smooth;
  }

  .chat::-webkit-scrollbar {
    display: none;
  }

  .chat .comment {
    position: relative;
    margin: 4px 0;
    padding: 4px 0 4px 40px;
    font-size: 20px;
    line-height: 24px;
  }

  .chat .icon {
    position: absolute;
    left: 0;
    top: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .chat .name {
    display: inline;
    color: #aaa;
  }

  .chat .body {
    display: inline;
  }
  </style>
`)