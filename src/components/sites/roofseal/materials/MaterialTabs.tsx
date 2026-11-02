"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./materials.module.css";

type MaterialTab = { id: string; label: string; children: ReactNode };

export function MaterialTabs({ tabs }: { tabs: MaterialTab[] }) {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const instanceId = useId();

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowDown": next = (index + 1) % tabs.length; break;
      case "ArrowUp": next = (index - 1 + tabs.length) % tabs.length; break;
      case "Home": next = 0; break;
      case "End": next = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setSelected(next);
    buttons.current[next]?.focus();
  }

  return <div className={styles.tabs}>
    <div className={styles.tabList} role="tablist" aria-label="BlueScope steel materials" aria-orientation="vertical">
      {tabs.map((tab, index) => <button
        key={tab.id}
        ref={(button) => { buttons.current[index] = button; }}
        id={`${instanceId}-tab-${tab.id}`}
        type="button"
        role="tab"
        aria-selected={selected === index}
        aria-controls={`${instanceId}-panel-${tab.id}`}
        tabIndex={selected === index ? 0 : -1}
        onClick={() => setSelected(index)}
        onKeyDown={(event) => handleKeyDown(event, index)}
      >{tab.label}<span aria-hidden="true">›</span></button>)}
    </div>
    <div className={styles.panels}>
      {tabs.map((tab, index) => <section
        key={tab.id}
        id={`${instanceId}-panel-${tab.id}`}
        role="tabpanel"
        aria-labelledby={`${instanceId}-tab-${tab.id}`}
        hidden={selected !== index}
        tabIndex={0}
        className={styles.panel}
      >{tab.children}</section>)}
    </div>
  </div>;
}
