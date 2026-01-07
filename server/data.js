// surely theres a way to make this two-way? instead of two objs? shrug
const missionIds = {
    capture: "MT_CAPTURE",
    excavation: "MT_EXCAVATE",
    exterminate: "MT_EXTERMINATE",
    defense: "MT_DEFENSE",
    disruption: "MT_ARTIFACT",
    survival: "MT_SURVIVAL",
    rescue: "MT_RESCUE",
    cascade: "MT_VOID_CASCADE",
    flood: "MT_CORRUPTION",
    alchemy: "MT_ALCHEMY",
}

const missionTitles = {
    MT_CAPTURE: "capture",
    MT_EXCAVATE: "excavation",
    MT_EXTERMINATE: "exterminate",
    MT_DEFENSE: "defense",
    MT_ARTIFACT: "disruption",
    MT_SURVIVAL: "survival",
    MT_RESCUE: "rescue",
    MT_VOID_CASCADE: "cascade",
    MT_CORRUPTION: "flood",
    MT_ALCHEMY: "alchemy",
}

const relicTiers = {
    VoidT1: "Lith",
    VoidT2: "Meso",
    VoidT3: "Neo",
    VoidT4: "Axi",
    VoidT5: "Requiem",
    VoidT6: "Omnia"
}

import solnodes from "./solnodes.js"

//get info for mission from solnodes
const solnodeLookup = (node) => {
    if (!solnodes) {
        console.log("SOLNODES INVALID");
        return {};
    }
    const nodeinfo = solnodes[node];
    if (nodeinfo === undefined) {
        console.log("SOLNODE MISSING? " + node)
        return {};
    }
    return nodeinfo;
}

//convert fissure mission in worldstate into object for rendering on UI
const worldstateMissionToJSON = (mission) => {
    let node = solnodeLookup(mission.Node);
    return {
        relic: relicTiers[mission.Modifier],
        node: node.value,
        steelpath: mission.Hard != null,
        faction: node.enemy,
        until: Number(mission.Expiry.$date.$numberLong)
    }
}

//scrape worldstate for all fissure missions and return, separating normal and steel path
const gatherFissureMissions = (missionData) => {
    if (!missionData) return;
    if (!missionData.ActiveMissions) return;

    var normal = {
        alchemy: [],
        capture: [],
        cascade: [],
        defense: [],
        disruption: [],
        excavation: [],
        exterminate: [],
        flood: [],
        rescue: [],
        survival: [],
    };
    var steelpath = {
        alchemy: [],
        capture: [],
        cascade: [],
        defense: [],
        disruption: [],
        excavation: [],
        exterminate: [],
        flood: [],
        rescue: [],
        survival: [],
    };

    missionData.ActiveMissions.forEach(mission => {
        let missionTitle = missionTitles[mission.MissionType];
        if (missionTitle) {
            let missionInfo = worldstateMissionToJSON(mission);
            const missionObj = {
                relic: missionInfo.relic,
                node: missionInfo.node,
                faction: missionInfo.faction,
                until: missionInfo.until
            };
            (missionInfo.steelpath ? steelpath : normal)[missionTitle]?.push(missionObj);
        }
    });

    return { normal, steelpath };
}

export default gatherFissureMissions;
