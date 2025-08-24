const { createPool } = require('mysql2/promise');
const DatabaseManager = require('../../shared/databaseManager');

const dbManager = new DatabaseManager(createPool);

class Call {
  constructor(data) {
    this.callId = data.callId;
    this.phone = data.phone;
    this.agentId = data.agentId;
    this.callDate = data.callDate;
    this.summary = data.summary;
    this.durationSeconds = data.durationSeconds;
  }

  static async create(callData) {
    try {
      const sql = `
        INSERT INTO calls (phone, agentId, callDate, summary, durationSeconds)
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [
        callData.phone,
        callData.agentId,
        callData.callDate,
        callData.summary || 'No Summary',
        callData.durationSeconds || 0
      ];

      const result = await dbManager.query(sql, values);
      return { 
        message: 'Call logged successfully', 
        callId: result[0].insertId 
      };
    } catch (error) {
      console.error('Error creating call:', error);
      throw error;
    }
  }

  static async findById(callId) {
    try {
      const sql = `
        SELECT callId, phone, agentId, callDate, summary, durationSeconds
        FROM calls 
        WHERE callId = ?
      `;
      const [rows] = await dbManager.query(sql, [callId]);
      
      if (rows.length === 0) {
        return null;
      }
      
      return new Call(rows[0]);
    } catch (error) {
      console.error('Error fetching call by ID:', error);
      throw error;
    }
  }

  static async findByPhone(phone, limit = 50, offset = 0) {
    try {
      const sql = `
        SELECT callId, phone, agentId, callDate, summary, durationSeconds
        FROM calls 
        WHERE phone = ?
        ORDER BY callDate DESC
        LIMIT ? OFFSET ?
      `;
      const [rows] = await dbManager.query(sql, [phone, limit, offset]);
      
      return rows.map(row => new Call(row));
    } catch (error) {
      console.error('Error fetching calls by phone:', error);
      throw error;
    }
  }

  static async findByAgent(agentId, limit = 50, offset = 0) {
    try {
      const sql = `
        SELECT 
          c.callId, 
          c.phone, 
          c.agentId, 
          c.callDate, 
          c.summary, 
          c.durationSeconds,
          ct.firstName AS contactFirstName,
          ct.lastName AS contactLastName,
          ct.email AS contactEmail,
          ct.company AS contactCompany,
          ct.position AS contactPosition,
          ct.notes AS contactNotes
        FROM calls c
        LEFT JOIN contacts ct ON c.phone = ct.phone
        WHERE c.agentId = ?
        ORDER BY c.callDate DESC
        LIMIT ? OFFSET ?
      `;
      const [rows] = await dbManager.query(sql, [agentId, limit, offset]);
      
      return rows;
    } catch (error) {
      console.error('Error fetching calls by agent:', error);
      throw error;
    }
  }

  static async findByDateRange(startDate, endDate, limit = 100, offset = 0) {
    try {
      const sql = `
        SELECT callId, phone, agentId, callDate, summary, durationSeconds
        FROM calls 
        WHERE callDate BETWEEN ? AND ?
        ORDER BY callDate DESC
        LIMIT ? OFFSET ?
      `;
      const [rows] = await dbManager.query(sql, [startDate, endDate, limit, offset]);
      
      return rows.map(row => new Call(row));
    } catch (error) {
      console.error('Error fetching calls by date range:', error);
      throw error;
    }
  }

  static async updateSummary(callId, newSummary) {
    try {
      const sql = `
        UPDATE calls 
        SET summary = ?
        WHERE callId = ?
      `;
      const result = await dbManager.query(sql, [newSummary, callId]);
      
      if (result.affectedRows === 0) {
        throw new Error('Call not found or no changes made');
      }
      
      return { 
        message: 'Summary updated successfully',
        callId: callId 
      };
    } catch (error) {
      console.error('Error updating call summary:', error);
      throw error;
    }
  }

  static async delete(callId) {
    try {
      const sql = `DELETE FROM calls WHERE callId = ?`;
      const result = await dbManager.query(sql, [callId]);
      
      if (result.affectedRows === 0) {
        throw new Error('Call not found');
      }
      
      return { message: 'Call deleted successfully' };
    } catch (error) {
      console.error('Error deleting call:', error);
      throw error;
    }
  }

  // ! ANALYTICS FUNCTIONS

  static async getAgentStats(agentId, startDate = null, endDate = null) {
    try {
      let sql = `
        SELECT 
          COUNT(*) as totalCalls,
          AVG(durationSeconds) as avgDuration,
          SUM(durationSeconds) as totalDuration,
          MIN(durationSeconds) as shortestCall,
          MAX(durationSeconds) as longestCall,
          DATE(callDate) as callDay,
          COUNT(DISTINCT DATE(callDate)) as activeDays
        FROM calls 
        WHERE agentId = ?
      `;
      
      const params = [agentId];
      
      if (startDate && endDate) {
        sql += ` AND callDate BETWEEN ? AND ?`;
        params.push(startDate, endDate);
      }
      
      sql += ` GROUP BY agentId`;
      
      const [rows] = await dbManager.query(sql, params);
      
      return rows[0] || {
        totalCalls: 0,
        avgDuration: 0,
        totalDuration: 0,
        shortestCall: 0,
        longestCall: 0,
        activeDays: 0
      };
    } catch (error) {
      console.error('Error fetching agent stats:', error);
      throw error;
    }
  }

  // Get daily call volume
  static async getDailyCallVolume(startDate, endDate) {
    try {
      const sql = `
        SELECT 
          DATE(callDate) as date,
          COUNT(*) as callCount,
          AVG(durationSeconds) as avgDuration,
          SUM(durationSeconds) as totalDuration
        FROM calls 
        WHERE callDate BETWEEN ? AND ?
        GROUP BY DATE(callDate)
        ORDER BY DATE(callDate) DESC
      `;
      
      const [rows] = await dbManager.query(sql, [startDate, endDate]);
      return rows;
    } catch (error) {
      console.error('Error fetching daily call volume:', error);
      throw error;
    }
  }

  // Get call frequency per phone number
  static async getCallFrequencyByPhone(limit = 20) {
    try {
      const sql = `
        SELECT 
          phone,
          COUNT(*) as callCount,
          AVG(durationSeconds) as avgDuration,
          MAX(callDate) as lastCallDate,
          MIN(callDate) as firstCallDate
        FROM calls 
        GROUP BY phone
        ORDER BY callCount DESC
        LIMIT ?
      `;
      
      const [rows] = await dbManager.query(sql, [limit]);
      return rows;
    } catch (error) {
      console.error('Error fetching call frequency by phone:', error);
      throw error;
    }
  }

  // Get hourly call distribution
  static async getHourlyCallDistribution(startDate = null, endDate = null) {
    try {
      let sql = `
        SELECT 
          HOUR(callDate) as hour,
          COUNT(*) as callCount,
          AVG(durationSeconds) as avgDuration
        FROM calls
      `;
      
      const params = [];
      
      if (startDate && endDate) {
        sql += ` WHERE callDate BETWEEN ? AND ?`;
        params.push(startDate, endDate);
      }
      
      sql += `
        GROUP BY HOUR(callDate)
        ORDER BY hour
      `;
      
      const [rows] = await dbManager.query(sql, params);
      return rows;
    } catch (error) {
      console.error('Error fetching hourly call distribution:', error);
      throw error;
    }
  }

  // Get top performing agents by call volume
  static async getTopAgentsByVolume(limit = 10, startDate = null, endDate = null) {
    try {
      let sql = `
        SELECT 
          agentId,
          COUNT(*) as totalCalls,
          AVG(durationSeconds) as avgDuration,
          SUM(durationSeconds) as totalDuration
        FROM calls
      `;
      
      const params = [];
      
      if (startDate && endDate) {
        sql += ` WHERE callDate BETWEEN ? AND ?`;
        params.push(startDate, endDate);
      }
      
      sql += `
        GROUP BY agentId
        ORDER BY totalCalls DESC
        LIMIT ?
      `;
      
      params.push(limit);
      
      const [rows] = await dbManager.query(sql, params);
      return rows;
    } catch (error) {
      console.error('Error fetching top agents by volume:', error);
      throw error;
    }
  }

  // Get average call duration trend over time
  static async getCallDurationTrend(days = 30) {
    try {
      const sql = `
        SELECT 
          DATE(callDate) as date,
          AVG(durationSeconds) as avgDuration,
          COUNT(*) as callCount
        FROM calls 
        WHERE callDate >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(callDate)
        ORDER BY DATE(callDate) DESC
      `;
      
      const [rows] = await dbManager.query(sql, [days]);
      return rows;
    } catch (error) {
      console.error('Error fetching call duration trend:', error);
      throw error;
    }
  }

  // Search calls by summary content
  static async searchBySummary(searchTerm, limit = 50) {
    try {
      const sql = `
        SELECT callId, phone, agentId, callDate, summary, durationSeconds
        FROM calls 
        WHERE summary LIKE ?
        ORDER BY callDate DESC
        LIMIT ?
      `;
      
      const [rows] = await dbManager.query(sql, [`%${searchTerm}%`, limit]);
      return rows.map(row => new Call(row));
    } catch (error) {
      console.error('Error searching calls by summary:', error);
      throw error;
    }
  }

  static async getCallsWithoutSummary(limit = 50) {
    try {
      const sql = `
        SELECT callId, phone, agentId, callDate, durationSeconds
        FROM calls 
        WHERE summary IS NULL OR summary = '' OR summary = 'No Summary'
        ORDER BY callDate DESC
        LIMIT ?
      `;
      
      const [rows] = await dbManager.query(sql, [limit]);
      return rows.map(row => new Call({ ...row, summary: 'No Summary' }));
    } catch (error) {
      console.error('Error fetching calls without summary:', error);
      throw error;
    }
  }

  // Get total system statistics
  static async getSystemStats() {
    try {
      const sql = `
        SELECT 
          COUNT(*) as totalCalls,
          COUNT(DISTINCT phone) as uniquePhones,
          COUNT(DISTINCT agentId) as activeAgents,
          AVG(durationSeconds) as avgDuration,
          SUM(durationSeconds) as totalDuration,
          MAX(callDate) as lastCallDate,
          MIN(callDate) as firstCallDate
        FROM calls
      `;
      
      const [rows] = await dbManager.query(sql);
      return rows[0];
    } catch (error) {
      console.error('Error fetching system stats:', error);
      throw error;
    }
  }
}

module.exports = Call;