import express from 'express';
import passport from 'passport';
import { Strategy as facebookStrategy } from 'passport-facebook';
import { Strategy as localStrategy } from 'passport-local';

import User from './Models/User';

const router = express.Router();

//Facebook Strategy
passport.use(
  new facebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: '/auth/facebook/callback',
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      return cb(null, profile);
    }
  )
);

//Local Strategy
passport.use(
  'local-signup',
  new localStrategy(
    {
      // override with email instead of email instead of userame
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    (req, email, password, cb) => {
      process.nextTick(async () => {
        const exists = await User.findOne({
          email: email,
        });
        if (exists) {
          console.log('User existed.');
          return cb(null, exists);
        }
        const newUser = new User({
          email: email,
          password: password,
        });
        console.log("New user's email: ", newUser);
        await newUser.save();
      });
    }
  )
);

passport.use(
  'local-login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, email, password, cb) => {
      process.nextTick(async () => {
        const user = await User.findOne({
          email: email,
        });
        if (!user) {
          console.log('User not found.');
          return cb(null, false);
        }
        if (user.password !== password) {
          console.log('Password incorrect.');
          return cb(null, false);
        }
        return cb(null, user);
      });
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id);
  cb(null, user);
});

// Routes for authentication Facebook
router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
  })
);

// Routes for authentication Local
router.post(
  '/login',
  passport.authenticate('local-login', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
  })
);

router.post(
  '/register',
  passport.authenticate('local-signup', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
  })
);

export default router;
