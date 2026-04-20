export default function Slide8Traction() {
  const stats = [
    { value: "47", label: "Cases Analyzed", sub: "across proof-of-concept" },
    { value: "600+", label: "Findings Surfaced", sub: "cited & strength-rated" },
    { value: "24", label: "Legal Categories", sub: "per case, automated" },
    { value: "4", label: "Early Partners", sub: "attorneys & advocates" },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0D1524" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 20%, #1A2A40 0%, #0D1524 65%)" }} />
      <div className="absolute top-0 left-0 right-0 h-[0.2vh] bg-accent opacity-20" />
      <div className="absolute bottom-0 left-0 right-0 h-[0.2vh] bg-accent opacity-20" />

      <div className="relative h-full flex flex-col justify-center" style={{ paddingLeft: "7vw", paddingRight: "7vw" }}>
        <p className="font-body font-medium tracking-widest text-accent uppercase" style={{ fontSize: "1.4vw" }}>
          Traction &amp; Impact
        </p>
        <h2 className="font-display font-bold text-primary leading-tight tracking-tight mt-[1.5vh]" style={{ fontSize: "4.2vw", maxWidth: "65vw" }}>
          Real cases. Real findings. Real results.
        </h2>
        <div className="mt-[1.5vh] w-[5vw] h-[0.2vh] bg-accent opacity-40" />

        <div className="mt-[4vh] grid grid-cols-4 gap-[2.5vw]" style={{ maxWidth: "88vw" }}>
          {stats.map((s) => (
            <div
              key={s.label}
              className="border border-accent border-opacity-20 px-[1.8vw] py-[2.5vh] flex flex-col"
              style={{ background: "rgba(201,168,76,0.04)" }}
            >
              <span className="font-display font-bold text-accent" style={{ fontSize: "4.8vw", lineHeight: 1 }}>
                {s.value}
              </span>
              <span className="font-body font-semibold text-primary mt-[1.2vh]" style={{ fontSize: "1.4vw" }}>
                {s.label}
              </span>
              <span className="font-body font-light text-muted mt-[0.5vh]" style={{ fontSize: "1.1vw" }}>
                {s.sub}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-[4vh] flex gap-[3vw]" style={{ maxWidth: "86vw" }}>
          <div className="flex-1 border-l-2 border-accent border-opacity-40 pl-[1.8vw]">
            <p className="font-body font-semibold text-primary" style={{ fontSize: "1.4vw" }}>
              Wisconsin Pilot
            </p>
            <p className="font-body font-light text-muted mt-[0.6vh]" style={{ fontSize: "1.2vw" }}>
              Post-conviction attorneys in Wisconsin testing CaseLight on active cases — surfacing procedural errors that manual review had missed.
            </p>
          </div>
          <div className="flex-1 border-l-2 border-accent border-opacity-40 pl-[1.8vw]">
            <p className="font-body font-semibold text-primary" style={{ fontSize: "1.4vw" }}>
              Innocence Org Engagement
            </p>
            <p className="font-body font-light text-muted mt-[0.6vh]" style={{ fontSize: "1.2vw" }}>
              Advocacy organizations evaluating CaseLight as a triage tool to prioritize cases for limited pro bono representation.
            </p>
          </div>
          <div className="flex-1 border-l-2 border-accent border-opacity-40 pl-[1.8vw]">
            <p className="font-body font-semibold text-primary" style={{ fontSize: "1.4vw" }}>
              Time-to-Analysis
            </p>
            <p className="font-body font-light text-muted mt-[0.6vh]" style={{ fontSize: "1.2vw" }}>
              Complex multi-document cases analyzed in under 60 minutes — work that previously required days of paralegal review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
