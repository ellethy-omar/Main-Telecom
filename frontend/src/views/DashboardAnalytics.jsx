import { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService'; // Adjust path if needed
import Loading from '../components/Loading/Loading';
import AnalyticsHeader from '../components/Analytics/AnalyticsHeader';
import AnalyticsCallsPanel from '../components/Analytics/AnalyticsCallsPanel';
import AnalyticsTicketsSummary from '../components/Analytics/AnalyticsTicketsSummary';
import AnalyticsCharts from '../components/Analytics/AnalyticsCharts'


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardAnalytics = () => {
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [avgResolutionTime, setAvgResolutionTime] = useState(null);
  const [statusCounts, setStatusCounts] = useState([]);
  const [ticketsPerAgent, setTicketsPerAgent] = useState([]);
  const [agingTickets, setAgingTickets] = useState([]);


  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [
          pie,
          bar,
          growth,
          avgTime,
          status,
          agentTickets,
          aging
        ] = await Promise.all([
          analyticsService.getPieChartData(),
          analyticsService.getBarChartData(),
          analyticsService.getGrowthChartData(),
          analyticsService.getAverageResoluitonTime(),
          analyticsService.getCountByStatus(),
          analyticsService.getTicketsOpenPerAgent(),
          analyticsService.getUnresolvedAging(),
        ]);

        if (Array.isArray(pie)) setPieData(pie);
        if (Array.isArray(bar)) setBarData(bar);
        if (Array.isArray(growth)) setGrowthData(growth);
        if (avgTime) setAvgResolutionTime(avgTime.averageResolutionHours);
        if (Array.isArray(status)) setStatusCounts(status);
        if (Array.isArray(agentTickets)) setTicketsPerAgent(agentTickets);
        if (Array.isArray(aging)) setAgingTickets(aging);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);


  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 space-y-8">
      <AnalyticsHeader />

      <AnalyticsCharts 
        barData={barData}
        pieData={pieData}
        growthData={growthData}
        COLORS={COLORS}/>

      <AnalyticsCallsPanel />

      <AnalyticsTicketsSummary 
        avgResolutionTime={avgResolutionTime}
        statusCounts={statusCounts}
        agingTickets={agingTickets}
        ticketsPerAgent={ticketsPerAgent}
      />
    </div>
  );
};

export default DashboardAnalytics;
