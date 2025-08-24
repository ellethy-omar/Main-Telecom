const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="text-lg text-gray-700 animate-pulse">Loading, please wait...</div>
    </div>
  );
};

export default Loading;