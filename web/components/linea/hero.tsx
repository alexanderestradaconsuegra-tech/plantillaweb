import { HERO_PLACEHOLDER } from "./hero-placeholder";

const IMG = "https://images.unsplash.com/photo-1719492172750-4ca0809345b8?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8Mnx8cGVyc29uJTIwcmVhZGluZyUyMG1lc3NhZ2UlMjBvbiUyMHBob25lJTIwc21pbGluZyUyMHNreXxlbnwxfDB8fHwxNzkxMjA5NTExfDA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1600&q=80";
const WIDTHS = [400, 640, 960, 1160, 1280, 1600];
const at = (w: number) => IMG.replace("w=1600", `w=${w}`);

const Wave = () => (
  <span className="m-caption__wave">
    <i />
    <i />
    <i />
    <i />
  </span>
);

const Tick = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path className="hero__tick" d="M3 8.5l3 3 7-7" />
  </svg>
);

export function Hero() {
  return (
    <section className="hero on-dark" id="hero" data-8b-section="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          srcSet={WIDTHS.map((w) => `${at(w)} ${w}w`).join(", ")}
          sizes="(max-width: 767px) 167vw, 90vw"
          style={{ background: HERO_PLACEHOLDER }}
          src={IMG}
          width={1600}
          height={1200}
          alt="A woman smiles as she reads a message on her phone under a clear blue sky"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__talk" aria-hidden="true">
        <div className="hero__draw">
          <svg className="hero__lines">
            <ellipse className="hero__arc hero__arc--a" pathLength={1} />
            <ellipse className="hero__arc hero__arc--b" pathLength={1} />
            <ellipse className="hero__flow hero__flow--a" pathLength={1} />
            <ellipse className="hero__flow hero__flow--b" pathLength={1} />
          </svg>
          <div className="hero__chip hero__chip--1">
            <p className="m-caption">
              <Wave />
              <span className="m-caption__text">Hi Mom! Are we still on for Sunday?</span>
            </p>
          </div>
          <div className="hero__chip hero__chip--2">
            <p className="m-caption">
              <Wave />
              <span className="m-caption__text">Noon works. Meet you by the lake?</span>
            </p>
          </div>
          <div className="hero__chip hero__chip--3">
            <p className="m-caption-2">
              <Wave />
              <span className="m-caption__text">Perfect. I’ll bring the good bread.</span>
            </p>
          </div>
        </div>
      </div>
      <div className="hero__copy l-wrap">
        <div className="hero__intro">
          <h1 className="m-text-2 hero__title" id="hero-title">
            Every call, written as it’s spoken.
          </h1>
          <div className="hero__lower">
            <p className="m-text-4 hero__lead">
              Linea turns the voice on the other end of the line — and the people around you — into clear live captions. Free for anyone with hearing loss.
            </p>
            <ul className="hero__proof m-text-6">
              <li>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path className="hero__star" d="M8 1.2l2 4.3 4.7.5-3.5 3.2 1 4.6L8 11.4l-4.2 2.4 1-4.6L1.3 6l4.7-.5z" />
                </svg>
                4.8 from 9,400 reviews
              </li>
              <li>
                <Tick />
                Free if you qualify
              </li>
              <li>
                <Tick />
                Private on your phone
              </li>
            </ul>
            <div className="hero__actions">
              <a className="m-btn" href="#start">
                <span className="m-btn__label">Get Linea free</span>
                <span className="m-btn__wave" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </a>
              <a className="m-link m-text-6" href="#listen">
                See how it works
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
