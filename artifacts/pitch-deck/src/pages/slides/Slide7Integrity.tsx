export default function Slide7Integrity() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0D1524" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, #1A2336 0%, #0D1524 70%)" }} />
      <div className="absolute top-[0] left-[0] right-[0] h-[0.2vh] bg-accent opacity-15" />
      <div className="absolute bottom-[0] left-[0] right-[0] h-[0.2vh] bg-accent opacity-15" />
      <div className="absolute left-[7vw] top-[0] bottom-[0] w-[0.15vw] bg-accent opacity-10" />

      <div className="relative h-full flex flex-col items-center justify-center text-center" style={{ paddingLeft: "10vw", paddingRight: "10vw" }}>
        <div className="w-[4vw] h-[0.2vh] bg-accent mb-[5vh]" />
        <blockquote className="font-display font-bold text-primary leading-tight tracking-tight" style={{ fontSize: "5.5vw" }}>
          "CaseLight isn't a win button&nbsp;— it's a precision instrument."
        </blockquote>
        <div className="w-[4vw] h-[0.2vh] bg-accent mt-[5vh] mb-[4vh]" />
        <p className="font-body font-light text-muted leading-relaxed" style={{ fontSize: "1.8vw", maxWidth: "55vw" }}>
          If the case lacks merit, the app says so. That's the point.
        </p>
        <p className="font-body font-light text-muted opacity-50 mt-[2vh]" style={{ fontSize: "1.5vw" }}>
          Precision over optimism. Clarity over comfort.
        </p>
      </div>
    </div>
  );
}
