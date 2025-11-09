function MissionType(props: { title: String, missions: Array<{ relic: String, node: String, faction: String, until: any }> }): React.ReactNode {

    if (!props.missions) return (<></>)

    let count = 0;
    const missionList = props.missions.map(mission => {
        return <div className="grid grid-cols-1 py-1 border-b-1 border-stone-400 dark:border-stone-500" key={count++}>
            <div>
                <label className="prose prose-stone dark:prose-invert font-bold" >Tier: </label> <span>{mission.relic}</span>
            </div>
            <div>
                <label className="prose prose-stone dark:prose-invert font-bold">Node: </label> <span>{mission.node}</span>
            </div>
            <div>
                <label className="prose prose-stone dark:prose-invert font-bold">Faction: </label> <span>{mission.faction}</span>
            </div>
            <div>
                <label className="prose prose-stone dark:prose-invert font-bold">Expires: </label> <span>{new Date(mission.until).toLocaleTimeString()}</span>
            </div>
        </div>;
    });

    return (
        <div className="h-min bg-stone-100 dark:bg-stone-700 m-4 p-2 shadow shadow-stone-300 dark:shadow-stone-900">
            <div className="grid grid-cols-1 pb-1">
                <label className="prose prose-stone dark:prose-invert font-bold border-b-1 border-stone-400 dark:border-stone-500 pb-1">{props.title}</label>
                <div className="">{missionList}</div>
            </div>
        </div>
    )
}

export default MissionType
