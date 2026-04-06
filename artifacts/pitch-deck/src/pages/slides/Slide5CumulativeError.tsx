export default function Slide5CumulativeError() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0D1524" }}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0D1524 0%, #1A2336 50%, #0D1524 100%)" }} />
      <div className="absolute top-0 right-0 w-[0.2vw] h-full bg-accent opacity-10" />

      <div className="relative h-full flex" style={{ paddingTop: "7vh", paddingBottom: "7vh" }}>
        <div className="flex flex-col" style={{ paddingLeft: "7vw", paddingRight: "3vw", width: "50vw", justifyContent: "space-between" }}>
          <div>
            <p className="font-body font-medium tracking-widest text-accent uppercase" style={{ fontSize: "1.5vw" }}>
              Feature — Strategic Output
            </p>
            <h2 className="font-display font-bold text-primary leading-tight tracking-tight mt-[2vh]" style={{ fontSize: "3.8vw" }}>
              Individual errors lose. Cumulative errors win.
            </h2>
            <div className="w-[5vw] h-[0.2vh] bg-accent mt-[3vh]" />
          </div>

          <div>
            <p className="font-body font-light text-primary leading-relaxed" style={{ fontSize: "1.7vw" }}>
              CaseLight synthesizes findings into two strategic documents that no human alone could produce at this speed.
            </p>

            <div className="mt-[3.5vh]">
              <div className="flex items-start gap-[1.5vw] mb-[2.5vh]">
                <div className="flex-shrink-0 w-[0.3vw] h-[5vh] bg-accent mt-[0.5vh]" />
                <div>
                  <p className="font-body font-semibold text-primary" style={{ fontSize: "1.8vw" }}>Cumulative Error Brief</p>
                  <p className="font-body font-light text-muted mt-[0.8vh]" style={{ fontSize: "1.5vw" }}>A consolidated argument combining multiple individually-insufficient errors into a viable constitutional claim</p>
                </div>
              </div>

              <div className="flex items-start gap-[1.5vw]">
                <div className="flex-shrink-0 w-[0.3vw] h-[5vh] bg-accent opacity-50 mt-[0.5vh]" />
                <div>
                  <p className="font-body font-semibold text-primary" style={{ fontSize: "1.8vw" }}>Prioritized Strategic Roadmap</p>
                  <p className="font-body font-light text-muted mt-[0.8vh]" style={{ fontSize: "1.5vw" }}>Ranked action plan based on legal weight, jurisdiction, and procedural posture</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center" style={{ paddingRight: "7vw", width: "50vw", paddingLeft: "3vw" }}>
          <div className="w-full border border-accent border-opacity-20 p-[3vw]" style={{ background: "rgba(201,168,76,0.03)" }}>
            <div className="flex items-end justify-between gap-[2vw]">
              <div className="flex flex-col items-center">
                <div className="flex items-end gap-[0.8vw]">
                  <div className="bg-muted opacity-40" style={{ width: "3.5vw", height: "12vh" }} />
                  <div className="bg-muted opacity-40" style={{ width: "3.5vw", height: "8vh" }} />
                  <div className="bg-muted opacity-40" style={{ width: "3.5vw", height: "6vh" }} />
                </div>
                <p className="font-body text-muted mt-[1.5vh] text-center" style={{ fontSize: "1.5vw" }}>Individual errors</p>
                <p className="font-body font-semibold text-muted" style={{ fontSize: "2vw" }}>Dismissed</p>
              </div>

              <div className="text-accent font-display font-black self-center" style={{ fontSize: "3vw" }}>+</div>

              <div className="flex flex-col items-center">
                <div className="bg-accent" style={{ width: "5vw", height: "28vh" }} />
                <p className="font-body text-primary mt-[1.5vh] text-center" style={{ fontSize: "1.5vw" }}>Combined argument</p>
                <p className="font-body font-bold text-accent" style={{ fontSize: "2vw" }}>Viable</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
