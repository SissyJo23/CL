export default function Slide3HowItWorks() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0D1524" }}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #1A2336 0%, #0D1524 60%)" }} />

      <div className="relative h-full flex flex-col" style={{ paddingLeft: "7vw", paddingRight: "7vw", paddingTop: "7vh", paddingBottom: "7vh" }}>
        <div className="mb-[5vh]">
          <p className="font-body font-medium tracking-widest text-accent uppercase" style={{ fontSize: "1.5vw" }}>
            How It Works
          </p>
          <h2 className="font-display font-bold text-primary leading-tight tracking-tight mt-[1.5vh]" style={{ fontSize: "4vw" }}>
            Three steps from transcript to strategy.
          </h2>
        </div>

        <div className="flex-1 flex items-center gap-[0vw]">
          <div className="flex-1 flex flex-col items-center text-center" style={{ paddingLeft: "1vw", paddingRight: "2vw" }}>
            <div className="flex items-center justify-center rounded-full border border-accent border-opacity-40" style={{ width: "6vw", height: "6vw", background: "rgba(201,168,76,0.06)" }}>
              <span className="font-display font-black text-accent" style={{ fontSize: "3vw" }}>01</span>
            </div>
            <h3 className="font-display font-bold text-primary mt-[3vh]" style={{ fontSize: "2.5vw" }}>Upload</h3>
            <div className="w-[2.5vw] h-[0.15vh] bg-accent opacity-50 mt-[1.5vh]" />
            <p className="font-body font-light text-muted mt-[2vh] leading-relaxed" style={{ fontSize: "1.6vw" }}>
              Court transcripts, trial records, and case files — any volume
            </p>
          </div>

          <div className="flex flex-col items-center self-center" style={{ marginBottom: "2vh" }}>
            <div className="w-[4vw] h-[0.15vh] bg-accent opacity-20" />
            <span className="text-accent opacity-40 mt-[0.5vh]" style={{ fontSize: "1.8vw" }}>&#9654;</span>
          </div>

          <div className="flex-1 flex flex-col items-center text-center" style={{ paddingLeft: "2vw", paddingRight: "2vw" }}>
            <div className="flex items-center justify-center rounded-full border border-accent border-opacity-40" style={{ width: "6vw", height: "6vw", background: "rgba(201,168,76,0.06)" }}>
              <span className="font-display font-black text-accent" style={{ fontSize: "3vw" }}>02</span>
            </div>
            <h3 className="font-display font-bold text-primary mt-[3vh]" style={{ fontSize: "2.5vw" }}>Analyze</h3>
            <div className="w-[2.5vw] h-[0.15vh] bg-accent opacity-50 mt-[1.5vh]" />
            <p className="font-body font-light text-muted mt-[2vh] leading-relaxed" style={{ fontSize: "1.6vw" }}>
              Line-by-line classification across 24 legal categories
            </p>
          </div>

          <div className="flex flex-col items-center self-center" style={{ marginBottom: "2vh" }}>
            <div className="w-[4vw] h-[0.15vh] bg-accent opacity-20" />
            <span className="text-accent opacity-40 mt-[0.5vh]" style={{ fontSize: "1.8vw" }}>&#9654;</span>
          </div>

          <div className="flex-1 flex flex-col items-center text-center" style={{ paddingLeft: "2vw", paddingRight: "1vw" }}>
            <div className="flex items-center justify-center rounded-full border border-accent border-opacity-40" style={{ width: "6vw", height: "6vw", background: "rgba(201,168,76,0.06)" }}>
              <span className="font-display font-black text-accent" style={{ fontSize: "3vw" }}>03</span>
            </div>
            <h3 className="font-display font-bold text-primary mt-[3vh]" style={{ fontSize: "2.5vw" }}>Simulate</h3>
            <div className="w-[2.5vw] h-[0.15vh] bg-accent opacity-50 mt-[1.5vh]" />
            <p className="font-body font-light text-muted mt-[2vh] leading-relaxed" style={{ fontSize: "1.6vw" }}>
              Adversarial court simulation with a skeptical judge
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
