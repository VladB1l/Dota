// algorithm.js

// === Настройки ===
const POPULATION_SIZE = 50;
const GENERATIONS = 10000;
const MUTATION_RATE = 0.2;
const FEATURES = ["kills", "assists", "deaths", "gpm", "xpm", "heroDamage", "towerDamage", "heroHealing", "numLastHits"];

const coreFeatures = FEATURES;
const supportFeatures = FEATURES;

function generateRandomWeights() {
    const weights = {};
    let total = 0;
    for (const feature of FEATURES) {
        weights[feature] = Math.random();
        total += weights[feature];
    }
    for (const feature of FEATURES) {
        weights[feature] /= total;
    }
    return weights;
}

function calculateImpact(player, weights) {
    let impact = 0;
    for (const feature of FEATURES) {
        const value = player[feature] ?? 0;
        impact += value * (weights[feature] ?? 0);
    }
    impact = Math.max(0, Math.min(impact / 1000, 1)); // нормалізація
    return Math.round(impact * 100); // у діапазоні 0-100, округлення
}

function scaleStratzImpact(imp) {
    return Math.round((imp + 100) / 2);
}

function fitness(individual, players, roleType) {
    let totalError = 0;
    for (const player of players) {
        const isSupport = player.role === "LIGHT_SUPPORT" || player.role === "HARD_SUPPORT";
        if ((roleType === "support" && !isSupport) || (roleType === "core" && isSupport)) continue;
        const predicted = calculateImpact(player, individual);
        const expected = scaleStratzImpact(player.imp);
        const error = Math.abs(predicted - expected);
        totalError += error;
    }
    return 1 / (1 + totalError);
}

function crossover(parent1, parent2) {
    const child = {};
    for (const feature of FEATURES) {
        child[feature] = Math.random() < 0.5 ? parent1[feature] : parent2[feature];
    }
    return normalizeWeights(child);
}

function mutate(individual) {
    for (const feature of FEATURES) {
        if (Math.random() < MUTATION_RATE) {
            individual[feature] += (Math.random() - 0.5) * 0.2; // +/-0.1
            individual[feature] = Math.max(0, individual[feature]);
        }
    }
    return normalizeWeights(individual);
}

function normalizeWeights(weights) {
    let total = 0;
    for (const feature of FEATURES) {
        total += weights[feature];
    }
    for (const feature of FEATURES) {
        weights[feature] /= total;
    }
    return weights;
}

function evolve(players, roleType) {
    let population = Array.from({ length: POPULATION_SIZE }, generateRandomWeights);

    for (let generation = 0; generation < GENERATIONS; generation++) {
        const evaluated = population.map(ind => ({
            weights: ind,
            fitness: fitness(ind, players, roleType)
        }));

        evaluated.sort((a, b) => b.fitness - a.fitness);
        const newPopulation = [evaluated[0].weights]; // Elitism

        while (newPopulation.length < POPULATION_SIZE) {
            const parent1 = tournamentSelection(evaluated);
            const parent2 = tournamentSelection(evaluated);
            const child = mutate(crossover(parent1.weights, parent2.weights));

            // Тест: чи усі значення імпакту в межах 0-100
            const valid = players.every(player => {
                const isSupport = player.role === "LIGHT_SUPPORT" || player.role === "HARD_SUPPORT";
                if ((roleType === "support" && !isSupport) || (roleType === "core" && isSupport)) return true;
                const predicted = calculateImpact(player, child);
                return predicted >= 0 && predicted <= 100;
            });

            if (valid) newPopulation.push(child);
        }
        population = newPopulation;
    }

    const best = population[0];
    return best;
}

function tournamentSelection(population) {
    const k = 5;
    const tournament = [];
    for (let i = 0; i < k; i++) {
        const random = population[Math.floor(Math.random() * population.length)];
        tournament.push(random);
    }
    tournament.sort((a, b) => b.fitness - a.fitness);
    return tournament[0];
}

// === Основна функція ===
function runImpactOptimization(players) {
    const coreWeights = evolve(players, "core");
    const supportWeights = evolve(players, "support");

    console.log("Core weights:", coreWeights);
    console.log("Support weights:", supportWeights);

    players.forEach(player => {
        const isSupport = player.role === "LIGHT_SUPPORT" || player.role === "HARD_SUPPORT";
        const weights = isSupport ? supportWeights : coreWeights;
        const impact = calculateImpact(player, weights);
        const scaledStratz = scaleStratzImpact(player.imp);
        console.log(`${player.steamAccount?.name || "Unknown"} - ${player.hero.displayName}: Calculated Impact = ${impact}, Scaled Stratz Impact = ${scaledStratz}`);
    });
}
