const express = require('express');
const { loginUser, registerUser, addProject } = require('../controllers/users.controller');
const { Authenticator } = require('../middlewares/Auth');
// const { getAllVehicles } = require('../controllers/vehicles');
const router = express.Router();



router.route('/login').post(loginUser)
router.route('/register').post(registerUser)
router.route('/project').put( Authenticator, addProject)


module.exports = router;