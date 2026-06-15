const fs = require("fs");

async function updateData() {

    const apiKey = process.env.API_FOOTBALL_KEY;

    const res = await fetch(
        "https://v3.football.api-sports.io/fixtures?league=1&season=2026",
        {
            headers: {
                "x-apisports-key": apiKey
            }
        }
    );

    const apiData = await res.json();

    const localData = JSON.parse(
        fs.readFileSync("./data/wc2026.json")
    );

    apiData.response.forEach(apiMatch => {

        const home = apiMatch.teams.home.name;
        const away = apiMatch.teams.away.name;

        const match = localData.fixtures.find(
            m =>
                m.home_team === home &&
                m.away_team === away
        );

        if(match){

            match.score.home =
                apiMatch.goals.home;

            match.score.away =
                apiMatch.goals.away;

            match.status =
                apiMatch.fixture.status.short;
        }
    });

    fs.writeFileSync(
        "./data/wc2026.json",
        JSON.stringify(localData,null,2)
    );
}

updateData();
