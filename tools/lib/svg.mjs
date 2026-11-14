// Scene building blocks for Claude Code Desktop backdrops.
//
// Every scene is one <svg> with a viewBox of 1600 x 1000 and preserveAspectRatio "xMidYMid slice".
// Rules learned from testing in the desktop app (see docs/quy-trinh-tao-mod.md):
//   - CSS animations only (transform, opacity, stroke-dashoffset); no SMIL animateMotion.
//   - No @media blocks, no url() inside <style>, no pathLength, no <image>, no <text>, no script.
//   - A CSS transform replaces an element's transform attribute, so animated groups are nested
//     inside a positioned group, never on the positioned group itself.

export const W = 1600
export const H = 1000

export const f = n => Math.round(n * 10) / 10

export function rng(seed) {
  let s = seed >>> 0 || 1
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

export function hashSeed(text) {
  let h = 2166136261
  for (const ch of text) {
    h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0
  }
  return h
}

const pick = (r, list) => list[Math.floor(r() * list.length) % list.length]

// ---------- shared CSS ----------

export const CSS = `
.fb{transform-box:fill-box;transform-origin:center}
.ob{transform-box:fill-box;transform-origin:center bottom}
.ot{transform-box:fill-box;transform-origin:center top}
.spin{animation:spin 300s linear infinite}
.spinr{animation:spinr 300s linear infinite}
.glint{animation:glint 12s ease-in-out infinite}
.pulse{animation:pulse 6s ease-in-out infinite}
.tw{opacity:0;animation:tw 5s ease-in-out infinite}
.rise{opacity:0;animation:rise 20s linear infinite}
.riseFar{opacity:0;animation:riseFar 24s linear infinite}
.balloon{animation:balloon 26s linear infinite}
.fall{animation:fall 18s linear infinite}
.spinp{animation:spin 6s linear infinite}
.sway{animation:sway 7s ease-in-out infinite}
.bob{animation:bob 4s ease-in-out infinite}
.floatA{animation:floatA 28s ease-in-out infinite}
.floatB{animation:floatB 34s ease-in-out infinite}
.drift{animation:drift 90s linear infinite}
.sand{opacity:0;animation:sand 14s linear infinite}
.wave{animation:wave 14s linear infinite}
.grow{animation:grow 5s ease-in-out infinite}
.flick{animation:flick 7s steps(1) infinite}
.ripple{opacity:0;animation:ripple 4s ease-out infinite}
.comet{fill:none;stroke-linecap:round;stroke-dasharray:24 1976;animation:comet 6s linear infinite}
.shoot{fill:none;stroke-linecap:round;stroke-dasharray:90 3000;animation:shoot 9s ease-in infinite}
.aurA{animation:aurA 16s ease-in-out infinite}
.aurB{animation:aurB 21s ease-in-out infinite}
.sweep{animation:sweep 22s ease-in-out infinite}
.firefly{opacity:0;animation:firefly 9s ease-in-out infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes spinr{to{transform:rotate(-360deg)}}
@keyframes glint{0%,100%{opacity:.7}50%{opacity:1}}
@keyframes pulse{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes tw{0%,100%{opacity:0;transform:scale(.6)}50%{opacity:1;transform:scale(1)}}
@keyframes rise{0%{transform:translateY(0);opacity:0}15%{opacity:.85}85%{opacity:.5}100%{transform:translateY(-620px);opacity:0}}
@keyframes riseFar{0%{transform:translateY(0);opacity:0}10%{opacity:.8}90%{opacity:.6}100%{transform:translateY(-1150px);opacity:0}}
@keyframes balloon{0%{transform:translate(0,0)}25%{transform:translate(18px,-300px)}50%{transform:translate(-12px,-600px)}75%{transform:translate(14px,-900px)}100%{transform:translate(0,-1250px)}}
@keyframes fall{0%{transform:translate(0,0)}25%{transform:translate(45px,280px)}50%{transform:translate(-25px,560px)}75%{transform:translate(40px,840px)}100%{transform:translate(10px,1120px)}}
@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes floatA{0%,100%{transform:translate(0,0)}50%{transform:translate(220px,120px)}}
@keyframes floatB{0%,100%{transform:translate(0,0)}50%{transform:translate(-240px,-110px)}}
@keyframes drift{from{transform:translateX(0)}to{transform:translateX(2300px)}}
@keyframes sand{0%{transform:translate(0,0);opacity:0}15%{opacity:.7}85%{opacity:.4}100%{transform:translate(-420px,-40px);opacity:0}}
@keyframes wave{from{transform:translateX(0)}to{transform:translateX(-800px)}}
@keyframes grow{0%,100%{transform:scaleY(.45)}50%{transform:scaleY(1)}}
@keyframes flick{0%,100%{opacity:.95}40%{opacity:.25}55%{opacity:.95}80%{opacity:.4}}
@keyframes ripple{0%{opacity:.8;transform:scale(.3)}100%{opacity:0;transform:scale(2.4)}}
@keyframes comet{from{stroke-dashoffset:2000}to{stroke-dashoffset:0}}
@keyframes shoot{0%{stroke-dashoffset:90}12%{stroke-dashoffset:-330}100%{stroke-dashoffset:-330}}
@keyframes aurA{0%,100%{transform:translateX(0) scaleY(1);opacity:.7}50%{transform:translateX(120px) scaleY(1.15);opacity:1}}
@keyframes aurB{0%,100%{transform:translateX(0) scaleY(1.1);opacity:.85}50%{transform:translateX(-140px) scaleY(.9);opacity:.55}}
@keyframes sweep{0%{transform:translateX(-1900px)}60%,100%{transform:translateX(1900px)}}
@keyframes firefly{0%,100%{opacity:0;transform:translate(0,0)}30%{opacity:1}50%{opacity:.6;transform:translate(30px,-40px)}70%{opacity:1}}
`

// ---------- defs ----------

export function defs(t) {
  const [a0, a1, a2] = t.metal
  const stops = t.bg.map((c, i) => `<stop offset="${f(i / (t.bg.length - 1))}" stop-color="${c}"/>`).join('')
  return `<linearGradient id="bg" x1="0" y1="0" x2="${t.bgVertical ? 0 : 1}" y2="1">${stops}</linearGradient>
<linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a0}"/><stop offset=".5" stop-color="${a1}"/><stop offset="1" stop-color="${a2}"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="${t.glow[0]}" stop-opacity=".55"/><stop offset="1" stop-color="${t.glow[0]}" stop-opacity="0"/></radialGradient>
<radialGradient id="glow2"><stop offset="0" stop-color="${t.glow[1] ?? t.glow[0]}" stop-opacity=".45"/><stop offset="1" stop-color="${t.glow[1] ?? t.glow[0]}" stop-opacity="0"/></radialGradient>
<radialGradient id="spark"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset=".35" stop-color="${a1}" stop-opacity=".6"/><stop offset="1" stop-color="${a1}" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${t.vignette ?? 0.45}"/></radialGradient>
<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>`
}

// ---------- patterns ----------

export function pattern(kind, color, opacity) {
  const bodies = {
    grid: [40, 40, `<path d="M40 0H0V40" fill="none" stroke="${color}" stroke-width="1"/>`],
    blueprint: [100, 100, `<path d="M100 0H0V100" fill="none" stroke="${color}" stroke-width="1.4"/><path d="M20 0V100M40 0V100M60 0V100M80 0V100M0 20H100M0 40H100M0 60H100M0 80H100" stroke="${color}" stroke-width=".5"/>`],
    dots: [48, 48, `<circle cx="24" cy="24" r="1.8" fill="${color}"/>`],
    lattice: [64, 64, `<path d="M32 0L64 32L32 64L0 32Z" fill="none" stroke="${color}" stroke-width="1"/>`],
    deco: [80, 40, `<path d="M0 40A40 40 0 0 1 80 40M10 40A30 30 0 0 1 70 40M20 40A20 20 0 0 1 60 40M30 40A10 10 0 0 1 50 40M-40 0A40 40 0 0 1 40 0M40 0A40 40 0 0 1 120 0" fill="none" stroke="${color}" stroke-width="1"/>`],
    damask: [96, 96, `<g fill="none" stroke="${color}" stroke-width="1"><circle cx="48" cy="34" r="14"/><circle cx="48" cy="62" r="14"/><circle cx="34" cy="48" r="14"/><circle cx="62" cy="48" r="14"/><path d="M48 0L96 48L48 96L0 48Z"/><circle cx="48" cy="48" r="3" fill="${color}"/></g>`],
    hex: [56, 97, `<path d="M28 0L56 16V48L28 64L0 48V16ZM28 64V97" fill="none" stroke="${color}" stroke-width="1"/>`],
    diamond: [40, 40, `<path d="M20 4L36 20L20 36L4 20Z" fill="none" stroke="${color}" stroke-width=".9"/><circle cx="0" cy="0" r="1.6" fill="${color}"/><circle cx="40" cy="40" r="1.6" fill="${color}"/>`],
    paper: [32, 32, `<path d="M0 31.5H32" stroke="${color}" stroke-width="1"/>`],
    hearts: [90, 90, `<path transform="translate(45 45) scale(1.4)" d="M0 4C-6-1-5-7 0-4C5-7 6-1 0 4Z" fill="${color}"/><circle cx="0" cy="0" r="2.2" fill="${color}"/><circle cx="90" cy="90" r="2.2" fill="${color}"/>`],
  }
  const [w, h, body] = bodies[kind]
  const id = `p-${kind}`
  return {
    def: `<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">${body}</pattern>`,
    body: `<rect width="${W}" height="${H}" fill="url(#${id})" opacity="${opacity}"/>`,
  }
}

// ---------- medallions (centred on 0,0) ----------

function ring(count, radius, draw) {
  let out = ''
  for (let i = 0; i < count; i++) {
    const deg = (360 / count) * i
    const rad = (deg * Math.PI) / 180
    out += draw(f(Math.cos(rad) * radius), f(Math.sin(rad) * radius), deg, rad)
  }
  return out
}

const P = (rr, aa) => `${f(Math.cos(aa) * rr)},${f(Math.sin(aa) * rr)}`

function ornate(r, paint) {
  const rays = ring(16, 0, (_x, _y, _d, a) => {
    const w = (Math.PI / 16) * 0.55
    return `<polygon points="${P(r * 0.12, a - w)} ${P(r * 0.34, a)} ${P(r * 0.12, a + w)}"/>`
  })
  const teeth = ring(48, 0, (_x, _y, _d, a) => {
    const w = Math.PI / 48
    return `<polygon points="${P(r * 0.52, a - w)} ${P(r * 0.6, a)} ${P(r * 0.52, a + w)}"/>`
  })
  const dots = ring(36, r * 0.68, (x, y) => `<circle cx="${x}" cy="${y}" r="${f(r * 0.012)}"/>`)
  const petals = ring(12, r * 0.82, (x, y, deg) => `<ellipse cx="${x}" cy="${y}" rx="${f(r * 0.06)}" ry="${f(r * 0.022)}" transform="rotate(${deg} ${x} ${y})"/>`)
  const circles = [0.1, 0.36, 0.5, 0.62, 0.74, 0.9, 1].map(k => `<circle r="${f(r * k)}"/>`).join('')
  return `<g stroke="${paint}" stroke-width="${f(r * 0.004 + 0.6)}" fill="none">${circles}${petals}</g><g fill="${paint}">${rays}${teeth}${dots}</g><circle r="${f(r * 0.05)}" fill="${paint}"/>`
}

function compass(r, paint) {
  let ticks = ''
  for (let i = 0; i < 72; i++) {
    const a = (i * 5 * Math.PI) / 180
    const inner = i % 6 === 0 ? r * 0.86 : r * 0.93
    ticks += `M${f(Math.cos(a) * inner)} ${f(Math.sin(a) * inner)}L${f(Math.cos(a) * r)} ${f(Math.sin(a) * r)}`
  }
  let points = ''
  for (let i = 0; i < 8; i++) {
    const a = (i * 45 * Math.PI) / 180
    const len = i % 2 === 0 ? r * 0.7 : r * 0.42
    const w = i % 2 === 0 ? r * 0.07 : r * 0.045
    points += `<polygon points="${P(len, a)} ${P(w, a + Math.PI / 2)} ${P(w * 0.4, a + Math.PI)} ${P(w, a - Math.PI / 2)}"/>`
  }
  return `<g fill="none" stroke="${paint}"><circle r="${r}" stroke-width="1.6"/><circle r="${f(r * 0.82)}" stroke-width="1" stroke-dasharray="2 9"/><circle r="${f(r * 0.56)}" stroke-width="1.2"/><circle r="${f(r * 0.3)}" stroke-width="1" stroke-dasharray="14 8"/><path d="${ticks}" stroke-width="1.4"/></g><g fill="${paint}">${points}</g>`
}

function sunburst(r, paint) {
  let out = ''
  for (let i = 0; i < 36; i++) {
    const a = (i * 10 * Math.PI) / 180
    const len = i % 2 === 0 ? r : r * 0.72
    const w = (Math.PI / 36) * 0.5
    out += `<polygon points="${P(r * 0.22, a - w)} ${P(len, a)} ${P(r * 0.22, a + w)}"/>`
  }
  const rings = [0.18, 0.22, 1.04].map(k => `<circle r="${f(r * k)}" fill="none" stroke="${paint}" stroke-width="1.5"/>`).join('')
  return `<g fill="${paint}">${out}</g>${rings}<circle r="${f(r * 0.1)}" fill="${paint}"/>`
}

function mandala(r, paint) {
  let out = ''
  for (const [k, n, rx, ry] of [[0.3, 8, 0.14, 0.05], [0.55, 12, 0.13, 0.045], [0.8, 16, 0.12, 0.04]]) {
    out += ring(n, r * k, (x, y, deg) => `<ellipse cx="${x}" cy="${y}" rx="${f(r * rx)}" ry="${f(r * ry)}" transform="rotate(${deg} ${x} ${y})"/>`)
  }
  const dots = ring(48, r * 0.96, (x, y) => `<circle cx="${x}" cy="${y}" r="${f(r * 0.01)}" fill="${paint}"/>`)
  return `<g fill="none" stroke="${paint}" stroke-width="${f(r * 0.004 + 0.6)}">${out}<circle r="${f(r * 0.42)}"/><circle r="${f(r * 0.68)}"/><circle r="${r}"/></g>${dots}<circle r="${f(r * 0.06)}" fill="${paint}"/>`
}

function gear(r, paint, teeth = 18) {
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2
    const a1 = a0 + (Math.PI * 2) / teeth * 0.25
    const a2 = a0 + (Math.PI * 2) / teeth * 0.5
    const a3 = a0 + (Math.PI * 2) / teeth * 0.75
    d += `${i === 0 ? 'M' : 'L'}${P(r * 0.86, a0)}L${P(r, a1)}L${P(r, a2)}L${P(r * 0.86, a3)}`
  }
  return `<g fill="none" stroke="${paint}" stroke-width="1.6"><path d="${d}Z"/><circle r="${f(r * 0.6)}"/><circle r="${f(r * 0.2)}"/>${ring(6, 0, (_x, _y, _d, a) => `<path d="M${P(r * 0.2, a)}L${P(r * 0.6, a)}"/>`)}</g>`
}

const MEDALLIONS = { ornate, compass, sunburst, mandala, gear }

export function medallion({ style, x, y, r, speed = 300, reverse = false, opacity = 0.35, paint = 'url(#g1)', delay = 0 }) {
  return `<g transform="translate(${x} ${y})" opacity="${opacity}"><g class="glint" style="animation-delay:${delay}s"><g class="${reverse ? 'spinr' : 'spin'} fb" style="animation-duration:${speed}s">${MEDALLIONS[style](r, paint)}</g></g></g>`
}

// ---------- particles ----------

const SHAPES = {
  petal: c => `<path d="M0-9C6-9 9-1 0 9C-9-1-6-9 0-9Z" fill="${c}"/>`,
  leaf: c => `<path d="M0-12C8-7 8 7 0 12C-8 7-8-7 0-12Z" fill="${c}"/><path d="M0-11V11" stroke="#000" stroke-opacity=".18" stroke-width="1"/>`,
  maple: c => `<path d="M0-13L3-6L9-8L6-2L12 0L5 3L6 9L0 6L-6 9L-5 3L-12 0L-6-2L-9-8L-3-6Z" fill="${c}"/>`,
  snow: c => `<g stroke="${c}" stroke-width="1.4" stroke-linecap="round"><path d="M0-9V9M-7.8-4.5L7.8 4.5M-7.8 4.5L7.8-4.5"/></g><circle r="1.6" fill="${c}"/>`,
  heart: c => `<path d="M0 6C-9-1-7-10 0-6C7-10 9-1 0 6Z" fill="${c}"/>`,
  confetti: c => `<rect x="-5" y="-2.5" width="10" height="5" rx="1" fill="${c}"/>`,
  star4: c => `<path d="M0-8L2-2L8 0L2 2L0 8L-2 2L-8 0L-2-2Z" fill="${c}"/>`,
}

export function fall(seed, { n, shapes, colors, scale = [0.8, 1.6], speed = [14, 26], opacity = 0.85 }) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < n; i++) {
    const x = f(r() * 1700 - 50)
    const s = f(scale[0] + r() * (scale[1] - scale[0]))
    const dur = f(speed[0] + r() * (speed[1] - speed[0]))
    const delay = f(-r() * dur)
    const spinDur = f(4 + r() * 6)
    out += `<g class="fall" style="animation-duration:${dur}s;animation-delay:${delay}s"><g transform="translate(${x} -40) scale(${s})" opacity="${opacity}"><g class="spinp fb" style="animation-duration:${spinDur}s">${SHAPES[pick(r, shapes)](pick(r, colors))}</g></g></g>`
  }
  return out
}

export function rise(seed, { n, colors, size = [1, 3.4], y = [560, 1040], far = false, speed = [14, 30] }) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < n; i++) {
    const cx = f(r() * 1600)
    const cy = f(y[0] + r() * (y[1] - y[0]))
    const rad = f(size[0] + r() * (size[1] - size[0]))
    const dur = f(speed[0] + r() * (speed[1] - speed[0]))
    out += `<circle class="${far ? 'riseFar' : 'rise'}" cx="${cx}" cy="${cy}" r="${rad}" fill="${pick(r, colors)}" style="animation-duration:${dur}s;animation-delay:${f(-r() * dur)}s"/>`
  }
  return out
}

export function bubbles(seed, { n, color, size = [6, 22] }) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < n; i++) {
    const cx = f(r() * 1600)
    const rad = f(size[0] + r() * (size[1] - size[0]))
    const dur = f(16 + r() * 18)
    out += `<g class="riseFar" style="animation-duration:${dur}s;animation-delay:${f(-r() * dur)}s"><circle cx="${cx}" cy="${f(1040 + r() * 60)}" r="${rad}" fill="${color}" fill-opacity=".12" stroke="${color}" stroke-opacity=".7" stroke-width="1.4"/><circle cx="${f(cx - rad * 0.35)}" cy="${f(1040 - rad * 0.35)}" r="${f(rad * 0.22)}" fill="#FFFFFF" fill-opacity=".8"/></g>`
  }
  return out
}

export function balloons(seed, { n, colors }) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < n; i++) {
    const x = f(60 + r() * 1480)
    const s = f(0.7 + r() * 0.8)
    const c = pick(r, colors)
    const dur = f(22 + r() * 16)
    out += `<g class="balloon" style="animation-duration:${dur}s;animation-delay:${f(-r() * dur)}s"><g transform="translate(${x} 1090) scale(${s})"><path d="M0 34C-2 50 4 62 -2 80" fill="none" stroke="${c}" stroke-opacity=".6" stroke-width="1.4"/><ellipse cx="0" cy="0" rx="26" ry="32" fill="${c}"/><path d="M-4 31L4 31L0 36Z" fill="${c}"/><ellipse cx="-9" cy="-12" rx="6" ry="10" fill="#FFFFFF" fill-opacity=".45" transform="rotate(-25 -9 -12)"/></g></g>`
  }
  return out
}

export function twinkle(seed, { n, colors, shape = 'circle', size = [1.2, 3], area = [0, 0, 1600, 1000] }) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < n; i++) {
    const x = f(area[0] + r() * (area[2] - area[0]))
    const y = f(area[1] + r() * (area[3] - area[1]))
    const s = f(size[0] + r() * (size[1] - size[0]))
    const c = pick(r, colors)
    const dur = f(3 + r() * 5)
    const body = shape === 'star4' ? `<path d="M0-${f(s * 3)}L${f(s * 0.7)}-${f(s * 0.7)}L${f(s * 3)} 0L${f(s * 0.7)} ${f(s * 0.7)}L0 ${f(s * 3)}L-${f(s * 0.7)} ${f(s * 0.7)}L-${f(s * 3)} 0L-${f(s * 0.7)}-${f(s * 0.7)}Z" fill="${c}"/>` : `<circle r="${s}" fill="${c}"/>`
    out += `<g transform="translate(${x} ${y})"><g class="tw fb" style="animation-duration:${dur}s;animation-delay:${f(-r() * dur)}s">${body}</g></g>`
  }
  return out
}

export function fireflies(seed, { n, color, area = [0, 300, 1600, 1000] }) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < n; i++) {
    const x = f(area[0] + r() * (area[2] - area[0]))
    const y = f(area[1] + r() * (area[3] - area[1]))
    const dur = f(6 + r() * 6)
    out += `<g transform="translate(${x} ${y})"><g class="firefly" style="animation-duration:${dur}s;animation-delay:${f(-r() * dur)}s"><circle r="10" fill="url(#spark)"/><circle r="2.2" fill="${color}"/></g></g>`
  }
  return out
}

export function sandDrift(seed, { n, color }) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < n; i++) {
    const dur = f(9 + r() * 9)
    out += `<circle class="sand" cx="${f(200 + r() * 1500)}" cy="${f(640 + r() * 340)}" r="${f(0.8 + r() * 1.6)}" fill="${color}" style="animation-duration:${dur}s;animation-delay:${f(-r() * dur)}s"/>`
  }
  return out
}

// ---------- scenery ----------

export function glowBlob(x, y, rx, ry, id = 'glow', cls = 'floatA', opacity = 0.6) {
  return `<g opacity="${opacity}"><g class="${cls}"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${id})"/></g></g>`
}

export function sheen(opacity = 0.06, angle = 18) {
  return `<g class="sweep" opacity="${opacity}"><rect x="-200" y="-400" width="360" height="1800" fill="url(#sheen)" transform="rotate(${angle} 0 500)"/></g>`
}

export function vignette() {
  return `<rect width="${W}" height="${H}" fill="url(#vig)"/>`
}

export function waves({ colors, base = 820, amp = 26, step = 70 }) {
  return colors.map((c, i) => {
    const y = base + i * step
    const a = amp - i * 4
    let d = `M0 ${y}`
    for (let x = 0; x < 2600; x += 400) {
      d += `Q${x + 100} ${y - a} ${x + 200} ${y}T${x + 400} ${y}`
    }
    d += `V1100H0Z`
    return `<g><g class="wave" style="animation-duration:${14 + i * 5}s;animation-direction:${i % 2 ? 'reverse' : 'normal'}"><path d="${d}" fill="${c}"/></g></g>`
  }).join('')
}

function cloudShape(c, o) {
  return `<g fill="${c}" opacity="${o}"><ellipse cx="0" cy="0" rx="70" ry="32"/><circle cx="-34" cy="-16" r="30"/><circle cx="12" cy="-30" r="38"/><circle cx="50" cy="-10" r="26"/></g>`
}

export function clouds(seed, { n, color, opacity = 0.85, y = [80, 420] }) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < n; i++) {
    const s = f(0.6 + r() * 0.9)
    const dur = f(80 + r() * 70)
    out += `<g transform="translate(-300 ${f(y[0] + r() * (y[1] - y[0]))})"><g class="drift" style="animation-duration:${dur}s;animation-delay:${f(-r() * dur)}s"><g transform="scale(${s})">${cloudShape(color, opacity)}</g></g></g>`
  }
  return out
}

export function moon(x, y, r, color = '#F4F1E1', glow = true) {
  return `${glow ? `<g opacity=".7"><g class="pulse"><circle cx="${x}" cy="${y}" r="${f(r * 3)}" fill="url(#glow)"/></g></g>` : ''}<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.2)}" r="${f(r * 0.16)}" fill="#000" fill-opacity=".07"/><circle cx="${f(x + r * 0.25)}" cy="${f(y + r * 0.3)}" r="${f(r * 0.22)}" fill="#000" fill-opacity=".06"/>`
}

export function sun(x, y, r, paint = 'url(#g1)') {
  return `<g opacity=".8"><g class="pulse"><circle cx="${x}" cy="${y}" r="${f(r * 3.2)}" fill="url(#glow)"/></g></g><g transform="translate(${x} ${y})" opacity=".55"><g class="spin fb" style="animation-duration:120s">${ring(24, 0, (_x, _y, _d, a) => `<path d="M${P(r * 1.25, a)}L${P(r * 1.6, a)}" stroke="${paint}" stroke-width="4" stroke-linecap="round"/>`)}</g></g><circle cx="${x}" cy="${y}" r="${r}" fill="${paint}"/>`
}

export function mountains(layers, snow) {
  const shapes = [
    'M0 1000V720L160 560L300 680L470 500L640 690L800 560L980 720L1140 540L1320 700L1480 580L1600 650V1000Z',
    'M0 1000V820L200 690L380 800L560 660L760 820L950 700L1150 830L1330 690L1600 800V1000Z',
  ]
  const caps = 'M160 560L130 592L160 585L190 595ZM470 500L438 538L470 528L505 540ZM1140 540L1110 575L1140 566L1172 578Z'
  return layers.map((c, i) => `<path d="${shapes[i % 2]}" fill="${c}"/>${i === 0 && snow ? `<path d="${caps}" fill="${snow}"/>` : ''}`).join('')
}

export function dunes(colors) {
  const shapes = [
    'M0 1000V700C200 640 420 650 600 700C800 755 1000 690 1200 660C1380 635 1500 650 1600 670V1000Z',
    'M0 1000V800C180 760 380 770 560 805C760 845 960 800 1160 770C1340 745 1480 760 1600 780V1000Z',
    'M0 1000V890C220 860 420 880 640 900C860 920 1080 880 1300 870C1440 865 1540 875 1600 880V1000Z',
  ]
  return colors.map((c, i) => `<path d="${shapes[i]}" fill="${c}"/>`).join('')
}

export function skyline(seed, { body, lit }) {
  const r = rng(seed)
  let rects = ''
  let windows = ''
  let x = -20
  while (x < 1620) {
    const w = 60 + Math.floor(r() * 90)
    const h = 120 + Math.floor(r() * 300)
    rects += `<rect x="${x}" y="${1000 - h}" width="${w}" height="${h + 10}" fill="${body}"/>`
    for (let wy = 1000 - h + 18; wy < 980; wy += 26) {
      for (let wx = x + 10; wx < x + w - 14; wx += 20) {
        const v = r()
        if (v < 0.16) {
          windows += `<rect x="${wx}" y="${wy}" width="8" height="12" fill="${lit}" class="flick" style="animation-delay:${f(-r() * 7)}s;animation-duration:${f(5 + r() * 6)}s"/>`
        } else if (v < 0.42) {
          windows += `<rect x="${wx}" y="${wy}" width="8" height="12" fill="${lit}" opacity=".55"/>`
        }
      }
    }
    x += w + 4
  }
  return rects + windows
}

export function bars(seed, { paint, x0, count = 7 }) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < count; i++) {
    const h = 80 + Math.floor(r() * 220)
    out += `<g transform="translate(${x0 + i * 34} 1000)" opacity=".55"><rect class="grow ob" x="0" y="-${h}" width="22" height="${h}" rx="3" fill="${paint}" style="animation-duration:${f(4 + r() * 4)}s;animation-delay:${f(-r() * 6)}s"/></g>`
  }
  return out
}

export function mapnet({ pinPaint = 'url(#g1)', route = '#C9A84C', comet = '#FFF3C4' }) {
  const offices = [[170, 250, 0], [360, 760, 1.1], [1080, 300, 2.2], [1430, 560, 0.6], [610, 130, 1.7], [130, 560, 2.8], [1180, 860, 1.4], [820, 880, 0.3]]
  const routes = [[0, 4], [4, 2], [2, 3], [0, 5], [5, 1], [3, 6], [1, 7], [7, 6]]
  const pin = 'M0 0C-4-8-13-15-13-24A13 13 0 1 1 13-24C13-15 4-8 0 0ZM0-29A5 5 0 1 0 0-19A5 5 0 1 0 0-29Z'
  let out = ''
  routes.forEach(([a, b], i) => {
    const A = offices[a]
    const B = offices[b]
    const mx = (A[0] + B[0]) / 2
    const my = (A[1] + B[1]) / 2 - Math.abs(A[0] - B[0]) * 0.18 - 40
    const d = `M${A[0]} ${A[1] - 18}Q${Math.round(mx)} ${Math.round(my)} ${B[0]} ${B[1] - 18}`
    out += `<path d="${d}" fill="none" stroke="${route}" stroke-width="1.8" stroke-dasharray="5 10" opacity=".7"/>`
    if (i % 2 === 0) {
      out += `<path class="comet" d="${d}" stroke="${comet}" stroke-width="3" style="animation-duration:${f(4 + (i % 3) * 1.4)}s;animation-delay:${f(-i * 0.9)}s"/>`
    }
  })
  for (const [x, y, delay] of offices) {
    out += `<g transform="translate(${x} ${y})"><g class="ripple fb" style="animation-delay:${delay}s"><ellipse rx="30" ry="10" fill="none" stroke="${route}" stroke-width="2"/></g><g class="bob" style="animation-delay:${delay}s"><path d="${pin}" fill="${pinPaint}" fill-rule="evenodd"/></g></g>`
  }
  return out
}

export function bamboo(seed, { color, leaf, xs }) {
  const r = rng(seed)
  let out = ''
  for (const x of xs) {
    const h = 620 + Math.floor(r() * 300)
    const w = 16 + Math.floor(r() * 10)
    let stalk = `<rect x="${-w / 2}" y="-${h}" width="${w}" height="${h}" rx="${w / 2}" fill="${color}"/>`
    for (let y = -90; y > -h; y -= 90 + Math.floor(r() * 30)) {
      stalk += `<rect x="${-w / 2 - 2}" y="${y}" width="${w + 4}" height="4" rx="2" fill="#000" fill-opacity=".25"/>`
      if (r() < 0.55) {
        const side = r() < 0.5 ? -1 : 1
        stalk += `<path d="M0 ${y}q${side * 40}-30 ${side * 90}-20q${-side * 50} 4 ${-side * 90} 20Z" fill="${leaf}"/>`
      }
    }
    out += `<g transform="translate(${x} 1010)"><g class="sway ob" style="animation-duration:${f(6 + r() * 4)}s;animation-delay:${f(-r() * 6)}s">${stalk}</g></g>`
  }
  return out
}

export function flowers(seed, { colors, center, stem, n = 16 }) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < n; i++) {
    const x = f(30 + r() * 1540)
    const h = 70 + Math.floor(r() * 150)
    const c = pick(r, colors)
    const petals = ring(5, 11, (px, py) => `<circle cx="${px}" cy="${py}" r="9" fill="${c}"/>`)
    out += `<g transform="translate(${x} 1005)"><g class="sway ob" style="animation-duration:${f(4 + r() * 4)}s;animation-delay:${f(-r() * 5)}s"><path d="M0 0Q8-${h / 2} 0-${h}" fill="none" stroke="${stem}" stroke-width="3"/><path d="M0-${f(h * 0.4)}q16-14 26-4q-14 10-26 4Z" fill="${stem}"/><g transform="translate(0 -${h})">${petals}<circle r="6" fill="${center}"/></g></g></g>`
  }
  return out
}

export function lotus(seed, { petal, pad, water }) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < 7; i++) {
    const x = f(80 + r() * 1440)
    const y = f(860 + r() * 110)
    out += `<g transform="translate(${x} ${y})"><g class="ripple fb" style="animation-delay:${f(-r() * 4)}s;animation-duration:${f(4 + r() * 3)}s"><ellipse rx="60" ry="14" fill="none" stroke="${water}" stroke-width="1.6"/></g><ellipse rx="54" ry="13" fill="${pad}"/></g>`
  }
  for (const [x, y] of [[260, 880], [1300, 900], [760, 950]]) {
    const leaves = [-50, -25, 0, 25, 50].map(a => `<path d="M0 0C-14-20-10-48 0-60C10-48 14-20 0 0Z" fill="${petal}" transform="rotate(${a})"/>`).join('')
    out += `<g transform="translate(${x} ${y})"><g class="bob">${leaves}<circle cy="-8" r="6" fill="#F6D365"/></g></g>`
  }
  return out
}

export function aurora(colors) {
  return colors.map((c, i) => {
    const y = 140 + i * 90
    const d = `M-200 ${y}C200 ${y - 80} 500 ${y + 90} 900 ${y}S1500 ${y - 70} 1900 ${y + 20}V${y + 260}C1500 ${y + 200} 1100 ${y + 320} 700 ${y + 240}S0 ${y + 300} -200 ${y + 230}Z`
    return `<defs><linearGradient id="au${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset=".45" stop-color="${c}" stop-opacity=".55"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient></defs><g class="${i % 2 ? 'aurB' : 'aurA'} ot"><path d="${d}" fill="url(#au${i})"/></g>`
  }).join('')
}

export function galaxy(seed, { x, y, R, colors }) {
  const r = rng(seed)
  let dots = ''
  for (let arm = 0; arm < 3; arm++) {
    for (let i = 0; i < 70; i++) {
      const t = i / 70
      const a = arm * ((Math.PI * 2) / 3) + t * Math.PI * 2.6
      const rr = t * R
      const jitter = (r() - 0.5) * R * 0.08
      dots += `<circle cx="${f(Math.cos(a) * rr + jitter)}" cy="${f(Math.sin(a) * rr * 0.55 + jitter)}" r="${f(0.6 + r() * 1.8)}" fill="${pick(r, colors)}" opacity="${f(0.4 + r() * 0.6)}"/>`
    }
  }
  return `<g opacity=".8"><g class="pulse"><ellipse cx="${x}" cy="${y}" rx="${f(R * 0.9)}" ry="${f(R * 0.5)}" fill="url(#glow)"/></g></g><g transform="translate(${x} ${y})"><g class="spin fb" style="animation-duration:240s">${dots}<circle r="${f(R * 0.06)}" fill="#FFF6E0"/></g></g>`
}

export function shootingStars(seed, { n, color }) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < n; i++) {
    const x = f(300 + r() * 1200)
    const y = f(40 + r() * 300)
    out += `<path class="shoot" d="M${x} ${y}l-300 120" stroke="${color}" stroke-width="2.2" style="animation-delay:${f(-r() * 9)}s;animation-duration:${f(7 + r() * 6)}s"/>`
  }
  return out
}

export function rainbow(x, y, R, colors) {
  const arcs = colors.map((c, i) => {
    const rr = R - i * 16
    return `<path d="M${x - rr} ${y}A${rr} ${rr} 0 0 1 ${x + rr} ${y}" fill="none" stroke="${c}" stroke-width="15" stroke-linecap="round"/>`
  }).join('')
  return `<g opacity=".45"><g class="pulse">${arcs}</g></g>`
}

export function marble(seed, { colors }) {
  const r = rng(seed)
  let out = ''
  for (let i = 0; i < 9; i++) {
    const y = f(r() * 1000)
    const d = `M-100 ${y}C${f(200 + r() * 300)} ${f(y - 200 + r() * 400)} ${f(700 + r() * 300)} ${f(y - 200 + r() * 400)} ${f(1100 + r() * 200)} ${f(y - 100 + r() * 200)}S${f(1500 + r() * 200)} ${f(r() * 1000)} 1750 ${f(r() * 1000)}`
    out += `<path d="${d}" fill="none" stroke="${pick(r, colors)}" stroke-width="${f(0.8 + r() * 2.6)}" opacity="${f(0.15 + r() * 0.35)}"/>`
  }
  return `<g class="floatA" style="animation-duration:60s">${out}</g>`
}

export function branch(x, y, s, { wood, blossom }) {
  const flowersOnBranch = [[60, -30], [120, -70], [180, -40], [230, -100], [90, -110], [290, -60], [160, -130]]
    .map(([fx, fy], i) => `<g transform="translate(${fx} ${fy})"><g class="glint" style="animation-duration:${6 + i}s;animation-delay:-${i}s">${ring(5, 8, (px, py) => `<circle cx="${px}" cy="${py}" r="7" fill="${blossom}"/>`)}<circle r="3.5" fill="#F7C35F"/></g></g>`).join('')
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0C60-20 120-60 180-50S270-90 320-80M120-60C110-90 100-110 90-120M200-55C220-80 230-95 240-110" fill="none" stroke="${wood}" stroke-width="8" stroke-linecap="round"/>${flowersOnBranch}</g>`
}
