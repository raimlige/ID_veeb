const express = require('express');
const router = express.Router();
const { showVisitPage, registerVisit, showVisitLog } = require('../controllers/visitControllers');

router.get('/', showVisitPage);
router.post('/', registerVisit);
router.get('/log', showVisitLog);

module.exports = router;