
const router = require('express').Router();

const {
    getTicketById,
    getTicketsByContact,
    getTicketByAgentId,
    getTicketsByStatus,
    getTicketsByStatusForCertainAgent,
    createTicket,
    updateTicket,
    deleteTicket
} = require('../controllers/ticketsController');

const {
    getAverageResolutionTime,
    getCountByStatus,
    getTicketsPerAgent,
    getUnresolvedAging,
    getTicketsOpenPerAgent
} = require('../controllers/ticketAnalyticsController');


router.get('/getTicketById', getTicketById);
router.get('/getTicketsByContact', getTicketsByContact);
router.get('/getTicketsByStatus', getTicketsByStatus);
router.get('/getTicketsByStatusForCertainAgent', getTicketsByStatusForCertainAgent);
router.get('/getTicketByAgentId', getTicketByAgentId);

router.post('/createTicket', createTicket);
router.put('/updateTicket', updateTicket);

router.delete('/deleteTicket', deleteTicket);

router.get('/getAverageResolutionTime', getAverageResolutionTime);
router.get('/getCountByStatus', getCountByStatus);
router.get('/getTicketsPerAgent', getTicketsPerAgent);
router.get('/getUnresolvedAging', getUnresolvedAging);
router.get('/getTicketsOpenPerAgent', getTicketsOpenPerAgent);

const { handleInvalidRoute } = require('../../shared/letMeIn');
router.use(handleInvalidRoute('Tickets Service'));
module.exports = router;