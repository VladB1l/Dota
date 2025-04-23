const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiNjQ1YWIxMmEtYjE3MS00Y2NmLWJkM2QtZTE0MWQzODY0MzI3IiwiU3RlYW1JZCI6IjMwNzE5NzU2NiIsIm5iZiI6MTcyNjY4NzgyNCwiZXhwIjoxNzU4MjIzODI0LCJpYXQiOjE3MjY2ODc4MjQsImlzcyI6Imh0dHBzOi8vYXBpLnN0cmF0ei5jb20ifQ.M-ca7BA-MIz0sMVNLVTToCo1VpOMbIudQWmfnvdi9pU'; // Замени на актуальный ключ

// Функция для получения винрейтов "with"
async function fetchHeroWinRatesWith(heroIds) {
    const url = 'https://api.stratz.com/graphql';

    const queries = heroIds.map(id => `
        hero_${id}: heroVsHeroMatchup(heroId: ${id}) {
            advantage {
                heroId
                with {
                    heroId1
                    heroId2
                    winsAverage
                }
            }
        }
    `).join('\n');

    const query = `
    {
        heroStats {
            ${queries}
        }
    }
    `;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({ query })
        });

        const json = await response.json();
        const result = json.data.heroStats;

        const winRateWithMap = {};

        for (const key in result) {
            const entry = result[key]?.advantage[0];

            if (entry?.with) {
                entry.with.forEach(pair => {
                    const key = `${pair.heroId1}-${pair.heroId2}`;
                    winRateWithMap[key] = pair.winsAverage;
                });
            }
        }

        return winRateWithMap;
    } catch (err) {
        console.error("Ошибка при получении данных with:", err);
        return {};
    }
}

// Функция для получения винрейтов "vs"
async function fetchHeroWinRatesVs(heroIds) {
    const url = 'https://api.stratz.com/graphql';

    const queries = heroIds.map(id => `
        hero_${id}: heroVsHeroMatchup(heroId: ${id} bracketBasicIds: [DIVINE_IMMORTAL]) {
            advantage {
                heroId
                vs {
                    heroId1
                    heroId2
                    winsAverage
                }
            }
        }
    `).join('\n');

    const query = `
    {
        heroStats {
            ${queries}
        }
    }
    `;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({ query })
        });

        const json = await response.json();
        const result = json.data.heroStats;

        const winRateVsMap = {};

        for (const key in result) {
            const entry = result[key]?.advantage[0];

            if (entry?.vs) {
                entry.vs.forEach(pair => {
                    const key = `${pair.heroId1}-${pair.heroId2}`;
                    winRateVsMap[key] = pair.winsAverage;
                });
            }
        }

        return winRateVsMap;
    } catch (err) {
        console.error("Ошибка при получении данных vs:", err);
        return {};
    }
}

// Функция для получения винрейтов между героями (объединяет результаты)
export async function fetchHeroWinRates(heroIds) {
    const [winRateWithMap, winRateVsMap] = await Promise.all([
        fetchHeroWinRatesWith(heroIds),
        fetchHeroWinRatesVs(heroIds)
    ]);

    return { winRateWithMap, winRateVsMap };
}

// Функция для получения имен героев
export async function fetchHeroNames() {
    const query = `{
        constants {
            heroes {
                id
                displayName
            }
        }
    }`;

    try {
        const response = await fetch("https://api.stratz.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({ query })
        });

        const json = await response.json();
        const heroes = json.data.constants.heroes;

        const heroMap = {};
        heroes.forEach(hero => {
            heroMap[hero.id] = hero.displayName;
        });

        return heroMap;
    } catch (err) {
        console.error("Ошибка при получении названий героев:", err);
        return {};
    }
}
