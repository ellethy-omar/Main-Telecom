const AlertOverlayed = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm m-4 sm:m-0 animate-slide-up transition-transform">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">Are you sure?</h2>
          <p className="text-sm text-gray-600 mt-2">{message}</p>
        </div>
        <div className="flex justify-end px-4 py-3 space-x-2 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertOverlayed;
