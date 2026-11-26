// An original sunset coast, drawn as SVG. Plain attributes are the dusk
// (dark) colors; the light media query swaps in golden hour.

const n = (v: number) => Math.round(v * 10) / 10

// Same picture every load: a tiny seeded generator.
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647
  return seed / 2147483647
}

const FRONDS = [
  [-190, -10, 110], [-165, -75, 60], [-85, -115, 40], [60, -135, 35],
  [165, -75, 60], [190, -10, 110], [-120, 30, 150], [120, 30, 150],
] as const

// Each frond is a curved spine with leaflets hanging from it.
const fronds = FRONDS.map(([cx, cy, drop]) => {
  const ex = cx * 1.15
  const ey = cy + drop
  let d = `M0 0Q${n(cx * 0.6)} ${n(cy * 1.1 - 20)} ${n(ex)} ${n(ey)}`
  for (let i = 1; i <= 16; i++) {
    const t = i / 16
    const u = 1 - t
    const x = 2 * u * t * cx * 0.6 + t * t * ex
    const y = 2 * u * t * (cy * 1.1 - 20) + t * t * ey
    const len = 12 + 46 * Math.sin(Math.PI * Math.min(1, t * 0.85 + 0.1))
    const lean = Math.sign(cx || (i % 2 ? 1 : -1)) * len * 0.45
    d += `M${n(x)} ${n(y)}l${n(lean)} ${n(len)}`
  }
  return d
}).join('')

const palm = (x: number, y: number, scale: number, bend: number, cls: string) =>
  `<g transform="translate(${x} ${y}) scale(${scale})">` +
  `<path class="ink" d="M-16 520Q${bend - 12} 240 -7 0L7 0Q${bend + 12} 240 20 520Z" fill="#0a0414"/>` +
  `<g class="${cls}"><path class="inkline" d="${fronds}" fill="none" stroke="#0a0414" stroke-width="7" stroke-linecap="round"/>` +
  `<circle class="ink" cx="-9" cy="10" r="11" fill="#0a0414"/><circle class="ink" cx="10" cy="12" r="10" fill="#0a0414"/></g></g>`

const skyline = () => {
  const r = seeded(1986)
  let towers = ''
  const windows = ['', '', '']
  let x = -20
  while (x < 1640) {
    const w = 34 + r() * 46
    const h = 40 + r() * r() * 190
    const top = 640 - h
    towers += `M${n(x)} 640V${n(top)}H${n(x + w)}V640Z`
    if (r() > 0.6) {
      // A stepped crown, the way seaside deco hotels have.
      towers += `M${n(x + w * 0.25)} ${n(top)}v-14h${n(w * 0.5)}v14ZM${n(x + w * 0.46)} ${n(top - 14)}v-22h${n(w * 0.08)}v22Z`
    }
    for (let wy = top + 10; wy < 628; wy += 14) {
      for (let wx = x + 7; wx < x + w - 8; wx += 12) {
        if (r() > 0.62) {
          windows[Math.floor(r() * 3)] += `M${n(wx)} ${n(wy)}h5v6h-5z`
        }
      }
    }
    x += w + r() * 10
  }
  return (
    `<path class="tower" d="${towers}" fill="#1a0830"/>` +
    windows
      .map((d, i) => `<path class="win w${i}" d="${d}" fill="${['#ffd27a', '#ff6fb5', '#5fe3e8'][i]}" opacity=".8"/>`)
      .join('')
  )
}

const stars = () => {
  const r = seeded(77)
  let d = ''
  for (let i = 0; i < 70; i++) {
    d += `M${n(r() * 1600)} ${n(r() * 260)}h1.8v1.8h-1.8z`
  }
  return `<path class="stars" d="${d}" fill="#ffe9f6" opacity=".7"/>`
}

// The sun's broken reflection, wider the nearer it gets.
const glints = () => {
  const r = seeded(305)
  let out = ''
  for (let i = 0; i < 16; i++) {
    const w = 120 + i * 13 - r() * 70
    const cx = 1200 + (r() - 0.5) * 50
    out += `<rect class="glint g${i % 3}" x="${n(cx - w / 2)}" y="${n(652 + i * 21)}" width="${n(w)}" height="${n(4 + i * 0.5)}" rx="4" fill="#ffc46b" opacity="${n(0.6 - i * 0.025)}"/>`
  }
  return out
}

const cloud = (cls: string, x: number, y: number, s: number, fill: string) =>
  `<g transform="translate(${x} ${y}) scale(${s} 1)"><path class="cloud ${cls}" d="M0 20C60 4 110 14 170 6C240 -6 300 10 420 16C340 26 240 22 170 27C100 32 50 26 0 20Z" fill="${fill}" opacity=".4"/></g>`

export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
.sway{animation:sway 9s ease-in-out infinite alternate}
.sway2{animation:sway 12s ease-in-out infinite alternate-reverse}
.glint{animation:glint 7s ease-in-out infinite alternate}
.g1{animation-duration:9s}
.g2{animation-duration:11s}
.drift{animation:drift 70s ease-in-out infinite alternate}
.drift2{animation:drift 95s ease-in-out infinite alternate-reverse}
.w0{animation:glow 10s ease-in-out infinite alternate}
.w1{animation:glow 14s ease-in-out infinite alternate-reverse}
.boat{animation:sail 120s linear infinite alternate}
@keyframes sway{from{transform:rotate(-1.6deg)}to{transform:rotate(1.6deg)}}
@keyframes glint{from{transform:translateX(-12px)}to{transform:translateX(12px)}}
@keyframes drift{from{transform:translateX(-50px)}to{transform:translateX(50px)}}
@keyframes glow{from{opacity:.55}to{opacity:.9}}
@keyframes sail{from{transform:translateX(-160px)}to{transform:translateX(160px)}}
@media (prefers-color-scheme: light){
.s0{stop-color:#8fd3e8}.s1{stop-color:#cfc6f0}.s2{stop-color:#ffb9cf}.s3{stop-color:#ffc9a3}.s4{stop-color:#ffe6ad}
.o0{stop-color:#ffc7a8}.o1{stop-color:#8fd0d8}.o2{stop-color:#4fb0c2}
.tower{fill:#b98bc0}.stars{display:none}
.ink{fill:#4a2a5c}.inkline{stroke:#4a2a5c}.boat{fill:#4a2a5c}
}
</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop class="s0" offset="0" stop-color="#0c0420"/><stop class="s1" offset=".3" stop-color="#300b4c"/><stop class="s2" offset=".58" stop-color="#8a1a63"/><stop class="s3" offset=".82" stop-color="#d63f60"/><stop class="s4" offset="1" stop-color="#ee8649"/>
</linearGradient>
<linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0a8"/><stop offset=".5" stop-color="#ffb04f"/><stop offset="1" stop-color="#ff4f8b"/></linearGradient>
<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
<stop class="o0" offset="0" stop-color="#a02e60"/><stop class="o1" offset=".25" stop-color="#471455"/><stop class="o2" offset="1" stop-color="#090417"/>
</linearGradient>
<radialGradient id="halo"><stop offset="0" stop-color="#ffcf7d" stop-opacity=".5"/><stop offset="1" stop-color="#ff5f8f" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="642" fill="url(#sky)"/>
${stars()}
<circle cx="1200" cy="500" r="330" fill="url(#halo)"/>
<circle cx="1200" cy="500" r="138" fill="url(#sun)"/>
${cloud('drift', 820, 300, 1.3, '#ff8fb0')}
${cloud('drift2', 160, 220, 1.1, '#d65a9f')}
${cloud('drift2', 1080, 420, 1, '#ffd0a0')}
${cloud('drift', 330, 400, 0.9, '#ff9a8a')}
${skyline()}
<rect y="640" width="1600" height="360" fill="url(#sea)"/>
${glints()}
<path class="boat" d="M620 712h86l-14 16h-56zM640 712l12 -14h26l10 14z" fill="#0a0414"/>
${palm(130, 420, 1.15, 40, 'sway')}
${palm(290, 590, 0.8, -30, 'sway2')}
${palm(1500, 380, 1.25, -50, 'sway2')}
</svg>`
