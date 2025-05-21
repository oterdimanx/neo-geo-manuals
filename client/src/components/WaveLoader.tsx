export default function WaveLoader ({ text = 'Generating-Image....Please-Wait' }) {
    return (
        <div className="relative w-full h-12 overflow-hidden">
          <div className="absolute animate-scroll-left whitespace-nowrap text-indigo-600 font-bold text-4xl px-4">
            {text.split('').map((char, i) => (
              <span
                key={i}
                className="inline-block animate-wave"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      );
}