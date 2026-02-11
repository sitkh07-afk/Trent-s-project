import { useState, useMemo, useCallback, useEffect } from "react";

// ════════════════════════════════════════════════════════════
// VENUES — these are real, curated, permanent
// ════════════════════════════════════════════════════════════

const VENUES = {
  "la-marbrerie":{ id:"la-marbrerie", name:"La Marbrerie", hood:"Montreuil edge", walkMin:22, ms:0, tier:"walk", tr:true, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/La+Marbrerie/@48.8561,2.4101,17z" },
  "le-zorba":{ id:"le-zorba", name:"Le Zorba", hood:"Belleville", walkMin:12, ms:0, tier:"walk", tr:true, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/Le+Zorba/@48.8714,2.3842,17z" },
  "galerie-sator":{ id:"galerie-sator", name:"Galerie Sator", hood:"Ménilmontant", walkMin:15, ms:0, tier:"walk", tr:true, cof:true, bar:false, gmaps:"https://www.google.com/maps/place/Galerie+Sator/@48.8658,2.3891,17z" },
  "la-mecanique-ondulatoire":{ id:"la-mecanique-ondulatoire", name:"La Mécanique Ondulatoire", hood:"Charonne", walkMin:20, ms:0, tier:"walk", tr:false, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/La+M%C3%A9canique+Ondulatoire/@48.8532,2.3878,17z" },
  "le-petit-bain":{ id:"le-petit-bain", name:"Le Petit Bain", hood:"BNF / 13th", walkMin:null, ms:5, tier:"short_metro", tr:true, cof:false, bar:true, gmaps:"https://www.google.com/maps/place/Petit+Bain/@48.8347,2.3753,17z" },
  "la-cigale":{ id:"la-cigale", name:"La Cigale", hood:"Pigalle / 18th", walkMin:null, ms:3, tier:"short_metro", tr:true, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/La+Cigale/@48.8822,2.3402,17z" },
  "bronte-coffee":{ id:"bronte-coffee", name:"Brontë Coffee", hood:"Jourdain", walkMin:6, ms:0, tier:"walk", tr:true, cof:true, bar:false, gmaps:"https://www.google.com/maps/place/Bront%C3%AB+Paris/@48.8756,2.3912,17z" },
  "forum-des-images":{ id:"forum-des-images", name:"Forum des Images", hood:"Châtelet / 1st", walkMin:null, ms:2, tier:"short_metro", tr:true, cof:true, bar:false, gmaps:"https://www.google.com/maps/place/Forum+des+images/@48.8617,2.3472,17z" },
  "l-olympia":{ id:"l-olympia", name:"L'Olympia", hood:"Opéra / 9th", walkMin:null, ms:7, tier:"long_metro", tr:true, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/L'Olympia/@48.8699,2.3283,17z" },
  "le-baratin":{ id:"le-baratin", name:"Le Baratin", hood:"Belleville", walkMin:10, ms:0, tier:"walk", tr:true, cof:false, bar:true, gmaps:"https://www.google.com/maps/place/Le+Baratin/@48.8712,2.3888,17z" },
  "la-station":{ id:"la-station", name:"La Station – Gare des Mines", hood:"Aubervilliers / 18th", walkMin:null, ms:4, tier:"short_metro", tr:true, cof:false, bar:true, gmaps:"https://www.google.com/maps/place/La+Station+-+Gare+des+Mines/@48.8971,2.3693,17z" },
  "le-hasard-ludique":{ id:"le-hasard-ludique", name:"Le Hasard Ludique", hood:"St-Ouen / 18th", walkMin:null, ms:5, tier:"short_metro", tr:true, cof:true, bar:false, gmaps:"https://www.google.com/maps/place/Le+Hasard+Ludique/@48.8982,2.3282,17z" },
  "cafe-charbon":{ id:"cafe-charbon", name:"Café Charbon", hood:"Oberkampf", walkMin:18, ms:0, tier:"walk", tr:true, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/Caf%C3%A9+Charbon/@48.8654,2.3782,17z" },
  "philharmonie":{ id:"philharmonie", name:"Philharmonie de Paris", hood:"La Villette / 19th", walkMin:null, ms:6, tier:"long_metro", tr:true, cof:true, bar:false, gmaps:"https://www.google.com/maps/place/Philharmonie+de+Paris/@48.8910,2.3936,17z" },
  "nouveau-casino":{ id:"nouveau-casino", name:"Le Nouveau Casino", hood:"Oberkampf", walkMin:18, ms:0, tier:"walk", tr:true, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/Nouveau+Casino/@48.8654,2.3785,17z" },
  "la-bellevilloise":{ id:"la-bellevilloise", name:"La Bellevilloise", hood:"Ménilmontant", walkMin:14, ms:0, tier:"walk", tr:true, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/La+Bellevilloise/@48.8682,2.3932,17z" },
  "le-trabendo":{ id:"le-trabendo", name:"Le Trabendo", hood:"La Villette / 19th", walkMin:null, ms:3, tier:"short_metro", tr:true, cof:false, bar:false, gmaps:"https://www.google.com/maps/place/Le+Trabendo/@48.8911,2.3920,17z" },
  "point-ephemere":{ id:"point-ephemere", name:"Point Éphémère", hood:"Canal St-Martin / 10th", walkMin:null, ms:2, tier:"short_metro", tr:true, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/Point+%C3%89ph%C3%A9m%C3%A8re/@48.8815,2.3654,17z" },
  "le-triton":{ id:"le-triton", name:"Le Triton", hood:"Les Lilas", walkMin:24, ms:0, tier:"walk", tr:true, cof:true, bar:false, gmaps:"https://www.google.com/maps/place/Le+Triton/@48.8802,2.4192,17z" },
  "supersonic":{ id:"supersonic", name:"Supersonic", hood:"Bastille / 12th", walkMin:null, ms:3, tier:"short_metro", tr:true, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/Supersonic+Paris/@48.8530,2.3700,17z" },
  "l-international":{ id:"l-international", name:"L'International", hood:"Oberkampf", walkMin:17, ms:0, tier:"walk", tr:true, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/L'International/@48.8650,2.3790,17z" },
  "palais-de-tokyo":{ id:"palais-de-tokyo", name:"Palais de Tokyo", hood:"Trocadéro / 16th", walkMin:null, ms:8, tier:"long_metro", tr:true, cof:true, bar:false, gmaps:"https://www.google.com/maps/place/Palais+de+Tokyo/@48.8613,2.2980,17z" },
  "la-maroquinerie":{ id:"la-maroquinerie", name:"La Maroquinerie", hood:"Ménilmontant", walkMin:13, ms:0, tier:"walk", tr:true, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/La+Maroquinerie/@48.8670,2.3890,17z" },
  "le-bataclan":{ id:"le-bataclan", name:"Le Bataclan", hood:"Oberkampf / 11th", walkMin:null, ms:2, tier:"short_metro", tr:true, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/Bataclan/@48.8633,2.3702,17z" },
  "rosa-bonheur":{ id:"rosa-bonheur", name:"Rosa Bonheur", hood:"Buttes-Chaumont / 19th", walkMin:10, ms:0, tier:"walk", tr:true, cof:false, bar:true, gmaps:"https://www.google.com/maps/place/Rosa+Bonheur/@48.8808,2.3833,17z" },
  "le-zebre":{ id:"le-zebre", name:"Le Zèbre de Belleville", hood:"Belleville", walkMin:11, ms:0, tier:"walk", tr:true, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/Le+Z%C3%A8bre+de+Belleville/@48.8718,2.3847,17z" },
  "badaboum":{ id:"badaboum", name:"Badaboum", hood:"Bastille / 11th", walkMin:null, ms:3, tier:"short_metro", tr:true, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/Badaboum/@48.8528,2.3715,17z" },
  "gaite-lyrique":{ id:"gaite-lyrique", name:"La Gaîté Lyrique", hood:"Réaumur / 3rd", walkMin:null, ms:3, tier:"short_metro", tr:true, cof:true, bar:false, gmaps:"https://www.google.com/maps/place/La+Ga%C3%AEt%C3%A9+Lyrique/@48.8665,2.3538,17z" },
  "fondation-lv":{ id:"fondation-lv", name:"Fondation Louis Vuitton", hood:"Bois de Boulogne / 16th", walkMin:null, ms:9, tier:"long_metro", tr:true, cof:true, bar:false, gmaps:"https://www.google.com/maps/place/Fondation+Louis+Vuitton/@48.8764,2.2646,17z" },
  "aux-folies":{ id:"aux-folies", name:"Aux Folies", hood:"Belleville", walkMin:11, ms:0, tier:"walk", tr:true, cof:true, bar:true, gmaps:"https://www.google.com/maps/place/Aux+Folies/@48.8712,2.3840,17z" },
  "la-recyclerie":{ id:"la-recyclerie", name:"La Recyclerie", hood:"Clignancourt / 18th", walkMin:null, ms:4, tier:"short_metro", tr:true, cof:true, bar:false, gmaps:"https://www.google.com/maps/place/La+REcyclerie/@48.8990,2.3450,17z" },
  "buttes-chaumont":{ id:"buttes-chaumont", name:"Parc des Buttes-Chaumont", hood:"19th", walkMin:8, ms:0, tier:"walk", tr:false, cof:true, bar:false, gmaps:"https://www.google.com/maps/place/Parc+des+Buttes-Chaumont/@48.8809,2.3828,17z" },
};

const VENUE_ALIASES = {};
Object.values(VENUES).forEach(v => {
  VENUE_ALIASES[v.name.toLowerCase()] = v.id;
  VENUE_ALIASES[v.id] = v.id;
  const short = v.name.toLowerCase().replace(/^(le |la |l'|les |aux )/,"");
  VENUE_ALIASES[short] = v.id;
});

function matchVenue(name) {
  if (!name) return null;
  const n = name.toLowerCase().trim();
  if (VENUE_ALIASES[n]) return VENUES[VENUE_ALIASES[n]];
  for (const [key, vid] of Object.entries(VENUE_ALIASES)) {
    if (n.includes(key) || key.includes(n)) return VENUES[vid];
  }
  return null;
}

// ════════════════════════════════════════════════════════════
// SCORING
// ════════════════════════════════════════════════════════════

const SP=["indie_sleaze","art_led","design_literate","rock_gig","blues_night","post_punk","indie_live","electro_rock","lcd_adjacent","divey_good","cinematic","paris_only"];
const SN=["exhibition","talk","food","wine_bar"];
const SX=["mass_tourism","corporate","influencer_bait","family_centric"];

function scoreEv(ev, v, pr) {
  if (!v) return { sc: 0, q:0, vi:0, te:0, ri:0, dm:1, raw:0 };
  let q=0;
  if(v.tr)q+=10; if(ev.editorial_pick)q+=10; if(ev.trusted_platform)q+=5;
  if((ev.sources||[]).length>=2)q+=5; if((ev.sources||[]).length>=3)q+=5;
  q=Math.min(q,30);
  let vi=0;
  for(const t of (ev.vibe_tags||[])){if(SP.includes(t))vi+=8;if(SN.includes(t))vi+=3;if(SX.includes(t))vi-=12;}
  let te=0;
  const now=new Date(), ed=ev.date?new Date(ev.date):new Date();
  const dd=(ed-now)/(864e5);
  if(dd>=-0.5&&dd<=1)te+=20;else if(dd<=7)te+=15;
  if(ev.recurring&&vi>0)te+=8;
  const sh=ed.getHours()+ed.getMinutes()/60;
  const wd=ed.getDay(),wk=wd>=1&&wd<=5;
  if(wk&&sh>=22.5)te-=8;if(sh>=(pr.bed||23.5))te-=10;
  if(sh>=23&&v.tier!=="walk")te-=12;
  let ri=0;if(v.walkMin&&v.walkMin<=(pr.wm||25))ri+=10;if(v.cof)ri+=8;if(v.bar)ri+=6;if(ev.solo!==false)ri+=6;
  ri=Math.min(ri,30);
  let dm=1;if(v.tier==="short_metro")dm=.75;if(v.tier==="long_metro"){dm=.4;if(q>=25&&vi>=16)dm=.85;}
  const raw=q+vi+te+ri;
  return{sc:Math.round(raw*dm),q,vi,te,ri,dm,raw};
}

// ════════════════════════════════════════════════════════════
// LIVE DATA FETCHING via Anthropic API + web search
// ════════════════════════════════════════════════════════════

const SEARCH_QUERIES = [
  "concerts rock indie post-punk Paris this week february 2026",
  "live music gigs Paris Belleville Ménilmontant Oberkampf this week",
  "art exhibitions openings Paris this week february 2026",
  "DJ nights electronic music Paris this week",
  "cinema screenings retrospective Paris this week",
  "events concerts La Maroquinerie La Bellevilloise Nouveau Casino this week",
  "events concerts La Cigale Le Bataclan Le Trabendo Paris this week",
  "events Point Ephemere Petit Bain Badaboum Paris this week",
];

const SYSTEM_PROMPT = `You are a Paris events data extractor. Search for REAL events happening THIS WEEK in Paris (February 10-16, 2026). Focus on: live music (rock, indie, post-punk, blues, electro), art exhibitions, cinema screenings, DJ nights. Prioritize venues in and near the 20th arrondissement (Belleville, Ménilmontant, Oberkampf, Jourdain).

Return ONLY valid JSON array. No markdown, no backticks, no preamble. Each event object must have:
{
  "title": "exact event name",
  "venue_name": "exact venue name",
  "date": "ISO 8601 datetime",
  "end_time": "ISO 8601 or null",
  "price": number or 0 for free or null if unknown,
  "description": "1-2 sentences about the event",
  "editorial": "one confident sentence, magazine voice, why this matters",
  "vibe_tags": ["from: rock_gig, indie_live, post_punk, blues_night, electro_rock, lcd_adjacent, indie_sleaze, art_led, design_literate, divey_good, cinematic, paris_only, wine_bar, exhibition"],
  "sources": [{"name": "source name", "url": "EXACT full URL to the specific event page"}],
  "recurring": boolean,
  "editorial_pick": boolean,
  "trusted_platform": boolean,
  "solo": boolean,
  "coffee_tip": "nearby coffee suggestion or null",
  "late_night_tip": "what to do after or null"
}

CRITICAL RULES:
- Only include events you found via web search with REAL URLs
- Every URL must point to the SPECIFIC event page, not a homepage
- Do not invent events or URLs
- If you can't find the specific event URL, use the venue's programme page
- Include the source website name accurately
- Return 5-10 events per search, diverse across days and venues
- Include events from: Shotgun, DICE, Resident Advisor, Time Out Paris, L'Officiel, Télérama, venue websites, Instagram event pages
- If an event has multiple sources, include all of them`;

async function fetchLiveEvents(query) {
  // Try local API route first (Vercel/deployed), fallback to direct Anthropic API (Claude.ai artifact)
   const BACKEND_URL = "https://trent-project-backend.onrender.com";
  try {
    // Attempt 1: Local serverless function (works when deployed)
    const localResp = await fetch("${BACKEND_URL}/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (localResp.ok) {
      const data = await localResp.json();
      return data.events || [];
    }
  } catch (e) {
    // Local API not available — fall through to direct call
  }

  // Attempt 2: Direct Anthropic API (works in Claude.ai artifact environment)
  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: `Search for: ${query}\n\nReturn ONLY a JSON array of events found.` }],
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      }),
    });
    const data = await resp.json();
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const startIdx = cleaned.indexOf("[");
    const endIdx = cleaned.lastIndexOf("]");
    if (startIdx === -1 || endIdx === -1) return [];
    return JSON.parse(cleaned.slice(startIdx, endIdx + 1));
  } catch (e) {
    console.error("Fetch error for query:", query, e);
    return [];
  }
}

// ════════════════════════════════════════════════════════════
// INTEGRITY CHECKING
// ════════════════════════════════════════════════════════════

function checkIntegrity(events) {
  return events.map(ev => {
    const issues = [];
    if (!ev.title) issues.push("missing title");
    if (!ev.date) issues.push("missing date");
    const d = new Date(ev.date);
    if (isNaN(d.getTime())) issues.push("invalid date");
    else {
      const now = new Date();
      const diff = (d - now) / 864e5;
      if (diff < -1) issues.push("event in the past");
      if (diff > 14) issues.push("event >2 weeks away");
    }
    if (!ev.venue) issues.push("no matched venue");
    if (!ev.sources || ev.sources.length === 0) issues.push("no sources");
    else {
      ev.sources.forEach((s, i) => {
        if (!s.url) issues.push(`source ${i + 1}: no url`);
        else if (!s.url.startsWith("http")) issues.push(`source ${i + 1}: invalid url`);
        else if (s.url.match(/example\.com|placeholder|localhost/)) issues.push(`source ${i + 1}: placeholder url`);
      });
    }
    if (!ev.vibe_tags || ev.vibe_tags.length === 0) issues.push("no vibe tags");
    if (!ev.editorial) issues.push("no editorial line");
    const status = issues.length === 0 ? "ok" : issues.length <= 1 ? "warn" : "fail";
    return { ...ev, _issues: issues, _status: status };
  });
}

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════

const DL=["SUN","MON","TUE","WED","THU","FRI","SAT"], MN=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fD=i=>{if(!i)return"—";const d=new Date(i);if(isNaN(d))return"—";return`${DL[d.getDay()]} ${d.getDate()} ${MN[d.getMonth()]}`};
const fT=i=>{if(!i)return"";const d=new Date(i);if(isNaN(d))return"";return`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`};
const tE=t=>t==="walk"?"🚶":t==="short_metro"?"🚇":"🚇🚇";
const tL=t=>t==="walk"?"walk":t==="short_metro"?"short metro":"long metro";
const dT=v=>v?v.tier==="walk"?`${v.walkMin} min walk`:`${v.ms} stops`:"?";
const pT=p=>p===0?"free":p==null?"tbc":`€${p}`;
const vL=t=>t.replace(/_/g," ");
const srcIcon=n=>{const l=n.toLowerCase();if(l.includes("instagram"))return"📸";if(l.includes("guardian")||l.includes("time out")||l.includes("telerama")||l.includes("nme")||l.includes("pitchfork"))return"📰";if(l.includes("dice")||l.includes("shotgun")||l.includes("resident")||l.includes("songkick")||l.includes("bandsintown"))return"🎫";if(l.includes("artnet")||l.includes("artsy"))return"🎨";return"🔗"};
const statusIcon=s=>s==="ok"?"🟢":s==="warn"?"🟡":"🔴";

// ════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════

const css = `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
:root{--bg:#F6F4F0;--bg2:#EDEAE4;--fg:#1F1E1C;--fg2:#5C5955;--fg3:#9B9690;--ac:#B54A28;--ac2:#D4714F;--bd:#D8D4CC;--cd:#FFFEFA;--wk:#6B8F4A;--mt:#B54A28;--ml:#9B9690;--mn:'IBM Plex Mono',monospace;--sf:'Newsreader',serif;--ok:#4A8F4A;--warn:#C4960A;--fail:#B54A28}
*{margin:0;padding:0;box-sizing:border-box}
.tp{font-family:var(--mn);background:var(--bg);color:var(--fg);min-height:100vh;font-size:13px;line-height:1.6;display:flex;flex-direction:column;max-width:540px;margin:0 auto}
.hd{padding:16px 20px 10px;border-bottom:1px solid var(--bd);position:sticky;top:0;background:var(--bg);z-index:50}
.hdr{display:flex;justify-content:space-between;align-items:center}
.ht{font-size:14px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.hs{font-size:11px;color:var(--fg3);margin-top:2px}
.rbtn{font-family:var(--mn);font-size:10px;background:none;border:1px solid var(--bd);padding:5px 10px;cursor:pointer;color:var(--fg3);transition:all .15s;display:flex;align-items:center;gap:4px}
.rbtn:hover{border-color:var(--fg);color:var(--fg)}
.rbtn.loading{opacity:.5;pointer-events:none}
@keyframes spin{to{transform:rotate(360deg)}}
.spinner{display:inline-block;animation:spin 1s linear infinite}
.nv{display:flex;border-bottom:1px solid var(--bd);background:var(--bg);position:sticky;top:52px;z-index:49}
.nv button{flex:1;background:none;border:none;font-family:var(--mn);font-size:10px;padding:9px 0;color:var(--fg3);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;letter-spacing:.04em}
.nv button:hover{color:var(--fg)}.nv button.a{color:var(--fg);border-bottom-color:var(--ac)}
.ct{flex:1;padding:0 20px 80px}
.stat-bar{font-size:10px;color:var(--fg3);padding:10px 0;border-bottom:1px solid var(--bd);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px}
.stat-bar span{display:flex;align-items:center;gap:3px}
.dr{display:flex;gap:2px;padding:12px 0 8px;border-bottom:1px solid var(--bd);margin-bottom:4px}
.db{flex:1;background:none;border:1px solid transparent;font-family:var(--mn);font-size:9px;padding:4px 2px;color:var(--fg3);cursor:pointer;text-align:center;border-radius:2px;transition:all .1s}
.db:hover{color:var(--fg)}.db.a{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.db .dn{display:block;font-size:12px;font-weight:600;margin-top:1px}
.th{padding:16px 0 5px;font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;display:flex;align-items:center;gap:8px}
.th .tl{flex:1;height:1px;background:var(--bd)}
.tw{color:var(--wk)}.tm{color:var(--mt)}.tml{color:var(--ml)}
.et{font-family:var(--sf);font-style:italic;font-size:13px;color:var(--fg3);padding:8px 0 14px}
.ec{padding:10px 0;border-bottom:1px solid var(--bd);cursor:pointer;transition:background .1s}
.ec:hover{background:var(--cd);margin:0 -20px;padding:10px 20px}
.ect{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.ecn{font-size:13px;font-weight:600;line-height:1.3}
.ecs{font-size:10px;font-weight:600;color:var(--ac);white-space:nowrap;padding-top:2px}
.ece{font-family:var(--sf);font-style:italic;font-size:12px;color:var(--fg2);margin-top:2px;line-height:1.4}
.ecm{font-size:10px;color:var(--fg3);margin-top:4px;display:flex;flex-wrap:wrap;gap:2px 8px}
.tgs{display:flex;flex-wrap:wrap;gap:3px;margin-top:4px}
.tg{font-size:8px;letter-spacing:.05em;padding:1px 4px;border:1px solid var(--bd);color:var(--fg3)}
.tv{border-color:var(--ac2);color:var(--ac)}
.dt{padding-top:12px}
.dtb{font-family:var(--mn);font-size:11px;color:var(--fg3);background:none;border:none;cursor:pointer;padding:6px 0;margin-bottom:6px}
.dtb:hover{color:var(--fg)}
.dtr{font-size:10px;letter-spacing:.15em;text-transform:uppercase;margin-bottom:3px}
.dtt{font-size:17px;font-weight:600;line-height:1.25;margin-bottom:3px}
.dte{font-family:var(--sf);font-style:italic;font-size:14px;color:var(--fg2);line-height:1.45;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--bd)}
.ds{padding:8px 0;border-bottom:1px solid var(--bd)}
.dl{font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--fg3);margin-bottom:2px}
.dv{font-size:13px;color:var(--fg);line-height:1.5}
.dvs{font-family:var(--sf)}
.dd{font-family:var(--sf);font-size:13px;line-height:1.6;color:var(--fg2);padding:12px 0}
.sl{display:flex;flex-wrap:wrap;gap:2px 0;padding:8px 0;border-bottom:1px solid var(--bd)}
.sl a{font-size:10px;display:inline-flex;align-items:center;gap:3px;color:var(--ac);text-decoration:none;padding:3px 10px 3px 0;white-space:nowrap}
.sl a:hover{text-decoration:underline}
.sb{font-family:var(--mn);font-size:11px;background:none;border:1px solid var(--bd);padding:9px 16px;cursor:pointer;margin-top:12px;transition:all .15s;width:100%}
.sb:hover{border-color:var(--fg)}.sb.sv{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.dsb{font-size:10px;color:var(--fg3);margin-top:4px;line-height:1.7}
.se{font-family:var(--sf);font-style:italic;color:var(--fg3);padding:40px 0;text-align:center;font-size:13px}
.sr{padding:12px 0;border-bottom:1px solid var(--bd)}
.srl{font-size:11px;font-weight:600;letter-spacing:.06em;margin-bottom:5px}
.sro{display:flex;gap:2px;flex-wrap:wrap}
.so{font-family:var(--mn);font-size:10px;background:none;border:1px solid var(--bd);padding:4px 10px;cursor:pointer;transition:all .1s;color:var(--fg3)}
.so:hover{color:var(--fg);border-color:var(--fg2)}.so.a{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.sn{font-size:9px;color:var(--fg3);margin-top:4px;font-style:italic}
.mts{padding:4px 0 2px}
.mi{display:flex;gap:8px;padding:6px 0;border-bottom:1px solid var(--bd);cursor:pointer;align-items:flex-start}
.mi:hover{background:var(--cd);margin:0 -20px;padding:6px 20px}
.md2{font-size:10px;color:var(--fg3);min-width:60px;padding-top:2px;text-align:right}
.mif{flex:1}.mn2{font-size:11px;font-weight:500}.mh{font-size:10px;color:var(--fg3)}
.we{font-family:var(--sf);font-style:italic;font-size:13px;color:var(--fg3);text-align:center;padding:28px 0;border-top:1px solid var(--bd);margin-top:14px}
.fr{display:flex;gap:2px;padding:8px 0;border-bottom:1px solid var(--bd)}
.fb{font-family:var(--mn);font-size:10px;background:none;border:1px solid var(--bd);padding:3px 8px;cursor:pointer;color:var(--fg3);transition:all .1s}
.fb.a{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.ic{margin-top:12px}
.ic-row{padding:8px 0;border-bottom:1px solid var(--bd);font-size:11px;display:flex;gap:8px;align-items:flex-start}
.ic-status{min-width:18px;text-align:center;padding-top:1px}
.ic-title{font-weight:500;flex:1}
.ic-issues{font-size:9px;color:var(--fg3);margin-top:2px}
.prog{background:var(--bd);height:3px;margin:8px 0;border-radius:2px;overflow:hidden}
.prog-bar{height:100%;background:var(--ac);transition:width .3s}
.empty-state{text-align:center;padding:60px 20px}
.empty-state p{font-family:var(--sf);font-style:italic;color:var(--fg3);font-size:14px;margin-bottom:12px}
.load-btn{font-family:var(--mn);font-size:12px;background:var(--fg);color:var(--bg);border:none;padding:12px 24px;cursor:pointer;letter-spacing:.05em}
.load-btn:hover{opacity:.85}`;

// ════════════════════════════════════════════════════════════
// APP
// ════════════════════════════════════════════════════════════

export default function App() {
  const [view, setView] = useState("week");
  const [selDay, setSel] = useState(null);
  const [det, setDet] = useState(null);
  const [saved, setSaved] = useState([]);
  const [pr, setPr] = useState({ wm: 25, mm: 3, bed: 23.5, bud: "mid", lang: "en" });
  const [mf, setMf] = useState("all");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadStatus, setLoadStatus] = useState("");
  const [lastRefresh, setLastRefresh] = useState(null);
  const [showIntegrity, setShowIntegrity] = useState(false);

  const processRawEvents = useCallback((rawEvents) => {
    const deduped = new Map();
    rawEvents.forEach(raw => {
      const key = `${(raw.title||"").toLowerCase().slice(0,30)}-${(raw.date||"").slice(0,10)}`;
      if (deduped.has(key)) {
        const existing = deduped.get(key);
        existing.sources = [...(existing.sources||[]), ...(raw.sources||[])];
      } else {
        deduped.set(key, { ...raw });
      }
    });
    return Array.from(deduped.values()).map((raw, i) => {
      const venue = matchVenue(raw.venue_name);
      const fallbackVenue = venue || {
        id: `ext-${i}`, name: raw.venue_name || "Unknown", hood: "Paris",
        walkMin: null, ms: 5, tier: "short_metro", tr: false, cof: false, bar: false,
        gmaps: `https://www.google.com/maps/search/${encodeURIComponent((raw.venue_name||"Paris")+" Paris")}`
      };
      const s = scoreEv(raw, venue || fallbackVenue, pr);
      return {
        id: `live-${i}-${Date.now()}`,
        title: raw.title || "Untitled",
        desc: raw.description || "",
        ed: raw.editorial || "",
        date: raw.date,
        end: raw.end_time,
        price: raw.price,
        recurring: raw.recurring || false,
        vibe_tags: raw.vibe_tags || [],
        sources: (raw.sources || []).filter(s => s && s.url),
        editorial_pick: raw.editorial_pick || false,
        trusted_platform: raw.trusted_platform || false,
        solo: raw.solo !== false,
        cof: raw.coffee_tip,
        late: raw.late_night_tip,
        venue: venue || fallbackVenue,
        knownVenue: !!venue,
        ...s,
      };
    });
  }, [pr]);

  const doRefresh = useCallback(async () => {
    setLoading(true);
    setLoadProgress(0);
    setLoadStatus("searching paris...");
    const allRaw = [];
    for (let i = 0; i < SEARCH_QUERIES.length; i++) {
      setLoadStatus(`searching ${i + 1}/${SEARCH_QUERIES.length}: ${SEARCH_QUERIES[i].slice(0, 40)}...`);
      setLoadProgress(((i) / SEARCH_QUERIES.length) * 100);
      const results = await fetchLiveEvents(SEARCH_QUERIES[i]);
      allRaw.push(...results);
      await new Promise(r => setTimeout(r, 300));
    }
    setLoadStatus(`processing ${allRaw.length} raw results...`);
    setLoadProgress(90);
    const processed = processRawEvents(allRaw);
    const checked = checkIntegrity(processed);
    setEvents(checked.filter(e => e.sc >= 40).sort((a, b) => b.sc - a.sc));
    setLastRefresh(new Date());
    setLoadProgress(100);
    setLoadStatus("");
    setLoading(false);
  }, [processRawEvents]);

  // Week dates (current week)
  const weekDates = useMemo(() => {
    const now = new Date();
    const mon = new Date(now);
    mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    mon.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      return d;
    });
  }, []);

  const filtered = useMemo(() => {
    if (selDay === null) return events;
    return events.filter(e => {
      const d = new Date(e.date);
      return d.toDateString() === weekDates[selDay]?.toDateString();
    });
  }, [events, selDay, weekDates]);

  const tiers = useMemo(() => ({
    w: filtered.filter(e => e.venue?.tier === "walk").slice(0, 8),
    s: filtered.filter(e => e.venue?.tier === "short_metro").slice(0, 6),
    l: filtered.filter(e => e.venue?.tier === "long_metro").slice(0, 4),
  }), [filtered]);

  const tog = useCallback(id => setSaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]), []);
  const savedEv = useMemo(() => events.filter(e => saved.includes(e.id)), [events, saved]);

  const intStats = useMemo(() => {
    const ok = events.filter(e => e._status === "ok").length;
    const warn = events.filter(e => e._status === "warn").length;
    const fail = events.filter(e => e._status === "fail").length;
    return { ok, warn, fail, total: events.length };
  }, [events]);

  // ── CARD ──
  const Card = ({ ev }) => (
    <div className="ec" onClick={() => setDet(ev.id)}>
      <div className="ect">
        <div className="ecn">{ev._status && statusIcon(ev._status)} {ev.title}</div>
        <div className="ecs">{ev.sc}</div>
      </div>
      {ev.ed && <div className="ece">"{ev.ed}"</div>}
      <div className="ecm">
        <span>{fD(ev.date)} · {fT(ev.date)}</span>
        <span>{ev.venue?.name}</span>
        <span>{dT(ev.venue)}</span>
        <span>{pT(ev.price)}</span>
        {!ev.knownVenue && <span style={{ color: "var(--warn)" }}>⚠ unknown venue</span>}
      </div>
      <div className="tgs">
        {(ev.vibe_tags || []).slice(0, 3).map(t => <span key={t} className="tg tv">{vL(t)}</span>)}
        <span className="tg">{(ev.sources || []).length} source{(ev.sources || []).length !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );

  // ── DETAIL ──
  if (det) {
    const ev = events.find(e => e.id === det);
    if (!ev) { setDet(null); return null; }
    const v = ev.venue, is = saved.includes(ev.id);
    const tc = v?.tier === "walk" ? "tw" : v?.tier === "short_metro" ? "tm" : "tml";
    return (
      <div className="tp"><style>{css}</style>
        <div className="ct dt">
          <button className="dtb" onClick={() => setDet(null)}>← back</button>
          <div className={`dtr ${tc}`}>{tE(v?.tier)} {tL(v?.tier)} · {dT(v)}</div>
          <div className="dtt">{ev.title}</div>
          {ev.ed && <div className="dte">"{ev.ed}"</div>}
          <div className="ds"><div className="dl">📅 when</div><div className="dv">{fD(ev.date)} · {fT(ev.date)}{ev.end ? `–${fT(ev.end)}` : ""}</div></div>
          <div className="ds"><div className="dl">📍 where</div><div className="dv">{v?.name} · {v?.hood}{!ev.knownVenue && " ⚠ unmatched"}</div></div>
          <div className="sl">
            {v?.gmaps && <a href={v.gmaps} target="_blank" rel="noopener noreferrer">📍 google maps ↗</a>}
            {(ev.sources || []).map((s, i) => <a key={i} href={s.url} target="_blank" rel="noopener noreferrer">{srcIcon(s.name)} {s.name} ↗</a>)}
          </div>
          <div className="ds"><div className="dl">💰 price</div><div className="dv">{pT(ev.price)}</div></div>
          {ev.cof && <div className="ds"><div className="dl">☕ coffee anchor</div><div className="dv dvs">{ev.cof}</div></div>}
          {ev.desc && <div className="dd">{ev.desc}</div>}
          {ev.late && <div className="ds"><div className="dl">🌙 late night</div><div className="dv dvs">{ev.late}</div></div>}
          <div className="tgs" style={{ padding: "8px 0" }}>
            {(ev.vibe_tags || []).map(t => <span key={t} className="tg tv">{vL(t)}</span>)}
          </div>
          <div className="ds"><div className="dl">score breakdown</div>
            <div className="dsb">quality {ev.q} · vibe {ev.vi} · temporal {ev.te} · ritual {ev.ri} · raw {ev.raw} × {ev.dm} = <strong style={{ color: "var(--ac)" }}>{ev.sc}</strong></div>
          </div>
          {ev._issues && ev._issues.length > 0 && (
            <div className="ds"><div className="dl">{statusIcon(ev._status)} integrity</div>
              <div className="dsb">{ev._issues.join(" · ")}</div>
            </div>
          )}
          <button className={`sb ${is ? "sv" : ""}`} onClick={() => tog(ev.id)}>{is ? "⚡ saved" : "⚡ save this"}</button>
        </div>
      </div>
    );
  }

  const Tier = ({ label, cls, items, empty }) => (
    <><div className={`th ${cls}`}>{label}<span className="tl" /></div>
      {items.length === 0 ? <div className="et">{empty}</div> : items.map(e => <Card key={e.id} ev={e} />)}</>
  );

  // ── EMPTY STATE ──
  if (events.length === 0 && !loading) {
    return (
      <div className="tp"><style>{css}</style>
        <div className="hd"><div className="ht">⚡ trent power</div><div className="hs">jourdain, 20th</div></div>
        <div className="ct">
          <div className="empty-state">
            <p style={{fontSize:24,marginBottom:20}}>⚡</p>
            <p>No data loaded yet.</p>
            <p style={{ fontSize: 11, marginBottom: 20 }}>Tap below to search Paris listings for this week's events via live web search. Sources include Shotgun, DICE, RA, Time Out, L'Officiel, Télérama, venue sites, and more.</p>
            <button className="load-btn" onClick={doRefresh}>search paris this week</button>
          </div>
        </div>
      </div>
    );
  }

  // ── LOADING STATE ──
  if (loading) {
    return (
      <div className="tp"><style>{css}</style>
        <div className="hd"><div className="ht">⚡ trent power</div><div className="hs">jourdain, 20th</div></div>
        <div className="ct">
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            <p style={{ fontSize: 20, marginBottom: 16 }}><span className="spinner">⚡</span></p>
            <p style={{ fontFamily: "var(--sf)", fontStyle: "italic", color: "var(--fg2)", fontSize: 14, marginBottom: 12 }}>{loadStatus}</p>
            <div className="prog"><div className="prog-bar" style={{ width: `${loadProgress}%` }} /></div>
            <p style={{ fontSize: 10, color: "var(--fg3)", marginTop: 8 }}>searching {SEARCH_QUERIES.length} queries across paris listings...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── WEEK ──
  const Week = () => (
    <>
      <div className="stat-bar">
        <span>{intStats.total} events · 🟢 {intStats.ok} · 🟡 {intStats.warn} · 🔴 {intStats.fail}</span>
        <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowIntegrity(!showIntegrity)}>
          {showIntegrity ? "hide" : "show"} integrity
        </span>
      </div>
      {showIntegrity && (
        <div className="ic">
          <div style={{ fontSize: 10, color: "var(--fg3)", padding: "6px 0", borderBottom: "1px solid var(--bd)" }}>
            🟢 = verified · 🟡 = minor issue · 🔴 = data problems · click event to see details
          </div>
          {events.map(ev => (
            <div key={ev.id} className="ic-row" onClick={() => setDet(ev.id)} style={{ cursor: "pointer" }}>
              <div className="ic-status">{statusIcon(ev._status)}</div>
              <div style={{ flex: 1 }}>
                <div className="ic-title">{ev.title}</div>
                {ev._issues.length > 0 && <div className="ic-issues">{ev._issues.join(" · ")}</div>}
                <div className="ic-issues">{(ev.sources || []).length} source(s): {(ev.sources || []).map(s => s.name).join(", ")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="dr">
        <button className={`db ${selDay === null ? "a" : ""}`} onClick={() => setSel(null)}><span style={{ fontSize: 9 }}>ALL</span><span className="dn">—</span></button>
        {weekDates.map((d, i) => <button key={i} className={`db ${selDay === i ? "a" : ""}`} onClick={() => setSel(i)}><span>{DL[d.getDay()]}</span><span className="dn">{d.getDate()}</span></button>)}
      </div>
      <Tier label="🚶 walk" cls="tw" items={tiers.w} empty={`Nothing worth the walk ${selDay !== null ? "today" : "this week"}.`} />
      <Tier label="🚇 short metro" cls="tm" items={tiers.s} empty={`Metro's not earning it ${selDay !== null ? "today" : "right now"}.`} />
      <Tier label="🚇🚇 long metro — only if exceptional" cls="tml" items={tiers.l} empty="Nothing far away worth the trip." />
      <div className="we">That's enough for this week.</div>
    </>
  );

  // ── MAP ──
  const MapView = () => {
    const ml = mf === "all" ? events : events.filter(e => {
      if (mf === "walk") return e.venue?.tier === "walk";
      if (mf === "metro") return e.venue?.tier !== "walk";
      if (mf === "tonight") { const d = new Date(e.date); const n = new Date(); return d.toDateString() === n.toDateString(); }
      return true;
    });
    const g = { w: ml.filter(e => e.venue?.tier === "walk"), s: ml.filter(e => e.venue?.tier === "short_metro"), l: ml.filter(e => e.venue?.tier === "long_metro") };
    return (<>
      <div style={{ padding: "12px 0 5px", fontSize: 11, color: "var(--fg3)" }}>📍 radiating from jourdain, 20th</div>
      <div className="fr">{["all", "walk", "metro", "tonight"].map(f => <button key={f} className={`fb ${mf === f ? "a" : ""}`} onClick={() => setMf(f)}>{f}</button>)}</div>
      {[{ k: "w", l: "🚶 walking distance", i: g.w, c: "tw" }, { k: "s", l: "🚇 short metro", i: g.s, c: "tm" }, { k: "l", l: "🚇🚇 long metro", i: g.l, c: "tml" }].map(x => (
        <div key={x.k} className="mts">
          <div className={`th ${x.c}`}>{x.l}<span className="tl" /></div>
          {x.i.length === 0 ? <div className="et">—</div> : x.i.map(ev => (
            <div key={ev.id} className="mi" onClick={() => setDet(ev.id)}>
              <div className="md2">{dT(ev.venue)}</div>
              <div className="mif"><div className="mn2">{statusIcon(ev._status)} {ev.title}</div><div className="mh">{ev.venue?.name} · {ev.sc}pts · {fD(ev.date)}</div></div>
            </div>
          ))}
        </div>
      ))}
    </>);
  };

  // ── SAVED ──
  const Saved = () => (<>
    <div style={{ padding: "12px 0 5px", fontSize: 11, color: "var(--fg3)", letterSpacing: ".1em", textTransform: "uppercase" }}>⚡ saved</div>
    {savedEv.length === 0 ? <div className="se">Nothing saved yet. Tap ⚡ on any plan.</div> : savedEv.map(ev => (
      <div key={ev.id} className="ec" onClick={() => setDet(ev.id)}>
        <div className="ect"><div className="ecn">{ev.title}</div><div className="ecs">{tE(ev.venue?.tier)} {ev.sc}</div></div>
        {ev.ed && <div className="ece">"{ev.ed}"</div>}
        <div className="ecm"><span>{fD(ev.date)} · {fT(ev.date)}</span><span>{ev.venue?.name}</span></div>
        <button style={{ fontFamily: "var(--mn)", fontSize: 10, background: "none", border: "1px solid var(--bd)", padding: "3px 8px", marginTop: 5, cursor: "pointer", color: "var(--fg3)" }} onClick={e => { e.stopPropagation(); tog(ev.id); }}>remove</button>
      </div>
    ))}
  </>);

  // ── SETTINGS ──
  const Settings = () => (<>
    <div style={{ padding: "12px 0 5px", fontSize: 11, color: "var(--fg3)", letterSpacing: ".1em", textTransform: "uppercase" }}>⚙️ preferences</div>
    <div className="sr"><div className="srl">🚶 walk tolerance (max min)</div><div className="sro">{[15, 20, 25, 30, 35].map(x => <button key={x} className={`so ${pr.wm === x ? "a" : ""}`} onClick={() => setPr(p => ({ ...p, wm: x }))}>{x}</button>)}</div></div>
    <div className="sr"><div className="srl">🚇 short metro (max stops)</div><div className="sro">{[2, 3, 4, 5].map(x => <button key={x} className={`so ${pr.mm === x ? "a" : ""}`} onClick={() => setPr(p => ({ ...p, mm: x }))}>{x}</button>)}</div></div>
    <div className="sr"><div className="srl">🌙 bedtime</div><div className="sro">{[{ l: "22:00", v: 22 }, { l: "22:30", v: 22.5 }, { l: "23:00", v: 23 }, { l: "23:30", v: 23.5 }, { l: "00:00", v: 24 }].map(o => <button key={o.v} className={`so ${pr.bed === o.v ? "a" : ""}`} onClick={() => setPr(p => ({ ...p, bed: o.v }))}>{o.l}</button>)}</div><div className="sn">events after this get penalised</div></div>
    <div className="sr"><div className="srl">💰 budget</div><div className="sro">{["low", "mid", "high"].map(x => <button key={x} className={`so ${pr.bud === x ? "a" : ""}`} onClick={() => setPr(p => ({ ...p, bud: x }))}>{x}</button>)}</div></div>
    <div className="sr"><div className="srl">🌐 language</div><div className="sro">{["en", "fr"].map(x => <button key={x} className={`so ${pr.lang === x ? "a" : ""}`} onClick={() => setPr(p => ({ ...p, lang: x }))}>{x}</button>)}</div></div>
    <div style={{ padding: "16px 0", fontSize: 10, color: "var(--fg3)", lineHeight: 1.8 }}>
      all preferences stored in memory.<br />no account. no sync. no tracking.<br />
      {lastRefresh && <>last refresh: {lastRefresh.toLocaleTimeString()}<br /></>}
      data source: live web search via {SEARCH_QUERIES.length} queries
    </div>
  </>);

  return (
    <div className="tp"><style>{css}</style>
      <div className="hd">
        <div className="hdr">
          <div>
            <div className="ht">⚡ trent power</div>
            <div className="hs">jourdain, 20th · {lastRefresh ? `refreshed ${lastRefresh.toLocaleTimeString()}` : "no data"}</div>
          </div>
          <button className={`rbtn ${loading ? "loading" : ""}`} onClick={doRefresh} disabled={loading}>
            {loading ? <><span className="spinner">↻</span> searching</> : <>↻ refresh</>}
          </button>
        </div>
      </div>
      <div className="nv">
        <button className={view === "week" ? "a" : ""} onClick={() => setView("week")}>this week</button>
        <button className={view === "map" ? "a" : ""} onClick={() => setView("map")}>map</button>
        <button className={view === "saved" ? "a" : ""} onClick={() => setView("saved")}>saved{saved.length > 0 ? ` (${saved.length})` : ""}</button>
        <button className={view === "settings" ? "a" : ""} onClick={() => setView("settings")}>settings</button>
      </div>
      <div className="ct">
        {view === "week" && <Week />}
        {view === "map" && <MapView />}
        {view === "saved" && <Saved />}
        {view === "settings" && <Settings />}
      </div>
    </div>
  );
}
