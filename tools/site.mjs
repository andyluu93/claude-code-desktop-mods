// Builds the GitHub Pages site (index.html at the repo root) from the theme list.
// The page reuses preview/scenes/*.svg, so the scenes animate exactly as built.

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const plain = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase()

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16)
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
}

// The phrase typed in chat: the theme name when it matches the slug words, otherwise the slug words.
function phraseOf(t) {
  const words = t.slug.replace(/-/g, ' ')
  return plain(t.name) === words ? `giao diện ${t.name.toLowerCase()}` : `giao diện ${words}`
}

export function siteHtml(themes, owner) {
  const repo = `${owner}/claude-code-desktop-mods`
  const data = themes.map(t => ({
    slug: t.slug,
    name: t.name,
    category: t.category,
    mode: t.mode === 'dark' ? 'tối' : 'sáng',
    summary: t.summary,
    accent: t.accent,
    onAccent: luminance(t.accent) > 0.36 ? '#1C2230' : '#FFFFFF',
    phrase: phraseOf(t),
  }))
  const categories = [...new Set(themes.map(t => t.category))]
  const tiles = data.map(t => `<li><button class="tile" type="button" data-slug="${t.slug}" data-category="${esc(t.category)}" aria-pressed="false">
<span class="tile-scene"><img src="preview/scenes/${t.slug}.svg" alt="" loading="lazy" width="320" height="200"></span>
<span class="tile-text"><span class="tile-name">${esc(t.name)}</span><span class="tile-meta">${esc(t.category)}, chế độ ${t.mode}</span></span>
</button></li>`).join('\n')
  const filters = ['Tất cả', ...categories].map((c, i) => `<button type="button" class="filter" data-filter="${i === 0 ? '' : esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join('')

  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Giao diện cho Claude Code Desktop</title>
<meta name="description" content="30 giao diện có hình nền chuyển động cho Claude Code trên ứng dụng Claude Desktop. Xem thử và sao chép lệnh cài đặt.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Be+Vietnam+Pro:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{
  --page:#EEF0F3;--surface:#FFFFFF;--ink:#1C2230;--muted:#566072;--line:#D5DAE2;
  --accent:#4C8DF6;--on-accent:#FFFFFF;
  --display:'Bricolage Grotesque',system-ui,sans-serif;--body:'Be Vietnam Pro',system-ui,sans-serif;
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--page);color:var(--ink);font:400 16px/1.6 var(--body)}
a{color:inherit}
:focus-visible{outline:3px solid var(--ink);outline-offset:3px;border-radius:6px}
.wrap{max-width:1240px;margin:0 auto;padding:0 24px}

.top{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 0}
.brand{font:700 18px/1.2 var(--display);letter-spacing:-.01em;text-decoration:none}
.top nav{display:flex;gap:20px;font-size:15px}
.top nav a{text-decoration:none;color:var(--muted)}
.top nav a:hover{color:var(--ink)}

.intro{padding:28px 0 36px;max-width:760px}
.intro h1{font:700 clamp(34px,5.2vw,60px)/1.04 var(--display);letter-spacing:-.025em;margin:0 0 18px}
.intro p{margin:0;font-size:18px;color:var(--muted);max-width:62ch}

.studio{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:40px;align-items:start;padding-bottom:72px}

/* Try-on window: the scene under the app's frosted bands */
.fitting{position:sticky;top:20px}
.window{position:relative;aspect-ratio:16/10;border-radius:14px;overflow:hidden;background:#0d0f14;box-shadow:0 30px 60px -30px rgba(28,34,48,.55),0 0 0 1px rgba(28,34,48,.12)}
.window img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .35s ease}
.window img.fading{opacity:0}
.bar,.composer{position:absolute;left:0;right:0;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.bar{top:0;height:9%;display:flex;align-items:center;gap:7px;padding:0 4%}
.bar i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.55)}
.composer{bottom:5%;left:18%;right:18%;height:15%;border-radius:12px;display:flex;align-items:center;padding:0 4%;font-size:clamp(11px,1.2vw,14px)}
.chat{position:absolute;top:22%;left:24%;right:24%;display:grid;gap:10px}
.chat span{display:block;height:10px;border-radius:5px}
.chat span:nth-child(2){width:82%}.chat span:nth-child(3){width:64%}
.window[data-mode="tối"] .bar,.window[data-mode="tối"] .composer{background:rgba(16,18,26,.55);color:rgba(255,255,255,.7)}
.window[data-mode="tối"] .chat span{background:rgba(255,255,255,.16)}
.window[data-mode="sáng"] .bar,.window[data-mode="sáng"] .composer{background:rgba(255,255,255,.6);color:rgba(28,34,48,.65)}
.window[data-mode="sáng"] .chat span{background:rgba(28,34,48,.12)}

.card{background:var(--surface);border-radius:14px;padding:22px 24px;margin-top:18px;border:1px solid var(--line)}
.card h2{font:700 30px/1.1 var(--display);letter-spacing:-.02em;margin:0 0 6px}
.card .meta{margin:0 0 10px;color:var(--muted);font-size:14px}
.card .summary{margin:0 0 18px}
.swatch{display:inline-block;width:12px;height:12px;border-radius:50%;background:var(--accent);margin-right:8px;vertical-align:-1px}
.cmd{display:flex;align-items:stretch;border:1px solid var(--line);border-radius:10px;overflow:hidden;margin-top:8px;background:#F6F7F9}
.cmd code{flex:1;min-width:0;padding:11px 14px;font:500 14px/1.4 ui-monospace,Consolas,monospace;overflow-x:auto;white-space:nowrap}
.copy{border:0;border-left:1px solid var(--line);background:var(--accent);color:var(--on-accent);font:600 14px var(--body);padding:0 16px;cursor:pointer;white-space:nowrap}
.copy:hover{filter:brightness(1.06)}
.hint{margin:16px 0 0;font-size:14px;color:var(--muted)}
.hint b{color:var(--ink);font-weight:600}

/* Gallery */
.filters{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px}
.filter{border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:999px;padding:7px 16px;font:500 14px var(--body);cursor:pointer}
.filter[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:#fff}
.grid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.grid li[hidden]{display:none}
.tile{display:block;width:100%;padding:0;border:1px solid var(--line);border-radius:12px;background:var(--surface);text-align:left;cursor:pointer;overflow:hidden;font:inherit;color:inherit}
.tile-scene{display:block;aspect-ratio:16/10;overflow:hidden;background:#d9dde3}
.tile-scene img{display:block;width:100%;height:100%;object-fit:cover}
.tile-text{display:grid;padding:10px 12px 12px}
.tile-name{font-weight:600;font-size:15px}
.tile-meta{font-size:13px;color:var(--muted)}
.tile[aria-pressed="true"]{border-color:var(--ink);box-shadow:0 0 0 2px var(--ink)}

/* Install steps */
.install{background:var(--surface);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:64px 0}
.install h2{font:700 clamp(28px,3.6vw,40px)/1.1 var(--display);letter-spacing:-.02em;margin:0 0 10px}
.install .lead{margin:0 0 32px;color:var(--muted);max-width:62ch}
.steps{list-style:none;counter-reset:s;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}
.steps li{counter-increment:s;min-width:0}
.steps li::before{content:counter(s);display:block;font:700 44px/1 var(--display);color:var(--line);margin-bottom:10px}
.steps h3{font:600 18px/1.3 var(--body);margin:0 0 6px}
.steps p{margin:0;color:var(--muted);font-size:15px}
.ask{margin-top:44px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:32px;align-items:start}
.ask h3{font:700 24px/1.2 var(--display);margin:0 0 8px}
.ask p{margin:0;color:var(--muted)}
.prompt{position:relative;background:#1C2230;color:#E6E9EF;border-radius:12px;padding:18px 20px 56px;font:500 14px/1.6 ui-monospace,Consolas,monospace;white-space:pre-wrap;margin:0}
.prompt-box{position:relative}
.copy-prompt{position:absolute;right:12px;bottom:12px;border:0;border-radius:8px;background:#fff;color:#1C2230;font:600 14px var(--body);padding:8px 14px;cursor:pointer}

.more{padding:56px 0 24px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}
.more h3{font:600 17px/1.3 var(--body);margin:0 0 6px}
.more p{margin:0;color:var(--muted);font-size:15px}
.more code{font:500 13px ui-monospace,Consolas,monospace;background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:1px 6px}
footer{padding:28px 0 48px;color:var(--muted);font-size:14px}

.toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,20px);background:var(--ink);color:#fff;padding:10px 18px;border-radius:999px;font-size:14px;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s}
.toast.show{opacity:1;transform:translate(-50%,0)}

@media (max-width:900px){
  .studio{grid-template-columns:minmax(0,1fr);gap:28px}
  .fitting{position:static}
  .steps,.more,.ask{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:520px){
  .wrap{padding:0 16px}
  .top nav{gap:14px}
  .grid{gap:10px}
  .tile-text{padding:8px 10px 10px}
  .card{padding:18px}
}
@media (prefers-reduced-motion:reduce){
  .window img,.toast{transition:none}
}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <a class="brand" href="./">Claude Code Desktop Mods</a>
    <nav><a href="#cai-dat">Cài đặt</a><a href="https://github.com/${repo}">GitHub</a></nav>
  </header>

  <section class="intro">
    <h1>30 giao diện có hình nền chuyển động cho Claude Code Desktop</h1>
    <p>Bộ giao diện dành cho Claude Code trên ứng dụng Claude Desktop. Mỗi giao diện có họa tiết riêng và bảng màu đầy đủ cho chế độ sáng, tối. Chọn một giao diện bên dưới để xem thử và sao chép lệnh cài.</p>
  </section>

  <section class="studio" aria-label="Xem thử và chọn giao diện">
    <div class="fitting">
      <div class="window" id="window" data-mode="tối" aria-hidden="true">
        <img id="scene" src="preview/scenes/${data[0].slug}.svg" alt="">
        <div class="bar"><i></i><i></i><i></i></div>
        <div class="chat"><span></span><span></span><span></span></div>
        <div class="composer">Nhập yêu cầu cho Claude...</div>
      </div>
      <div class="card" aria-live="polite">
        <h2 id="name">${esc(data[0].name)}</h2>
        <p class="meta" id="meta"><span class="swatch"></span><span id="metaText"></span></p>
        <p class="summary" id="summary"></p>
        <div>Lệnh cài giao diện này</div>
        <div class="cmd"><code id="installCmd"></code><button class="copy" type="button" data-copy="installCmd">Sao chép</button></div>
        <p class="hint">Đổi nhanh trong phiên đang mở: gõ <b id="phrase"></b> vào ô chat.</p>
      </div>
    </div>

    <div>
      <div class="filters" role="group" aria-label="Lọc theo phong cách">${filters}</div>
      <ul class="grid" id="grid">
${tiles}
      </ul>
    </div>
  </section>
</div>

<section class="install" id="cai-dat">
  <div class="wrap">
    <h2>Cài đặt trong ba bước</h2>
    <p class="lead">Thực hiện trên máy đã có ứng dụng Claude Desktop với thẻ Code. Bước thứ nhất chỉ cần làm một lần; các lần sau chỉ cần cài thêm giao diện.</p>
    <ol class="steps">
      <li>
        <h3>Thêm kho giao diện</h3>
        <p>Đăng ký kho này với Claude Code.</p>
        <div class="cmd"><code id="stepAdd">claude plugin marketplace add ${repo}</code><button class="copy" type="button" data-copy="stepAdd">Sao chép</button></div>
      </li>
      <li>
        <h3>Cài giao diện đã chọn</h3>
        <p>Dùng lệnh cài hiển thị cạnh cửa sổ xem thử ở trên.</p>
        <div class="cmd"><code id="stepInstall"></code><button class="copy" type="button" data-copy="stepInstall">Sao chép</button></div>
      </li>
      <li>
        <h3>Mở một phiên mới</h3>
        <p>Giao diện được áp dụng khi phiên mới bắt đầu. Nên chỉ để một giao diện ở trạng thái bật.</p>
      </li>
    </ol>

    <div class="ask">
      <div>
        <h3>Hoặc nhờ Claude Code cài đặt</h3>
        <p>Dán đoạn sau vào một phiên trong thẻ Code. Claude Code sẽ chạy đúng hai lệnh cài và báo lại kết quả.</p>
      </div>
      <div class="prompt-box">
        <pre class="prompt" id="askPrompt"></pre>
        <button class="copy-prompt" type="button" data-copy="askPrompt">Sao chép đoạn này</button>
      </div>
    </div>
  </div>
</section>

<div class="wrap">
  <section class="more" aria-label="Quản lý giao diện">
    <div>
      <h3>Đổi sang giao diện khác</h3>
      <p>Tắt giao diện cũ bằng <code>claude plugin disable &lt;mã&gt;@cc-desktop-mods</code>, bật giao diện mới bằng <code>claude plugin enable &lt;mã&gt;@cc-desktop-mods</code>.</p>
    </div>
    <div>
      <h3>Cập nhật hoặc gỡ</h3>
      <p>Nhận bản mới bằng <code>claude plugin marketplace update cc-desktop-mods</code>. Gỡ một giao diện bằng <code>claude plugin uninstall &lt;mã&gt;@cc-desktop-mods</code>.</p>
    </div>
    <div>
      <h3>An toàn khi sử dụng</h3>
      <p>Giao diện chỉ đổi màu và vẽ hình nền; không đọc tệp, không chạy lệnh, không gửi dữ liệu ra ngoài. Mã nguồn công khai trên <a href="https://github.com/${repo}">GitHub</a>.</p>
    </div>
  </section>
  <footer>
    Phát hành theo giấy phép MIT. Hướng dẫn tự tạo giao diện: <a href="https://github.com/${repo}/blob/main/docs/quy-trinh-tao-mod.md">quy trình tạo mod</a>.
  </footer>
</div>

<div class="toast" id="toast" role="status">Đã sao chép</div>

<script>
const THEMES = ${JSON.stringify(data)}
const REPO = ${JSON.stringify(repo)}
const $ = id => document.getElementById(id)
const tiles = [...document.querySelectorAll('.tile')]

function select(slug, fromUser) {
  const t = THEMES.find(x => x.slug === slug) || THEMES[0]
  const root = document.documentElement.style
  root.setProperty('--accent', t.accent)
  root.setProperty('--on-accent', t.onAccent)
  const img = $('scene')
  if (!img.src.endsWith(t.slug + '.svg')) {
    img.classList.add('fading')
    setTimeout(() => { img.src = 'preview/scenes/' + t.slug + '.svg'; img.classList.remove('fading') }, 180)
  }
  $('window').dataset.mode = t.mode
  $('name').textContent = t.name
  $('metaText').textContent = t.category + ', hợp chế độ ' + t.mode + ', mã ' + t.slug
  $('summary').textContent = t.summary
  const cmd = 'claude plugin install ' + t.slug + '@cc-desktop-mods'
  $('installCmd').textContent = cmd
  $('stepInstall').textContent = cmd
  $('phrase').textContent = t.phrase
  $('askPrompt').textContent = 'Hãy cài giao diện cho Claude Code từ kho https://github.com/' + REPO + '.\\nChỉ chạy đúng hai lệnh sau, không chạy lệnh nào khác:\\nclaude plugin marketplace add ' + REPO + '\\n' + cmd + '\\nChạy xong thì báo kết quả.'
  tiles.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.slug === t.slug)))
  if (fromUser) {
    try { history.replaceState(null, '', '#' + t.slug) } catch (e) {}
    if (matchMedia('(max-width:900px)').matches) $('window').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }
}

tiles.forEach(b => b.addEventListener('click', () => select(b.dataset.slug, true)))

document.querySelectorAll('.filter').forEach(f => f.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(x => x.setAttribute('aria-pressed', String(x === f)))
  const want = f.dataset.filter
  tiles.forEach(b => { b.parentElement.hidden = want !== '' && b.dataset.category !== want })
}))

let toastTimer
document.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
  const text = $(btn.dataset.copy).textContent
  try { await navigator.clipboard.writeText(text) } catch (e) {
    const r = document.createRange(); r.selectNodeContents($(btn.dataset.copy))
    const s = getSelection(); s.removeAllRanges(); s.addRange(r); document.execCommand('copy'); s.removeAllRanges()
  }
  const toast = $('toast'); toast.classList.add('show')
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 1600)
}))

const start = location.hash.slice(1)
select(THEMES.some(t => t.slug === start) ? start : 'ho-sen', false)
</script>
</body>
</html>
`
}
