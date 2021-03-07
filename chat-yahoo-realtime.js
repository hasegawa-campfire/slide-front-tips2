const $autoscroll = document.querySelector('.Autoscroll')

let debounceId = null
let buff = []

function reverse(items) {
  return Array.from(items).reverse()
}

function send(node) {
  const $icon = node.querySelector('[class^=Tweet_icon_] > img')
  const $body = node.querySelector('[class^=Tweet_body_]')
  const $name = node.querySelector('[class^=Tweet_authorName_]')

  for (const node of $body.querySelectorAll('a')) {
    node.remove()
  }

  buff.push({
    icon: $icon.src,
    name: $name.innerHTML,
    body: $body.innerHTML,
  })

  clearTimeout(debounceId)
  debounceId = setTimeout(() => {
    fetch('https://ppng.io/slide-chat-html', {
      method: 'POST',
      body: JSON.stringify({ items: buff }),
    })
    buff = []
  }, 300)
}

for (const node of reverse(document.querySelectorAll('[class^=Tweet_TweetContainer_]'))) {
  if (!node.matches('[class^=BestTweet_BestTweet_] + *')) {
    send(node)
  }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of reverse(mutations)) {
    for (const node of reverse(mutation.addedNodes)) {
      send(node)
    }
  }
})

observer.observe($autoscroll, { childList: true })
