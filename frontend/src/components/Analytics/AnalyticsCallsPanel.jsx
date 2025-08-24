import { useEffect, useState } from "react";
import { analyticsService } from "../../services/analyticsService";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import Loading from "../Loading/Loading";

const CARD_CLASS = "bg-white p-4 rounded-xl shadow";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const AgentStatsModal = ({ agentId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!agentId) return;
    let mounted = true;
    (async () => {
      try {
        const d = await analyticsService.getAgentStats(agentId);
        if (!mounted) return;
        setStats(d.statistics ?? d);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [agentId]);

  if (!agentId) return null;
  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg"><Loading /></div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Agent #{agentId} — statistics</h3>

        {stats ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Total Calls</div>
              <div className="font-semibold text-xl">{stats.totalCalls ?? "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Avg Duration (m)</div>
              <div className="font-semibold text-xl">{stats.avgDurationMinutes ?? stats.avgDuration ?? "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Duration (s)</div>
              <div className="font-semibold">{stats.totalDuration ?? "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Active Days</div>
              <div className="font-semibold">{stats.activeDays ?? "-"}</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-gray-500">Shortest / Longest (s)</div>
              <div className="font-semibold">
                {stats.shortestCall ?? "-"} / {stats.longestCall ?? "-"}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No stats available.</p>
        )}

        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded">Close</button>
        </div>
      </motion.div>
    </div>
  );
};

const AnalyticsCallsPanel = () => {
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState(null);
  const [durationTrend, setDurationTrend] = useState(null);
  const [topAgents, setTopAgents] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [frequentCallers, setFrequentCallers] = useState([]);
  const [agentModalId, setAgentModalId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [
          sys,
          dur,
          top,
          hour,
          freq,
        ] = await Promise.all([
          analyticsService.getCallSystemStats(),
          analyticsService.getCallDurationTrend(),
          analyticsService.getTopAgentsByVolume(),
          analyticsService.getHourlyCallDistribution(),
          analyticsService.getCallFrequencyByPhone(),
        ]);

        if (!mounted) return;

        setSystemStats(sys ?? null); // object with overview, dateRange, averages
        setDurationTrend(dur ?? { trend: [] });
        setTopAgents(top?.topAgents ?? []);
        setHourly(hour?.hourlyBreakdown ?? []);
        setFrequentCallers(freq?.frequentCallers ?? []);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || "Failed to fetch call analytics");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => (mounted = false);
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">{error}</div>;

  // prepare trend chart data
  const trendData = (durationTrend?.trend ?? []).map((r) => ({
    label: new Date(r.date).toLocaleDateString(),
    avgMinutes: Number(r.avgDurationMinutes ?? r.avgDuration) || 0,
    callCount: Number(r.callCount ?? 0),
  }));

  // hourly chart
  const hourlyData = (hourly ?? []).map((h) => ({
    hourLabel: `${h.hour}:00`,
    callCount: Number(h.callCount ?? 0),
    avgMinutes: Number(h.avgDurationMinutes ?? h.avgDuration) || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={CARD_CLASS}>
          <div className="text-sm text-gray-500">Total Calls</div>
          <div className="text-2xl font-semibold">{systemStats?.overview?.totalCalls ?? "-"}</div>
          <div className="text-xs text-gray-400 mt-1">Operational days: {systemStats?.dateRange?.operationalDays ?? "-"}</div>
        </div>

        <div className={CARD_CLASS}>
          <div className="text-sm text-gray-500">Unique Callers</div>
          <div className="text-2xl font-semibold">{systemStats?.overview?.uniquePhones ?? "-"}</div>
          <div className="text-xs text-gray-400 mt-1">Avg calls / phone: {systemStats?.averages?.callsPerPhone ?? "-"}</div>
        </div>

        <div className={CARD_CLASS}>
          <div className="text-sm text-gray-500">Active Agents</div>
          <div className="text-2xl font-semibold">{systemStats?.overview?.activeAgents ?? "-"}</div>
          <div className="text-xs text-gray-400 mt-1">Avg calls / agent: {systemStats?.averages?.callsPerAgent ?? "-"}</div>
        </div>

        <div className={CARD_CLASS}>
          <div className="text-sm text-gray-500">Avg Duration</div>
          <div className="text-2xl font-semibold">{systemStats?.overview?.avgDurationMinutes ?? "-" } m</div>
          <div className="text-xs text-gray-400 mt-1">Total hours: {systemStats?.overview?.totalDurationHours ?? "-"}</div>
        </div>
      </div>

      {/* Trend + hourly charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className={CARD_CLASS} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h4 className="font-semibold mb-3">Call Duration Trend ({durationTrend?.period ?? "period"})</h4>
          {trendData.length > 0 ? (
            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <LineChart data={trendData}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="avgMinutes" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="text-gray-500">No trend data</p>}
          <div className="text-xs text-gray-400 mt-3">Overall avg: {durationTrend?.summary?.overallAvgDurationMinutes ?? "-" } m</div>
        </motion.div>

        <motion.div className={CARD_CLASS} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h4 className="font-semibold mb-3">Hourly Distribution</h4>
          {hourlyData.length > 0 ? (
            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={hourlyData}>
                  <XAxis dataKey="hourLabel" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="callCount" radius={[6,6,0,0]} >
                    {hourlyData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.callCount === Math.max(...hourlyData.map(h=>h.callCount)) ? "#ef4444" : "#60a5fa"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="text-gray-500">No hourly data</p>}
          <div className="text-xs text-gray-400 mt-3">Peak hour: {systemStats?.dateRange ? formatDate(systemStats.dateRange.firstCall) : "-"}</div>
        </motion.div>
      </div>

      {/* Top agents + frequent callers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={CARD_CLASS}>
          <h4 className="font-semibold mb-3">Top Agents by Volume</h4>
          {topAgents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="text-left px-2 py-1">#</th>
                    <th className="text-left px-2 py-1">Agent</th>
                    <th className="text-right px-2 py-1">Calls</th>
                    <th className="text-right px-2 py-1">Avg (m)</th>
                    <th className="text-right px-2 py-1">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {topAgents.map(a => (
                    <tr key={a.agentId} className="hover:bg-gray-50 cursor-pointer" onClick={() => setAgentModalId(a.agentId)}>
                      <td className="px-2 py-2">{a.rank}</td>
                      <td className="px-2 py-2">Agent #{a.agentId}</td>
                      <td className="px-2 py-2 text-right">{a.totalCalls}</td>
                      <td className="px-2 py-2 text-right">{a.avgDurationMinutes ?? a.avgDuration ?? "-"}</td>
                      <td className="px-2 py-2 text-right">{a.totalDurationHours ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-gray-500">No top agents data</p>}
          <div className="text-xs text-gray-400 mt-3">Click an agent to see details</div>
        </div>

        <div className={CARD_CLASS}>
          <h4 className="font-semibold mb-3">Frequent Callers</h4>
          {frequentCallers.length > 0 ? (
            <div className="space-y-2">
              {frequentCallers.map((f) => (
                <div key={f.phone} className="p-3 rounded-md border bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{f.phone}</div>
                      <div className="text-xs text-gray-500">calls: {f.callCount} • avg: {f.avgDurationMinutes ?? f.avgDuration ?? "-"} m</div>
                    </div>
                    <div className="text-xs text-gray-400">{formatDate(f.lastCallDate)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500">No frequent callers</p>}
        </div>
      </div>

      {agentModalId && <AgentStatsModal agentId={agentModalId} onClose={() => setAgentModalId(null)} />}
    </div>
  );
};

export default AnalyticsCallsPanel;
