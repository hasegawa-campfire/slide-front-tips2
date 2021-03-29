const suffixPreview = `
<!DOCTYPE html>
<meta charset="utf-8">
<title></title>

<style>
body {
  font-family: sans-serif;
  color: #4d4a4a;
  font-size: 25px;
  line-height: 1.4;
  cursor: default;
  margin: 0;
}

*, ::before, ::after {
  box-sizing: border-box;
}

button, input, select, textarea {
  font-family: inherit;
  font-size: 100%;
}

pre.console-log {
  position: relative;
}

pre.console-log + pre.console-log {
  margin-top: 2em;
}

pre.console-log + pre.console-log::before {
  content: '';
  display: block;
  border-top: 4px #eee dashed;
  position: absolute;
  top: -1em;
  left: 0;
  right: 0;
}
</style>

<script>
const $ = (sel, el = document) => el.querySelector(sel)
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel))
console.log = (...values) => {
  const pre = document.createElement('pre')
  pre.className = 'console-log'
  pre.textContent = values.map((v) => {
    return v && (v.constructor === Object || !v.constructor) ? JSON.stringify(v, null, '  ') : String(v)
  }).join(' ')
  document.body.append(pre)
}
</script>
`

function $(sel, el = document) {
  return el.querySelector(sel)
}

function $$(sel, el = document) {
  return Array.from(el.querySelectorAll(sel))
}

function getText(el) {
  el = el.cloneNode(true)
  for (const div of el.querySelectorAll('div')) {
    div.before(document.createTextNode('\n'))
  }
  return el.textContent
}

function flatIndent(text) {
  text = text.split(/[\r\n]/).map(s => s.trim() ? s : '').join('\n').replace(/^\n+|\n+$/g, '')
  const indent = text.match(/^ */)[0].length
  return text.replace(new RegExp(`^ {0,${indent}}`, 'gm'), '')
}

for (const $temp of $$('template.playground')) {
  $temp.insertAdjacentHTML('afterend', `
    <div class="playground">
      <iframe class="preview"></iframe>
      <div class="tab">HTML</div>
      <div class="tab">CSS</div>
      <div class="tab">JavaScript</div>
      <code contenteditable spellcheck="false"></code>
      <code contenteditable spellcheck="false"></code>
      <code contenteditable spellcheck="false"></code>
    </div>
  `)

  const $playground = $temp.nextElementSibling
  const $preview = $('.preview', $playground)
  const $tabs = $$('.tab', $playground)
  const $codes = $$('code', $playground)

  const init = () => {
    const node = $temp.cloneNode(true)
    $codes[1].textContent = $$('style', node.content).map(el => (el.remove(), flatIndent(el.innerHTML))).join('')
    $codes[2].textContent = $$('script', node.content).map(el => (el.remove(), flatIndent(el.innerHTML))).join('')
    $codes[0].textContent = flatIndent(node.innerHTML)
    $preview.style.width = $temp.dataset.width || '';
    $preview.style.height = $temp.dataset.height || '';
    $preview.contentWindow.document.scrollingElement.scrollTop = 0
    updatePreview()
    selectTab(Math.max(0, ['html', 'css', 'script'].indexOf($temp.dataset.tab)))
    for (let i = 0; i < 3; i++) {
      if (!$codes[i].textContent) $tabs[i].remove()
      $codes[i].scrollTop = 0
    }
  }

  const selectTab = (index) => {
    for (let i  = 0; i < 3; i++) {
      $tabs[i].classList.toggle('active', i === index)
      $codes[i].classList.toggle('active', i === index)
    }
  }

  const updatePreview = () => {
    URL.revokeObjectURL($preview.contentWindow.location.href)
    const html = `
      ${suffixPreview}
      <style>${$codes[1].textContent}</style>
      ${$codes[0].textContent}
      <div id="$dummy"></div>
      <script>$dummy.remove();${getText($codes[2])}</script>
    `
    const url = URL.createObjectURL(new Blob([fixedUrl(html)], { type: 'text/html' }))
    $preview.contentWindow.location.replace(url)
  }

  const fixedUrl = (html) => {
    const node = document.createElement('template')
    node.innerHTML = html
    for (const el of node.content.querySelectorAll('img')) {
      const src = el.getAttribute('src')
      if (src && !/^(https?:)?\/\//.test(src)) {
        el.src = new URL(src, location).href
      }
    }
    return node.innerHTML
  }

  let debounceId
  for (const el of $codes) {
    el.addEventListener('input', () => {
      clearTimeout(debounceId)
      debounceId = setTimeout(updatePreview, 500)
    })
  }
  $tabs.forEach((el, i) => el.addEventListener('click', () => selectTab(i)))
  $temp.remove()
  addEventListener('slide-init', init)
  init()
}
