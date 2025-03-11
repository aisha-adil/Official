const express = require('express');
const app = express();
app.use(express.json());
let wizards = [
  {
    id: 1,
    name: 'Hephaestus',
    type: 'fire',
    health: 85,
    magicEnergy: 70,
    attack: 95,
    defense: 75,
    agility: 40,
    experience: 150,
    resources: { gold: 500, potions: 2 },
    questStatus: 'pending',
    spells: { basic: ['Fireball', 'Flame Shield'], advanced: ['Inferno', 'Molten Strike'] }
  },
  {
    id: 2,
    name: 'Poseidon',
    type: 'water',
    health: 90,
    magicEnergy: 80,
    attack: 85,
    defense: 90,
    agility: 50,
    experience: 170,
    resources: { gold: 600, potions: 3 },
    questStatus: 'completed',
    spells: { basic: ['Water Blast', 'Tidal Shield'], advanced: ['Tsunami', 'Maelstrom'] }
  },
  {
    id: 3,
    name: 'Zephyros',
    type: 'storm',
    health: 75,
    magicEnergy: 80,
    attack: 80,
    defense: 60,
    agility: 95,
    experience: 130,
    resources: { gold: 700, potions: 4 },
    questStatus: 'in-progress',
    spells: { basic: ['Gust', 'Wind Wall'], advanced: ['Hurricane', 'Thunder Strike'] }
  },
  {
    id: 4,
    name: 'Athena',
    type: 'arcane',
    health: 90,
    magicEnergy: 100,
    attack: 75,
    defense: 95,
    agility: 60,
    experience: 180,
    resources: { gold: 800, potions: 5 },
    questStatus: 'completed',
    spells: { basic: ['Arcane Bolt', 'Magic Shield'], advanced: ['Mind Control', 'Arcane Storm'] }
  },
  {
    id: 5,
    name: 'Ares',
    type: 'fire',
    health: 80,
    magicEnergy: 65,
    attack: 100,
    defense: 55,
    agility: 70,
    experience: 140,
    resources: { gold: 650, potions: 3 },
    questStatus: 'in-progress',
    spells: { basic: ['Flame Sword', 'Ember Armor'], advanced: ['Hellfire', 'War Flame'] }
  },
  {
    id: 6,
    name: 'Demeter',
    type: 'nature',
    health: 92,
    magicEnergy: 85,
    attack: 70,
    defense: 80,
    agility: 55,
    experience: 150,
    resources: { gold: 550, potions: 6 },
    questStatus: 'completed',
    spells: { basic: ['Vine Whip', 'Nature Shield'], advanced: ['Earthquake', 'Overgrowth'] }
  },
  {
    id: 7,
    name: 'Hecate',
    type: 'moon',
    health: 88,
    magicEnergy: 95,
    attack: 85,
    defense: 70,
    agility: 90,
    experience: 160,
    resources: { gold: 900, potions: 7 },
    questStatus: 'in-progress',
    spells: { basic: ['Moonbeam', 'Lunar Shield'], advanced: ['Eclipse', 'Nightfall'] }
  },
  {
    id: 8,
    name: 'Hermes',
    type: 'wind',
    health: 70,
    magicEnergy: 60,
    attack: 75,
    defense: 50,
    agility: 100,
    experience: 140,
    resources: { gold: 400, potions: 2 },
    questStatus: 'pending',
    spells: { basic: ['Speed Dash', 'Wind Shield'], advanced: ['Tornado', 'Lightning Dash'] }
  }
];
const wizTypeCheck = (req, res, next) => {
  const { wiz1, wiz2 } = req.body;
  if (wiz1.type === 'fire') wiz1.attack *= 1.5;
  if (wiz2.type === 'fire') wiz2.attack *= 1.5;
  if (wiz1.type === 'water') wiz1.defense *= 1.5;
  if (wiz2.type === 'water') wiz2.defense *= 1.5;
  if (wiz1.type === 'storm') wiz1.agility *= 1.5;
  if (wiz2.type === 'storm') wiz2.agility *= 1.5;
  if (wiz1.type === 'arcane') wiz1.magicEnergy *= 1.5;
  if (wiz2.type === 'arcane') wiz2.magicEnergy *= 1.5;
  if (wiz1.type === 'nature') wiz1.health *= 1.5;
  if (wiz2.type === 'nature') wiz2.health *= 1.5;
  if (wiz1.type === 'wind') wiz1.agility *= 1.6;
  if (wiz2.type === 'wind') wiz2.agility *= 1.6;
  next();
};
const healthCheck = (req, res, next) => {
  const { wiz1, wiz2 } = req.body;
  if (wiz1.health < 20) {
    wiz1.attack *= 0.7;
    wiz1.defense *= 0.7;
  }
  if (wiz2.health < 20) {
    wiz2.attack *= 0.7;
    wiz2.defense *= 0.7;
  }
  next();
};
const magicEnergyCheck = (req, res, next) => {
  const { wiz1, wiz2 } = req.body;
  if (wiz1.magicEnergy < 30) {
    wiz1.attack *= 0.8;
    wiz1.spellType = 'basic'; 
  } 
  else {
    wiz1.spellType = 'advanced'; 
  }
  if (wiz2.magicEnergy < 30) {
    wiz2.attack *= 0.8;
    wiz2.spellType = 'basic';
  } 
  else {
    wiz2.spellType = 'advanced';
  }
  next();
};
app.post('/duel', wizTypeCheck, healthCheck, magicEnergyCheck, (req, res) => {
  const { wiz1, wiz2 } = req.body;
  const wiz1Power = wiz1.attack + wiz1.defense + wiz1.agility;
  const wiz2Power = wiz2.attack + wiz2.defense + wiz2.agility;
  let winner;
  if (wiz1Power > wiz2Power) {
    winner = wiz1.name;
    wiz1.experience += 20; 
    wiz1.resources.gold += 100;
  } else {
    winner = wiz2.name;
    wiz2.experience += 20;
    wiz2.resources.gold += 100;
  } 
  res.json({
    winner,
    wiz1Stats: { ...wiz1, spells: wiz1.spellType === 'advanced' ? wiz1.spells.advanced : wiz1.spells.basic },
    wiz2Stats: { ...wiz2, spells: wiz2.spellType === 'advanced' ? wiz2.spells.advanced : wiz2.spells.basic }
  });
});
app.put('/wizards/upgrade/:id', (req, res) => {
  const wizardId = parseInt(req.params.id);
  const { stat, value } = req.body;
  const wizard = wizards.find(w => w.id === wizardId);
  if (!wizard) return res.status(404).json({ error: 'Wizard not found' });
  if (stat === 'attack') wizard.attack += value;
  if (stat === 'defense') wizard.defense += value;
  if (stat === 'agility') wizard.agility += value;
  res.json({ message: 'Wizard upgraded', wizard });
});
app.get('/wizards/:id', (req, res) => {
    const wizardId = parseInt(req.params.id); 
    const wizard = wizards.find(w => w.id === wizardId); 
    if (!wizard) {
      return res.status(404).json({ error: 'Wizard not found' });
    }
    const { name, type, health, magicEnergy, attack, defense, agility, experience, resources, questStatus, spells } = wizard; 
    res.json({
      name,
      type,
      health,
      magicEnergy,
      attack,
      defense,
      agility,
      experience,
      resources,
      questStatus,
      spells
    });
  });
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'An internal error occurred!' });
});
app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
