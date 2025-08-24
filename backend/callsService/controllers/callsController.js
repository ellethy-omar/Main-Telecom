const Call = require('../models/Call');
const { logEndpointHit, logEndpointHitWithId } = require('../../shared/logger');

const createCall = async (req, res) => {
  logEndpointHit("createCall");
  try {
    const agentId = req.user.id;
    const { phone, callDate, summary, durationSeconds } = req.body;

    if (!phone || !agentId) {
      console.log('Invalid Parameters');
      return res.status(400).json({
        success: false,
        message: 'Phone and agentId are required fields'
      });
    }

    const callData = {
      phone,
      agentId,
      callDate: callDate || new Date(),
      summary,
      durationSeconds
    };

    const result = await Call.create(callData);

    const call = await Call.findById(result.callId);

    res.status(201).json({
      success: true,
      data: call,
      message: 'Call created successfully'
    });
    console.log("Call:", call);
  } catch (error) {
    console.error('Error in createCall:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

const getCallById = async (req, res) => {
  try {
    const { id } = req.params;

    logEndpointHitWithId("getCallById", id);

    if (!id || isNaN(id)) {
      console.log('Invalid id');
      return res.status(400).json({
        success: false,
        message: 'Valid call ID is required'
      });
    }

    const call = await Call.findById(parseInt(id));

    if (!call) {
      console.log("Call not found");
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    res.status(200).json({
      success: true,
      data: call
    });
    console.log("Call: ", call);
  } catch (error) {
    console.error('Error in getCallById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

const getCallsByPhone = async (req, res) =>  {
  try {
    logEndpointHit("getCallsByPhone");
    const { phone } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    if (!phone) {
      console.log('No phone given');
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const calls = await Call.findByPhone(phone, limit, offset);

    res.status(200).json({
      success: true,
      data: calls,
      meta: {
        limit,
        offset,
        count: calls.length
      }
    });
    console.log("calls", calls);
  } catch (error) {
    console.error('Error in getCallsByPhone:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

const getCallsForMe = async (req, res) => {
  try {
    const agentId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    logEndpointHitWithId("getCallsForMe", agentId);

    if (!agentId || isNaN(agentId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid agent ID is required'
      });
    }

    const calls = await Call.findByAgent(parseInt(agentId), limit, offset);

    res.status(200).json({
      success: true,
      data: calls,
      meta: {
        agentId: parseInt(agentId),
        limit,
        offset,
        count: calls.length
      }
    });
    console.log("calls:", calls);
  } catch (error) {
    console.error('Error in getCallsByAgent:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

const getCallsByAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    logEndpointHitWithId("getCallsByAgent", agentId);

    if (!agentId || isNaN(agentId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid agent ID is required'
      });
    }

    const calls = await Call.findByAgent(parseInt(agentId), limit, offset);

    res.status(200).json({
      success: true,
      data: calls,
      meta: {
        agentId: parseInt(agentId),
        limit,
        offset,
        count: calls.length
      }
    });
    console.log("calls:", calls);
  } catch (error) {
    console.error('Error in getCallsByAgent:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

const getCallsByDateRange = async (req, res) => {
  try {
    logEndpointHit("getCallsByDateRange");

    const { startDate, endDate } = req.query;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    if (!startDate || !endDate) {
      console.log("No Dates.");
      return res.status(400).json({
        success: false,
        message: 'Both startDate and endDate are required'
      });
    }

    // Validate date format
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.log("Invalid Dates");
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD format'
      });
    }

    const calls = await Call.findByDateRange(start, end, limit, offset);

    res.status(200).json({
      success: true,
      data: calls,
      meta: {
        startDate,
        endDate,
        limit,
        offset,
        count: calls.length
      }
    });
    console.log("calls", calls);
  } catch (error) {
    console.error('Error in getCallsByDateRange:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

const searchCallsBySummary = async (req, res) => {
  try {
    logEndpointHit("searchCallsBySummary");
    const { q: searchTerm } = req.query;
    const limit = parseInt(req.query.limit) || 50;

    if (!searchTerm || searchTerm.trim().length === 0) {
      console.log("No serachTerm");
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const calls = await Call.searchBySummary(searchTerm.trim(), limit);

    res.status(200).json({
      success: true,
      data: calls,
      meta: {
        searchTerm: searchTerm.trim(),
        limit,
        count: calls.length
      }
    });
    console.log("calls", calls);
  } catch (error) {
    console.error('Error in searchCallsBySummary:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

const updateCallSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const { summary } = req.body;
    logEndpointHitWithId("updateCallSummary", id);

    if (!id || isNaN(id)) {
      console.log("No id");
      return res.status(400).json({
        success: false,
        message: 'Valid call ID is required'
      });
    }

    if (!summary || summary.trim().length === 0) {
      console.log("No Summary");
      return res.status(400).json({
        success: false,
        message: 'Summary is required'
      });
    }

    const call = await Call.findById(id);

    if (!call) {
      return res.status(404).json({
        success: false,
        message: "Not found"
      })
    }

    const result = await Call.updateSummary(parseInt(id), summary.trim());

    res.status(200).json({
      success: true,
      data: result,
      message: 'Call summary updated successfully'
    });

    console.log("result:", result);
  } catch (error) {
    if (error.message === 'Call not found or no changes made') {
      console.log("Call not found");
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    console.error('Error in updateCallSummary:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

const getCallsWithoutSummary = async (req, res) => {
  try {
    logEndpointHit("getCallsWithoutSummary");
    const limit = parseInt(req.query.limit) || 50;

    const calls = await Call.getCallsWithoutSummary(limit);

    res.status(200).json({
      success: true,
      data: calls,
      meta: {
        limit,
        count: calls.length
      }
    });
    console.log("calls", calls);
  } catch (error) {
    console.error('Error in getCallsWithoutSummary:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

const deleteCall = async (req, res) => {
  try {
    const { id } = req.params;

    logEndpointHitWithId("deleteCall", id);

    if (!id || isNaN(id)) {
      console.log("No id");
      return res.status(400).json({
        success: false,
        message: 'Valid call ID is required'
      });
    }

    const call = await Call.findById(id);

    if (!call) {
      return res.status(404).json({
        success: false,
        message: "Not found"
      })
    }

    const result = await Call.delete((id));

    res.status(200).json({
      success: true,
      message: 'Call deleted successfully'
    });
    console.log("result:", result);
  } catch (error) {
    if (error.message === 'Call not found') {
      console.log("Call not found");
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    console.error('Error in deleteCall:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}


module.exports = {
  createCall,
  getCallById,
  getCallsByAgent,
  getCallsForMe,
  getCallsByDateRange,
  getCallsByPhone,
  searchCallsBySummary,
  getCallsWithoutSummary,
  deleteCall,
  updateCallSummary
};