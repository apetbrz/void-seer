import { Suspense } from "react";
import Relics from "~/components/relics/Relics";
import Clock from "~/components/relics/Clock";
import Loading from "~/components/shared/Loading";
import Title from "~/components/shared/Title";
import Footer from "~/components/shared/Footer";

function App() {
    return (
        <>
            <Title title="Void Seer" />
            <Clock />
            <Suspense fallback={<Loading />}>
                <Relics />
            </Suspense>
            <Footer />
        </>
    )
}

export default App
