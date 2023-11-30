import session from 'express-session';
import cookiParser from 'cookie-parser';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../Models/User';
import { comparePasswords } from './password';
import express from 'express';
import MongoStore from 'connect-mongo';

export default (app: express.Express) => {
  const sessionStoreOptions = {};

  app.use(cookiParser());
  // session basic setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI!,
        autoRemove: 'interval',
        autoRemoveInterval: 60, // In every 60 minutes it'll remove expired sessions
        touchAfter: 3600, // time period in seconds
        // Every time request made on server it'll resave all session to avoid it use touchAfter
        // it'll only update session one time in defined interval
      }),
      // automatically extends the session age on each request. useful if you want
      // the user's activity to extend their session. If you want an absolute session
      // expiration, set to false
      rolling: true,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        // sameSite: 'none',
        // secure: true,
        // domain: '',
      },
    })
  );

  passport.serializeUser((user: any, done: any) => {
    done(null, user._id);
  });

  passport.deserializeUser((user_id: String, done: Function) => {
    User.findById(user_id)
      .then(user => {
        done(null, user);
      })
      .catch(err => done(err));
  });

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const errorMsg = 'Invalid username or password';
      const user = await User.findOne({ userName: username });

      if (!user) {
        return done(null, false, { message: errorMsg });
      }
      const isMatch = await comparePasswords(password, user.password);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: errorMsg });
      }
    })
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID_K!,
        clientSecret: process.env.FACEBOOK_APP_SECRET_K!,
        callbackURL: process.env.FACEBOOK_CALLBACK!,
        profileFields: [
          'id',
          'displayName',
          'picture.type(large)',
          'email',
          'birthday',
          'friends',
          'first_name',
          'last_name',
          'middle_name',
          'gender',
          'link',
        ],
      },
      function (accessToken, refreshToken, profile, done) {
        console.log('user => ', profile);
        // Need to decide what to do with facebook strategy
        // No email get on this
        return done(null, profile);
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_APP_ID!,
        clientSecret: process.env.GOOGLE_APP_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK!,
      },
      function (accessToken, refreshToken, profile, done) {
        console.log('User google => ', profile, accessToken, refreshToken);
        const userData = {
          firstName: profile.name?.familyName,
          lastName: profile.name?.givenName,
          email: profile.emails?.[0].value,
          profilePicture: profile.photos?.[0].value,
          provider: profile.provider,
        };
        const user = new User(userData);
        user
          .save()
          .then(data => {
            return done(null, data);
          })
          .catch(err => {
            return done(err);
          });
      }
    )
  );

  // init passport on every route call.
  app.use(passport.initialize());
  // allow passport to use "express-session".
  app.use(passport.session());
  app.use(passport.authenticate('session'));
};
