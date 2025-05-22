export default function DropletBackground({ count = 20 }: { count?: number }) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {Array.from({ length: count }).map((_, i) => {
          const size = ['w-10 h-10', 'w-14 h-14', 'w-20 h-20', 'w-25 h-25', 'w-30 h-30'][Math.floor(Math.random() * 3)];
          const color = [
            'bg-lime-500/80',
            'bg-red-500/80',
            'bg-blue-500/80',
            'bg-yellow-500/80',
            'bg-fuchsia-500/80',
            'bg-green-500/80',
            'bg-orange-500/80',
            'bg-yellow-100',
            'bg-lime-500',
            'bg-black',
            'bg-blue-400/80',
            'bg-rose-500/80',
            'bg-amber-400/80',
            'bg-purple-500/80',
            'bg-teal-400/80',
            'bg-pink-500/80',
            'bg-orange-400/80'
          ][Math.floor(Math.random() * 7)];
  
          return (
            <div
              key={i}
              className={`absolute rounded-full ${size} ${color} blur-[1px] droplet`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${-10 - Math.random() * 30}%`,
                animation: `dropletfall ${8 + Math.random() * 12}s ${Math.random() * 5}s infinite linear, wobble ${8 + Math.random() * 12}s ${Math.random() * 5}s infinite ease-in-out`,
            }}
            />
          );
        })}
      </div>
    );
  }