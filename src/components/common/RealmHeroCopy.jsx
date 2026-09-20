import React, { useEffect, useState } from "react";
import staticText from "../../content/staticText.json";

/**
 * Entrance hero — neat full-screen type over the realm.
 */
export default function RealmHeroCopy({ visible }) {
  const [role, setRole] = useState(staticText.statusDisplay.roles[3]);

  useEffect(() => {
    const roles = staticText.statusDisplay.roles;
    let index = 0;
    const interval = setInterval(() => {
      setRole(roles[index]);
      index = (index + 1) % roles.length;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`realm-hero-copy${visible ? " realm-hero-copy--visible" : ""}`}
      aria-hidden={!visible}
    >
      <div className="realm-hero-copy__veil" aria-hidden />
      <div className="realm-hero-copy__content">
        <p className="realm-hero-copy__eyebrow">
          {staticText.statusDisplay.availabilityLabel}
        </p>
        <h1 className="realm-hero-copy__title">
          <span className="realm-hero-copy__im">
            {staticText.statusDisplay.introPrefix}
          </span>
          <span className="realm-hero-copy__role">{role}</span>
        </h1>
        <p className="realm-hero-copy__lede">
          {staticText.statusDisplay.description}
        </p>
      </div>
    </div>
  );
}
