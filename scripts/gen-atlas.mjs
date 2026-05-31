// Standalone: re-create the same atlas as in makeBlockTexture() and save it to PNG
import { writeFileSync, mkdirSync } from 'fs';

// Fallback: use node-canvas if available, otherwise use jimp/sharp
// Actually let's use puppeteer/playwright to run the canvas code in a browser context

import pkg from '/home/user/CraftDefense/node_modules/@playwright/test/index.js';
const { chromium } = pkg;
mkdirSync('/home/user/CraftDefense/screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
});
const page = await browser.newPage();

const atlasBase64 = await page.evaluate(() => {
  const ATLAS_TILES = 32;
  const S = 16;
  const canvas = document.createElement("canvas");
  canvas.width = ATLAS_TILES * S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");

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

  // All original tiles 0-15
  noise(0*S,136,136,136,0.08,1001); border(0*S);
  noise(1*S,136,128,112,0.1,1002);
  { const r=rng(2002); for(let i=0;i<6;i++){const bx=(r()*12+1)|0,by=(r()*12+1)|0,bw=(r()*3+2)|0,bh=(r()*2+2)|0;ctx.fillStyle="rgba(80,72,60,0.35)";ctx.fillRect(1*S+bx,by,bw,bh);ctx.fillStyle="rgba(180,172,155,0.3)";ctx.fillRect(1*S+bx+1,by+1,bw,bh);} } border(1*S);
  noise(2*S,139,92,42,0.1,1003); border(2*S);
  noise(3*S,93,158,58,0.1,1004); border(3*S);
  noise(4*S,139,92,42,0.08,1005); {ctx.fillStyle="rgba(93,158,58,0.9)";ctx.fillRect(4*S,0,S,3);} {const r=rng(2005);for(let x=0;x<S;x++)for(let y=3;y<5;y++)if(r()>0.5){ctx.fillStyle=`rgba(93,158,58,${0.4+r()*0.3})`;ctx.fillRect(4*S+x,y,1,1);}} border(4*S);
  noise(5*S,212,196,132,0.08,1006); border(5*S);
  fill(6*S,"#6b4c2a"); {const r=rng(2006);for(let x=1;x<S-1;x++){const dark=r()>0.6;for(let y=1;y<S-1;y++){const v=(r()-0.5)*30;const b=dark?-20:0;const cr=Math.max(0,Math.min(255,107+b+v))|0;const cg=Math.max(0,Math.min(255,76+b+v))|0;const cb=Math.max(0,Math.min(255,42+b+v*0.5))|0;pixel(6*S+x,y,`rgb(${cr},${cg},${cb})`);}}  } border(6*S);
  fill(7*S,"#b8905a"); {const cx=8,cy=8;for(let y=0;y<S;y++)for(let x=0;x<S;x++){const dist=Math.sqrt((x-cx)**2+(y-cy)**2);const ring=Math.abs(Math.sin(dist*0.8))*0.2+0.9;const cr=Math.min(255,Math.round(184*ring))|0;const cg=Math.min(255,Math.round(144*ring))|0;const cb=Math.min(255,Math.round(90*ring))|0;pixel(7*S+x,y,`rgb(${cr},${cg},${cb})`);}} border(7*S);
  fill(8*S,"#c8a060"); {const r=rng(2008);for(let y=0;y<S;y++)for(let x=0;x<S;x++){const v=(r()-0.5)*20;pixel(8*S+x,y,`rgb(${(200+v)|0},${(160+v*0.8)|0},${(96+v*0.5)|0})`);} for(let y=3;y<S;y+=4){ctx.fillStyle="rgba(0,0,0,0.2)";ctx.fillRect(8*S,y,S,1);} ctx.fillStyle="rgba(0,0,0,0.15)";ctx.fillRect(8*S+8,0,1,4);ctx.fillRect(8*S+8,8,1,4);} border(8*S);
  fill(9*S,"transparent"); {const r=rng(2009);for(let y=0;y<S;y++)for(let x=0;x<S;x++){const v=r();if(v<0.15){pixel(9*S+x,y,"rgba(0,0,0,0)");continue;}const brightness=0.6+r()*0.5;pixel(9*S+x,y,`rgb(${(58*brightness)|0},${(122*brightness)|0},${(37*brightness)|0})`);}} border(9*S);
  noise(10*S,136,136,136,0.07,1010); {const r=rng(2010);for(let i=0;i<5;i++){const ox2=(r()*11+2)|0,oy2=(r()*11+2)|0;ctx.fillStyle="#cc8844";ctx.fillRect(10*S+ox2,oy2,2,2);ctx.fillStyle="#dd9955";ctx.fillRect(10*S+ox2,oy2,1,1);}} border(10*S);
  noise(11*S,136,136,136,0.07,1011); {const r=rng(2011);for(let i=0;i<5;i++){const ox2=(r()*11+2)|0,oy2=(r()*11+2)|0;ctx.fillStyle="#222222";ctx.fillRect(11*S+ox2,oy2,2,2);ctx.fillStyle="#333333";ctx.fillRect(11*S+ox2+1,oy2,1,1);}} border(11*S);
  noise(12*S,51,51,51,0.15,1012); {const r=rng(2012);for(let i=0;i<8;i++){const ox2=(r()*12+1)|0,oy2=(r()*12+1)|0;ctx.fillStyle="#111111";ctx.fillRect(12*S+ox2,oy2,2,2);}} border(12*S);
  fill(13*S,"#ffffff"); border(13*S);
  noise(14*S,136,136,136,0.07,1014); {const r=rng(2014);for(let i=0;i<5;i++){const ox2=(r()*11+2)|0,oy2=(r()*11+2)|0;ctx.fillStyle="#ddaa00";ctx.fillRect(14*S+ox2,oy2,2,2);ctx.fillStyle="#eebb22";ctx.fillRect(14*S+ox2,oy2,1,1);}} border(14*S);
  noise(15*S,136,136,136,0.07,1015); {const r=rng(2015);for(let i=0;i<4;i++){const ox2=(r()*10+3)|0,oy2=(r()*10+3)|0;pixel(15*S+ox2,oy2+1,"#00cccc");pixel(15*S+ox2+1,oy2,"#00cccc");pixel(15*S+ox2+1,oy2+2,"#00cccc");pixel(15*S+ox2+2,oy2+1,"#00cccc");pixel(15*S+ox2+1,oy2+1,"#55ffff");}} border(15*S);

  // New tiles 16-26
  noise(16*S,148,140,124,0.12,1016); {const r=rng(3016);for(let i=0;i<8;i++){const px=(r()*11+1)|0,py=(r()*11+1)|0;const pw=(r()*2+2)|0,ph=(r()*2+2)|0;ctx.fillStyle="rgba(80,68,54,0.6)";ctx.fillRect(16*S+px-1,py-1,pw+2,ph+2);ctx.fillStyle="rgba(172,162,142,0.5)";ctx.fillRect(16*S+px,py,pw,ph);}} border(16*S);
  noise(17*S,188,188,194,0.04,1017); {ctx.fillStyle="rgba(140,140,148,0.65)";ctx.fillRect(17*S,7,S,2);ctx.fillRect(17*S+7,0,2,S);ctx.fillStyle="rgba(220,220,226,0.4)";ctx.fillRect(17*S+1,1,5,1);ctx.fillRect(17*S+1,1,1,5);ctx.fillRect(17*S+9,1,5,1);ctx.fillRect(17*S+9,1,1,5);} border(17*S);
  noise(18*S,22,8,38,0.06,1018); {const r=rng(3018);for(let i=0;i<6;i++){const px=(r()*14)|0,py=(r()*14)|0;const bright=(100+r()*100)|0;pixel(18*S+px,py,`rgb(${(bright*0.55)|0},${(bright*0.12)|0},${bright})`);}} border(18*S);
  fill(19*S,"#3888cc"); {const r=rng(3019);for(let y=1;y<S;y+=3){for(let x=0;x<S;x++){if(r()>0.35){const bright=0.88+r()*0.28;pixel(19*S+x,y,`rgb(${(52*bright)|0},${(136*bright)|0},${(210*bright)|0}`);}}} for(let i=0;i<5;i++){pixel(19*S+((r()*13+1)|0),(r()*13+1)|0,"#a8dcf8");}} border(19*S);
  noise(20*S,234,244,254,0.03,1020); {const r=rng(3020);for(let i=0;i<10;i++){const px=(r()*14)|0,py=(r()*14)|0;pixel(20*S+px,py,r()>0.5?"#ffffff":"#d8ecfc");}} border(20*S);
  fill(21*S,"#2d7a2d"); {const r=rng(3021);for(let x=2;x<S;x+=4){for(let y=0;y<S;y++){const v=(r()-0.5)*14;pixel(21*S+x,y,`rgb(${(68+v)|0},${(148+v)|0},${(52+v*0.4)|0})`);}} for(let y=2;y<S;y+=4){pixel(21*S+0,y,"#1a521a");pixel(21*S+S-1,y,"#1a521a");pixel(21*S+1,y,"#88cc55");pixel(21*S+S-2,y,"#88cc55");}} border(21*S);
  noise(22*S,104,64,28,0.10,1022); {for(let y=2;y<S;y+=3){ctx.fillStyle="rgba(58,28,8,0.4)";ctx.fillRect(22*S,y,S,1);ctx.fillStyle="rgba(138,88,42,0.3)";ctx.fillRect(22*S,y+1,S,1);}} border(22*S);
  noise(23*S,200,160,96,0.08,1023); {ctx.fillStyle="rgba(78,48,18,0.55)";ctx.fillRect(23*S+5,0,1,S);ctx.fillRect(23*S+10,0,1,S);ctx.fillRect(23*S,5,S,1);ctx.fillRect(23*S,10,S,1);} border(23*S);
  noise(24*S,160,82,32,0.08,1024); {ctx.fillStyle="rgba(98,82,52,0.8)";ctx.fillRect(24*S,6,S,4);ctx.fillStyle="rgba(182,152,78,0.55)";ctx.fillRect(24*S,6,S,1);ctx.fillStyle="rgba(182,152,78,0.55)";ctx.fillRect(24*S,9,S,1);ctx.fillStyle="rgba(202,172,88,0.95)";ctx.fillRect(24*S+7,7,3,2);ctx.fillStyle="rgba(80,55,20,0.8)";ctx.fillRect(24*S+8,7,1,2);} border(24*S);
  noise(25*S,118,114,106,0.09,1025); {ctx.fillStyle="rgba(18,12,8,0.92)";ctx.fillRect(25*S+4,3,8,10);ctx.fillStyle="rgba(255,90,0,0.75)";ctx.fillRect(25*S+5,9,2,3);ctx.fillRect(25*S+9,9,2,3);ctx.fillStyle="rgba(255,195,0,0.65)";ctx.fillRect(25*S+6,10,4,2);ctx.fillStyle="rgba(255,255,120,0.55)";ctx.fillRect(25*S+7,11,2,1);} border(25*S);
  noise(26*S,186,148,92,0.06,1026); {const bookPalette=["#aa2020","#1e3faa","#1f8830","#998400","#552a0e","#aa4499"];const r=rng(3026);let bx=26*S+1;for(let i=0;i<6;i++){const bw=((r()*2+1.5)|0);ctx.fillStyle=bookPalette[i%bookPalette.length];ctx.fillRect(bx,2,bw,5);bx+=bw+1;if(bx>=26*S+S-1)break;} bx=26*S+1;for(let i=0;i<6;i++){const bw=((r()*2+1.5)|0);ctx.fillStyle=bookPalette[(i+2)%bookPalette.length];ctx.fillRect(bx,9,bw,5);bx+=bw+1;if(bx>=26*S+S-1)break;} ctx.fillStyle="rgba(98,62,22,0.7)";ctx.fillRect(26*S,7,S,2);} border(26*S);

  // Scale up 8x for visibility
  const big = document.createElement('canvas');
  big.width = canvas.width * 8; big.height = canvas.height * 8;
  const bctx = big.getContext('2d');
  bctx.imageSmoothingEnabled = false;
  bctx.drawImage(canvas, 0, 0, big.width, big.height);
  return big.toDataURL('image/png').split(',')[1];
});

writeFileSync('/home/user/CraftDefense/screenshots/atlas-preview.png', Buffer.from(atlasBase64, 'base64'));
await browser.close();
console.log('Atlas saved');
