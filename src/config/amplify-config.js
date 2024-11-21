import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      region: 'ap-northeast-2',
      loginWith: {
        oauth: {
          domain: '202533495554epari-pool.auth.ap-northeast-2.amazoncognito.com',
          scopes: ['email', 'profile', 'openid'],
          redirectSignIn: ['http://localhost:5173/courses'],
          redirectSignOut: ['http://localhost:5173/signin'],
          responseType: 'code',
          providers: ['Google']
        },
        email: true
      }
    }
  }
});
