const base = import.meta.env.BASE_URL;

export default function Slide6CourtSimulator() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-navy">
      <img
        src={`${base}court-simulator.png`}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Court simulator visualization"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(13,21,36,0.75) 0%, rgba(13,21,36,0.88) 60%, rgba(13,21,36,0.97) 100%)" }} />

      <div className="relative h-full flex flex-col justify-end" style={{ paddingLeft: "7vw", paddingRight: "7vw", paddingBottom: "7vh" }}>
        <p className="font-body font-medium tracking-widest text-accent uppercase" style={{ fontSize: "1.5vw" }}>
          Feature — Court Simulator
        </p>
        <h2 className="font-display font-bold text-primary leading-tight tracking-tight mt-[2vh]" style={{ fontSize: "4.5vw", maxWidth: "60vw" }}>
          4+ adversarial rounds. The State argues back.
        </h2>

        <div className="mt-[3vh] flex gap-[2vw]">
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

        <div className="mt-[3.5vh] border-l-2 border-accent pl-[2vw]" style={{ maxWidth: "62vw" }}>
          <p className="font-display font-bold text-primary italic leading-snug" style={{ fontSize: "2.2vw" }}>
            "The AI is programmed to say No. If your argument survives it, you have something real."
          </p>
        </div>
      </div>
    </div>
  );
}
