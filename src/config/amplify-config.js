import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      region: 'ap-northeast-2',
      loginWith: {
        email: true,
        phone: false,
        username: false
      },
      oauth: {
        domain: import.meta.env.VITE_COGNITO_DOMAIN,
        scopes: ['email', 'profile', 'openid'],
        responseType: 'code',
        redirectSignIn: import.meta.env.VITE_REDIRECT_SIGN_IN,
        redirectSignOut: import.meta.env.VITE_REDIRECT_SIGN_OUT
      }
    }
  }
});
