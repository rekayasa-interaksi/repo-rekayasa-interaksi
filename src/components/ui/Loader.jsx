export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse-fast"></div>
        <div
          className="w-3 h-3 bg-primary rounded-full animate-pulse-fast"
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div
          className="w-3 h-3 bg-primary rounded-full animate-pulse-fast"
          style={{ animationDelay: '0.4s' }}
        ></div>
      </div>
    </div>
  );
}