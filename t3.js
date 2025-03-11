const express = require('express');
const app = express();
app.use(express.json());

let players = [
    { id: 1, name: "Hero", strength: 80, agility: 60, wisdom: 70, experience: 200, resources: { gold: 500, potions: 3 }},
    { id: 2, name: "Rogue", strength: 60, agility: 90, wisdom: 50, experience: 150, resources: { gold: 300, potions: 1 }},
    { id: 3, name: "Mage", strength: 50, agility: 40, wisdom: 100, experience: 250, resources: { gold: 700, potions: 5 }}
];
function skillLevelCheck(req, res, next) {
    const { playerId } = req.body;
    const player = players.find(p => p.id === playerId);
    if (!player) {
        return res.status(404).json({ message: "Player not found" });
    }
    if (player.strength + player.agility + player.wisdom >= 200) {
        req.skillBonus = true; 
    } else {
        req.skillBonus = false;
    }
    next();
}
function expCheck(req, res, next) {
    const { playerId } = req.body;
    const player = players.find(p => p.id === playerId);
    if (!player) {
        return res.status(404).json({ message: "Player not found" });
    }
    req.experienceBonus = player.experience >= 200;
    next();
}
function resAvailCheck(req, res, next) {
    const { playerId } = req.body;
    const player = players.find(p => p.id === playerId);
    if (!player) {
        return res.status(404).json({ message: "Player not found" });
    }
    req.hasResources = player.resources.gold >= 100 && player.resources.potions > 0;
    next();
}
app.post('/complete-quest', skillLevelCheck, expCheck, resAvailCheck, (req, res) => {
    const { questDifficulty, playerId } = req.body;
    const { skillBonus, experienceBonus, hasResources } = req;
    if (!hasResources) {
        return res.status(400).json({ message: "Whoopsies! Quest failed due to lack of resources", outcome: "failure" });
    }
    let outcome = "failure";
    if (skillBonus || experienceBonus) {
        if (questDifficulty === "hard" && experienceBonus) {
            outcome = "success";
        } 
        else if (questDifficulty !== "hard") {
            outcome = "success";
        }
    }
    return res.json({ message: "Quest completion processed", outcome: outcome });
});
app.put('/players/upgrade-stats', (req, res) => {
    const { id, strength, agility, wisdom } = req.body;
    const player = players.find(p => p.id === id);
    if (!player) {
        return res.status(404).json({ message: "Player not found" });
    }
    player.strength += strength;
    player.agility += agility;
    player.wisdom += wisdom;
    return res.json({
        message: "Player stats upgraded",
        player: player
    });
});
app.get('/players', (req, res) => {
    return res.json(players);
});
function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json({ message: "An error occurred", error: err.message });
}
app.use(errorHandler);
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
