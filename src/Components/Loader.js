export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fadeIn">
      {/* Pulsing dots */}
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #6473AA, #8B5CF6)',
            animation: 'dotPulse 1.4s ease-in-out infinite',
            animationDelay: '0s',
          }}
        />
        <span
          className="w-3 h-3 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #06D6A0)',
            animation: 'dotPulse 1.4s ease-in-out infinite',
            animationDelay: '0.2s',
          }}
        />
        <span
          className="w-3 h-3 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #06D6A0, #6473AA)',
            animation: 'dotPulse 1.4s ease-in-out infinite',
            animationDelay: '0.4s',
          }}
        />
      </div>
      <p className="text-sm text-richblack-300 font-medium tracking-wide">Loading...</p>
    </div>
  );
}