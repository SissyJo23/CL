export default function Slide4BeforeAfter() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #0D1524 0%, #1A2336 100%)" }}>
      <div className="absolute top-0 right-0 w-[40vw] h-full opacity-5" style={{ background: "radial-gradient(ellipse at top right, #C9A84C 0%, transparent 70%)" }} />

      <div className="relative h-full flex flex-col" style={{ paddingLeft: "7vw", paddingRight: "7vw", paddingTop: "6vh", paddingBottom: "5vh" }}>
        <div className="mb-[3vh]">
          <p className="font-body font-medium tracking-widest text-accent uppercase" style={{ fontSize: "1.5vw" }}>
            What It Does
          </p>
          <h2 className="font-display font-bold text-primary leading-tight tracking-tight mt-[1vh]" style={{ fontSize: "3.5vw" }}>
            Before. After.
          </h2>
        </div>

        <div className="flex-1 flex gap-[3vw]">
          <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
            <div className="mb-[1.5vh]">
              <span className="font-body font-medium tracking-widest text-muted uppercase" style={{ fontSize: "1.2vw" }}>
                Source Document
              </span>
              <div className="w-[3vw] h-[0.15vh] bg-accent opacity-30 mt-[0.8vh]" />
            </div>
            <div
              className="flex-1 border border-accent border-opacity-15 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)", padding: "2vw 2.5vw" }}
            >
              <p
                className="text-muted leading-loose"
                style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: "1.3vw", color: "#8A9BB5" }}
              >
                THE COURT: Mr. Reyes, do you understand<br />
                that by entering this plea you give up your<br />
                right to a jury trial?<br />
                <br />
                THE DEFENDANT: Yes.<br />
                <br />
                THE COURT: And do you understand the<br />
                charge against you?<br />
                <br />
                THE DEFENDANT: I think so.<br />
                <br />
                THE COURT: Very well. The Court finds the<br />
                plea knowing and voluntary. Plea accepted.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center" style={{ minWidth: "3vw" }}>
            <div className="w-[0.15vw] flex-1 bg-accent opacity-10" />
            <span className="text-accent opacity-40 my-[1vh]" style={{ fontSize: "2vw" }}>&#9654;</span>
            <div className="w-[0.15vw] flex-1 bg-accent opacity-10" />
          </div>

          <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
            <div className="mb-[1.5vh]">
              <span className="font-body font-medium tracking-widest text-muted uppercase" style={{ fontSize: "1.2vw" }}>
                CaseLight Output
              </span>
              <div className="w-[3vw] h-[0.15vh] bg-accent opacity-30 mt-[0.8vh]" />
            </div>
            <div className="flex-1 flex flex-col gap-[1.5vh]">
              <div className="border border-accent border-opacity-25 px-[1.5vw] py-[1.2vh]" style={{ background: "rgba(201,168,76,0.05)" }}>
                <p className="font-body font-medium text-primary" style={{ fontSize: "1.4vw" }}>
                  Incomplete advisement of maximum penalty
                </p>
                <div className="flex gap-[2vw] mt-[0.8vh]">
                  <span className="font-body text-muted" style={{ fontSize: "1.2vw" }}>Bangert / Plea Colloquy</span>
                  <span className="font-body font-medium text-accent" style={{ fontSize: "1.2vw" }}>Weight: High</span>
                </div>
              </div>
              <div className="border border-accent border-opacity-25 px-[1.5vw] py-[1.2vh]" style={{ background: "rgba(201,168,76,0.05)" }}>
                <p className="font-body font-medium text-primary" style={{ fontSize: "1.4vw" }}>
                  Security footage disclosed 7 days late
                </p>
                <div className="flex gap-[2vw] mt-[0.8vh]">
                  <span className="font-body text-muted" style={{ fontSize: "1.2vw" }}>Brady</span>
                  <span className="font-body font-medium" style={{ fontSize: "1.2vw", color: "#B8A060" }}>Weight: Moderate</span>
                </div>
              </div>
              <div className="border border-accent border-opacity-25 px-[1.5vw] py-[1.2vh]" style={{ background: "rgba(201,168,76,0.05)" }}>
                <p className="font-body font-medium text-primary" style={{ fontSize: "1.4vw" }}>
                  No advisement of immigration consequences
                </p>
                <div className="flex gap-[2vw] mt-[0.8vh]">
                  <span className="font-body text-muted" style={{ fontSize: "1.2vw" }}>Padilla</span>
                  <span className="font-body font-medium text-accent" style={{ fontSize: "1.2vw" }}>Weight: High</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[2.5vh] text-center">
          <div className="w-full h-[0.12vh] bg-accent opacity-15 mb-[2vh]" />
          <p className="font-body font-medium text-muted" style={{ fontSize: "1.6vw" }}>
            Every page. Every line. Categorized, cited, weighted.
          </p>
        </div>
      </div>
    </div>
  );
}
