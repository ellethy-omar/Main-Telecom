import { authenticatedFetch } from "../utils/apiInterceptor";
const API_BASE_URL = process.env.REACT_APP_BASE_URL;

// TODO: Replace with real API call later
export const analyticsService = {
  async getPieChartData() {
    return [
      { name: 'Cairo', value: 400 },
      { name: 'Alexandria', value: 300 },
      { name: 'Giza', value: 300 },
      { name: 'Other', value: 200 },
    ];
  },

  async getBarChartData() {
    return [
      { word: 'Phone', count: 120 },
      { word: 'Laptop', count: 98 },
      { word: 'Charger', count: 86 },
      { word: 'Headset', count: 65 },
      { word: 'Camera', count: 45 },
    ];
  },

  async getGrowthChartData() {
    return [
      { month: 'Jan', users: 400 },
      { month: 'Feb', users: 800 },
      { month: 'Mar', users: 1000 },
      { month: 'Apr', users: 1500 },
      { month: 'May', users: 1800 },
      { month: 'Jun', users: 2200 },
    ];
  },

  async getCallSystemStats() {
    const API_URL = API_BASE_URL + "/calls/analytics/getSystemStats";
    try {
      const res = await authenticatedFetch(API_URL, { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch call system stats");
      const json = await res.json();
      return json.data; // { overview, dateRange, averages }
    } catch (error) {
      console.error("Call system stats fetch error:", error);
      throw error;
    }
  },

  async getCallDurationTrend() {
    const API_URL = API_BASE_URL + "/calls/analytics/getCallDurationTrend";
    try {
      const res = await authenticatedFetch(API_URL, { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch call duration trend");
      const json = await res.json();
      return json.data; // { period, summary, trend: [...] }
    } catch (error) {
      console.error("Call duration trend fetch error:", error);
      throw error;
    }
  },

  async getTopAgentsByVolume() {
    const API_URL = API_BASE_URL + "/calls/analytics/getTopAgentsByVolume";
    try {
      const res = await authenticatedFetch(API_URL, { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch top agents by volume");
      const json = await res.json();
      return json.data; // { period, meta, topAgents: [...] }
    } catch (error) {
      console.error("Top agents fetch error:", error);
      throw error;
    }
  },

  async getHourlyCallDistribution() {
    const API_URL = API_BASE_URL + "/calls/analytics/getHourlyCallDistribution";
    try {
      const res = await authenticatedFetch(API_URL, { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch hourly distribution");
      const json = await res.json();
      return json.data; // { peakHour, hourlyBreakdown: [...] }
    } catch (error) {
      console.error("Hourly distribution fetch error:", error);
      throw error;
    }
  },

  async getCallFrequencyByPhone() {
    const API_URL = API_BASE_URL + "/calls/analytics/getCallFrequencyByPhone";
    try {
      const res = await authenticatedFetch(API_URL, { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch call frequency by phone");
      const json = await res.json();
      return json.data; // { meta, frequentCallers: [...] }
    } catch (error) {
      console.error("Call frequency fetch error:", error);
      throw error;
    }
  },

  async getAgentStats(agentId) {
    const API_URL = API_BASE_URL + `/calls/analytics/getAgentStats/${agentId}`;
    try {
      const res = await authenticatedFetch(API_URL, { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch agent stats");
      const json = await res.json();
      return json.data; // { agentId, period, statistics: { ... } }
    } catch (error) {
      console.error("Agent stats fetch error:", error);
      throw error;
    }
  },

  async getAverageResoluitonTime() {
    const API_URL = API_BASE_URL + "/tickets/getAverageResolutionTime";

    try {
      const result = await authenticatedFetch(API_URL, { method: 'GET' });

      if (!result.ok) {
        throw new Error('Failed to average resolution time');
      }

      const data = await result.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error('Average resolution time fetch error:', error);
      throw error;
    }
  },

  async getCountByStatus() {
    const API_URL = API_BASE_URL + "/tickets/getCountByStatus";

    try {
      const result = await authenticatedFetch(API_URL, { method: 'GET' });

      if (!result.ok) {
        throw new Error('Failed to count by status');
      }

      const data = await result.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error('Count by status fetch error:', error);
      throw error;
    }
  },

  async getTicketsPerAgent(){
    const API_URL = API_BASE_URL + "/tickets/getTicketsPerAgent";

    try {
      const result = await authenticatedFetch(API_URL, { method: 'GET' });

      if (!result.ok) {
        throw new Error('Failed to get open tickets per agent');
      }

      const data = await result.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error('Open tickets per agent fetch error:', error);
      throw error;
    }
  },

  async getUnresolvedAging() {
    const API_URL = API_BASE_URL + "/tickets/getUnresolvedAging";

    try {
      const result = await authenticatedFetch(API_URL, { method: 'GET' });


      if (!result.ok) {
        throw new Error('Failed to get unresolved aging tickets');
      }

      const data = await result.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error('Unresolved aging tickets fetch error:', error);
      throw error;
    }
  },

  async getTicketsOpenPerAgent() {
    const API_URL = API_BASE_URL + "/tickets/getTicketsOpenPerAgent";

    try {
      const result = await authenticatedFetch(API_URL, { method: 'GET' });

      if (!result.ok) {
        throw new Error('Failed to get open tickets per agent');
      }

      const data = await result.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error('Open tickets per agent fetch error:', error);
      throw error;
    }
  }
};
