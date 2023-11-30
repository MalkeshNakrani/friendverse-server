import { Router } from 'express';
import passport from 'passport';
import User from '../../Models/User';
import Joi from 'joi';
import isError from '../../utils/isError';

const userValidation = Joi.object({
  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),
  userName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid('male', 'female', 'others'),
  birthDate: Joi.date(),
  bio: Joi.string().max(1000),
  website: Joi.string(),
  profilePicture: Joi.string(),
  coverPicture: Joi.string(),
  provider: Joi.string().default('local').valid('local'),
}).required();

const router = Router();

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
  })
);

router.get('/logout', async (req, res) => {
  try {
    req.logOut(error => {
      if (error) throw error;
      res.redirect('/login');
    });
  } catch (err) {
    const error = isError(err);
    console.log('Error in logout => ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/signup-local', async (req, res) => {
  try {
    const userData = userValidation.validate(req.body);
    if (userData.error) {
      return res.status(400).json({ message: userData.error.message });
    }
    const user = new User(userData.value);
    const response = await user.save();
    res.status(200).json({ user: response }).end();
  } catch (error) {
    console.log('Error while creating user', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/dashboard' })
);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/dashboard' })
);

export default router;
