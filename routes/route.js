const router = require('express').Router();
const Controller = require('../controllers/controller');

router.get('/index', Controller.index);
router.get('/main', Controller.main);
router.get('/main/:type', Controller.main);
router.post('/main', Controller.send_note);
router.post('/get_person', Controller.get_person);
router.post('/update_credentails', Controller.update_credentails);
router.post('/fub_tags', Controller.fub_tags);
router.get('/error', Controller.index);
router.post('/ghl_auth', Controller.ghl_auth);
// router.get('/success', Controller.success);
router.get('/fail', Controller.fail);

module.exports = router;