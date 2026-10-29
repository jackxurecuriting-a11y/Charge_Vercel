import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  MapPin,
  Menu,
  X,
  CircleHelp,
  RotateCcw,
  CreditCard,
} from "lucide-react";
import StationLocator from "./components/StationLocator";

const faqs = [
  [
    "Can I borrow a charger today?",
    "The UW network is planned. Rentals are not available through this site yet. Pricing, payment details, and launch timing have not been announced.",
  ],
  [
    "What does this QR code do?",
    "The Charge map QR opens the location explorer. It does not start a rental or take a payment. You can browse without an account or location permission.",
  ],
  [
    "Where will I be able to return a charger?",
    "The intended experience is to return to a participating Charge station. The four buildings shown here are planned locations. Indoor placement, access hours, and available return slots are not yet confirmed.",
  ],
  [
    "The map or my location will not load.",
    "Use the searchable location list. You can find buildings without sharing your location. Directions open in Google Maps; an internet connection may be needed.",
  ],
  [
    "A charger will not release or charge.",
    "Do not force a charger out of a station. Check the connector and follow the instructions on the hardware. Use the support contact printed on that station and keep any rental reference.",
  ],
  [
    "How do I know a return is complete?",
    "Follow the station’s return instructions and look for its confirmation. This website cannot verify a physical return or end a rental. If you do not receive confirmation, use the support contact on the station.",
  ],
  [
    "I need help with a payment.",
    "Keep your receipt or rental reference and contact the support channel shown on the station or receipt. Do not send full card details. Pricing and refund terms for the UW pilot are not yet announced.",
  ],
];

function Help({ open, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    if (open) dialog.current.showModal();
    else dialog.current.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="help-dialog"
      onClose={onClose}
      aria-labelledby="help-title"
    >
      <div className="dialog-top">
        <span className="eyebrow">A little help, on the go</span>
        <button
          className="icon-button"
          aria-label="Close help"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <h2 id="help-title">Let’s keep you moving.</h2>
      <p className="muted">Answers for the planned UW pilot.</p>
      <div className="faq-list">
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
      <p className="help-note">
        For a device in your hands, use the support contact on its station or
        receipt. Support availability has not been confirmed on this site.
      </p>
    </dialog>
  );
}

export default function App() {
  const isLocator = () =>
    window.location.pathname.replace(/\/$/, "") === "/stations" ||
    window.location.hash === "#stations";
  const [locator, setLocator] = useState(isLocator);
  const [helpOpen, setHelpOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const update = () => {
      setLocator(isLocator());
      setMenuOpen(false);
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    if (locator && window.location.hash === "#stations") {
      window.history.replaceState(null, "", "/stations");
      window.scrollTo(0, 0);
    }
    document.title = locator
      ? "Find a station · Charge at UW"
      : "Charge — Your phone is dying. Your day isn’t.";
  }, [locator]);
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Charge home">
          <span className="brand-symbol">
            c<span>•</span>
          </span>
          charge<span className="brand-period">.</span>
        </a>
        <nav
          className={menuOpen ? "nav-links open" : "nav-links"}
          aria-label="Main navigation"
        >
          <a href="/stations" aria-current={locator ? "page" : undefined}>
            Find a station
          </a>
          <a href="/#how">How it works</a>
          <button
            onClick={() => {
              setHelpOpen(true);
              setMenuOpen(false);
            }}
          >
            Help
          </button>
        </nav>
        <span className="header-preview">
          <span /> UW pilot preview
        </span>
        <button
          className="menu-button icon-button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>
      <main id="content">
        {locator ? (
          <StationLocator onHelp={() => setHelpOpen(true)} />
        ) : (
          <>
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow">
                  <span className="tiny-dot" /> Portable power. University of
                  Washington.
                </p>
                <h1>
                  Your phone
                  <br />
                  is dying.
                  <br />
                  <em>Your day isn’t.</em>
                </h1>
                <p className="hero-lede">
                  Borrow a portable charger. Keep your plans.
                  <br className="desktop-break" /> Return it at a participating
                  station.
                </p>
                <div className="hero-actions">
                  <a className="button primary" href="/stations">
                    Find a station <ArrowRight size={19} />
                  </a>
                  <a className="text-link" href="#how">
                    How it works <ArrowUpRight size={17} />
                  </a>
                </div>
                <p className="launch-note">
                  <span className="status">Planned network</span> UW rentals
                  aren’t live yet. Explore what’s coming.
                </p>
              </div>
              <div className="hero-visual">
                <img
                  src="/charge-hero.webp"
                  width="800"
                  height="1000"
                  alt="Concept illustration of portable charging at a campus gathering"
                  fetchPriority="high"
                />
                <span className="photo-tag">
                  <MapPin size={15} /> Built for campus days
                </span>
                <div className="hero-caption">
                  <BatteryCharging size={25} />
                  <div>
                    <strong>Power in your pocket.</strong>
                    <span>A preview of the Charge experience</span>
                  </div>
                </div>
              </div>
            </section>
            <section className="network-teaser">
              <div>
                <p className="eyebrow">Start with your campus</p>
                <h2>
                  Four places.
                  <br />
                  <em>One less thing to worry about.</em>
                </h2>
                <p>
                  PACCAR. Dempsey. Founders. The Golf Range.
                  <br />
                  Explore the four planned locations for our UW pilot.
                </p>
                <a className="button dark" href="/stations">
                  Explore the UW map <ArrowRight size={18} />
                </a>
              </div>
              <a
                className="network-art"
                href="/stations"
                aria-label="Explore four planned UW locations"
              >
                <span className="network-ring ring-one" />
                <span className="network-ring ring-two" />
                <span className="network-center">
                  UW<span>Seattle campus</span>
                </span>
                <span className="campus-label label-one">
                  <MapPin size={16} /> PACCAR
                </span>
                <span className="campus-label label-two">
                  <MapPin size={16} /> Dempsey
                </span>
                <span className="campus-label label-three">
                  <MapPin size={16} /> Founders
                </span>
                <span className="campus-label label-four">
                  <MapPin size={16} /> Golf Range
                </span>
                <small>4 planned locations · Explore the map ↗</small>
              </a>
            </section>
            <section className="how-section" id="how">
              <div className="section-intro">
                <p className="eyebrow">The idea is simple</p>
                <h2>
                  Borrow. Charge. <em>Carry on.</em>
                </h2>
                <p>
                  The planned experience, from pickup to return. Final rental
                  instructions and pricing will be confirmed before launch.
                </p>
              </div>
              <div className="steps">
                {[
                  [
                    CreditCard,
                    "01",
                    "Borrow",
                    "Find an operating station and follow its rental instructions. Check the price before you confirm.",
                  ],
                  [
                    BatteryCharging,
                    "02",
                    "Keep moving",
                    "Take a portable charger with you. Charge while you study, meet friends, or head to class.",
                  ],
                  [
                    RotateCcw,
                    "03",
                    "Return",
                    "Find a participating station with an open slot. Follow its instructions and wait for a verified return confirmation.",
                  ],
                ].map(([Icon, n, title, body]) => (
                  <article key={n}>
                    <div className="step-top">
                      <Icon size={26} />
                      <span>{n}</span>
                    </div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </article>
                ))}
              </div>
              <details className="hardware-preview">
                <summary>
                  Take a look at the planned station <ArrowUpRight size={18} />
                </summary>
                <div>
                  <img
                    src="/charge-machine-8slot.webp"
                    loading="lazy"
                    alt="Concept image of an eight-slot Charge station"
                  />
                  <p>
                    Hardware concept preview. Station access, payment, charger
                    availability, and return confirmation will depend on the
                    installed system. No rental starts on this website.
                  </p>
                </div>
              </details>
            </section>
          </>
        )}
      </main>
      <footer>
        <a className="footer-brand" href="/">
          charge.
        </a>
        <p>
          Shared power. More possibilities.
          <span>University of Washington pilot · Planned network</span>
        </p>
        <div>
          <a href="/stations">Station map</a>
          <button onClick={() => setHelpOpen(true)}>Need help?</button>
        </div>
        <details className="print-assets">
          <summary>Print & supplier resources</summary>
          <a href="/charge-uw-stations-qr.svg" download>
            Download QR · SVG
          </a>
          <a href="/charge-uw-stations-qr.png" download>
            Download QR · PNG
          </a>
          <p>Existing map QR codes continue to work.</p>
        </details>
      </footer>
      <button
        className="help-fab"
        onClick={() => setHelpOpen(true)}
        aria-haspopup="dialog"
      >
        <CircleHelp size={18} /> Help
      </button>
      <Help open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
