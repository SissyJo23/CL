export default function Slide3Audience() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #0D1524 0%, #1A2336 100%)" }}>
      <div className="absolute top-0 right-0 w-[45vw] h-full opacity-5" style={{ background: "radial-gradient(ellipse at top right, #C9A84C 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[35vw] h-[45vh] opacity-5" style={{ background: "radial-gradient(ellipse at bottom left, #C9A84C 0%, transparent 70%)" }} />

      <div className="relative h-full flex flex-col" style={{ paddingLeft: "7vw", paddingRight: "7vw", paddingTop: "6vh", paddingBottom: "6vh" }}>
        <div className="mb-[4vh]">
          <p className="font-body font-medium tracking-widest text-accent uppercase" style={{ fontSize: "1.5vw" }}>
            Who This Is For
          </p>
          <h2 className="font-display font-bold text-primary leading-tight tracking-tight mt-[1.5vh]" style={{ fontSize: "4vw" }}>
            Everyone the system left behind.
          </h2>
          <div className="w-[5vw] h-[0.2vh] bg-accent mt-[2vh]" />
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[2.5vw]">
          <div className="border border-accent border-opacity-20 p-[2vw]" style={{ background: "rgba(201,168,76,0.04)" }}>
            <p className="font-body font-medium tracking-widest text-accent uppercase" style={{ fontSize: "1.1vw" }}>
              The Incarcerated
            </p>
            <div className="w-[2.5vw] h-[0.12vh] bg-accent opacity-40 mt-[1vh] mb-[1.5vh]" />
            <p className="font-body font-light text-primary leading-relaxed" style={{ fontSize: "1.5vw" }}>
              Pro se petitioners who need a system that reads every page of the record without being tired or afraid — built specifically to find what people miss.
            </p>
          </div>

          <div className="border border-accent border-opacity-20 p-[2vw]" style={{ background: "rgba(201,168,76,0.04)" }}>
            <p className="font-body font-medium tracking-widest text-accent uppercase" style={{ fontSize: "1.1vw" }}>
              Families &amp; Advocates
            </p>
            <div className="w-[2.5vw] h-[0.12vh] bg-accent opacity-40 mt-[1vh] mb-[1.5vh]" />
            <p className="font-body font-light text-primary leading-relaxed" style={{ fontSize: "1.5vw" }}>
              The specific language — findings, precedents, procedural arguments — to stop being dismissed by a process they were told to trust.
            </p>
          </div>

          <div className="border border-accent border-opacity-20 p-[2vw]" style={{ background: "rgba(201,168,76,0.04)" }}>
            <p className="font-body font-medium tracking-widest text-accent uppercase" style={{ fontSize: "1.1vw" }}>
              Defense Attorneys &amp; Public Defenders
            </p>
            <div className="w-[2.5vw] h-[0.12vh] bg-accent opacity-40 mt-[1vh] mb-[1.5vh]" />
            <p className="font-body font-light text-primary leading-relaxed" style={{ fontSize: "1.5vw" }}>
              A discovery pass that flags errors and maps to precedent automatically — so counsel can focus on strategy, not search.
            </p>
          </div>

          <div className="border border-accent border-opacity-20 p-[2vw]" style={{ background: "rgba(201,168,76,0.04)" }}>
            <p className="font-body font-medium tracking-widest text-accent uppercase" style={{ fontSize: "1.1vw" }}>
              Appellate &amp; Post-Conviction Counsel
            </p>
            <div className="w-[2.5vw] h-[0.12vh] bg-accent opacity-40 mt-[1vh] mb-[1.5vh]" />
            <p className="font-body font-light text-primary leading-relaxed" style={{ fontSize: "1.5vw" }}>
              AEDPA, procedural bars, exhaustion, adversarial simulation. Start at the finish line of discovery, not the starting blocks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
