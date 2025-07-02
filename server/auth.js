import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import https from 'https';

// Debug logging for environment variables
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
console.log('FACEBOOK_CLIENT_ID:', process.env.FACEBOOK_CLIENT_ID);
console.log('FACEBOOK_CLIENT_SECRET:', process.env.FACEBOOK_CLIENT_SECRET);
console.log('LINKEDIN_CLIENT_ID:', process.env.LINKEDIN_CLIENT_ID);
console.log('LINKEDIN_CLIENT_SECRET:', process.env.LINKEDIN_CLIENT_SECRET);

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Here, you would look up or create the user in your DB
  return done(null, profile);
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'photos', 'email']
}, (accessToken, refreshToken, profile, done) => {
  // Here, you would look up or create the user in your DB
  return done(null, profile);
}));

// LinkedIn strategy with patched userProfile to set User-Agent and fetch email
const linkedInStrategy = new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: '/auth/linkedin/callback',
  scope: ['openid','email', 'profile'],
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
});

linkedInStrategy.userProfile = function(accessToken, done) {
  // Fetch profile
  console.log(accessToken);
  this._oauth2._request(
    'GET',
    'https://api.linkedin.com/v2/userinfo',
    { Authorization: 'Bearer ' + accessToken, 'User-Agent': 'Node.js' },
    '',
    accessToken,
    (err, body, res) => {
      if (err) {
        return done(new Error('Failed to fetch user profile from LinkedIn: ' + JSON.stringify(err)));
      }
      try {
        const profile = JSON.parse(body);
        // Fetch email
        this._oauth2._request(
          'GET',
          'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
          { Authorization: 'Bearer ' + accessToken, 'User-Agent': 'Node.js' },
          '',
          accessToken,
          (err2, body2, res2) => {
            if (!err2) {
              try {
                const emailData = JSON.parse(body2);
                if (emailData.elements && emailData.elements[0] && emailData.elements[0]["handle~"] && emailData.elements[0]["handle~"].emailAddress) {
                  profile.email = emailData.elements[0]["handle~"].emailAddress;
                }
              } catch (e2) {}
            }
            done(null, profile);
          }
        );
      } catch (e) {
        done(e);
      }
    }
  );
};

passport.use(linkedInStrategy);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport; 