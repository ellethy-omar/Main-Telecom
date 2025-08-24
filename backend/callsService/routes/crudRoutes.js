const router = require('express').Router();

const {
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
} = require("../controllers/callsController");

router.post('/createCall', createCall);
router.get('/getCallById/:id', getCallById);
router.delete('/deleteCall/:id', deleteCall);

router.get('/getCallsByPhone/:phone', getCallsByPhone);
router.get('/getCallsByAgent/:agentId', getCallsByAgent);
router.get('/getCallsForMe', getCallsForMe);
router.get('/getCallsByDateRange', getCallsByDateRange);
router.get('/searchCallsBySummary', searchCallsBySummary);

router.put('/updateCallSummary/:id', updateCallSummary);
router.get('/getCallsWithoutSummary', getCallsWithoutSummary);

module.exports = router;