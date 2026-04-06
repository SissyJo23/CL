export default function Slide4FindingClassifier() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(160deg, #1A2336 0%, #0D1524 100%)" }}>
      <div className="absolute top-0 left-0 w-full h-[0.3vh] bg-accent opacity-20" />

      <div className="relative h-full flex" style={{ paddingTop: "7vh", paddingBottom: "7vh" }}>
        <div className="flex flex-col justify-between" style={{ paddingLeft: "7vw", width: "48vw" }}>
          <div>
            <p className="font-body font-medium tracking-widest text-accent uppercase" style={{ fontSize: "1.5vw" }}>
              Feature — Finding Classifier
            </p>
            <h2 className="font-display font-bold text-primary leading-tight tracking-tight mt-[2vh]" style={{ fontSize: "3.8vw" }}>
              Every page. Every line. Every finding.
            </h2>
            <div className="w-[5vw] h-[0.2vh] bg-accent mt-[3vh]" />
          </div>

          <div style={{ marginTop: "3vh" }}>
            <p className="font-body font-light text-primary leading-relaxed" style={{ fontSize: "1.7vw" }}>
              CaseLight audits transcripts line by line, categorizing findings by legal weight across 24 standard legal categories.
            </p>

            <div className="mt-[3vh] flex flex-wrap gap-[1vh]">
              <span className="font-body text-accent border border-accent border-opacity-30 px-[1.2vw] py-[0.6vh]" style={{ fontSize: "1.5vw" }}>Brady</span>
              <span className="font-body text-accent border border-accent border-opacity-30 px-[1.2vw] py-[0.6vh]" style={{ fontSize: "1.5vw" }}>IAC</span>
              <span className="font-body text-accent border border-accent border-opacity-30 px-[1.2vw] py-[0.6vh]" style={{ fontSize: "1.5vw" }}>4th Amendment</span>
              <span className="font-body text-accent border border-accent border-opacity-30 px-[1.2vw] py-[0.6vh]" style={{ fontSize: "1.5vw" }}>Due Process</span>
              <span className="font-body text-muted border border-muted border-opacity-20 px-[1.2vw] py-[0.6vh]" style={{ fontSize: "1.5vw" }}>+ 20 more</span>
            </div>

            <p className="font-body font-light text-muted mt-[3vh] leading-relaxed" style={{ fontSize: "1.6vw" }}>
              Thousands of pages. One prioritized dataset.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center" style={{ paddingLeft: "4vw", paddingRight: "7vw", width: "52vw" }}>
          <div className="border-l-2 border-accent border-opacity-40 h-full flex flex-col justify-center" style={{ paddingLeft: "4vw" }}>
            <div className="mb-[3vh]">
              <p className="font-body font-medium text-accent uppercase tracking-widest" style={{ fontSize: "1.5vw" }}>High Priority</p>
              <div className="mt-[1.5vh] space-y-[1.2vh]">
                <div className="flex items-center gap-[1.5vw]">
                  <div className="w-[3vw] h-[0.5vh] bg-accent" />
                  <span className="font-body text-primary" style={{ fontSize: "1.6vw" }}>Brady Material Suppression</span>
                </div>
                <div className="flex items-center gap-[1.5vw]">
                  <div className="w-[2.3vw] h-[0.5vh] bg-accent opacity-80" />
                  <span className="font-body text-primary" style={{ fontSize: "1.6vw" }}>Ineffective Assistance of Counsel</span>
                </div>
              </div>
            </div>

            <div className="mb-[3vh]">
              <p className="font-body font-medium text-muted uppercase tracking-widest" style={{ fontSize: "1.5vw" }}>Medium Priority</p>
              <div className="mt-[1.5vh] space-y-[1.2vh]">
                <div className="flex items-center gap-[1.5vw]">
                  <div className="w-[1.8vw] h-[0.4vh] bg-muted opacity-60" />
                  <span className="font-body text-muted" style={{ fontSize: "1.6vw" }}>4th Amendment Search</span>
                </div>
                <div className="flex items-center gap-[1.5vw]">
                  <div className="w-[1.4vw] h-[0.4vh] bg-muted opacity-50" />
                  <span className="font-body text-muted" style={{ fontSize: "1.6vw" }}>Prosecutorial Misconduct</span>
                </div>
              </div>
            </div>

            <div>
              <p className="font-body font-light text-muted uppercase tracking-widest opacity-50" style={{ fontSize: "1.5vw" }}>Lower Weight</p>
              <div className="mt-[1.5vh]">
                <div className="flex items-center gap-[1.5vw]">
                  <div className="w-[0.8vw] h-[0.3vh] bg-muted opacity-30" />
                  <span className="font-body text-muted opacity-50" style={{ fontSize: "1.6vw" }}>Additional findings categorized...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
