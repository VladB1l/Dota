// // getWeights.js

// const MATCH_IDS = [
//     8194730838, 8194450475, 8194108058, 8194041669,
//     8192640238, 8192597841, 8189992504, 8189953971,
//     8182282477, 8182230063
// ];

// const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiNjQ1YWIxMmEtYjE3MS00Y2NmLWJkM2QtZTE0MWQzODY0MzI3IiwiU3RlYW1JZCI6IjMwNzE5NzU2NiIsIm5iZiI6MTcyNjY4NzgyNCwiZXhwIjoxNzU4MjIzODI0LCJpYXQiOjE3MjY2ODc4MjQsImlzcyI6Imh0dHBzOi8vYXBpLnN0cmF0ei5jb20ifQ.M-ca7BA-MIz0sMVNLVTToCo1VpOMbIudQWmfnvdi9pU'; // Вставьте свой API-ключ

// const GRAPHQL_URL = 'https://api.stratz.com/graphql';

// async function fetchMatchData(matchId) {
//     const query = `{
//         match(id: ${matchId}) {
//             players {
//                 kills
//                 deaths
//                 assists
//                 goldPerMinute
//                 experiencePerMinute
//                 heroDamage
//                 towerDamage
//                 heroHealing
//                 numLastHits
//                 imp
//                 role
//             }
//         }
//     }`;

//     const response = await fetch(GRAPHQL_URL, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${API_KEY}`,
//         },
//         body: JSON.stringify({ query })
//     });

//     const data = await response.json();
//     return data.data.match.players;
// }

// function normalizeWeights(weights) {
//     const total = Object.values(weights).reduce((a, b) => a + b, 0);
//     for (let key in weights) weights[key] /= total;
//     return weights;
// }

// function calculateImpact(player, weights) {
//     let impact = 0;
//     for (let key in weights) {
//         impact += player[key] * weights[key];
//     }
//     return Math.max(0, Math.min(100, Math.round(impact)));
// }

// function evaluateFitness(players, weights) {
//     let totalError = 0;
//     for (const p of players) {
//         const predicted = calculateImpact(p, weights);
//         const scaledStratz = Math.round((p.imp + 100) / 2); // от -100 до 100 -> 0 до 100
//         totalError += Math.abs(predicted - scaledStratz);
//     }
//     return -totalError; // меньше ошибка — выше фитнес
// }

// function generateRandomWeights() {
//     const keys = ["kills", "deaths", "assists", "goldPerMinute", "experiencePerMinute", "heroDamage", "towerDamage", "heroHealing", "numLastHits"];
//     const weights = {};
//     for (const k of keys) weights[k] = Math.random();
//     return normalizeWeights(weights);
// }

// function crossover(parentA, parentB) {
//     const child = {};
//     for (const key in parentA) {
//         child[key] = Math.random() < 0.5 ? parentA[key] : parentB[key];
//     }
//     return normalizeWeights(child);
// }

// function mutate(weights, rate = 0.1) {
//     const mutated = { ...weights };
//     for (const key in mutated) {
//         if (Math.random() < rate) {
//             mutated[key] *= (0.9 + Math.random() * 0.2);
//         }
//     }
//     return normalizeWeights(mutated);
// }

// export async function getOptimizedWeights() {
//     const allPlayers = [];
//     for (const id of MATCH_IDS) {
//         const players = await fetchMatchData(id);
//         allPlayers.push(...players);
//     }

//     let population = Array.from({ length: 30 }, generateRandomWeights);
//     const generations = 7000;

//     for (let g = 0; g < generations; g++) {
//         population.sort((a, b) => evaluateFitness(allPlayers, b) - evaluateFitness(allPlayers, a));
//         const survivors = population.slice(0, 10);

//         const newPopulation = [...survivors];
//         while (newPopulation.length < population.length) {
//             const [a, b] = [
//                 survivors[Math.floor(Math.random() * survivors.length)],
//                 survivors[Math.floor(Math.random() * survivors.length)]
//             ];
//             let child = crossover(a, b);
//             child = mutate(child);
//             newPopulation.push(child);
//         }
//         population = newPopulation;
//     }

//     return population[0];
// }

