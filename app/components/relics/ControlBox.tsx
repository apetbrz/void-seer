import { useState } from "react";

function ControlBox(props: { settings: any, togglePane: Function, toggleMission: Function }) {

    let [active, setActive]: [Boolean, Function] = useState(false);

    let toggleActive = () => {
        setActive(!active);
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
            className={`px-1 prose prose-stone dark:prose-invert text-nowrap h-8 shadow shadow-stone-300 dark:shadow-stone-900 bg-stone-100 dark:bg-stone-800 ${props.settings.missions.normal[missionName] && props.settings.normal ? "" : "opacity-40"}`}
            onClick={toggleMissionCallback(missionName, false)}
            key={missionName}
            disabled={!active || !props.settings.normal}
        >{missionName}</button>
    })
    let steelpathButtons = Object.keys(props.settings.missions.steelpath).map((missionName) => {
        return <button
            className={`px-1 prose prose-stone dark:prose-invert text-nowrap h-8 shadow shadow-stone-300 dark:shadow-stone-900 bg-stone-100 dark:bg-stone-800 ${props.settings.missions.steelpath[missionName] && props.settings.steelpath ? "" : "opacity-40"}`}
            onClick={toggleMissionCallback(missionName, true)}
            key={"sp" + missionName}
            disabled={!active || !props.settings.steelpath}
        >{missionName}</button>
    })

    return (
        <div className="mt-4 mb-8">
            <div className="w-max mx-auto mb-4">
                <button className="p-1" onClick={toggleActive}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div id="controls" className={"grid overflow-hidden shadow-inner shadow-stone-300 dark:shadow-stone-950 bg-stone-200 dark:bg-stone-900" + (active ? " open" : "")}>
                <style>{`
                    #controls {
                        grid-template-rows: 0fr;
                        transition: grid-template-rows 0.2s ease-in;
                    }
                    #controls.open{
                        grid-template-rows: 1fr;
                        transition: grid-template-rows 0.2s ease-out;
                    }
                `}</style>
                <div className="w-auto flex flex-col space-y-2 min-h-0">
                    <div className="mt-4 flex not-lg:flex-col lg:items-center gap-2 mx-2 lg:mx-auto not-lg:pb-2 not-lg:border-b-1 not-lg:border-stone-400 not-lg:dark:border-stone-500">
                        <button
                            className={`px-1 prose prose-stone dark:prose-invert text-nowrap min-w-30 max-w-30 h-8 shadow shadow-stone-300 dark:shadow-stone-900 bg-stone-100 dark:bg-stone-800 ${props.settings.normal ? "" : "opacity-40"}`}
                            onClick={togglePaneCallback("normal")}
                        >normal</button>
                        <div className="not-lg:hidden lg:h-8 lg:border-r-1 lg:border-stone-400 lg:dark:border-stone-500"></div>
                        <div className="flex flex-wrap shrink gap-2">
                            {normalButtons}
                        </div>
                    </div>
                    <div className="mb-4 flex not-lg:flex-col lg:items-center gap-2 mx-2 lg:mx-auto">
                        <button
                            className={`px-1 prose prose-stone dark:prose-invert text-nowrap min-w-30 max-w-30 h-8 shadow shadow-stone-300 dark:shadow-stone-900 bg-stone-100 dark:bg-stone-800 ${props.settings.steelpath ? "" : "opacity-40"}`}
                            onClick={togglePaneCallback("steelpath")}
                        >steel path</button>
                        <div className="not-lg:hidden lg:h-8 lg:border-r-1 lg:border-stone-400 lg:dark:border-stone-500"></div>
                        <div className="flex flex-wrap shrink gap-2">
                            {steelpathButtons}
                        </div>
                    </div>
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
