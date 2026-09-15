import { useEffect, useRef, useState } from "react";
import { Check, CreditCard, LoaderCircle } from "lucide-react";

const scenes = [
  {
    label: "01 · APPROACH",
    title: "Walk up. No outlet hunt.",
    body: "A compact Charge station meets you where your day is already happening.",
  },
  {
    label: "02 · TAP",
    title: "Tap to pay.",
    body: "Hold a contactless card or phone near the reader to begin the rental.",
  },
  {
    label: "03 · AUTHORIZE",
    title: "One quick moment.",
    body: "The station confirms the rental and unlocks an available power bank.",
  },
  {
    label: "04 · GO",
    title: "Take power with you.",
    body: "Grab the released charger, plug in, and keep moving.",
  },
];

const clamp = (value) => Math.min(1, Math.max(0, value));

export default function ChargeMachineStory() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      setProgress(clamp(-rect.top / range));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const active =
    progress < 0.26 ? 0 : progress < 0.53 ? 1 : progress < 0.76 ? 2 : 3;
  const scene = scenes[active];
  const style = {
    "--story-progress": progress,
    "--hand-progress": clamp((progress - 0.18) / 0.22),
    "--load-progress": clamp((progress - 0.45) / 0.18),
    "--bank-progress": clamp((progress - 0.68) / 0.22),
  };

  return (
    <section
      className="machine-story"
      id="how"
      ref={sectionRef}
      aria-label="Interactive tap-to-pay rental demonstration"
    >
      <div className="machine-sticky" style={style}>
        <div className="story-copy" aria-live="polite">
          <p className="story-label">{scene.label}</p>
          <h2>{scene.title}</h2>
          <p>{scene.body}</p>
          <div className="story-progress" aria-hidden="true">
            {scenes.map((item, index) => (
              <span
                className={index <= active ? "active" : ""}
                key={item.label}
              />
            ))}
          </div>
          <small>Scroll to try it</small>
        </div>
        <div className="machine-stage" aria-hidden="true">
          <div className="machine-glow" />
          <img
            className="machine-product"
            src="/charge-machine-8slot.webp"
            alt=""
          />
          <div className={`machine-status status-${active}`}>
            {active === 0 && (
              <>
                <CreditCard size={21} />
                <span>READY TO TAP</span>
              </>
            )}
            {active === 1 && (
              <>
                <CreditCard size={21} />
                <span>CARD DETECTED</span>
              </>
            )}
            {active === 2 && (
              <>
                <LoaderCircle className="spin" size={21} />
                <span>AUTHORIZING</span>
              </>
            )}
            {active === 3 && (
              <>
                <Check size={21} />
                <span>CHARGER READY</span>
              </>
            )}
          </div>
          <div className="reader-pulse">
            <CreditCard size={22} />
          </div>
          <img className="tap-hand" src="/tap-hand-card.webp" alt="" />
          <div className="eject-origin">
            <span className="slot-depth" />
            <img className="ejected-bank" src="/powerbank-lime.webp" alt="" />
            <span className="slot-collar" />
            <span className="release-flash" />
          </div>
        </div>
      </div>
    </section>
  );
}
