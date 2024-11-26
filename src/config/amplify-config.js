import { Amplify } from 'aws-amplify';

const redirectUrls = {
  signIn: [import.meta.env.VITE_REDIRECT_SIGNIN],
  signOut: [import.meta.env.VITE_REDIRECT_SIGNOUT]
};

if (import.meta.env.PROD) {
  redirectUrls.signIn.push(import.meta.env.VITE_REDIRECT_SIGNIN_WWW);
  redirectUrls.signOut.push(import.meta.env.VITE_REDIRECT_SIGNOUT_WWW);
}

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      region: 'ap-northeast-2',
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN,
          scopes: ['email', 'profile', 'openid'],
          redirectSignIn: redirectUrls.signIn.filter(Boolean),
          redirectSignOut: redirectUrls.signOut.filter(Boolean),
          responseType: 'code',
          providers: ['Google']
        },
        email: true
      }
    }
  }
});
