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
