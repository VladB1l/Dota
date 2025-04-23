import { runImpactOptimization } from "./optimizer.js";

async function getMatchInfo() {
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiNjQ1YWIxMmEtYjE3MS00Y2NmLWJkM2QtZTE0MWQzODY0MzI3IiwiU3RlYW1JZCI6IjMwNzE5NzU2NiIsIm5iZiI6MTcyNjY4NzgyNCwiZXhwIjoxNzU4MjIzODI0LCJpYXQiOjE3MjY2ODc4MjQsImlzcyI6Imh0dHBzOi8vYXBpLnN0cmF0ei5jb20ifQ.M-ca7BA-MIz0sMVNLVTToCo1VpOMbIudQWmfnvdi9pU'; // Замени на свой актуальный ключ
    const url = `https://api.stratz.com/graphql`;
    const query = `{
        match(id: ${matchId}) {
            id
            radiantKills
            direKills
            durationSeconds
            didRadiantWin
            players {
                steamAccount {
                    name
                }
                hero {
                    id
                    displayName
                    shortName
                }
                isRadiant
                kills
                deaths
                assists
                goldPerMinute
                experiencePerMinute
                heroDamage
                towerDamage
                heroHealing
                numLastHits
                role
                imp
            }
        }
    }`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();
        renderMatch(data.data.match);
        runImpactOptimization(data.data.match.players);
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

let matchId;

function GetMatchId() {
    matchId = document.getElementById("matchId").value;
    console.log(`\n\n${matchId}`);
    getMatchInfo();
}

window.GetMatchId = GetMatchId;

function renderMatch(match) {
    document.getElementById("winner").innerText = match.didRadiantWin ? "Radiant win!" : "Dire win!";
    document.getElementById("matchDuration").innerText = `${Math.floor(match.durationSeconds / 60)}:${match.durationSeconds % 60}`;
    document.getElementById("direKills").innerText = match.direKills.reduce((sum, kills) => sum + kills, 0);
    document.getElementById("radiantKills").innerText = match.radiantKills.reduce((sum, kills) => sum + kills, 0);

    const radiantDiv = document.getElementById("radiant");
    const direDiv = document.getElementById("dire");

    radiantDiv.innerHTML = '<h3>Radiant</h3>';
    direDiv.innerHTML = '<h3>Dire</h3>';

    match.players.forEach(player => {
        const playerDiv = document.createElement("div");
        playerDiv.classList.add("player");

        const heroImg = document.createElement("img");
        heroImg.src = `https://cdn.stratz.com/images/dota2/heroes/${player.hero.shortName}_icon.png`;
        heroImg.alt = player.hero.displayName;

        const playerName = document.createElement("p");
        playerName.innerText = `${player.steamAccount?.name || "Unknown"}`;

        const playerKDA = document.createElement("div");
        playerKDA.classList.add("KDA");
        playerKDA.innerText = `${player.kills} / ${player.deaths} / ${player.assists}`;

        playerDiv.appendChild(heroImg);
        playerDiv.appendChild(playerName);
        playerDiv.appendChild(playerKDA);

        if (player.isRadiant) {
            radiantDiv.appendChild(playerDiv);
        } else {
            direDiv.appendChild(playerDiv);
        }
    });

    // Добавим секцию для оптимизированных пиков
    let resultDiv = document.getElementById("optimization-result");
    if (!resultDiv) {
        resultDiv = document.createElement("div");
        resultDiv.id = "optimization-result";
        resultDiv.style.marginTop = "30px";
        document.body.appendChild(resultDiv);
    } else {
        resultDiv.innerHTML = "";
    }
}
