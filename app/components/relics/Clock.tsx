import { useState, useEffect } from 'react'

export default function Clock() {

    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    //begin 1 second timer, for keeping local time correct
    useEffect(() => {
        setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
    }, []);

    return (
        <div className="mx-auto w-max">
            <p id="time">Current Time: {currentTime}</p>
        </div>
    )
}
