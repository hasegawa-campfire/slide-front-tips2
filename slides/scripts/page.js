document.body.insertAdjacentHTML('afterbegin', `
  <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
    <filter id="text-stroke">
      <feMorphology operator="dilate" radius="2" in="SourceAlpha" result="dilated"></feMorphology>
      <feFlood flood-color="#fff" result="flooded"></feFlood>
      <feComposite in="flooded" in2="dilated" operator="in"></feComposite>
      <feComposite in="SourceGraphic"></feComposite>
    </filter>
  </svg>
`)

const $targets = new Set()

function toggleDialog(selector) {
  const $target = document.querySelector(selector)

  for (const el of $targets) {
    if (el !== $target) {
      el.classList.remove('active')
    }
  }

  $target.classList.toggle('active')
  $targets.add($target)
}

addEventListener('mousedown', (e) => {
  for (const el of $targets) {
    if (!el.contains(e.target)) {
      el.classList.remove('active')
    }
  }
})

addEventListener('slide-fin', () => {
  for (const el of $targets) el.classList.remove('active')
})

addEventListener('DOMContentLoaded', () => {
  document.querySelector('.slide-note')?.insertAdjacentHTML('beforeend',`
    <style>
      .slide-note {
        white-space: pre-line;
        text-indent: 1em each-line;
      }
      .slide-note::first-line {
        font-size: 0;
      }
      [onclick] {
        color: blue;
        cursor: pointer;
        text-decoration: underline;
      }
    </style>
  `)
})
