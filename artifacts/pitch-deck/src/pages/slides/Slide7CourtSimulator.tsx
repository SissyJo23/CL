const base = import.meta.env.BASE_URL;

export default function Slide7CourtSimulator() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-navy">
      <img
        src={`${base}court-simulator.png`}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Court simulator visualization"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(13,21,36,0.75) 0%, rgba(13,21,36,0.88) 60%, rgba(13,21,36,0.97) 100%)" }} />

      <div className="relative h-full flex flex-col justify-end" style={{ paddingLeft: "7vw", paddingRight: "7vw", paddingBottom: "4vh" }}>
        <p className="font-body font-medium tracking-widest text-accent uppercase" style={{ fontSize: "1.5vw" }}>
          Feature — Court Simulator
        </p>
        <h2 className="font-display font-bold text-primary leading-tight tracking-tight mt-[1.5vh]" style={{ fontSize: "4.5vw", maxWidth: "60vw" }}>
          4+ adversarial rounds. The State argues back.
        </h2>

        <div className="mt-[2vh] flex gap-[2vw]">
          <div className="border border-accent border-opacity-25 px-[1.5vw] py-[1.2vh]" style={{ background: "rgba(201,168,76,0.05)" }}>
            <p className="font-body font-medium text-primary" style={{ fontSize: "1.5vw" }}>Post-Conviction 974</p>
          </div>
          <div className="border border-accent border-opacity-25 px-[1.5vw] py-[1.2vh]" style={{ background: "rgba(201,168,76,0.05)" }}>
            <p className="font-body font-medium text-primary" style={{ fontSize: "1.5vw" }}>Direct Appeal</p>
          </div>
          <div className="border border-accent border-opacity-25 px-[1.5vw] py-[1.2vh]" style={{ background: "rgba(201,168,76,0.05)" }}>
            <p className="font-body font-medium text-primary" style={{ fontSize: "1.5vw" }}>Federal Habeas</p>
          </div>
          <div className="border border-accent border-opacity-25 px-[1.5vw] py-[1.2vh]" style={{ background: "rgba(201,168,76,0.05)" }}>
            <p className="font-body font-medium text-primary" style={{ fontSize: "1.5vw" }}>Bangert Motion</p>
          </div>
        </div>

        <div className="mt-[2.5vh] border-l-2 border-accent pl-[2vw]" style={{ maxWidth: "62vw" }}>
          <p className="font-display font-bold text-primary italic leading-snug" style={{ fontSize: "2.2vw" }}>
            "The AI is programmed to say No. If your argument survives it, you have something real."
          </p>
        </div>

        <div className="mt-[2.5vh] border border-accent border-opacity-30 px-[2vw] py-[1.8vh]" style={{ background: "rgba(201,168,76,0.04)", maxWidth: "86vw" }}>
          <p className="font-body font-medium tracking-widest text-accent uppercase mb-[1.2vh]" style={{ fontSize: "1.1vw" }}>
            Proof of Concept
          </p>
          <div className="flex gap-[4vw]">
            <div className="flex-1">
              <p className="font-body font-medium text-primary" style={{ fontSize: "1.3vw" }}>
                Test Case A — Case stacked with errors, weak evidentiary basis:
              </p>
              <p className="font-body font-medium text-accent mt-[0.5vh]" style={{ fontSize: "1.3vw" }}>
                RULING: STATE WIN — Escalona-Naranjo procedural bar applied.
              </p>
              <p className="font-body font-light text-muted mt-[0.4vh]" style={{ fontSize: "1.2vw" }}>
                "The app identified that the claims, while real, lacked the concrete evidentiary development to survive post-conviction scrutiny."
              </p>
            </div>
            <div className="w-[0.12vw] bg-accent opacity-20" />
            <div className="flex-1">
              <p className="font-body font-medium text-primary" style={{ fontSize: "1.3vw" }}>
                Test Case B — Case with documented Brady violations + Strickland deficiency:
              </p>
              <p className="font-body font-medium text-accent mt-[0.5vh]" style={{ fontSize: "1.3vw" }}>
                RULING: DEFENSE WIN — Machner hearing ordered.
              </p>
              <p className="font-body font-light text-muted mt-[0.4vh]" style={{ fontSize: "1.2vw" }}>
                "The cumulative weight of plea colloquy failures and withheld footage created a viable ineffective assistance claim."
              </p>
            </div>
          </div>
          <div className="mt-[1.2vh] border-t border-accent border-opacity-15 pt-[1vh]">
            <p className="font-body font-medium text-primary text-center" style={{ fontSize: "1.3vw" }}>
              Two cases. Two opposite outcomes. Both correct.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
