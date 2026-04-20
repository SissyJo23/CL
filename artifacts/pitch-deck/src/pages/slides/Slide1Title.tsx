const base = import.meta.env.BASE_URL;

export default function Slide1Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-navy">
      <img
        src={`${base}courtroom-hero.png`}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Federal courtroom interior"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(13,21,36,0.95) 55%, rgba(13,21,36,0.6) 100%)" }} />
      <div className="absolute inset-0 flex flex-col justify-center" style={{ paddingLeft: "7vw", paddingTop: "6vh", paddingBottom: "6vh" }}>
        <div className="w-[6vw] h-[0.18vh] bg-accent mb-[3.5vh]" />
        <h1 className="font-display font-black tracking-tight text-primary leading-none" style={{ fontSize: "6vw" }}>
          From CaseLight
        </h1>
        <h1 className="font-display font-black tracking-tight leading-none" style={{ fontSize: "6vw", color: "#C9A84C" }}>
          to Freedom.
        </h1>
        <p className="font-body font-light text-primary mt-[3vh] leading-snug" style={{ fontSize: "2vw", maxWidth: "40vw" }}>
          AI-powered legal analysis for post-conviction cases — built for everyone the system left behind.
        </p>
        <p className="font-body font-light text-muted mt-[2vh] leading-snug" style={{ fontSize: "1.5vw", maxWidth: "42vw" }}>
          From transcript to strategy. Before you file.
        </p>
        <div className="mt-[6vh] w-[6vw] h-[0.12vh] bg-accent opacity-50" />
        <p className="font-body font-light text-muted mt-[2vh]" style={{ fontSize: "1.5vw" }}>
          Precision Legal Analysis &amp; Court Simulation
        </p>
      </div>
    </div>
  );
}
