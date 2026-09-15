import {
  ArrowDown,
  ArrowRight,
  BatteryCharging,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";
import ChargeMachineStory from "./components/ChargeMachineStory";
import StationLocator from "./components/StationLocator";

function Brand() {
  return (
    <a className="brand" href="#top">
      <span className="brand-mark">
        <Zap size={17} strokeWidth={2.7} />
      </span>
      CHARGE
    </a>
  );
}

export default function App() {
  return (
    <main>
      <header className="site-header">
        <Brand />
        <nav aria-label="Primary navigation">
          <a href="#how">How it works</a>
          <a href="#stations">Find a station</a>
        </nav>
        <a className="header-pill" href="#stations">
          Find a station <ArrowRight size={15} />
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> Seattle concept · UW pilot first
          </p>
          <h1>
            Your phone
            <br />
            is dying.
            <br />
            <em>Your day isn’t.</em>
          </h1>
          <p className="hero-lede">
            Charge is shared power for life on the move. Tap to rent a portable
            charger, power up as you go, and return it to a participating
            station.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#how">
              Show me how <ArrowDown size={18} />
            </a>
            <span className="concept-chip">
              <Sparkles size={15} /> Starting at UW · Built for Seattle
            </span>
          </div>
          <p className="hero-note">
            Not a live rental service yet. This page introduces the planned
            experience.
          </p>
        </div>
        <div className="hero-image">
          <img
            src="/charge-hero.webp"
            alt="Seattle students using a portable power bank station at an outdoor gathering"
          />
          <div className="image-top-card">
            <MapPin size={16} /> Seattle, Washington
          </div>
          <div className="low-battery-card">
            <div>
              <span>PHONE BATTERY</span>
              <strong>8%</strong>
            </div>
            <div className="battery-line">
              <span />
            </div>
            <p>
              <BatteryCharging size={18} /> Charge the phone. Keep the plans.
            </p>
          </div>
        </div>
      </section>

      <section className="ticker" aria-label="Charge product summary">
        <span>TAP</span>
        <Zap size={16} />
        <span>BORROW</span>
        <Zap size={16} />
        <span>CHARGE ANYWHERE</span>
        <Zap size={16} />
        <span>RETURN</span>
      </section>
      <ChargeMachineStory />
      <StationLocator />
    </main>
  );
}
