import { Html, useProgress } from "@react-three/drei";

export const CanvasLoader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center w-64">
        {/* Animated Box Icon */}
        <div className="text-4xl animate-bounce mb-4">📦</div>

        {/* Progress Bar Container */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Percentage Text */}
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Loading Assets: {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
};
