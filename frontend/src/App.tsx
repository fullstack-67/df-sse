import { useState, useEffect } from "react";
import styles from "./styles/style.module.css";

function App() {
  const [clockEvents, setClockEvents] = useState("");
  useEffect(() => {
    const events = new EventSource("/clock");
    events.onmessage = (e: any) => {
      setClockEvents(e?.data ?? "");
    };
  }, []);
  return (
    <main className="container" style={{ padding: "1rem 0" }}>
      <h1>Server-Sent Events</h1>
      <article>
        <span className={styles.clockText}>{clockEvents}</span>
      </article>
    </main>
  );
}

export default App;
