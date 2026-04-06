export default function Slide8Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(160deg, #1A2336 0%, #0D1524 100%)" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.07) 0%, transparent 65%)" }} />
      <div className="absolute top-0 left-0 right-0 h-[0.25vh] bg-accent opacity-30" />

      <div className="relative h-full flex flex-col items-center justify-center text-center" style={{ paddingLeft: "7vw", paddingRight: "7vw" }}>
        <div className="w-[4vw] h-[0.2vh] bg-accent mb-[4vh]" />
        <h1 className="font-display font-black text-primary tracking-tight leading-none" style={{ fontSize: "9vw" }}>
          CaseLight
        </h1>
        <p className="font-body font-light text-muted mt-[2.5vh]" style={{ fontSize: "1.8vw" }}>
          Stop guessing how a judge will rule.
        </p>
        <div className="w-[4vw] h-[0.15vh] bg-accent opacity-50 mt-[4vh] mb-[4vh]" />
        <a
          href="https://caselight.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body font-medium text-accent underline underline-offset-4"
          style={{ fontSize: "1.7vw" }}
        >
          caselight.app
        </a>
      </div>
    </div>
  );
}
