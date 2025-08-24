const Call = require('../models/Call');
const axios = require('axios');
const moment = require('moment');

const handle3CXWebhook = async (req, res) => {
  const webhookData = req.body;

  if (!webhookData || !webhookData.eventType) {
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }

  console.log('Webhook received:', webhookData.eventType, webhookData);

  try {
    switch (webhookData.eventType) {
      case 'CallStart':
        const result = await handleCallStart(webhookData);
        if (!result.found) {
            return res.status(404).json({ error: result.reason });
        }
        return res.status(200).json({ message: 'Call started', contact: result.contact });
      case 'CallEnd':
        await handleCallEnd(webhookData);
        break;
      default:
        console.warn('⚠️ Unknown webhook event type:', webhookData.eventType);
        break;
    }

    res.status(200).json({ message: 'Webhook processed' });
  } catch (error) {
    console.error('Error processing webhook:', error.message);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
};

const handleCallStart = async (webhookData) => {
    const phone = webhookData.phoneNumber || webhookData.callerNumber;
  
    if (!phone) {
      console.warn('No phone number in webhook.');
      return { found: false, reason: 'No phone number in webhook' };
    }
  
    try {
      const CONTACTS_SERVICE_URL = process.env.CONTACTS_SERVICE_URL || 'http://localhost:4127';
      console.log("CONTACTS_SERVICE_URL being used:", CONTACTS_SERVICE_URL);
  
      const response = await axios.get(
        `${CONTACTS_SERVICE_URL}/getContactByPhone/${encodeURIComponent(phone)}`,
        {
          headers: {
            [process.env.AUTH_HEADER_TITLE.toLowerCase()]: process.env.API_SECRET
          }
        }
      );
  
      const contact = response.data;
      console.log('Contact found for CallStart:', contact);
  
      return { found: true, contact };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('Contact not found for number:', phone);
        return { found: false, reason: 'Contact not found' };
      } else {
        console.error(
          'Error fetching contact on CallStart:',
          error.message,
          error.response?.data
        );
        return { found: false, reason: 'Server error while fetching contact' };
      }
    }
};
  
  
const handleCallEnd = async (webhookData) => {
  const phone = webhookData.phoneNumber || webhookData.callerNumber;

  if (!phone) {
    console.warn('No phone number in webhook.');
    return;
  }

  try {
    const callData = {
      phone: phone,
      agentId: 1, // You can update this to dynamic agent logic later
      callDate: webhookData.timestamp ? moment(webhookData.timestamp).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss'),
      summary: 'Call ended for now ',
      durationSeconds: webhookData.duration || 0,
    };

    console.log('📞 Logging call:', callData);

    await Call.create(callData);
    //console.log('Insert result:', result);
  } catch (error) {
    console.error('Error logging call on CallEnd:', error.message);
  }
};

module.exports = {
  handle3CXWebhook,
};
