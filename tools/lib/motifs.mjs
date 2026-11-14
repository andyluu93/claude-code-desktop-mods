// One signature motif per look. Same safety rules as svg.mjs: CSS keyframes on transform, opacity and
// stroke-dashoffset only; positioned groups never carry the animated class themselves.
import { f, rng } from './svg.mjs'

const pick = (r, list) => list[Math.floor(r() * list.length) % list.length]
const anim = (cls, dur, delay = 0, extra = '') => `class="${cls}" style="animation-duration:${f(dur)}s;animation-delay:${f(delay)}s${extra}"`

// Extra keyframes used by these motifs, appended to the shared CSS.
export const MOTIF_CSS = `
.beam{animation:beam 7s ease-in-out infinite}
.tilt{animation:tilt 9s ease-in-out infinite}
.flash{opacity:0;animation:flash 6s ease-in-out infinite}
.billow{animation:billow 9s ease-in-out infinite}
.draw{fill:none;stroke-dasharray:2000 2000;animation:draw 12s ease-in-out infinite}
.donut{fill:none;stroke-dasharray:999 999;animation:donut 10s ease-in-out infinite}
.meridian{animation:meridian 12s linear infinite}
.rain{animation:rain 9s linear infinite}
.plane{animation:plane 26s linear infinite}
.trail{animation:trail 1.6s linear infinite}
.search{animation:search 10s ease-in-out infinite}
.flap{animation:flap .9s ease-in-out infinite}
.wing{animation:wing .5s ease-in-out infinite}
.fly{animation:fly 30s linear infinite}
.flutter{animation:flutter 24s ease-in-out infinite}
.swim{animation:swim 34s linear infinite}
.tail{animation:tail 1.2s ease-in-out infinite}
.orbit{animation:spin 40s linear infinite}
.swing{animation:swing 5s ease-in-out infinite}
.gust{fill:none;stroke-dasharray:160 1840;animation:gust 7s linear infinite}
.shimmer{opacity:.2;animation:shimmer 3s ease-in-out infinite}
.walk{animation:walk 120s linear infinite}
@keyframes beam{0%,100%{opacity:.25;transform:scaleY(.82)}50%{opacity:.7;transform:scaleY(1)}}
@keyframes tilt{0%,100%{transform:rotate(-6deg) translateY(0)}50%{transform:rotate(6deg) translateY(-14px)}}
@keyframes flash{0%,70%,100%{opacity:0;transform:scale(.4)}80%{opacity:1;transform:scale(1.2)}}
@keyframes billow{0%,100%{transform:skewX(0deg) scaleX(1)}50%{transform:skewX(1.4deg) scaleX(1.03)}}
@keyframes draw{0%{stroke-dashoffset:2000;opacity:1}45%,80%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}
@keyframes donut{0%,100%{stroke-dashoffset:999}50%{stroke-dashoffset:260}}
@keyframes meridian{0%{transform:scaleX(1)}25%{transform:scaleX(0)}50%{transform:scaleX(-1)}75%{transform:scaleX(0)}100%{transform:scaleX(1)}}
@keyframes rain{from{transform:translateY(0)}to{transform:translateY(1300px)}}
@keyframes plane{0%{transform:translate(0,0)}100%{transform:translate(2300px,-620px)}}
@keyframes trail{to{stroke-dashoffset:-28}}
@keyframes search{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(24deg)}}
@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(-.6)}}
@keyframes wing{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.25)}}
@keyframes fly{0%{transform:translate(0,0)}100%{transform:translate(2200px,-160px)}}
@keyframes flutter{0%{transform:translate(0,0)}25%{transform:translate(380px,-120px)}50%{transform:translate(760px,40px)}75%{transform:translate(1140px,-90px)}100%{transform:translate(1900px,10px)}}
@keyframes swim{0%{transform:translate(0,0)}50%{transform:translate(1100px,-40px)}100%{transform:translate(2200px,0)}}
@keyframes tail{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(14deg)}}
@keyframes swing{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
@keyframes gust{from{stroke-dashoffset:2000}to{stroke-dashoffset:0}}
@keyframes shimmer{0%,100%{opacity:.15}50%{opacity:.85}}
@keyframes walk{from{transform:translateX(0)}to{transform:translateX(-2100px)}}
`

// ---------- Sang trọng ----------

export function decoPilasters(paint) {
  const side = mirror => {
    const sx = mirror ? -1 : 1
    let steps = ''
    for (let i = 0; i < 5; i++) {
      steps += `<rect x="${20 + i * 26}" y="${120 + i * 70}" width="${220 - i * 52}" height="${900 - i * 70}" fill="none" stroke="${paint}" stroke-width="${2 - i * 0.25}"/>`
    }
    let chevrons = ''
    for (let y = 160; y < 960; y += 44) {
      chevrons += `<path d="M60 ${y}l40 22l40-22" fill="none" stroke="${paint}" stroke-width="1.2"/>`
    }
    return `<g transform="translate(${mirror ? 1600 : 0} 0) scale(${sx} 1)" opacity=".55">${steps}${chevrons}<path d="M20 120Q130 20 240 120" fill="none" stroke="${paint}" stroke-width="2"/></g>`
  }
  return side(false) + side(true)
}

export function lightBeams(seed, n) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < n; i++) {
    const x = f(300 + (i / (n - 1)) * 1000 + (r() - 0.5) * 60)
    const tilt = f((x - 800) / 40)
    out += `<g transform="translate(${x} 1000) rotate(${tilt})"><rect ${anim('beam ob', 6 + r() * 4, -r() * 6)} x="-24" y="-950" width="48" height="950" fill="url(#beamFill)"/></g>`
  }
  return `<defs><linearGradient id="beamFill" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E7CA62" stop-opacity=".45"/><stop offset="1" stop-color="#E7CA62" stop-opacity="0"/></linearGradient></defs>${out}`
}

export function lowPoly(seed, colors) {
  const r = rng(seed)
  const cols = 9
  const rows = 6
  const pts = []
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      const edge = i === 0 || j === 0 || i === cols || j === rows
      pts.push([f((i / cols) * 1600 + (edge ? 0 : (r() - 0.5) * 120)), f((j / rows) * 1000 + (edge ? 0 : (r() - 0.5) * 110))])
    }
  }
  let out = ''
  const at = (i, j) => pts[j * (cols + 1) + i]
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = at(i, j), b = at(i + 1, j), c = at(i, j + 1), d = at(i + 1, j + 1)
      out += `<polygon points="${a} ${b} ${d}" fill="${pick(r, colors)}"/><polygon points="${a} ${d} ${c}" fill="${pick(r, colors)}"/>`
    }
  }
  return out
}

export function gems(seed, spots) {
  const r = rng(seed)
  return spots.map(([x, y, s], i) => {
    const facets = `<polygon points="0,-60 52,-22 32,52 -32,52 -52,-22" fill="#0E6B4F"/><polygon points="0,-60 52,-22 0,-6" fill="#3FD6A0"/><polygon points="0,-60 -52,-22 0,-6" fill="#1FA67A"/><polygon points="-52,-22 0,-6 -32,52" fill="#0B5A43"/><polygon points="52,-22 0,-6 32,52" fill="#148A64"/><polygon points="-32,52 0,-6 32,52" fill="#0A4A37"/><polygon points="0,-60 52,-22 32,52 -32,52 -52,-22" fill="none" stroke="#E7CA62" stroke-width="2"/>`
    const sparkle = `<g transform="translate(26 -40)"><g ${anim('flash fb', 5 + r() * 3, -i * 1.3)}><path d="M0-14L3-3L14 0L3 3L0 14L-3 3L-14 0L-3-3Z" fill="#FFFFFF"/></g></g>`
    return `<g transform="translate(${x} ${y}) scale(${s})"><g ${anim('tilt fb', 8 + r() * 4, -r() * 8)}>${facets}${sparkle}</g></g>`
  }).join('')
}

export function curtains() {
  const side = mirror => {
    let folds = ''
    for (let i = 0; i < 7; i++) {
      const x = i * 40
      folds += `<path d="M${x} 0C${x + 14} 300 ${x - 10} 600 ${x + 8} 1000H${x + 40}C${x + 22} 600 ${x + 50} 300 ${x + 40} 0Z" fill="${i % 2 ? '#5A0E20' : '#7A1830'}"/>`
    }
    const tieback = `<path d="M0 560Q150 620 280 520" fill="none" stroke="#D4917A" stroke-width="6"/><g transform="translate(280 520)"><g ${anim('swing fb', 5, mirror ? -2 : 0)}><path d="M0 0V60" stroke="#D4917A" stroke-width="3"/><path d="M-12 60H12L8 110H-8Z" fill="#E8B48F"/></g></g>`
    return `<g transform="translate(${mirror ? 1600 : 0} 0) scale(${mirror ? -1 : 1} 1)"><g ${anim('billow ot', 9, mirror ? -4 : 0)}>${folds}</g>${tieback}</g>`
  }
  let valance = ''
  for (let x = 0; x < 1600; x += 100) {
    valance += `<path d="M${x} 0V40Q${x + 50} 110 ${x + 100} 40V0Z" fill="#6A1428"/><path d="M${x} 40Q${x + 50} 110 ${x + 100} 40" fill="none" stroke="#D4917A" stroke-width="3"/>`
  }
  return side(false) + side(true) + valance
}

export function spotlight() {
  return `<defs><radialGradient id="spot" cx=".5" cy="1" r=".9"><stop offset="0" stop-color="#F2C2A8" stop-opacity=".45"/><stop offset="1" stop-color="#F2C2A8" stop-opacity="0"/></radialGradient></defs><g ${anim('pulse', 8)}><path d="M640 0L960 0L1250 1000L350 1000Z" fill="url(#spot)"/></g>`
}

export function moonSea(seed) {
  const r = rng(seed)
  let glints = ''
  for (let i = 0; i < 46; i++) {
    const y = 640 + Math.pow(r(), 1.3) * 360
    const spread = 30 + (y - 640) * 0.55
    const x = f(1250 + (r() - 0.5) * spread * 2)
    const w = f(14 + r() * 40)
    glints += `<rect ${anim('shimmer', 2 + r() * 3, -r() * 3)} x="${x}" y="${f(y)}" width="${w}" height="2.4" rx="1.2" fill="#F4F1E1"/>`
  }
  let swell = ''
  for (let i = 0; i < 6; i++) {
    const y = 680 + i * 52
    let d = `M0 ${y}`
    for (let x = 0; x < 2600; x += 400) d += `Q${x + 100} ${y - 8} ${x + 200} ${y}T${x + 400} ${y}`
    swell += `<g opacity=".35"><g ${anim('wave', 30 + i * 6, -i * 3)}><path d="${d}" fill="none" stroke="#6E8CC8" stroke-width="1.4"/></g></g>`
  }
  return `<rect y="640" width="1600" height="360" fill="url(#sea)"/><defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0D1D48"/><stop offset="1" stop-color="#040A1C"/></linearGradient></defs>${swell}<g opacity=".8"><g ${anim('pulse', 7)}><circle cx="1250" cy="230" r="170" fill="url(#glow)"/></g></g><circle cx="1250" cy="230" r="62" fill="#F4F1E1"/><circle cx="1228" cy="214" r="10" fill="#000" fill-opacity=".06"/><circle cx="1268" cy="250" r="14" fill="#000" fill-opacity=".05"/>${glints}`
}

export function kintsugi(seed) {
  const r = rng(seed)
  let veins = ''
  for (let i = 0; i < 12; i++) {
    const y = r() * 1000
    veins += `<path d="M-50 ${f(y)}C${f(300 + r() * 300)} ${f(y + (r() - 0.5) * 400)} ${f(900 + r() * 300)} ${f(y + (r() - 0.5) * 400)} 1650 ${f(r() * 1000)}" fill="none" stroke="${pick(r, ['#3A3A44', '#4A4A55', '#2A2A32', '#6A6A74'])}" stroke-width="${f(0.6 + r() * 2)}" opacity=".7"/>`
  }
  const crack = (x0, y0, steps, dx, dy) => {
    let d = `M${x0} ${y0}`
    let x = x0
    let y = y0
    for (let i = 0; i < steps; i++) {
      x += dx + (r() - 0.5) * 60
      y += dy + (r() - 0.5) * 60
      d += `L${f(x)} ${f(y)}`
    }
    return d
  }
  const cracks = [crack(0, 220, 9, 60, 30), crack(1600, 760, 10, -55, -25), crack(1150, 0, 8, 25, 55), crack(300, 1000, 7, 35, -50)]
  let gold = ''
  cracks.forEach((d, i) => {
    gold += `<path d="${d}" fill="none" stroke="#8A6A1F" stroke-width="5" stroke-linejoin="round" opacity=".5"/><g ${anim('pulse', 5 + i)}><path d="${d}" fill="none" stroke="#E7CA62" stroke-width="2.2" stroke-linejoin="round"/></g><path ${anim('gust', 6 + i * 1.5, -i * 2)} d="${d}" stroke="#FFF3C4" stroke-width="3" stroke-linecap="round"/>`
  })
  return veins + gold
}

export function silkAndPearls(seed) {
  const r = rng(seed)
  let silk = ''
  for (let i = 0; i < 5; i++) {
    const y = 120 + i * 190
    silk += `<g opacity=".9"><g ${anim('floatA', 40 + i * 8, -i * 5)}><path d="M-200 ${y}C200 ${y - 120} 600 ${y + 120} 1000 ${y}S1600 ${y - 100} 1900 ${y + 40}V${y + 140}C1500 ${y + 60} 1100 ${y + 240} 700 ${y + 130}S0 ${y + 40} -200 ${y + 150}Z" fill="${i % 2 ? '#FFFFFF' : '#E2D2B4'}" opacity=".55"/></g></g>`
  }
  const strand = (x0, x1, sag, n, delay) => {
    let pearls = ''
    for (let i = 0; i <= n; i++) {
      const t = i / n
      const x = x0 + (x1 - x0) * t
      const y = sag * 4 * t * (1 - t)
      pearls += `<circle cx="${f(x - x0)}" cy="${f(y)}" r="13" fill="url(#pearl)" stroke="#B89F78" stroke-opacity=".35"/>`
    }
    return `<g transform="translate(${x0} -6)"><g ${anim('swing ot', 7 + r() * 3, delay, ';animation-name:swing')}>${pearls}</g></g>`
  }
  const defs = `<defs><radialGradient id="pearl" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F1E6D2"/><stop offset="1" stop-color="#C9B38E"/></radialGradient></defs>`
  return defs + silk + strand(-40, 520, 230, 24, 0) + strand(1060, 1640, 250, 24, -2) + strand(420, 1180, 110, 34, -4)
}

export function peacockFeathers(seed) {
  const r = rng(seed)
  const feather = (len, angle, delay) => {
    let barbs = ''
    for (let y = -40; y > -len + 60; y -= 12) {
      const w = 22 + (len + y) * 0.04
      barbs += `<path d="M0 ${y}q${f(w)}-10 ${f(w * 1.6)}-26M0 ${y}q${f(-w)}-10 ${f(-w * 1.6)}-26" fill="none" stroke="#3FB39C" stroke-width="1.6" opacity=".8"/>`
    }
    const vane = `<path d="M0 -60C-70 ${f(-len * 0.45)} -80 ${-len + 30} 0 ${-len - 30}C80 ${-len + 30} 70 ${f(-len * 0.45)} 0 -60Z" fill="#1F7A6A" opacity=".35"/>`
    const eye = `<g transform="translate(0 ${-len + 40})"><ellipse rx="44" ry="58" fill="#1F6E5E"/><ellipse rx="32" ry="42" fill="#D4B45C"/><ellipse rx="22" ry="30" fill="#2A9FB0"/><ellipse cy="4" rx="13" ry="18" fill="#16245A"/></g>`
    return `<g transform="rotate(${angle})"><g ${anim('sway ob', 6 + r() * 3, delay)}>${vane}<path d="M0 0V${-len}" stroke="#C9A84C" stroke-width="2.4"/>${barbs}${eye}</g></g>`
  }
  const fan = (x, y, mirror) => {
    const angles = [-66, -46, -26, -6, 14]
    return `<g transform="translate(${x} ${y}) scale(${mirror ? -1 : 1} 1)">${angles.map((a, i) => feather(380 + i * 70, a + 20, -i * 1.4)).join('')}</g>`
  }
  return fan(60, 1040, false) + fan(1540, 1040, true)
}

// ---------- Chuyên nghiệp ----------

export function growthCharts(seed) {
  const r = rng(seed)
  const chart = (x0, w, h, color, delay) => {
    const pts = []
    let y = h * 0.8
    for (let i = 0; i <= 10; i++) {
      y = Math.max(h * 0.1, Math.min(h * 0.95, y - h * 0.08 + (r() - 0.5) * h * 0.18))
      pts.push([f((i / 10) * w), f(y)])
    }
    const line = 'M' + pts.map(p => p.join(' ')).join('L')
    const area = `${line}L${w} ${h}L0 ${h}Z`
    const dots = pts.filter((_, i) => i % 2 === 0).map((p, i) => `<g transform="translate(${p[0]} ${p[1]})"><circle ${anim('pulse', 3, -i * 0.4)} r="4.5" fill="${color}"/></g>`).join('')
    return `<g transform="translate(${x0} ${1000 - h - 40})"><path d="${area}" fill="${color}" opacity=".1"/><path ${anim('draw', 12, delay)} d="${line}" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>${dots}</g>`
  }
  let guides = ''
  for (let y = 100; y < 1000; y += 100) guides += `<path d="M0 ${y}H1600" stroke="#8CAFEB" stroke-opacity=".07"/>`
  const donut = `<g transform="translate(1420 190)"><circle r="159" fill="none" stroke="#8CAFEB" stroke-opacity=".15" stroke-width="14"/><g transform="rotate(-90)"><circle ${anim('donut', 10)} r="159" stroke="#4C8DF6" stroke-width="14" stroke-linecap="round"/></g><circle r="110" fill="none" stroke="#8CAFEB" stroke-opacity=".1" stroke-width="2"/></g>`
  return guides + chart(40, 520, 300, '#4C8DF6', 0) + chart(1040, 520, 260, '#5BC0EB', -5) + donut
}

export function bauhaus(seed) {
  const r = rng(seed)
  const hand = `<g transform="translate(1380 220)"><circle r="150" fill="none" stroke="#5C6370" stroke-width="1.2"/><g ${anim('spin fb', 60)}><path d="M0 0V-150" stroke="#3FB8A6" stroke-width="2"/><circle r="150" fill="none" stroke="none"/></g><circle r="5" fill="#3FB8A6"/></g>`
  const shapes = `<g opacity=".7"><g ${anim('floatA', 50)}><circle cx="230" cy="760" r="120" fill="none" stroke="#5C6370" stroke-width="1.4"/><path d="M110 760A120 120 0 0 1 350 760Z" fill="#3FB8A6" opacity=".25"/></g></g><g opacity=".6"><g ${anim('floatB', 60)}><rect x="1240" y="640" width="220" height="220" fill="none" stroke="#5C6370" stroke-width="1.2" transform="rotate(12 1350 750)"/></g></g><path d="M0 120H500M1100 940H1600" stroke="#5C6370" stroke-width="1"/><g transform="translate(560 880)"><g ${anim('bob', 7)}><path d="M0 0L60-104L120 0Z" fill="none" stroke="#3FB8A6" stroke-width="1.4"/></g></g>`
  let dots = ''
  for (let i = 0; i < 6; i++) dots += `<circle ${anim('pulse', 4 + r() * 3, -r() * 4)} cx="${f(80 + i * 22)}" cy="80" r="4" fill="#3FB8A6"/>`
  return hand + shapes + dots
}

export function blueprintGears() {
  const gear = (r, teeth) => {
    let d = ''
    for (let i = 0; i < teeth; i++) {
      const a0 = (i / teeth) * Math.PI * 2
      const step = (Math.PI * 2) / teeth
      const pt = (rr, a) => `${f(Math.cos(a) * rr)},${f(Math.sin(a) * rr)}`
      d += `${i === 0 ? 'M' : 'L'}${pt(r * 0.86, a0)}L${pt(r, a0 + step * 0.25)}L${pt(r, a0 + step * 0.5)}L${pt(r * 0.86, a0 + step * 0.75)}`
    }
    return `<path d="${d}Z" fill="none" stroke="#CFE6FF" stroke-width="1.8"/><circle r="${f(r * 0.6)}" fill="none" stroke="#CFE6FF" stroke-width="1.2"/><circle r="${f(r * 0.16)}" fill="none" stroke="#CFE6FF" stroke-width="1.6"/>`
  }
  const g = (x, y, r, teeth, dur, rev) => `<g transform="translate(${x} ${y})" opacity=".55"><g ${anim(`${rev ? 'spinr' : 'spin'} fb`, dur)}>${gear(r, teeth)}</g></g>`
  const dim = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#CFE6FF" stroke-width="1" stroke-dasharray="6 6" opacity=".5"/><circle cx="${x1}" cy="${y1}" r="3" fill="#CFE6FF"/><circle cx="${x2}" cy="${y2}" r="3" fill="#CFE6FF"/>`
  return g(1380, 780, 170, 20, 40, false) + g(1590, 650, 110, 13, 26, true) + g(160, 220, 130, 16, 34, true) + g(320, 330, 70, 9, 18, false) + dim(60, 900, 520, 900) + dim(1100, 80, 1560, 80) + dim(60, 420, 60, 880)
}

export function dataRain(seed) {
  const r = rng(seed)
  let out = ''
  for (let c = 0; c < 40; c++) {
    const x = f(10 + c * 40 + r() * 16)
    let col = ''
    const n = 8 + Math.floor(r() * 10)
    for (let i = 0; i < n; i++) {
      col += `<rect x="-3" y="${-i * 22}" width="6" height="${i === 0 ? 14 : 10}" rx="2" fill="${i === 0 ? '#C8FFF4' : '#2EC4D6'}" opacity="${f(1 - i / n)}"/>`
    }
    out += `<g transform="translate(${x} -260)"><g ${anim('rain', 7 + r() * 9, -r() * 12)}>${col}</g></g>`
  }
  const nodes = [[160, 180], [300, 120], [260, 300], [1340, 760], [1480, 860], [1460, 680]]
  let net = `<path d="M160 180L300 120L260 300Z M1340 760L1480 860L1460 680Z" fill="none" stroke="#2EC4D6" stroke-opacity=".4"/>`
  nodes.forEach(([x, y], i) => { net += `<g transform="translate(${x} ${y})"><circle ${anim('pulse', 3, -i * 0.5)} r="7" fill="#3FE0A0"/><g ${anim('ripple fb', 3, -i * 0.5)}><circle r="14" fill="none" stroke="#3FE0A0"/></g></g>` })
  return `<g opacity=".85">${out}</g>${net}`
}

export function globe() {
  let lat = ''
  for (const k of [-0.66, -0.33, 0, 0.33, 0.66]) {
    const y = f(k * 260)
    const rx = f(260 * Math.sqrt(1 - k * k))
    lat += `<ellipse cx="0" cy="${y}" rx="${rx}" ry="${f(rx * 0.16)}" fill="none" stroke="#8CB8FF" stroke-opacity=".45"/>`
  }
  let mer = ''
  for (let i = 0; i < 6; i++) {
    mer += `<g ${anim('meridian fb', 12, -i * 2)}><ellipse rx="260" ry="260" fill="none" stroke="#8CB8FF" stroke-opacity=".55"/></g>`
  }
  const orbit = `<g transform="rotate(-18)"><ellipse rx="380" ry="110" fill="none" stroke="#E7CA62" stroke-opacity=".35" stroke-dasharray="3 8"/></g><g transform="rotate(-18) scale(1 .29)"><g ${anim('orbit fb', 16)}><circle r="380" fill="none" stroke="none"/><circle cx="380" cy="0" r="11" fill="#E7CA62"/></g></g>`
  return `<g transform="translate(1300 520)"><circle r="300" fill="url(#glow)" opacity=".5"/><circle r="260" fill="#0B1A3A" stroke="#8CB8FF" stroke-opacity=".7" stroke-width="1.6"/>${lat}${mer}${orbit}</g>`
}

export function paperPlanes(seed) {
  const r = rng(seed)
  let lines = ''
  for (let y = 60; y < 1000; y += 36) lines += `<path d="M0 ${y}H1600" stroke="#9DB5D8" stroke-opacity=".35"/>`
  lines += `<path d="M120 0V1000" stroke="#E8A0A0" stroke-opacity=".55" stroke-width="1.5"/>`
  let planes = ''
  for (let i = 0; i < 5; i++) {
    const y = f(560 + r() * 440)
    const s = f(1.6 + r() * 1.2)
    planes += `<g transform="translate(-260 ${y})"><g ${anim('plane', 22 + r() * 14, -r() * 30)}><g transform="rotate(-15) scale(${s})"><path class="trail" d="M-40 6C-120 20-200-10-300 14" fill="none" stroke="#6E8BB8" stroke-width="2" stroke-dasharray="8 6"/><path d="M0 0L-46-18L-30 4Z" fill="#FFFFFF" stroke="#2B4C7E" stroke-width="1.6"/><path d="M0 0L-46 14L-30 4Z" fill="#E6ECF6" stroke="#2B4C7E" stroke-width="1.6"/></g></g></g>`
  }
  return lines + planes
}

export function hangingEucalyptus(seed) {
  const r = rng(seed)
  let out = ''
  const xs = [30, 150, 290, 420, 1180, 1310, 1440, 1570]
  for (const x of xs) {
    const len = 240 + Math.floor(r() * 300)
    let leaves = ''
    for (let y = 40; y < len; y += 46) {
      const s = 1.1 - (y / len) * 0.5
      const c1 = pick(r, ['#8FB59A', '#9DBFA3', '#7FA88A'])
      const c2 = pick(r, ['#A9C9A4', '#B7D3B2', '#94BB9C'])
      leaves += `<circle cx="${f(-20 * s)}" cy="${y}" r="${f(19 * s)}" fill="${c1}"/><circle cx="${f(20 * s)}" cy="${y + 20}" r="${f(19 * s)}" fill="${c2}"/><path d="M0 ${y}L${f(-20 * s)} ${y}M0 ${y + 20}L${f(20 * s)} ${y + 20}" stroke="#6E8B70" stroke-width="1.2"/>`
    }
    out += `<g transform="translate(${x} -10)"><g ${anim('sway ot', 6 + r() * 4, -r() * 6)}><path d="M0 0V${len}" stroke="#6E8B70" stroke-width="2.4"/>${leaves}</g></g>`
  }
  return out
}

export function searchlights() {
  return [[260, -16], [1340, 14], [800, 0]].map(([x, delay]) => `<g transform="translate(${x} 1000)"><g ${anim('search ob', 10 + Math.abs(delay) / 4, delay / 4)}><path d="M-10 0L-120-900L120-900L10 0Z" fill="url(#searchFill)"/></g></g>`).join('') +
    `<defs><linearGradient id="searchFill" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#B9B0FF" stop-opacity=".35"/><stop offset="1" stop-color="#B9B0FF" stop-opacity="0"/></linearGradient></defs>`
}

// ---------- Dễ thương ----------

export function lollipops(seed) {
  const r = rng(seed)
  const pop = (x, y, s, colors, delay) => {
    let swirl = ''
    for (let i = 0; i < 4; i++) {
      swirl += `<path d="M0 0C${30 + i * 6}-10 ${44 + i * 6} ${30 + i * 4} 0 ${46 + i * 4}" fill="none" stroke="${colors[i % colors.length]}" stroke-width="9" stroke-linecap="round" transform="rotate(${i * 90})"/>`
    }
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0V170" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/><circle r="66" fill="#FFF6FB"/><g ${anim('spin fb', 12, delay)}>${swirl}<circle r="66" fill="none" stroke="none"/></g></g>`
  }
  let candies = ''
  for (let i = 0; i < 9; i++) {
    const x = f(120 + r() * 1360)
    const y = f(120 + r() * 760)
    const c = pick(r, ['#F27BB0', '#C58BF2', '#78D9EC', '#FFD166'])
    candies += `<g transform="translate(${x} ${y}) rotate(${f(r() * 60 - 30)})"><g ${anim('bob', 4 + r() * 3, -r() * 4)}><path d="M-34-12L-22 0L-34 12ZM34-12L22 0L34 12Z" fill="${c}" opacity=".8"/><ellipse rx="22" ry="15" fill="${c}"/><path d="M-10-12V12M0-14V14M10-12V12" stroke="#FFFFFF" stroke-opacity=".6" stroke-width="3"/></g></g>`
  }
  return pop(160, 760, 1.4, ['#F27BB0', '#FFFFFF'], 0) + pop(1440, 200, 1.1, ['#C58BF2', '#78D9EC'], -4) + pop(1480, 820, 0.9, ['#FFD166', '#F27BB0'], -8) + candies
}

export function birds(seed, n) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < n; i++) {
    const y = f(120 + r() * 420)
    const s = f(1.3 + r() * 1)
    out += `<g transform="translate(-200 ${y})"><g ${anim('fly', 26 + r() * 14, -r() * 36)}><g transform="scale(${s})"><g ${anim('flap fb', 0.7 + r() * 0.5, -r())}><path d="M-22-4Q-11-14 0 0Q11-14 22-4" fill="none" stroke="#5B6B8C" stroke-width="3" stroke-linecap="round"/></g></g></g></g>`
  }
  return out
}

export function hangingStars(seed) {
  const r = rng(seed)
  const star = 'M0-22L6-7L22-7L9 3L14 19L0 9L-14 19L-9 3L-22-7L-6-7Z'
  let out = ''
  for (let i = 0; i < 11; i++) {
    const x = f(60 + i * 148 + r() * 30)
    const len = 120 + Math.floor(r() * 320)
    const isPlanet = i % 4 === 2
    const body = isPlanet
      ? `<circle cy="${len + 26}" r="24" fill="#F6B8D0"/><ellipse cy="${len + 26}" rx="40" ry="9" fill="none" stroke="#FFF4DA" stroke-width="3"/>`
      : `<path transform="translate(0 ${len + 22})" d="${star}" fill="${pick(r, ['#FFE7A0', '#FFF4DA', '#FFD3E6'])}"/>`
    out += `<g transform="translate(${x} -4)"><g ${anim('swing ot', 4 + r() * 3, -r() * 4)}><path d="M0 0V${len}" stroke="#E5DBFF" stroke-opacity=".7" stroke-width="1.4"/>${body}</g></g>`
  }
  return out
}

export function fishSchool(seed, n) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < n; i++) {
    const y = f(860 + r() * 120)
    const c = pick(r, ['#FF9F80', '#FFD166', '#F27BB0', '#FFFFFF'])
    const s = f(0.7 + r() * 0.6)
    out += `<g transform="translate(-200 ${y})"><g ${anim('swim', 30 + r() * 16, -r() * 40)}><g transform="scale(${s})"><g transform="translate(-30 0)"><g ${anim('tail fb', 1 + r() * 0.6)}><path d="M0 0L-24-14L-24 14Z" fill="${c}"/></g></g><ellipse rx="34" ry="16" fill="${c}"/><circle cx="18" cy="-4" r="3" fill="#123"/></g></g></g>`
  }
  return out
}

export function butterflies(seed, n) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < n; i++) {
    const y = f(260 + r() * 520)
    const c = pick(r, ['#F6A6BE', '#C58AF9', '#78D9EC', '#FFD166'])
    out += `<g transform="translate(-160 ${y})"><g ${anim('flutter', 22 + r() * 12, -r() * 30)}><g transform="scale(${f(1.5 + r() * 0.8)})"><g ${anim('wing fb', 0.45 + r() * 0.3, -r())}><path d="M0 0C-26-30-40-6-22 6C-36 18-14 30 0 6Z" fill="${c}"/><path d="M0 0C26-30 40-6 22 6C36 18 14 30 0 6Z" fill="${c}"/></g><path d="M0-8V12" stroke="#5B4636" stroke-width="3" stroke-linecap="round"/></g></g></g>`
  }
  return out
}

// ---------- Thiên nhiên ----------

export function lotusPond(seed) {
  const r = rng(seed)
  let pads = ''
  for (let i = 0; i < 12; i++) {
    const x = f(r() * 1600)
    const y = f(r() * 1000)
    const s = f(0.6 + r() * 0.9)
    pads += `<g transform="translate(${x} ${y}) scale(${s}) rotate(${f(r() * 360)})"><path d="M0 0L60-6A60 60 0 1 1 58 12Z" fill="#3E8C5A"/><path d="M0 0L60-6M0 0L-40 40M0 0L-50-30M0 0L20 55" stroke="#2E6B44" stroke-width="2"/></g>`
  }
  const flower = (x, y) => `<g transform="translate(${x} ${y})"><g ${anim('bob', 5)}>${[0, 60, 120, 180, 240, 300].map(a => `<ellipse cy="-26" rx="13" ry="28" fill="#F6A6BE" transform="rotate(${a})"/>`).join('')}${[30, 90, 150, 210, 270, 330].map(a => `<ellipse cy="-16" rx="9" ry="18" fill="#FBD0DC" transform="rotate(${a})"/>`).join('')}<circle r="10" fill="#F6D365"/></g></g>`
  const koi = (cx, cy, R, dur, delay, c) => `<g transform="translate(${cx} ${cy})"><g ${anim('orbit fb', dur, delay)}><circle r="${R}" fill="none" stroke="none"/><g transform="translate(${R} 0) rotate(90)"><ellipse rx="34" ry="13" fill="${c}"/><ellipse cx="-6" rx="10" ry="8" fill="#FFFFFF" opacity=".7"/><g transform="translate(-34 0)"><g ${anim('tail fb', 1.1)}><path d="M0 0L-22-14L-22 14Z" fill="${c}"/></g></g></g></g></g>`
  let ripples = ''
  for (let i = 0; i < 6; i++) ripples += `<g transform="translate(${f(r() * 1600)} ${f(r() * 1000)})"><g ${anim('ripple fb', 5, -r() * 5)}><circle r="40" fill="none" stroke="#BFF0E6" stroke-width="1.6"/></g></g>`
  return pads + ripples + koi(420, 640, 180, 30, 0, '#FF8A3D') + koi(1180, 330, 150, 26, -9, '#F4F1E8') + koi(1250, 760, 120, 22, -4, '#E8505B') + flower(250, 260) + flower(1400, 560) + flower(760, 880)
}

export function autumnGusts(seed) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < 7; i++) {
    const y = f(100 + r() * 800)
    out += `<path ${anim('gust', 6 + r() * 4, -r() * 8)} d="M-100 ${y}C300 ${f(y - 120)} 500 ${f(y + 120)} 900 ${y}S1400 ${f(y - 140)} 1750 ${f(y + 30)}" stroke="#D9772E" stroke-width="3" stroke-linecap="round" opacity=".7"/>`
  }
  return out
}

export function pineForest(seed) {
  const r = rng(seed)
  const tree = (x, h, c, snow) => `<g transform="translate(${x} 1000)"><path d="M0 ${-h}L${f(h * 0.28)} ${f(-h * 0.55)}H${f(h * 0.14)}L${f(h * 0.36)} ${f(-h * 0.2)}H${f(h * 0.08)}V0H${f(-h * 0.08)}V${f(-h * 0.2)}H${f(-h * 0.36)}L${f(-h * 0.14)} ${f(-h * 0.55)}H${f(-h * 0.28)}Z" fill="${c}"/><path d="M0 ${-h}L${f(h * 0.12)} ${f(-h * 0.78)}H${f(-h * 0.12)}Z" fill="${snow}"/></g>`
  let back = ''
  let front = ''
  for (let x = -40; x < 1660; x += 70 + Math.floor(r() * 50)) back += tree(x, 260 + Math.floor(r() * 160), '#0B1A33', '#9FBCE0')
  for (let x = -60; x < 1660; x += 120 + Math.floor(r() * 90)) front += tree(x, 360 + Math.floor(r() * 220), '#040A16', '#EAF3FF')
  return `${back}<rect y="960" width="1600" height="40" fill="#DCEBFA"/>${front}`
}

export function caravan() {
  const camel = x => `<g transform="translate(${x} 0)"><path d="M0 0C10-30 30-34 40-20C48-40 64-40 70-20L80-30L88-26L80-6L70 0L68 30H62L60 4H20L18 30H12L10 2Z" fill="#2A1009"/></g>`
  return `<path d="M0 1000V612C300 606 700 616 1000 610S1450 606 1600 612V1000Z" fill="#8A3A24"/><g transform="translate(1700 578)"><g ${anim('walk', 140, -70)}><g transform="scale(1.15)">${camel(0)}${camel(110)}${camel(220)}</g></g></g>`
}

export function silkRibbonsSand() {
  return ''
}
