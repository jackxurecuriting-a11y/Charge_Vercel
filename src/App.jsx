import {
  ArrowDown,
  ArrowRight,
  BatteryCharging,
  ChevronDown,
  CircleHelp,
  MapPin,
  Phone,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
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
  const [supportOpen, setSupportOpen] = useState(false);

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

      <button
        aria-controls="charge-support"
        aria-expanded={supportOpen}
        className="support-fab"
        onClick={() => setSupportOpen(true)}
        type="button"
      >
        <CircleHelp size={19} /> Need help?
      </button>

      {supportOpen && (
        <aside className="support-panel" id="charge-support" aria-label="Charge support">
          <div className="support-panel-heading">
            <div>
              <p className="kicker">Charge support</p>
              <h2>Here to keep you moving.</h2>
            </div>
            <button
              aria-label="Close support panel"
              className="icon-button"
              onClick={() => setSupportOpen(false)}
              type="button"
            >
              <X size={19} />
            </button>
          </div>
          <p className="support-intro">
            The UW pilot is still being planned. These are the answers we want
            every Charge rider to have before launch.
          </p>
          <details open>
            <summary>How do I rent a Charge bank? <ChevronDown size={17} /></summary>
            <p>Walk up to a station, tap to start a rental, then take the bank that releases.</p>
          </details>
          <details>
            <summary>Where can I return it? <ChevronDown size={17} /></summary>
            <p>Return it to any Charge station. The planned UW locations are shown on the station map.</p>
          </details>
          <details>
            <summary>What if a bank does not release? <ChevronDown size={17} /></summary>
            <p>Do not pull on the station. Use the support contact listed at the station and keep your rental confirmation nearby.</p>
          </details>
          <a className="support-contact" href="tel:+12066818702">
            <Phone size={18} />
            <div>
              <strong>Call Charge UW Support</strong>
              <span>(206) 681-8702 · UW pilot questions and station help</span>
            </div>
            <ArrowRight size={18} />
          </a>
        </aside>
      )}
    </main>
  );
}
