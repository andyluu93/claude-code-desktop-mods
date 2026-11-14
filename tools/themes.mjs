// The 30 looks. Each one has its own signature motif and background; no two share a pattern.
// Entry: identity, palette seeds, scene colours and the scene layers.
// Every scene is drawn without a ground: the app's page colour, which follows the person's light or dark
// setting, shows through. So each scene has to read on both a pale and a dark page: large dark or pale areas
// are softened with `soft`, and `auto` recolours what reads on one ground only, as [from, to] pairs.
// `mode` is the ground the scene was first drawn for; it no longer limits where the look is used.
import * as S from './lib/svg.mjs'
import * as M from './lib/motifs.mjs'

// A whole layer at reduced opacity, so a large area shows on either ground without hiding the words.
const soft = (layer, opacity) => typeof layer === 'string'
  ? `<g opacity="${opacity}">${layer}</g>`
  : { ...layer, body: `<g opacity="${opacity}">${layer.body}</g>` }

const GOLD = ['#B28A22', '#E7CA62', '#C9A84C']

export const THEMES = [
  // ---------------- Sang trọng ----------------
  {
    slug: 'hoang-kim-art-deco', name: 'Hoàng kim Art Deco', category: 'Sang trọng', mode: 'dark',
    summary: 'Sảnh Art Deco đen vàng: cột bậc thang hai bên, các chùm đèn vàng hắt lên nhấp nháy chậm.',
    hue: 42, sat: 30, accent: '#C9A84C', bg: ['#060606', '#14110A', '#050504'], bgVertical: true, metal: GOLD, glow: ['#E7CA62', '#8C6A1F'],
    layers: k => [
      M.lightBeams(k(1), 7),
      M.decoPilasters('#C9A84C'),
      S.rise(k(2), { n: 16, colors: ['#C9A84C'], size: [0.8, 2] }),
      S.vignette(),
    ],
    auto: [['stroke="#C9A84C"', 'stroke="#B08A2E"']],
  },
  {
    slug: 'ngoc-luc-bao', name: 'Ngọc lục bảo', category: 'Sang trọng', mode: 'dark',
    summary: 'Nền khảm đa giác xanh ngọc, bốn viên ngọc lục bảo viền vàng nghiêng nhẹ và lóe sáng.',
    hue: 158, sat: 45, accent: '#D4B45C', bg: ['#03120D', '#062418', '#03100B'], metal: GOLD, glow: ['#1E8C6A', '#E7CA62'],
    layers: k => [
      soft(M.lowPoly(k(3), ['#04241A', '#062C20', '#083426', '#052019', '#0A3D2D', '#07301F']), 0.35),
      M.gems(k(4), [[190, 210, 1.3], [1430, 830, 1.6], [1470, 200, 0.9], [150, 850, 0.8]]),
      S.vignette(),
    ],
  },
  {
    slug: 'ruou-vang-nhung', name: 'Rượu vang nhung', category: 'Sang trọng', mode: 'dark',
    summary: 'Sân khấu rèm nhung đỏ rượu vang lay nhẹ, tua vàng hồng đung đưa, đèn sân khấu ấm.',
    hue: 345, sat: 50, accent: '#D4917A', bg: ['#0E0206', '#22060F', '#0A0104'], bgVertical: true, metal: ['#B76E5C', '#F2C2A8', '#D4917A'], glow: ['#7A1A30', '#F2C2A8'],
    layers: () => [
      M.spotlight(),
      M.curtains(),
      S.vignette(),
    ],
  },
  {
    slug: 'dem-sapphire', name: 'Đêm sapphire', category: 'Sang trọng', mode: 'dark',
    summary: 'Trăng bạc trên mặt biển xanh sapphire, vệt sáng lấp lánh trên sóng, sóng ngầm trôi chậm.',
    hue: 225, sat: 55, accent: '#9FB4D9', bg: ['#02050F', '#0A1638', '#0C1A44'], bgVertical: true, metal: ['#8E9AAF', '#EEF2F8', '#B9C3D3'], glow: ['#C9D6F0', '#2A4FA8'],
    layers: k => [
      S.twinkle(k(5), { n: 34, colors: ['#EEF2F8', '#C9D6F0'], size: [0.6, 1.6], area: [0, 0, 1600, 600] }),
      soft(M.moonSea(k(6)), 0.5),
    ],
  },
  {
    slug: 'da-cam-thach-den', name: 'Đá cẩm thạch đen', category: 'Sang trọng', mode: 'dark',
    summary: 'Cẩm thạch đen vân xám, các vết nứt hàn vàng kiểu kintsugi, ánh vàng chạy dọc vết nứt.',
    hue: 240, sat: 6, accent: '#C9A84C', bg: ['#0B0B0D', '#17171B', '#0D0D10'], metal: GOLD, glow: ['#3A3A44', '#E7CA62'],
    layers: k => [
      M.kintsugi(k(7)),
      S.vignette(),
    ],
  },
  {
    slug: 'ngoc-trai', name: 'Ngọc trai', category: 'Sang trọng', mode: 'light',
    summary: 'Lụa ngà uốn lượn trôi chậm, ba chuỗi ngọc trai treo đung đưa trên nền sâm panh.',
    hue: 38, sat: 30, accent: '#A8865A', bg: ['#FBF7F0', '#EFE6D6', '#F8F3EA'], metal: ['#B8996B', '#F1DDB8', '#D2B88E'], glow: ['#FFFFFF', '#E8D5B0'], vignette: 0.1,
    layers: k => [
      soft(M.silkAndPearls(k(8)), 0.35),
      S.vignette(),
    ],
  },
  {
    slug: 'nau-dat-kim', name: 'Nâu đất kim', category: 'Sang trọng', mode: 'dark',
    summary: 'Nâu đất ấm và vàng kim, hoa văn gấm, hai vòng hoa văn xoay, bụi vàng bay lên.',
    hue: 30, sat: 40, accent: '#B8862B', bg: ['#4A331D', '#2E1F12', '#160E08'], metal: ['#8A5F1D', '#F6DC96', '#C9973A'], glow: ['#C9973A', '#E7CA62'],
    layers: k => [
      S.pattern('damask', '#B8862B', 0.16),
      S.medallion({ style: 'ornate', x: 1440, y: 900, r: 430, speed: 320, opacity: 0.32 }),
      S.medallion({ style: 'ornate', x: 130, y: 110, r: 230, speed: 220, reverse: true, opacity: 0.3, delay: -5 }),
      S.rise(k(9), { n: 30, colors: ['#C9973A'] }),
      S.sheen(0.05), S.vignette(),
    ],
  },
  {
    slug: 'tim-hoang-gia', name: 'Tím hoàng gia', category: 'Sang trọng', mode: 'dark',
    summary: 'Hai quạt lông công vươn lên từ hai góc dưới, mắt lông xanh vàng đung đưa trên nền tím.',
    hue: 275, sat: 50, accent: '#D4B45C', bg: ['#14062A', '#22093A', '#0C0418'], metal: GOLD, glow: ['#6A2FB0', '#E7CA62'],
    layers: k => [
      S.glowBlob(800, 1000, 700, 300, 'glow', 'floatA', 0.4),
      M.peacockFeathers(k(10)),
      S.vignette(),
    ],
  },

  // ---------------- Chuyên nghiệp ----------------
  {
    slug: 'xanh-doanh-nghiep', name: 'Xanh doanh nghiệp', category: 'Chuyên nghiệp', mode: 'dark',
    summary: 'Biểu đồ tăng trưởng tự vẽ dần ở hai góc dưới, vòng tròn chỉ tiêu tăng giảm, nền navy.',
    hue: 218, sat: 55, accent: '#4C8DF6', bg: ['#081226', '#0D1D3A', '#091530'], metal: ['#3D7BE0', '#A9CBFF', '#5B93EE'], glow: ['#2F7BFF', '#5BC0EB'],
    layers: k => [
      M.growthCharts(k(11)),
      S.vignette(),
    ],
  },
  {
    slug: 'than-chi-toi-gian', name: 'Than chì tối giản', category: 'Chuyên nghiệp', mode: 'dark',
    summary: 'Hình khối Bauhaus mảnh trôi chậm, kim đồng hồ quay một vòng mỗi phút, điểm xanh ngọc.',
    hue: 220, sat: 8, accent: '#3FB8A6', bg: ['#111215', '#1A1C20', '#0F1013'], metal: ['#2E9C8C', '#9FE3D7', '#3FB8A6'], glow: ['#3FB8A6', '#5C6370'],
    layers: k => [
      M.bauhaus(k(12)),
    ],
  },
  {
    slug: 'ban-ve-ky-thuat', name: 'Bản vẽ kỹ thuật', category: 'Chuyên nghiệp', mode: 'dark',
    summary: 'Giấy bản vẽ xanh có lưới, bốn bánh răng quay ăn khớp, đường kích thước nét đứt.',
    hue: 210, sat: 70, accent: '#7FC4FF', bg: ['#08243F', '#0C3560', '#082A4A'], metal: ['#CFE6FF', '#FFFFFF', '#A8D2FF'], glow: ['#3C8DD8', '#CFE6FF'], vignette: 0.35,
    layers: () => [
      S.pattern('blueprint', 'rgba(80,150,220,.22)', 1),
      M.blueprintGears(),
      S.vignette(),
    ],
    auto: [['stroke="#CFE6FF"', 'stroke="#6FA8DC"'], ['fill="#CFE6FF"', 'fill="#6FA8DC"']],
  },
  {
    slug: 'dong-du-lieu', name: 'Dòng dữ liệu', category: 'Chuyên nghiệp', mode: 'dark',
    summary: 'Mưa dữ liệu xanh lam rơi dọc màn hình, các nút mạng phát sóng ở hai góc.',
    hue: 195, sat: 60, accent: '#2EC4D6', bg: ['#020A10', '#05141E', '#020A10'], bgVertical: true, metal: ['#1FA2B8', '#9BF1FF', '#2EC4D6'], glow: ['#1FA2B8', '#3FE0A0'],
    layers: k => [
      M.dataRain(k(13)),
      S.vignette(),
    ],
  },
  {
    slug: 'ket-noi-toan-cau', name: 'Kết nối toàn cầu', category: 'Chuyên nghiệp', mode: 'dark',
    summary: 'Quả địa cầu kinh tuyến xoay, vệ tinh vàng bay quanh quỹ đạo nghiêng.',
    hue: 222, sat: 50, accent: '#C9A84C', bg: ['#050B1C', '#0B1A3A', '#040915'], metal: GOLD, glow: ['#2F7BFF', '#E7CA62'],
    layers: k => [
      S.twinkle(k(14), { n: 18, colors: ['#8CB8FF'], size: [0.6, 1.4] }),
      M.globe(),
      S.vignette(),
    ],
  },
  {
    slug: 'giay-trang', name: 'Giấy trắng', category: 'Chuyên nghiệp', mode: 'light',
    summary: 'Trang giấy kẻ dòng có lề đỏ, máy bay giấy bay chéo lên kèm vệt nét đứt.',
    hue: 40, sat: 12, accent: '#2B4C7E', bg: ['#FAF9F5', '#F1EFE8', '#FAF9F5'], metal: ['#2B4C7E', '#6E8BB8', '#3D5E92'], glow: ['#FFFFFF', '#DCE4F0'], vignette: 0.08,
    layers: k => [
      M.paperPlanes(k(15)),
    ],
  },
  {
    slug: 'xanh-sage', name: 'Xanh sage thanh lịch', category: 'Chuyên nghiệp', mode: 'light',
    summary: 'Những nhành bạch đàn treo từ mép trên, lá tròn xanh sage đung đưa nhẹ.',
    hue: 110, sat: 18, accent: '#4F7A5A', bg: ['#F2F5EF', '#E3EBDE', '#F4F7F1'], bgVertical: true, metal: ['#4F7A5A', '#9DBFA3', '#6E9A77'], glow: ['#FFFFFF', '#C9DCC4'], vignette: 0.08,
    layers: k => [
      M.hangingEucalyptus(k(16)),
    ],
  },
  {
    slug: 'dem-thanh-pho', name: 'Đêm thành phố', category: 'Chuyên nghiệp', mode: 'dark',
    summary: 'Ba cột đèn pha quét bầu trời tím, đường chân trời thành phố với cửa sổ sáng tắt.',
    hue: 235, sat: 45, accent: '#8B7CF6', bg: ['#060A17', '#141B3A', '#251850'], bgVertical: true, metal: ['#8B7CF6', '#D9D2FF', '#A99CFF'], glow: ['#5B4BD6', '#2F7BFF'],
    layers: k => [
      M.searchlights(),
      soft(S.skyline(k(17), { body: '#0B1026', lit: '#FFD98A' }), 0.6),
      S.vignette(),
    ],
  },

  // ---------------- Dễ thương ----------------
  {
    slug: 'keo-ngot', name: 'Kẹo ngọt', category: 'Dễ thương', mode: 'light',
    summary: 'Kẹo mút xoắn xoay tròn ở các góc, kẹo bọc giấy nhiều màu nhún nhảy.',
    hue: 330, sat: 70, accent: '#E2589A', bg: ['#FFF0F6', '#F6E6FF', '#FFF6FB'], metal: ['#E2589A', '#FFB3D5', '#B57CF2'], glow: ['#FFFFFF', '#F7C6E5'], vignette: 0.05,
    layers: k => [
      M.lollipops(k(18)),
    ],
  },
  {
    slug: 'hoa-anh-dao', name: 'Hoa anh đào', category: 'Dễ thương', mode: 'light',
    summary: 'Cành anh đào nở hoa ở hai góc, cánh hoa hồng rơi xoay trong gió.',
    hue: 345, sat: 60, accent: '#D9668A', bg: ['#FFF4F7', '#FDE4EC', '#FFF8FA'], metal: ['#D9668A', '#FFC2D4', '#E98AA8'], glow: ['#FFFFFF', '#FFD3E1'], vignette: 0.05,
    layers: k => [
      S.branch(1060, 170, 1.7, { wood: '#8C5A4A', blossom: '#F6A6BE' }),
      S.branch(-20, 860, 1.4, { wood: '#8C5A4A', blossom: '#F9BCCD' }),
      S.fall(k(19), { n: 34, shapes: ['petal'], colors: ['#F6A6BE', '#FBC7D6', '#F18FAE'], scale: [0.8, 1.5], speed: [14, 24], opacity: 0.85 }),
    ],
  },
  {
    slug: 'may-bong', name: 'Mây bông', category: 'Dễ thương', mode: 'light',
    summary: 'Trời xanh pastel, mây bông trôi chậm, đàn chim nhỏ vỗ cánh bay ngang.',
    hue: 205, sat: 70, accent: '#3E8EDE', bg: ['#CFE8FF', '#E6F2FF', '#FFF4EA'], bgVertical: true, metal: ['#3E8EDE', '#A8D2FF', '#6AAAE8'], glow: ['#FFFFFF', '#FFE6C8'], vignette: 0.04,
    layers: k => [
      S.clouds(k(20), { n: 9, color: '#B7D3EE', opacity: 0.85 }),
      M.birds(k(21), 9),
    ],
  },
  {
    slug: 'sao-dem-pastel', name: 'Sao đêm pastel', category: 'Dễ thương', mode: 'dark',
    summary: 'Ngôi sao và hành tinh treo trên sợi chỉ, đung đưa như đồ chơi nôi trên nền tím đêm.',
    hue: 250, sat: 35, accent: '#B9A6F7', bg: ['#1B1938', '#2C2858', '#211E44'], metal: ['#F6D9A0', '#FFF4DA', '#F3C988'], glow: ['#8C7CF0', '#F6D9A0'],
    layers: k => [
      S.twinkle(k(22), { n: 26, colors: ['#FFF4DA', '#E5DBFF'], size: [0.6, 1.4] }),
      M.hangingStars(k(23)),
    ],
  },
  {
    slug: 'bien-xanh', name: 'Biển xanh', category: 'Dễ thương', mode: 'light',
    summary: 'Sóng biển nhiều lớp, đàn cá nhỏ quẫy đuôi bơi ngang, bong bóng nước bay lên.',
    hue: 190, sat: 65, accent: '#1E9BB8', bg: ['#EAF9FF', '#D2F1F7', '#BFEAF3'], bgVertical: true, metal: ['#1E9BB8', '#8EE3F2', '#3CB6CF'], glow: ['#FFFFFF', '#BFF0F8'], vignette: 0.04,
    layers: k => [
      soft(S.waves({ colors: ['#8EE3F2', '#5CCDE3', '#2FB2CF'], base: 780 }), 0.7),
      M.fishSchool(k(24), 10),
      S.bubbles(k(25), { n: 14, color: '#1E9BB8', size: [5, 14] }),
    ],
  },
  {
    slug: 'bong-bay', name: 'Bóng bay', category: 'Dễ thương', mode: 'light',
    summary: 'Nền kem ấm, bóng bay nhiều màu bay lên đung đưa, giấy kim tuyến rơi.',
    hue: 30, sat: 60, accent: '#E56B6F', bg: ['#FFF8EC', '#FFEEF0', '#FFF9F2'], metal: ['#E56B6F', '#FFC3A0', '#F2A65A'], glow: ['#FFFFFF', '#FFE0C2'], vignette: 0.04,
    layers: k => [
      S.balloons(k(26), { n: 12, colors: ['#F28B82', '#FBBC04', '#81C995', '#78D9EC', '#C58AF9', '#F6AEA9'] }),
      S.fall(k(27), { n: 22, shapes: ['confetti'], colors: ['#F28B82', '#FBBC04', '#81C995', '#78D9EC', '#C58AF9'], scale: [0.8, 1.3], speed: [12, 20], opacity: 0.8 }),
    ],
  },
  {
    slug: 'vuon-hoa', name: 'Vườn hoa', category: 'Dễ thương', mode: 'light',
    summary: 'Hoa nhỏ đung đưa dưới đáy, bướm nhiều màu vỗ cánh bay lượn trên nền bạc hà.',
    hue: 145, sat: 45, accent: '#2E9E6A', bg: ['#F7FCF4', '#E8F7EC', '#DDF2E3'], bgVertical: true, metal: ['#2E9E6A', '#A7E0BF', '#5BB98A'], glow: ['#FFFFFF', '#FFF2C2'], vignette: 0.04,
    layers: k => [
      S.flowers(k(28), { colors: ['#F6A6BE', '#FFD166', '#C58AF9', '#78D9EC', '#FF9F80'], center: '#F7B733', stem: '#5BAA7A', n: 20 }),
      M.butterflies(k(29), 7),
    ],
  },

  // ---------------- Thiên nhiên ----------------
  {
    slug: 'ho-sen', name: 'Hồ sen', category: 'Thiên nhiên', mode: 'dark',
    summary: 'Nhìn từ trên xuống mặt hồ: lá sen, hoa sen hồng, cá koi bơi vòng, gợn nước lan tỏa.',
    hue: 170, sat: 40, accent: '#F6A6BE', bg: ['#06221F', '#0B3330', '#072622'], metal: ['#F6A6BE', '#FBD0DC', '#F28FAE'], glow: ['#2FA08C', '#F6A6BE'],
    layers: k => [
      M.lotusPond(k(30)),
      S.vignette(),
    ],
  },
  {
    slug: 'rung-tre', name: 'Rừng tre', category: 'Thiên nhiên', mode: 'dark',
    summary: 'Rừng tre đêm xanh thẫm, thân tre đung đưa hai bên, đom đóm lập lòe.',
    hue: 140, sat: 40, accent: '#7FCB8B', bg: ['#06140B', '#102C1A', '#08180E'], metal: ['#7FCB8B', '#D6F5B0', '#A3DE8F'], glow: ['#2E7A45', '#D6F5B0'],
    layers: k => [
      S.bamboo(k(31), { color: '#1F4D2C', leaf: '#2E6B3D', xs: [40, 110, 190, 1420, 1500, 1575] }),
      S.fireflies(k(32), { n: 22, color: '#E9FF9A' }),
      S.vignette(),
    ],
  },
  {
    slug: 'cuc-quang', name: 'Cực quang', category: 'Thiên nhiên', mode: 'dark',
    summary: 'Dải cực quang xanh tím uốn lượn trên bầu trời đêm phương Bắc, dãy núi tối.',
    hue: 200, sat: 55, accent: '#4FE3B0', bg: ['#020710', '#06182A', '#030B16'], bgVertical: true, metal: ['#4FE3B0', '#C2FFE9', '#7DF0C6'], glow: ['#1E6F8C', '#9B6FE0'],
    layers: k => [
      S.twinkle(k(33), { n: 40, colors: ['#FFFFFF', '#C2FFE9'], size: [0.6, 1.5], area: [0, 0, 1600, 650] }),
      S.aurora(['#4FE3B0', '#3FB8E0', '#9B6FE0']),
      soft(S.mountains(['#0A1626', '#060E1A'], '#DCEBFA'), 0.6),
    ],
  },
  {
    slug: 'thien-ha', name: 'Thiên hà', category: 'Thiên nhiên', mode: 'dark',
    summary: 'Thiên hà xoắn ốc xoay chậm, tinh vân tím hồng, sao băng vụt qua.',
    hue: 265, sat: 45, accent: '#B58CFF', bg: ['#04020C', '#120A2A', '#070414'], metal: ['#B58CFF', '#FFE2F4', '#D7A8FF'], glow: ['#7B3FE0', '#E05FA8'],
    layers: k => [
      S.glowBlob(300, 760, 520, 300, 'glow2', 'floatB', 0.45),
      S.galaxy(k(34), { x: 1200, y: 330, R: 380, colors: ['#B58CFF', '#E5D6FF', '#F28FC8', '#8FA8F0'] }),
      S.shootingStars(k(35), { n: 3, color: '#FFFFFF' }),
      S.vignette(),
    ],
  },
  {
    slug: 'hoang-hon-sa-mac', name: 'Hoàng hôn sa mạc', category: 'Thiên nhiên', mode: 'dark',
    summary: 'Mặt trời lặn trên đồi cát, đoàn lạc đà đi chậm qua đường chân trời, cát bay theo gió.',
    hue: 15, sat: 55, accent: '#F08A4B', bg: ['#2A0F1A', '#6A2A22', '#C2552E'], bgVertical: true, metal: ['#F08A4B', '#FFD08A', '#F7A35C'], glow: ['#FFB35C', '#FF6B4A'], vignette: 0.3,
    layers: k => [
      S.sun(1150, 600, 90, '#FFB35C'),
      M.caravan(),
      soft(S.dunes(['#7A3320', '#5A2416', '#3E180F']), 0.65),
      S.sandDrift(k(36), { n: 30, color: '#FFD08A' }),
      S.vignette(),
    ],
  },
  {
    slug: 'mua-thu', name: 'Mùa thu', category: 'Thiên nhiên', mode: 'light',
    summary: 'Những luồng gió thu vẽ thành vệt cam, lá phong đỏ cam rơi xoay theo gió.',
    hue: 32, sat: 55, accent: '#C8602E', bg: ['#FCF4E6', '#F5E2C8', '#FBF0DE'], metal: ['#C8602E', '#F2B66D', '#E08A3F'], glow: ['#FFFFFF', '#FFE2B0'], vignette: 0.06,
    layers: k => [
      M.autumnGusts(k(37)),
      S.fall(k(38), { n: 30, shapes: ['maple', 'leaf'], colors: ['#D9682E', '#E8923F', '#B8452A', '#C98B3A'], scale: [1, 1.9], speed: [16, 28], opacity: 0.85 }),
    ],
  },
  {
    slug: 'dong-tuyet', name: 'Đông tuyết', category: 'Thiên nhiên', mode: 'dark',
    summary: 'Rừng thông phủ tuyết hai lớp, tuyết rơi xoay nhẹ trên nền đêm đông xanh lạnh.',
    hue: 215, sat: 45, accent: '#9CC9F5', bg: ['#0A1630', '#132A50', '#1B3A66'], bgVertical: true, metal: ['#DCEBFA', '#FFFFFF', '#B9D6F5'], glow: ['#5A8BD6', '#DCEBFA'],
    layers: k => [
      soft(M.pineForest(k(39)), 0.75),
      S.fall(k(40), { n: 40, shapes: ['snow'], colors: ['#9FC3EA', '#DCEBFA'], scale: [0.7, 1.5], speed: [14, 26], opacity: 0.9 }),
    ],
  },
]
