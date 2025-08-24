const AnalyticsAverageResoultionTime = ({avgResolutionTime}) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Average Resolution Time</h3>
          <p className="text-2xl font-bold text-blue-600">
            {avgResolutionTime ? `${parseFloat(avgResolutionTime).toFixed(1)} hrs` : 'N/A'}
          </p>
        </div>
    );
}

export default AnalyticsAverageResoultionTime;