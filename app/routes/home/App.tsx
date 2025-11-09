import { Suspense } from "react";
import Relics from "~/components/relics/Relics";
import Clock from "~/components/relics/Clock";
import Loading from "~/components/relics/Loading";
import Title from "~/components/shared/Title";

function App() {
    return (
        <>
            <Title title="QuickRelics" />
            <Clock />
            <Suspense fallback={<Loading />}>
                <Relics />
            </Suspense>
        </>
    )
}

export default App
