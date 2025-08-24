const Call = require('../models/Call');
const { logEndpointHit, logEndpointHitWithId } = require('../../shared/logger');

const getAgentStats = async (req, res) => {
    try {
        const { agentId } = req.params;
        const { startDate, endDate } = req.query;

        logEndpointHitWithId("getAgentStats", agentId);

        if (!agentId || isNaN(agentId)) {
            console.log("Invalid agentId");
            return res.status(400).json({
                success: false,
                message: 'Valid agent ID is required'
            });
        }

        let start = null, end = null;
        
        if (startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.log("Invalid date format");
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD format'
            });
        }
        }

        const stats = await Call.getAgentStats(parseInt(agentId), start, end);

        res.status(200).json({
            success: true,
            data: {
                agentId: parseInt(agentId),
                period: startDate && endDate ? { startDate, endDate } : 'all-time',
                statistics: {
                ...stats,
                avgDuration: parseFloat(stats.avgDuration).toFixed(2),
                avgDurationMinutes: (parseFloat(stats.avgDuration) / 60).toFixed(2)
                }
            }
        });

        console.log("Stats:", stats);
    } catch (error) {
        console.error('Error in getAgentStats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

const getDailyCallVolume = async (req, res) => {
    try {
        logEndpointHit("getDailyCallVolume");
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Both startDate and endDate are required'
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD format'
            });
        }

        const dailyVolume = await Call.getDailyCallVolume(start, end);

        const totalCalls = dailyVolume.reduce((sum, day) => sum + day.callCount, 0);
        const avgCallsPerDay = dailyVolume.length > 0 ? (totalCalls / dailyVolume.length).toFixed(2) : 0;

        res.status(200).json({
            success: true,
            data: {
                period: { startDate, endDate },
                summary: {
                totalCalls,
                totalDays: dailyVolume.length,
                avgCallsPerDay: parseFloat(avgCallsPerDay)
                },
                dailyBreakdown: dailyVolume.map(day => ({
                ...day,
                avgDuration: parseFloat(day.avgDuration).toFixed(2),
                avgDurationMinutes: (parseFloat(day.avgDuration) / 60).toFixed(2)
                }))
            }
        });
    } catch (error) {
        console.error('Error in getDailyCallVolume:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

const getCallFrequencyByPhone = async (req, res) => {
    try {
        logEndpointHit("getCallFrequencyByPhone");

        const limit = parseInt(req.query.limit) || 20;

        if (limit > 100) {
            console.log("Max limit is 100");
            return res.status(400).json({
                success: false,
                message: 'Limit cannot exceed 100'
            });
        }

        const phoneFrequency = await Call.getCallFrequencyByPhone(limit);

        res.status(200).json({
            success: true,
            data: {
                meta: {
                limit,
                count: phoneFrequency.length
                },
                frequentCallers: phoneFrequency.map(caller => ({
                ...caller,
                avgDuration: parseFloat(caller.avgDuration).toFixed(2),
                avgDurationMinutes: (parseFloat(caller.avgDuration) / 60).toFixed(2)
                }))
            }
        });
    } catch (error) {
        console.error('Error in getCallFrequencyByPhone:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

const getHourlyCallDistribution = async (req, res) => {
    try {
        logEndpointHit("getHourlyCallDistribution");

        const { startDate, endDate } = req.query;

        let start = null, end = null;
        
        if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                console.log("Invalid date format");
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format. Use YYYY-MM-DD format'
                });
            }
        }

        const hourlyDistribution = await Call.getHourlyCallDistribution(start, end);

        // Find peak hours
        const peakHour = hourlyDistribution.reduce((max, hour) => 
            hour.callCount > max.callCount ? hour : max, 
            { callCount: 0, hour: 0 }
        );

        res.status(200).json({
            success: true,
            data: {
                period: startDate && endDate ? { startDate, endDate } : 'all-time',
                peakHour: {
                hour: peakHour.hour,
                callCount: peakHour.callCount,
                timeRange: `${peakHour.hour}:00 - ${peakHour.hour + 1}:00`
                },
                hourlyBreakdown: hourlyDistribution.map(hour => ({
                ...hour,
                timeRange: `${hour.hour}:00 - ${hour.hour + 1}:00`,
                avgDuration: parseFloat(hour.avgDuration).toFixed(2),
                avgDurationMinutes: (parseFloat(hour.avgDuration) / 60).toFixed(2)
                }))
            }
        });
    } catch (error) {
        console.error('Error in getHourlyCallDistribution:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

const getTopAgentsByVolume = async (req, res) => {
    try {
        logEndpointHit("getTopAgentsByVolume");
        const limit = parseInt(req.query.limit) || 10;
        const { startDate, endDate } = req.query;

        if (limit > 50) {
            console.log("Limit cannot excced 50");
            return res.status(400).json({
                success: false,
                message: 'Limit cannot exceed 50'
            });
        }

        let start = null, end = null;
        
        if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD format'
                });
            }
        }

        const topAgents = await Call.getTopAgentsByVolume(limit, start, end);

        res.status(200).json({
            success: true,
            data: {
                period: startDate && endDate ? { startDate, endDate } : 'all-time',
                meta: {
                limit,
                count: topAgents.length
                },
                topAgents: topAgents.map((agent, index) => ({
                rank: index + 1,
                ...agent,
                avgDuration: parseFloat(agent.avgDuration).toFixed(2),
                avgDurationMinutes: (parseFloat(agent.avgDuration) / 60).toFixed(2),
                totalDurationHours: (parseFloat(agent.totalDuration) / 3600).toFixed(2)
                }))
            }
        });
    } catch (error) {
        console.error('Error in getTopAgentsByVolume:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

const getCallDurationTrend = async (req, res) => {
    try {
        logEndpointHit("getCallDurationTrend");
        const days = parseInt(req.query.days) || 30;

        if (days > 365) {
            console.log("Cannot get more than 365 days");
            return res.status(400).json({
                success: false,
                message: 'Days cannot exceed 365'
            });
        }

        const durationTrend = await Call.getCallDurationTrend(days);

        const avgDurations = durationTrend.map(day => parseFloat(day.avgDuration));
        const overallAvg = avgDurations.length > 0 ? 
        (avgDurations.reduce((sum, dur) => sum + dur, 0) / avgDurations.length).toFixed(2) : 0;

        res.status(200).json({
            success: true,
            data: {
                period: `Last ${days} days`,
                summary: {
                overallAvgDuration: parseFloat(overallAvg),
                overallAvgDurationMinutes: (parseFloat(overallAvg) / 60).toFixed(2),
                totalDays: durationTrend.length
                },
                trend: durationTrend.map(day => ({
                ...day,
                avgDuration: parseFloat(day.avgDuration).toFixed(2),
                avgDurationMinutes: (parseFloat(day.avgDuration) / 60).toFixed(2)
                }))
            }
        });

        console.log("durationTrend: ", durationTrend);
    } catch (error) {
        console.error('Error in getCallDurationTrend:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

const getSystemStats = async (req, res) => {
    try {
        logEndpointHit("getSystemStats");
        const stats = await Call.getSystemStats();

        res.status(200).json({
            success: true,
            data: {
                overview: {
                totalCalls: stats.totalCalls,
                uniquePhones: stats.uniquePhones,
                activeAgents: stats.activeAgents,
                avgDuration: parseFloat(stats.avgDuration).toFixed(2),
                avgDurationMinutes: (parseFloat(stats.avgDuration) / 60).toFixed(2),
                totalDurationHours: (parseFloat(stats.totalDuration) / 3600).toFixed(2)
                },
                dateRange: {
                firstCall: stats.firstCallDate,
                lastCall: stats.lastCallDate,
                operationalDays: stats.firstCallDate && stats.lastCallDate ? 
                    Math.ceil((new Date(stats.lastCallDate) - new Date(stats.firstCallDate)) / (1000 * 60 * 60 * 24)) : 0
                },
                averages: {
                callsPerPhone: stats.uniquePhones > 0 ? 
                    (stats.totalCalls / stats.uniquePhones).toFixed(2) : 0,
                callsPerAgent: stats.activeAgents > 0 ? 
                    (stats.totalCalls / stats.activeAgents).toFixed(2) : 0
                }
            }
        });

        console.log("Stats:", stats);
    } catch (error) {
        console.error('Error in getSystemStats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

module.exports = {
    getAgentStats,
    getCallDurationTrend,
    getCallFrequencyByPhone,
    getDailyCallVolume,
    getHourlyCallDistribution,
    getSystemStats,
    getTopAgentsByVolume
}