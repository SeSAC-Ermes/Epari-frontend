import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-northeast-2_pD4FKh81Z',
      userPoolClientId: '3qonkcahudsvh9eathk7h6v9su',
      region: 'ap-northeast-2',
      loginWith: {
        email: true,
        phone: false,
        username: false
      },
      oauth: {
        domain: '202533495554epari-pool.auth.ap-northeast-2.amazoncognito.com',
        scopes: ['email', 'profile', 'openid'],
        responseType: 'code',
        redirectSignIn: 'http://localhost:5173/courselist',
        redirectSignOut: 'http://localhost:5173'
      }
    }
  }
});
