import { Suspense } from "react";
import Relics from "~/components/relics/Relics";
import Clock from "~/components/relics/Clock";
import Loading from "~/components/shared/Loading";
import Title from "~/components/shared/Title";
import Footer from "~/components/shared/Footer";

function App() {
    return (
        <div className="min-h-full flex flex-col justify-between">
            <div>
                <Title title="Void Seer" />
                <Clock />
                <Suspense fallback={<Loading />}>
                    <Relics />
                </Suspense>
            </div>
            <Footer />
        </div>
    )
}

export default App
