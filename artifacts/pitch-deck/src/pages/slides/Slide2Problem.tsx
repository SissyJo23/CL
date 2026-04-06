export default function Slide2Problem() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #0D1524 0%, #1A2336 100%)" }}>
      <div className="absolute top-0 right-0 w-[40vw] h-full opacity-5" style={{ background: "radial-gradient(ellipse at top right, #C9A84C 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[30vw] h-[40vh] opacity-5" style={{ background: "radial-gradient(ellipse at bottom left, #C9A84C 0%, transparent 70%)" }} />

      <div className="relative h-full flex" style={{ paddingLeft: "7vw", paddingRight: "5vw", paddingTop: "8vh", paddingBottom: "8vh" }}>
        <div className="flex flex-col justify-between w-[42vw]">
          <div>
            <p className="font-body font-medium tracking-widest text-accent uppercase" style={{ fontSize: "1.5vw" }}>
              The Problem
            </p>
            <h2 className="font-display font-bold text-primary leading-tight tracking-tight mt-[2vh]" style={{ fontSize: "4vw" }}>
              Most arguments never reach the merits.
            </h2>
            <div className="w-[5vw] h-[0.2vh] bg-accent mt-[3vh]" />
          </div>

          <div style={{ marginTop: "3vh" }}>
            <p className="font-body font-light text-primary leading-relaxed" style={{ fontSize: "1.7vw" }}>
              Attorneys and petitioners file post-conviction motions without knowing if their arguments will survive procedural scrutiny.
            </p>
            <p className="font-body font-light text-muted mt-[2.5vh] leading-relaxed" style={{ fontSize: "1.6vw" }}>
              The result: wasted resources, lost time, and clients who deserved better.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center ml-auto w-[40vw]">
          <div className="border border-accent border-opacity-30 p-[3vw]" style={{ background: "rgba(201,168,76,0.04)" }}>
            <p className="font-display font-black text-accent leading-none tracking-tighter" style={{ fontSize: "11vw" }}>
              1 in 3
            </p>
            <p className="font-body font-medium text-primary mt-[2vh] leading-snug" style={{ fontSize: "1.7vw" }}>
              post-conviction motions dismissed on procedural grounds
            </p>
            <p className="font-body font-light text-muted mt-[1.5vh]" style={{ fontSize: "1.5vw" }}>
              before the merits are ever heard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
