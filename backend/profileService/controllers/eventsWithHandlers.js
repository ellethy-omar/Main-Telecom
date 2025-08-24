const Agent = require('../models/Agent');

const eventsWithHandlers = [
    {
        channel: 'cloudinary:updateImageURL',
        callback: async (data, channel) => {
            console.log(`[${channel}] Heard with message:`, data);

            const { agentID, imageURL } = data;

            try {
                const updated = await Agent.updateImageURL(agentID, imageURL);

                if (updated) {
                    console.log(`✅ Agent ${agentID} imageURL updated.`);
                } else {
                    console.warn(`⚠️ Agent ${agentID} not found or imageURL unchanged.`);
                }
            } catch (err) {
                console.error(`❌ Failed to update imageURL for agent ${agentID}:`, err);
            }
        }
    }
];



module.exports = eventsWithHandlers