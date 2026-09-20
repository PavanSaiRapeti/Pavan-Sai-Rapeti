import React, { useEffect, useState } from "react";
import staticText from "../../content/staticText.json";

/**
 * Entrance hero — brand first, one role line, one lede.
 */
export default function RealmHeroCopy({ visible }) {
  const roles = staticText.statusDisplay.roles;
  const [roleIndex, setRoleIndex] = useState(3 % roles.length);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      window.setTimeout(() => {
        setRoleIndex((i) => (i + 1) % roles.length);
        setFade(true);
      }, 220);
    }, 3200);
    return () => clearInterval(interval);
  }, [roles.length]);

  const overlay = staticText.overlay;
  const role = roles[roleIndex] ?? roles[0];

  return (
    <div
      className={`realm-hero-copy${visible ? " realm-hero-copy--visible" : ""}`}
      aria-hidden={!visible}
    >
      <div className="realm-hero-copy__veil" aria-hidden />
      <div className="realm-hero-copy__grain" aria-hidden />
      <div className="realm-hero-copy__content">
        <p className="realm-hero-copy__brand">
          <span className="realm-hero-copy__brand-first">{overlay.firstName}</span>
          <span className="realm-hero-copy__brand-last">{overlay.lastName}</span>
        </p>

        <div className="realm-hero-copy__rule" aria-hidden />

        <h1 className="realm-hero-copy__title">
          <span className="realm-hero-copy__im">
            {staticText.statusDisplay.introPrefix}
          </span>
          <span className="realm-hero-copy__role-slot" aria-live="polite">
            {/* Invisible longest line reserves height so swaps don’t reflow */}
            <span className="realm-hero-copy__role-sizer" aria-hidden>
              FULL STACK DEVELOPER
            </span>
            <span
              className={`realm-hero-copy__role${
                fade ? " realm-hero-copy__role--in" : ""
              }`}
            >
              {role}
            </span>
          </span>
        </h1>

        <p className="realm-hero-copy__lede">
          {staticText.statusDisplay.description}
        </p>

        <p className="realm-hero-copy__eyebrow">
          {staticText.statusDisplay.availabilityLabel}
        </p>
      </div>
    </div>
  );
}
