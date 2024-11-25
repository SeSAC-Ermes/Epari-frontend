import { Amplify } from 'aws-amplify';

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
          redirectSignIn: [import.meta.env.VITE_REDIRECT_SIGNIN],
          redirectSignOut: [import.meta.env.VITE_REDIRECT_SIGNOUT],
          responseType: 'code',
          providers: ['Google']
        },
        email: true
      }
    }
  }
});
