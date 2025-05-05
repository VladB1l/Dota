import { fetchHeroNames, fetchHeroWinRates } from './heroDataFetcher.js';
import { CONFIG } from './config.js';


function calculateWinRateWithTeam(team, winRateWithMap) {
    let synergyScore = 0;
    for (let i = 0; i < team.length; i++) {
        for (let j = i + 1; j < team.length; j++) {
            const key1 = `${team[i]}-${team[j]}`;
            const key2 = `${team[j]}-${team[i]}`;
            synergyScore += (winRateWithMap[key1] || 0) + (winRateWithMap[key2] || 0);
        }
    }
    return synergyScore / (team.length * (team.length - 1));
}

function evaluateTeamAgainstOpponent(team, opponent, winRateVsMap) {
    let counterScore = 0;
    for (const t of team) {
        for (const o of opponent) {
            const key = `${t}-${o}`;
            counterScore += winRateVsMap[key] || 0;
        }
    }
    return counterScore / (team.length * opponent.length);
}

function calculateFitness(team, opponent, winRateVsMap, winRateWithMap) {
    const synergyScore = calculateWinRateWithTeam(team, winRateWithMap);
    const counterScore = evaluateTeamAgainstOpponent(team, opponent, winRateVsMap);

    const synergyWeight = 0.4;
    const counterWeight = 0.6;
    const fitness = synergyScore * synergyWeight + counterScore * counterWeight;
    return fitness;
}


function getAvailableHeroes(allHeroIds, exclude, team) {
    const excludeSet = new Set([...exclude, ...team]);
    return allHeroIds.filter(id => !excludeSet.has(id));
}

function generateRandomTeam(allHeroIds, exclude, heroNameMap) {
    const available = getAvailableHeroes(allHeroIds, exclude, []);
    const team = new Set();

    while (team.size < CONFIG.teamSize && available.length > 0) {
        const index = Math.floor(Math.random() * available.length);
        const heroId = available[index];
        if (heroNameMap[heroId]) {
            team.add(heroId);
        }
        available.splice(index, 1);
    }

    return Array.from(team);
}

function mutate(team, allHeroIds, exclude, heroNameMap) {
    let available = getAvailableHeroes(allHeroIds, exclude, team);
    if (available.length === 0) return team;

    const newTeam = [...team];
    for (let i = 0; i < newTeam.length; i++) {
        if (Math.random() < CONFIG.mutationRate) {
            if (available.length === 0) break;
            const replacementIndex = Math.floor(Math.random() * available.length);
            const replacement = available[replacementIndex];
            newTeam[i] = replacement;
            available = getAvailableHeroes(allHeroIds, exclude, newTeam);
        }
    }

    return Array.from(new Set(newTeam)).slice(0, CONFIG.teamSize);
}

function crossover(parent1, parent2) {
    const midpoint = Math.floor(CONFIG.teamSize / 2);
    const child1 = [...new Set([...parent1.slice(0, midpoint), ...parent2.slice(midpoint)])].slice(0, CONFIG.teamSize);
    const child2 = [...new Set([...parent2.slice(0, midpoint), ...parent1.slice(midpoint)])].slice(0, CONFIG.teamSize);
    return [child1, child2];
}

export async function runImpactOptimization(players) {
    const radiantIds = players.filter(p => p.isRadiant).map(p => p.hero.id);
    const direIds = players.filter(p => !p.isRadiant).map(p => p.hero.id);
    const allHeroIds = [...Array(CONFIG.allHeroCount).keys()].map(i => i + 1);

    const { winRateVsMap, winRateWithMap } = await fetchHeroWinRates(allHeroIds);
    const heroNameMap = await fetchHeroNames();

    function evolveTeam(currentOpponent, originalTeam) {
        let population = [
            originalTeam,
            ...Array.from({ length: CONFIG.populationSize - 1 }, () =>
                generateRandomTeam(allHeroIds, [...radiantIds, ...direIds], heroNameMap)
            ),
        ];

        for (let gen = 0; gen < CONFIG.generations; gen++) {
            const fitnessResults = population.map(team => ({
                team: team,
                fitness: calculateFitness(team, currentOpponent, winRateVsMap, winRateWithMap)
            }));
            fitnessResults.sort((a, b) => b.fitness - a.fitness);
            population = fitnessResults.map(item => item.team);

            const parent1 = population[0];
            const parent2 = population[1];

            let [child1, child2] = crossover(parent1, parent2);
            child1 = mutate(child1, allHeroIds, [...radiantIds, ...direIds], heroNameMap);
            child2 = mutate(child2, allHeroIds, [...radiantIds, ...direIds], heroNameMap);

            let addedCount = 0;
            if (child1.length === CONFIG.teamSize) {
                population.pop();
                population.push(child1);
                addedCount++;
            }
            if (child2.length === CONFIG.teamSize) {
                population.pop();
                population.push(child2);
                addedCount++;
            }

            population.sort((a, b) => calculateFitness(b, currentOpponent, winRateVsMap, winRateWithMap) - calculateFitness(a, currentOpponent, winRateVsMap, winRateWithMap));
            population = population.slice(0, CONFIG.populationSize);

        }

        return population[0];
    }

    const optimizedRadiant = evolveTeam(direIds, radiantIds);
    const optimizedDire = evolveTeam(radiantIds, direIds);

    const originalRadiantFitness = calculateFitness(radiantIds, direIds, winRateVsMap, winRateWithMap);
    const originalDireFitness = calculateFitness(direIds, radiantIds, winRateVsMap, winRateWithMap);
    const optimizedRadiantFitness = calculateFitness(optimizedRadiant, direIds, winRateVsMap, winRateWithMap);
    const optimizedDireFitness = calculateFitness(optimizedDire, radiantIds, winRateVsMap, winRateWithMap);

    const radiantWinChanceOriginal = (originalRadiantFitness / (originalRadiantFitness + originalDireFitness)) * 100;
    const radiantWinChanceOptimized = (optimizedRadiantFitness / (optimizedRadiantFitness + originalDireFitness)) * 100;
    const direWinChanceOriginal = 100 - radiantWinChanceOriginal;
    const direWinChanceOptimized = (optimizedDireFitness / (optimizedDireFitness + originalRadiantFitness)) * 100;


    const optimizedRadiantDetails = optimizedRadiant.map(id => ({
        displayName: heroNameMap[id]?.displayName || 'Unknown',
        shortName: heroNameMap[id]?.shortName || 'unknown'
    }));

    const optimizedDireDetails = optimizedDire.map(id => ({
        displayName: heroNameMap[id]?.displayName || 'Unknown',
        shortName: heroNameMap[id]?.shortName || 'unknown'
    }));

    return {
        optimizedRadiant,
        optimizedDire,
        radiantWinChanceOriginal,
        radiantWinChanceOptimized,
        direWinChanceOriginal,
        direWinChanceOptimized,
        optimizedRadiantDetails,
        optimizedDireDetails
    };
}
