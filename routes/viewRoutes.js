const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);

router.get('/me', authController.protect, viewsController.getAccount);

router.get('/page1', viewsController.showPage1);

//router.post('/submit-user-data', viewsController.updateUserData);

module.exports = router;
