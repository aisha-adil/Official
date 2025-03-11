const express = require('express');
const app = express();
app.use(express.json());
let resources = {teamMembers: 15,vehicles: 5,equipment: 17};
const animalRescueStrategies = {
    bird: { teamNeeded: 2, vehiclesNeeded: 1, equipmentNeeded: 2 },
    mammal: { teamNeeded: 4, vehiclesNeeded: 2, equipmentNeeded: 7 },
    reptile: { teamNeeded: 3, vehiclesNeeded: 1, equipmentNeeded: 3 }
};
function animalTypeCheck(req, res, next) {
    const { animalType } = req.body;
    if (!animalRescueStrategies[animalType]) {
        return res.status(400).json({ message: "Animal type not found" });
    }
    req.animalRequirements = animalRescueStrategies[animalType];
    next();
}
function sevLevelCheck(req, res, next) {
    const { severity } = req.body;
    const validSeverities = ['mild', 'moderate', 'severe'];
    if (!validSeverities.includes(severity)) {
        return res.status(400).json({ message: "Invalid severity level" });
    }
    req.severity = severity;
    next();
}
function resAvailCheck(req, res, next) {
    const { teamNeeded, vehiclesNeeded, equipmentNeeded } = req.animalRequirements;
    const severityMultiplier = req.severity === 'severe' ? 2 : 1;
    const totalTeamNeeded = teamNeeded * severityMultiplier;
    const totalVehiclesNeeded = vehiclesNeeded * severityMultiplier;
    const totalEquipmentNeeded = equipmentNeeded * severityMultiplier;
    if (resources.teamMembers < totalTeamNeeded ||
        resources.vehicles < totalVehiclesNeeded ||
        resources.equipment < totalEquipmentNeeded) {
        req.resourceStatus = "insufficient";
    } 
    else {
        req.resourceStatus = "sufficient";
    }
    next();
}
function missionOutcome(req, res, next) {
    if (req.resourceStatus === "insufficient") {
        req.outcome = "delayed";
    } 
    else {
        req.outcome = "success";
        const { teamNeeded, vehiclesNeeded, equipmentNeeded } = req.animalRequirements;
        const severitymul = req.severity === 'severe' ? 2.5 : 1;
        resources.teamMembers -= teamNeeded * severitymul;
        resources.vehicles -= vehiclesNeeded * severitymul;
        resources.equipment -= equipmentNeeded * severitymul;
    }
    next();
}
app.post('/rescue-mission', animalTypeCheck, sevLevelCheck, resAvailCheck, missionOutcome, (req, res) => {
    const { animalType, severity } = req.body;
    const { outcome } = req;
    res.json({
        message: "Rescue mission processed",
        animalType,
        severity,
        outcome
    });
});
function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json({ message: "An error occurred", error: err.message });
}
app.use(errorHandler);
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
