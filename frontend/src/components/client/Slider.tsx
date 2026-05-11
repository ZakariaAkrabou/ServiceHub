const words = ["Vacuum", "Cleaning", "Sweeping", "Mopping", "Polishing"];

export default function MarqueeSlider() {
  const items = [...words, ...words];

  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 18s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .marquee-word {
          color: #CCCAB9;
          transition: color 0.22s ease;
        }
        .marquee-word:hover {
          color: #081D3A;
        }
      `}</style>

      <div className="overflow-hidden w-full py-6 select-none cursor-default">
        <div className="marquee-track flex w-max">
          {items.map((word, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-7 px-7 whitespace-nowrap"
              aria-hidden={i >= words.length}
            >
              <span className="marquee-word font-serif text-[clamp(28px,4vw,48px)] font-extrabold tracking-widest uppercase cursor-pointer">
                {word}
              </span>
              <span className="text-[#CCCAB9] text-xl leading-none shrink-0" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}