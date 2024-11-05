import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'ap-northeast-2',
    userPoolId: 'ap-northeast-2_pD4FKh81Z',
    userPoolWebClientId: '57kqtimedjbhgnvt3e2msercue',
    oauth: {
      domain: '202533495554epari-pool.auth.ap-northeast-2.amazoncognito.com',
      scope: ['email', 'profile', 'openid'],
      redirectSignIn: 'http://localhost:5173/courselist',
      redirectSignOut: 'http://localhost:3000',
      responseType: 'code'
    }
  }
})
