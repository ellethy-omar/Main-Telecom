import AnalyticsGrowthLineChart from './Constant/AnalyticsGrowthLineChart'
import AnalyticsGovernoratePieChart from './Constant/AnalyticsGovernoratePieChart';
import AnalyticsBarChart from './Constant/AnalyticsBarChart';

const AnalyticsCharts = ({ growthData, pieData, barData, COLORS }) => {

    return( 
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnalyticsGovernoratePieChart COLORS={COLORS} pieData={pieData} />
                <AnalyticsBarChart barData={barData}/>
            </div>

            {/* Growth Line Chart */}
            <AnalyticsGrowthLineChart growthData={growthData}/>
        </>
    )
}

export default AnalyticsCharts;