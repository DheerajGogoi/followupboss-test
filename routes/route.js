const router = require('express').Router();
const Controller = require('../controllers/controller');

router.get('/index', Controller.index);
router.get('/main', Controller.main);
router.get('/main/:type', Controller.main);
router.post('/main/:type', Controller.send_note);
// router.get('/success', Controller.success);
// router.get('/fail', Controller.fail);

module.exports = router;