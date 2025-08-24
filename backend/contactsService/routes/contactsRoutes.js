const router = require("express").Router();
const {
    getAllContacts,
    getContactByPhone,
    createContact,
    updateContact,
    updateContactNotes,
    deleteContact,
    search3CX
} = require('../controllers/contactsController');

router.get('/search', search3CX);

router.get('/getAllContacts', getAllContacts);

router.post('/createContact/', createContact);

router.put('/updateContact/:phone', updateContact);

router.patch('/updateContactNotes/:phone', updateContactNotes);

router.delete('/deleteContact/:phone', deleteContact);

router.get('/getContactByPhone/:phone', getContactByPhone);

const { handleInvalidRoute } = require('../../shared/letMeIn');
router.use(handleInvalidRoute('Contacts Service'));

module.exports = router;