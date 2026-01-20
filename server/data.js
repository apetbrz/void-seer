//:sort /[^:]*:/
const missionTitles = {
    MT_ALCHEMY: "Alchemy",
    MT_CAPTURE: "Capture",
    MT_VOID_CASCADE: "Cascade",
    MT_DEFENSE: "Defense",
    MT_ARTIFACT: "Disruption",
    MT_EXCAVATE: "Excavation",
    MT_EXTERMINATE: "Exterminate",
    MT_CORRUPTION: "Flood",
    MT_RETRIEVAL: "Hijack",
    MT_HIVE: "Hive Sabotage",
    MT_PURIFY: "Infested Salvage",
    MT_TERRITORY: "Interception",
    MT_MOBILE_DEFENSE: "Mobile Defense",
    MT_RESCUE: "Rescue",
    MT_SABOTAGE: "Sabotage",
    MT_INTEL: "Spy",
    MT_SURVIVAL: "Survival",
}

//generate the template for collecting missions from worldstate data
//looks like:
//{ capture: [], excavation: [], ... } etc.
const missionsCollectorTemplate = Object.values(missionTitles)
    .reduce(
        (a, key) => (
            { ...a, [key]: [] }
        ),
        {});

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
    //check for invalid solnodes data (deprecated since included internally
    if (!solnodes) {
        console.log("SOLNODES INVALID");
        return {};
    }

    //get info
    const nodeinfo = solnodes[node];

    //check for missing node (means data is out of date)
    if (nodeinfo === undefined) {
        console.log("SOLNODE MISSING? " + node)
        return {};
    }

    return nodeinfo;
}

//convert fissure mission in worldstate into object for rendering on UI
//returns an array with [0] = steel path boolean, [1] = mission data object
const worldstateMissionToJSON = (mission) => {
    let node = solnodeLookup(mission.Node);
    return [
        mission.Hard != null,
        {
            relic: relicTiers[mission.Modifier],
            node: node.value,
            faction: node.enemy,
            until: Number(mission.Expiry.$date.$numberLong)
        }
    ]
}

//scrape worldstate for all fissure missions and return, separating normal and steel path
const gatherFissureMissions = (missionData) => {
    //invalid data
    if (!missionData) return;
    if (!missionData.ActiveMissions) return;

    //copy from template
    //looks like:
    //{ alchemy: [], capture: [], ... } etc.
    var normal = JSON.parse(JSON.stringify(missionsCollectorTemplate));
    var steelpath = JSON.parse(JSON.stringify(missionsCollectorTemplate));

    //for each active mission,
    missionData.ActiveMissions.forEach(mission => {
        //get the name
        let missionTitle = missionTitles[mission.MissionType];

        //if nothing, its a mission we're ignoring
        if (!missionTitle) return;

        //get the data out of it
        let missionInfo = worldstateMissionToJSON(mission);

        //and push it to the correct array
        (missionInfo[0] ? steelpath : normal)[missionTitle]?.push(missionInfo[1]);
    });

    return { normal, steelpath };
}

export default gatherFissureMissions;
