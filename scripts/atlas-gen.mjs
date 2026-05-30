// Standalone script to generate the block texture atlas for visual inspection
// Uses same logic as Map.ts makeBlockTexture()
import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

const ATLAS_TILES = 32;
const S = 16;
const canvas = createCanvas(ATLAS_TILES * S, S);
const ctx = canvas.getContext('2d');

const rng = (seed) => { let s = seed; return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; }; };
const pixel = (x, y, col) => { ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1); };
const border = (ox) => {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(ox, 0, S, 1); ctx.fillRect(ox, S-1, S, 1);
  ctx.fillRect(ox, 0, 1, S); ctx.fillRect(ox+S-1, 0, 1, S);
};
const fill = (ox, col) => { ctx.fillStyle = col; ctx.fillRect(ox, 0, S, S); };
const noise = (ox, baseR, baseG, baseB, variance, seed) => {
  const r = rng(seed);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const v = (r() - 0.5) * variance;
    const cr = Math.max(0, Math.min(255, baseR + v * 255)) | 0;
    const cg = Math.max(0, Math.min(255, baseG + v * 255)) | 0;
    const cb = Math.max(0, Math.min(255, baseB + v * 255)) | 0;
    pixel(ox + x, y, `rgb(${cr},${cg},${cb})`);
  }
};

// 0: stone
noise(0 * S, 136, 136, 136, 0.08, 1001); border(0 * S);
// 1: cobblestone
noise(1 * S, 136, 128, 112, 0.1, 1002);
{ const r = rng(2002);
  for (let i = 0; i < 6; i++) {
    const bx = (r() * 12 + 1) | 0, by = (r() * 12 + 1) | 0, bw = (r() * 3 + 2) | 0, bh = (r() * 2 + 2) | 0;
    ctx.fillStyle = "rgba(80,72,60,0.35)"; ctx.fillRect(1 * S + bx, by, bw, bh);
    ctx.fillStyle = "rgba(180,172,155,0.3)"; ctx.fillRect(1 * S + bx + 1, by + 1, bw, bh);
  }
}
border(1 * S);
// 2: dirt
noise(2 * S, 139, 92, 42, 0.1, 1003); border(2 * S);
// 3: grass top
noise(3 * S, 93, 158, 58, 0.1, 1004); border(3 * S);
// 4: grass side
noise(4 * S, 139, 92, 42, 0.08, 1005);
ctx.fillStyle = "rgba(93,158,58,0.9)"; ctx.fillRect(4 * S, 0, S, 3);
{ const r = rng(2005);
  for (let x = 0; x < S; x++) for (let y = 3; y < 5; y++)
    if (r() > 0.5) { ctx.fillStyle = `rgba(93,158,58,${0.4 + r() * 0.3})`; ctx.fillRect(4 * S + x, y, 1, 1); }
}
border(4 * S);
// 5: sand
noise(5 * S, 212, 196, 132, 0.08, 1006); border(5 * S);
// 6: wood side
fill(6 * S, "#6b4c2a");
border(6 * S);
// 7: wood top
fill(7 * S, "#b8905a");
border(7 * S);
// 8: planks
fill(8 * S, "#c8a060");
{ const r = rng(2008);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const v = (r() - 0.5) * 20;
    pixel(8 * S + x, y, `rgb(${(200 + v) | 0},${(160 + v * 0.8) | 0},${(96 + v * 0.5) | 0})`);
  }
  for (let y = 3; y < S; y += 4) { ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.fillRect(8 * S, y, S, 1); }
}
border(8 * S);
// 9: leaves
fill(9 * S, "transparent");
{ const r = rng(2009);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const v = r();
    if (v < 0.15) { pixel(9 * S + x, y, "rgba(0,0,0,0)"); continue; }
    const brightness = 0.6 + r() * 0.5;
    pixel(9 * S + x, y, `rgb(${(58 * brightness) | 0},${(122 * brightness) | 0},${(37 * brightness) | 0})`);
  }
}
border(9 * S);
// 10: iron ore
noise(10 * S, 136, 136, 136, 0.07, 1010);
{ const r = rng(2010);
  for (let i = 0; i < 5; i++) {
    const ox2 = (r() * 11 + 2) | 0, oy2 = (r() * 11 + 2) | 0;
    ctx.fillStyle = "#cc8844"; ctx.fillRect(10 * S + ox2, oy2, 2, 2);
    ctx.fillStyle = "#dd9955"; ctx.fillRect(10 * S + ox2, oy2, 1, 1);
  }
}
border(10 * S);
// 11: coal ore
noise(11 * S, 136, 136, 136, 0.07, 1011);
{ const r = rng(2011);
  for (let i = 0; i < 5; i++) {
    const ox2 = (r() * 11 + 2) | 0, oy2 = (r() * 11 + 2) | 0;
    ctx.fillStyle = "#222222"; ctx.fillRect(11 * S + ox2, oy2, 2, 2);
    ctx.fillStyle = "#333333"; ctx.fillRect(11 * S + ox2 + 1, oy2, 1, 1);
  }
}
border(11 * S);
// 12: bedrock
noise(12 * S, 51, 51, 51, 0.15, 1012);
border(12 * S);
// 13: generic white
fill(13 * S, "#ffffff"); border(13 * S);
// 14: gold ore
noise(14 * S, 136, 136, 136, 0.07, 1014);
{ const r = rng(2014);
  for (let i = 0; i < 5; i++) {
    const ox2 = (r() * 11 + 2) | 0, oy2 = (r() * 11 + 2) | 0;
    ctx.fillStyle = "#ddaa00"; ctx.fillRect(14 * S + ox2, oy2, 2, 2);
    ctx.fillStyle = "#eebb22"; ctx.fillRect(14 * S + ox2, oy2, 1, 1);
  }
}
border(14 * S);
// 15: diamond ore
noise(15 * S, 136, 136, 136, 0.07, 1015);
{ const r = rng(2015);
  for (let i = 0; i < 4; i++) {
    const ox2 = (r() * 10 + 3) | 0, oy2 = (r() * 10 + 3) | 0;
    pixel(15 * S + ox2, oy2 + 1, "#00cccc"); pixel(15 * S + ox2 + 1, oy2, "#00cccc");
    pixel(15 * S + ox2 + 1, oy2 + 2, "#00cccc"); pixel(15 * S + ox2 + 2, oy2 + 1, "#00cccc");
    pixel(15 * S + ox2 + 1, oy2 + 1, "#55ffff");
  }
}
border(15 * S);

// 16: glass
fill(16 * S, "#b8d4e0");
for (let i = 0; i < S; i++) {
  pixel(16*S+i, 0, "#6699aa"); pixel(16*S+i, S-1, "#6699aa");
  pixel(16*S, i, "#6699aa"); pixel(16*S+S-1, i, "#6699aa");
}
ctx.fillStyle = "rgba(255,255,255,0.55)";
ctx.fillRect(16*S+7, 1, 1, S-2); ctx.fillRect(16*S+1, 7, S-2, 1);

// 17: obsidian
fill(17*S, "#130820");
{ const r = rng(2017);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const v = r();
    if (v > 0.97) pixel(17*S+x, y, "#8844cc");
    else if (v > 0.94) pixel(17*S+x, y, "#3a1155");
    else if (v > 0.88) pixel(17*S+x, y, "#0e0418");
  }
}

// 18: water
noise(18*S, 40, 120, 200, 0.06, 1018);
{ const r = rng(2018);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    if (y % 5 === 1 && ((x + y) % 7 < 3)) pixel(18*S+x, y, "#88ccff");
    else if (r() > 0.88) pixel(18*S+x, y, "#1a6ab0");
  }
}
border(18*S);

// 19: torch
fill(19*S, "#1e1008");
for (let y = 8; y < S; y++) { pixel(19*S+7, y, "#8b6914"); pixel(19*S+8, y, "#6b4c2a"); }
for (let y = 0; y < 9; y++) for (let x = 4; x < 12; x++) {
  const dist = Math.abs(x - 7.5) + y * 0.45;
  if (dist < 2.2) pixel(19*S+x, y, "#ffee44");
  else if (dist < 3.4) pixel(19*S+x, y, "#ff8800");
  else if (dist < 4.5) pixel(19*S+x, y, "#882200");
}

// 20: chest top
noise(20*S, 138, 92, 45, 0.08, 1020);
ctx.fillStyle = "rgba(70,44,16,0.45)"; ctx.fillRect(20*S, 7, S, 2);
ctx.fillStyle = "#c8a020"; ctx.fillRect(20*S+5, 7, 6, 2);
ctx.fillStyle = "#ffe055"; ctx.fillRect(20*S+7, 7, 2, 1);
border(20*S);

// 21: chest side
noise(21*S, 135, 88, 42, 0.08, 1021);
ctx.fillStyle = "rgba(70,44,16,0.35)"; ctx.fillRect(21*S, 4, S, 8);
ctx.fillStyle = "#c8a020"; ctx.fillRect(21*S+5, 6, 6, 4);
ctx.fillStyle = "#ffe055"; ctx.fillRect(21*S+7, 7, 2, 2);
ctx.fillStyle = "#8b6010"; ctx.fillRect(21*S+6, 7, 1, 2); ctx.fillRect(21*S+11, 7, 1, 2);
border(21*S);

// 22: gravel
noise(22*S, 130, 125, 115, 0.1, 1022);
{ const r = rng(2022);
  for (let i = 0; i < 9; i++) {
    const px2 = (r() * 11 + 1) | 0, py2 = (r() * 11 + 1) | 0, sz = (r() * 2 + 1) | 0;
    ctx.fillStyle = "rgba(95,88,78,0.45)"; ctx.fillRect(22*S+px2, py2, sz+1, sz+1);
    ctx.fillStyle = "rgba(162,155,142,0.35)"; ctx.fillRect(22*S+px2+1, py2+1, sz, sz);
  }
}
border(22*S);

// 23: iron block
{ const r = rng(2023);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const v = (r() - 0.5) * 22;
    pixel(23*S+x, y, `rgb(${(192+v)|0},${(192+v)|0},${(195+v)|0})`);
  }
  ctx.fillStyle = "rgba(145,145,150,0.75)";
  for (let i = 0; i <= S; i += 4) {
    ctx.fillRect(23*S, i%S, S, 1); ctx.fillRect(23*S+(i%S), 0, 1, S);
  }
}

// 24: crafting table top
{ const r = rng(2024);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const v = (r() - 0.5) * 28;
    pixel(24*S+x, y, `rgb(${(160+v)|0},${(96+v)|0},${(48+v)|0})`);
  }
  ctx.fillStyle = "rgba(55,28,8,0.6)";
  for (let i = 5; i < S; i += 5) { ctx.fillRect(24*S, i, S, 1); ctx.fillRect(24*S+i, 0, 1, S); }
}
border(24*S);

// 25: crafting table side
noise(25*S, 185, 145, 85, 0.06, 1025);
ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.fillRect(25*S, 7, S, 1); ctx.fillRect(25*S, 8, S, 1);
ctx.fillStyle = "rgba(55,28,8,0.8)";
ctx.fillRect(25*S+4, 4, 6, 1); ctx.fillRect(25*S+4, 11, 6, 1); ctx.fillRect(25*S+3, 4, 1, 8);
border(25*S);

// 26: furnace front
noise(26*S, 122, 118, 114, 0.08, 1026);
ctx.fillStyle = "#111111"; ctx.fillRect(26*S+3, 5, 10, 8);
ctx.fillStyle = "#ff6600"; ctx.fillRect(26*S+4, 11, 8, 2);
ctx.fillStyle = "#ffaa00"; ctx.fillRect(26*S+5, 10, 6, 1);
ctx.fillStyle = "#ff4400"; ctx.fillRect(26*S+6, 9, 4, 1);
border(26*S);

// 27: snow
{ const r = rng(2027);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const v = (r() - 0.5) * 14;
    pixel(27*S+x, y, `rgb(${(240+v)|0},${(244+v)|0},${(252+v*1.5)|0})`);
  }
  for (let i = 0; i < 5; i++) pixel(27*S+((r()*13+1)|0), (r()*13+1)|0, "#ffffff");
}
border(27*S);

// 28: cactus
{ const r = rng(2028);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const v = (r() - 0.5) * 30;
    pixel(28*S+x, y, `rgb(${(42+v)|0},${(106+v)|0},${(42+v)|0})`);
  }
  ctx.fillStyle = "rgba(80,160,60,0.4)"; ctx.fillRect(28*S+6, 0, 4, S);
  for (let y = 2; y < S; y += 4) {
    pixel(28*S+1, y, "#dde0a0"); pixel(28*S+S-2, y, "#dde0a0");
    pixel(28*S+1, y+2, "#c8cb88"); pixel(28*S+S-2, y+2, "#c8cb88");
  }
}
border(28*S);

// 29: bookshelf
noise(29*S, 180, 140, 80, 0.06, 1029);
ctx.fillStyle = "rgba(75,48,18,0.55)";
ctx.fillRect(29*S, 0, S, 2); ctx.fillRect(29*S, S-2, S, 2); ctx.fillRect(29*S, 7, S, 2);
{ const bookColors = ["#cc3333","#3355cc","#33aa33","#cc8822","#883388","#338888","#ddaa22","#aa3333"];
  for (let row = 0; row < 2; row++) {
    let bx = 0;
    for (let bi = 0; bi < 5; bi++) {
      const bw = 2 + (bi % 2);
      ctx.fillStyle = bookColors[(row * 5 + bi) % bookColors.length];
      ctx.fillRect(29*S + bx, row === 0 ? 2 : 9, bw, 5);
      bx += bw + 1;
    }
  }
}
border(29*S);

// 30: enchanting table top
{ const r = rng(2030);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const v = (r() - 0.5) * 20;
    pixel(30*S+x, y, `rgb(${(34+v)|0},${(10+v*0.3)|0},${(58+v)|0})`);
  }
  ctx.fillStyle = "#aa44ff";
  ctx.fillRect(30*S+4, 4, 8, 1); ctx.fillRect(30*S+4, S-5, 8, 1);
  ctx.fillRect(30*S+4, 4, 1, 8); ctx.fillRect(30*S+S-5, 4, 1, 8);
  ctx.fillRect(30*S+7, 6, 2, 4);
  ctx.fillStyle = "#dd88ff"; ctx.fillRect(30*S+7, 7, 2, 2);
}
border(30*S);

// 31: farmland
noise(31*S, 100, 72, 38, 0.1, 1031);
for (let y = 0; y < S; y += 3) {
  ctx.fillStyle = "rgba(55,35,12,0.4)"; ctx.fillRect(31*S, y, S, 1);
}
ctx.fillStyle = "rgba(45,28,8,0.18)"; ctx.fillRect(31*S, 0, S/2, S);
border(31*S);

// Scale up 6x for visibility
const scaledCanvas = createCanvas(ATLAS_TILES * S * 6, S * 6);
const sCtx = scaledCanvas.getContext('2d');
sCtx.imageSmoothingEnabled = false;
sCtx.drawImage(canvas, 0, 0, ATLAS_TILES * S * 6, S * 6);

// Label each tile
sCtx.fillStyle = "rgba(0,0,0,0.6)";
sCtx.font = "8px sans-serif";
const labels = ["stone","cobble","dirt","grassTop","grassSide","sand","woodSide","woodTop","planks","leaves","ironOre","coalOre","bedrock","generic","","goldOre","diamond","glass","obsidian","water","torch","chestTop","chestSide","gravel","ironBlk","ctTop","ctSide","furnace","snow","cactus","bkshelf","enchTop","farmland"];
for (let i = 0; i < ATLAS_TILES; i++) {
  sCtx.fillText(i.toString(), i * S * 6 + 2, S * 6 - 2);
}

const buf = scaledCanvas.toBuffer('image/png');
writeFileSync('screenshots/atlas-preview.png', buf);
console.log('Atlas preview saved (32 tiles × 16px, scaled 6x)');
