import { useState, useEffect } from "react";
import MissionType from "./MissionType.js";
import { ControlBox, defaultSettingsFromData } from "./ControlBox.js";
import Loading from "../shared/Loading.js";

let hostUrl: URL;
if (import.meta.env.DEV) hostUrl = new URL("http://localhost:3000");
else hostUrl = new URL("https://relics.apetbrz.dev");

//save settings to local storage
function saveSettings(newSettings: any) {
    localStorage.setItem("displaySettings", JSON.stringify(newSettings));
};

export default function Relics() {
    //the parsed fissure data from the cache server
    const [data, setData]: [any, any] = useState({});
    //timestamp of cache update
    const [timestamp, setTimestamp] = useState(0);
    //local user settings
    const [displaySettings, setDisplaySettings] = useState(JSON.parse(localStorage.getItem("displaySettings") || "{}"));

    //this fetches worldstate data from cache server
    const fetchAPI = async () => {
        const res = await fetch("/worldstate").then((res) => res.json());
        setTimestamp(res.timestamp);
        setData(res.wfdata);
    };

    //fetch api
    useEffect(() => {
        //CLEAR PREVIOUS SETTINGS STORAGE KEY ON INITIAL LOAD (just in case) (remove later)
        localStorage.removeItem("enabledMissions");

        fetchAPI();
        setInterval(() => {
            fetchAPI();
        }, 60 * 1000);
    }, []);

    //toggle mission visibility (used in ControlBox)
    const toggleMission = (title: any, steelpath = false) => {
        let settings = { ...displaySettings };
        let mode = steelpath ? "steelpath" : "normal";
        settings.missions[mode][title] = !displaySettings.missions[mode][title];
        setDisplaySettings(settings);
        saveSettings(settings);
    };
    //toggles visibility of normal/steelpath mode sections
    const togglePane = (name: string) => {
        let settings = { ...displaySettings };
        settings[name] = !settings[name];
        setDisplaySettings(settings);
        saveSettings(settings);
    }

    //manage sync between locally stored settings and incoming mission type data
    useEffect(() => {
        //broken data?
        if (!data?.normal) return;

        //get local storage item, or {} if not exists
        let localSettings = JSON.parse(localStorage.getItem("displaySettings") || "{}");

        //assume normal/steelpath have identical mission names
        let localMissionTypes = localSettings?.missions?.normal ? Object.keys(localSettings?.missions?.normal) : [];
        let incomingMissionTypes = Object.keys(data.normal);

        //if the two lists are not identical,
        if (
            !(incomingMissionTypes.length == localMissionTypes.length &&
                localMissionTypes.every((element, key) => element == incomingMissionTypes[key]))
        ) {
            console.log("saved settings mismatch with incoming data, reconstructing...");
            //create default settings on the new mission data
            let defaultSettings = defaultSettingsFromData(data);
            //and save
            setDisplaySettings(defaultSettings);
            saveSettings(defaultSettings);
        }
    }, [data]);

    //if data is invalid, render empty element
    if (!data?.normal || !data?.steelpath || !displaySettings.missions) return (<Loading />)
    //otherwise, valid data!
    else {
        //get mission lists from the data directly:
        let normalMissions = Object.keys(data.normal).filter((missionName) => displaySettings.missions.normal[missionName]).map((missionName) => {
            return (
                <MissionType
                    title={missionName}
                    missions={data.normal[missionName]}
                    key={missionName}
                />
            );
        });
        let spMissions = Object.keys(data.steelpath).filter((missionName) => displaySettings.missions.steelpath[missionName]).map((missionName) => {
            return (
                <MissionType
                    title={"sp " + missionName}
                    missions={data.steelpath[missionName]}
                    key={"sp" + missionName}
                />
            );
        });

        return (
            <>
                <p className="mx-auto w-max">
                    Last Worldstate Update: {new Date(timestamp).toLocaleTimeString()}
                </p>
                <ControlBox settings={displaySettings} togglePane={togglePane} toggleMission={toggleMission} />
                <div className="flex lg:gap-8 justify-between not-lg:flex-col lg:flex-row xl:mx-32 lg:mx-8 pt-4 mb-32 bg-stone-100 dark:bg-stone-800">
                    <div className={"shadow-inner shadow-stone-300 dark:shadow-stone-950 bg-stone-200 dark:bg-stone-900 grid grid-cols-3 w-[100%] h-min gap-1 sm:gap-4 p-1 sm:p-4" + (displaySettings.normal ? "" : " hidden")}>{normalMissions}</div>
                    <div className={"shadow-inner shadow-stone-300 dark:shadow-stone-950 bg-stone-200 dark:bg-stone-900 grid grid-cols-3 w-[100%] h-min gap-1 sm:gap-4 p-1 sm:p-4" + (displaySettings.steelpath ? "" : " hidden")}>{spMissions}</div>
                </div>
            </>
        );
    }
}
