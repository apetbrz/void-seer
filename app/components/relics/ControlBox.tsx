import { useState } from "react";

function ControlBox(props: { settings: any, togglePane: Function, toggleMission: Function, toggleControlVisibility: Function }) {

    let [active, setActive]: [Boolean, Function] = useState(false);

    let toggleActive = () => {
        setActive(!active);
        props.toggleControlVisibility();
    }

    let toggleMissionCallback = (title: string, steelpath: Boolean) => {
        return () => {
            props.toggleMission(title, steelpath)
        }
    }

    let togglePaneCallback = (name: string) => {
        return () => {
            props.togglePane(name)
        }
    }

    let normalButtons = Object.keys(props.settings.missions.normal).map((missionName) => {
        return <button
            className={`px-1 h-8 ${props.settings.normal && props.settings.missions.normal[missionName] ? "bg-stone-300 dark:bg-stone-700" : "text-stone-500 dark:text-stone-500 bg-stone-200 dark:bg-stone-900"}`}
            onClick={toggleMissionCallback(missionName, false)}
            key={missionName}
            disabled={!active || !props.settings.normal}
        >{missionName}</button>
    })
    let steelpathButtons = Object.keys(props.settings.missions.steelpath).map((missionName) => {
        return <button className={`px-1 h-8 ${props.settings.steelpath && props.settings.missions.steelpath[missionName] ? "bg-stone-300 dark:bg-stone-700" : "text-stone-500 dark:text-stone-500 bg-stone-200 dark:bg-stone-900"}`}
            onClick={toggleMissionCallback(missionName, true)}
            key={"sp" + missionName}
            disabled={!active || !props.settings.steelpath}
        >{missionName}</button>
    })

    return (
        <div className="h-4 space-y-4 my-4">
            <div className="w-max mx-auto">
                <button className="bg-stone-300 dark:bg-stone-700 p-1" onClick={toggleActive}>settings</button>
            </div>
            <div className="w-auto flex flex-col space-y-2 py-4 shadow-inner shadow-stone-300 dark:shadow-stone-900 bg-stone-200 dark:bg-stone-800">
                <div className="flex items-center space-x-2 not-lg:justify-evenly mx-auto not-lg:pb-2 not-lg:border-b-1 not-lg:border-stone-400 not-lg:dark:border-stone-500">
                    <button
                        className={`prose prose-stone dark:prose-invert text-nowrap w-20 h-8 ${props.settings.normal ? "bg-stone-300 dark:bg-stone-700" : "text-stone-500 dark:text-stone-500 bg-stone-200 dark:bg-stone-900"}`}
                        onClick={togglePaneCallback("normal")}
                    >normal</button>
                    <div className="not-lg:h-28 lg:h-8 border-r-1 border-stone-400 dark:border-stone-500"></div>
                    <div className="w-max not-lg:grid not-lg:grid-cols-3 lg:flex gap-2">
                        {normalButtons}
                    </div>
                    <div className="w-20"></div>
                </div>
                <div className="flex items-center space-x-2 not-lg:justify-evenly mx-auto">
                    <button
                        className={`prose prose-stone dark:prose-invert text-nowrap w-20 h-8 ${props.settings.steelpath ? "bg-stone-300 dark:bg-stone-700" : "text-stone-500 dark:text-stone-500 bg-stone-200 dark:bg-stone-900"}`}
                        onClick={togglePaneCallback("steelpath")}
                    >steel path</button>
                    <div className="not-lg:h-28 lg:h-8 border-r-1 border-stone-400 dark:border-stone-500"></div>
                    <div className="w-max not-lg:grid not-lg:grid-cols-3 lg:flex gap-2">
                        {steelpathButtons}
                    </div>
                    <div className="w-20"></div>
                </div>
            </div>
        </div >
    )
}

function defaultSettingsFromData(data: { normal: Array<any>, steelpath: Array<any> }) {
    let missions: { normal: any, steelpath: any } = {
        normal: {},
        steelpath: {},
    };
    Object.keys(data.normal).map((missionName: string) => {
        missions.normal[missionName] = true;
    });
    Object.keys(data.steelpath).map((missionName) => {
        missions.steelpath[missionName] = true;
    });
    let settings = {
        normal: true,
        steelpath: true,
        missions: missions
    };
    return settings
}

export { ControlBox, defaultSettingsFromData }
