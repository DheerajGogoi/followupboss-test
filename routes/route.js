const router = require('express').Router();
const Controller = require('../controllers/controller');

router.get('/index', Controller.index);
// router.post('/index', Controller.add_leadngage);
router.get('/main', Controller.main);

module.exports = router;