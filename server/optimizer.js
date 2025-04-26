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

    // console.log(`Fitness for team [${team.join(', ')}]:`);
    // console.log(`  Synergy Score: ${synergyScore}`);
    // console.log(`  Counter Score: ${counterScore}`);
    // console.log(`  Total Fitness: ${fitness}`);

    return fitness;
}

function generateRandomTeam(allHeroIds, exclude, heroNameMap) {
    const available = allHeroIds.filter(id => !exclude.includes(id));
    const team = [];
    while (team.length < CONFIG.teamSize && available.length > 0) {
        const index = Math.floor(Math.random() * available.length);
        const heroId = available[index];
        if (heroNameMap[heroId] && !team.includes(heroId)) {
            team.push(heroId);
        }
        available.splice(index, 1);
    }
    return team;
}

function mutate(team, allHeroIds, exclude, heroNameMap) {
    let available = allHeroIds.filter(id => !exclude.includes(id) && !team.includes(id));
    if (available.length === 0) return team;

    let newTeam = [...team];
    for (let i = 0; i < newTeam.length; i++) {
        if (Math.random() < CONFIG.mutationRate) {
            if (available.length === 0) break;
            const replacementIndex = Math.floor(Math.random() * available.length);
            let replacement = available[replacementIndex];
            while (!heroNameMap[replacement] && available.length > 1) {
                available.splice(replacementIndex, 1);
                replacement = available[Math.floor(Math.random() * available.length)];
            }
            newTeam[i] = replacement;
            available = allHeroIds.filter(id => !exclude.includes(id) && !newTeam.includes(id));
        }
    }
    return [...new Set(newTeam)].slice(0, CONFIG.teamSize);
}

function crossover(parent1, parent2) {
    let child1 = [];
    let child2 = [];
    for (let i = 0; i < CONFIG.teamSize; i++) {
        child1.push(i < Math.floor(CONFIG.teamSize / 2) ? parent1[i] : parent2[i]);
        child2.push(i < Math.floor(CONFIG.teamSize / 2) ? parent2[i] : parent1[i]);
    }
    child1 = [...new Set(child1)].slice(0, CONFIG.teamSize);
    child2 = [...new Set(child2)].slice(0, CONFIG.teamSize);
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

            // console.log(`Generation ${gen + 1}: Best team [${population[0].join(', ')}] with fitness: ${calculateFitness(population[0], currentOpponent, winRateVsMap, winRateWithMap)}`);
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

    // console.log("Original Radiant Win Chance:", radiantWinChanceOriginal.toFixed(2) + "%");
    // console.log("Optimized Radiant Win Chance:", radiantWinChanceOptimized.toFixed(2) + "%");
    // console.log("Original Dire Win Chance:", direWinChanceOriginal.toFixed(2) + "%");
    // console.log("Optimized Dire Win Chance:", direWinChanceOptimized.toFixed(2) + "%");

    // console.log("Original Radiant Pick:", radiantIds.map(id => heroNameMap[id]).join(', '));
    // console.log("Optimized Radiant Pick:", optimizedRadiant.map(id => heroNameMap[id]).join(', '));
    // console.log("Original Dire Pick:", direIds.map(id => heroNameMap[id]).join(', '));
    // console.log("Optimized Dire Pick:", optimizedDire.map(id => heroNameMap[id]).join(', '));

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
