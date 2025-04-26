import fetch from 'node-fetch';
import { STRATZ_API_KEY } from './config.js';

const apiKey = `${STRATZ_API_KEY}`;

export async function fetchHeroWinRates(heroIds) {
    const [winRateWithMap, winRateVsMap] = await Promise.all([
        fetchHeroWinRatesWith(heroIds),
        fetchHeroWinRatesVs(heroIds)
    ]);
    return { winRateWithMap, winRateVsMap };
}

async function fetchHeroWinRatesWith(heroIds) {
    const url = 'https://api.stratz.com/graphql';
    const queries = heroIds.map(id => `hero_${id}: heroVsHeroMatchup(heroId: ${id}) {
    advantage { with { heroId1 heroId2 winsAverage } }
  }`).join('\n');
    const query = `{ heroStats { ${queries} } }`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ query })
    });
    const json = await res.json();
    const map = {};
    for (const key in json.data.heroStats) {
        const withStats = json.data.heroStats[key]?.advantage?.[0]?.with || [];
        withStats.forEach(({ heroId1, heroId2, winsAverage }) => {
            map[`${heroId1}-${heroId2}`] = winsAverage;
        });
    }
    return map;
}

async function fetchHeroWinRatesVs(heroIds) {
    const url = 'https://api.stratz.com/graphql';
    const queries = heroIds.map(id => `hero_${id}: heroVsHeroMatchup(heroId: ${id} bracketBasicIds: [DIVINE_IMMORTAL]) {
    advantage { vs { heroId1 heroId2 winsAverage } }
  }`).join('\n');
    const query = `{ heroStats { ${queries} } }`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ query })
    });
    const json = await res.json();
    const map = {};
    for (const key in json.data.heroStats) {
        const vsStats = json.data.heroStats[key]?.advantage?.[0]?.vs || [];
        vsStats.forEach(({ heroId1, heroId2, winsAverage }) => {
            map[`${heroId1}-${heroId2}`] = winsAverage;
        });
    }
    return map;
}

export async function fetchHeroNames() {
    const query = `{
      constants {
        heroes { id displayName shortName }
      }
    }`;

    const res = await fetch("https://api.stratz.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ query })
    });

    const json = await res.json();
    const heroes = json.data.constants.heroes;

    const map = {};
    heroes.forEach(h => {
        map[h.id] = {
            displayName: h.displayName,
            shortName: h.shortName
        };
    });

    return map;
}
