import { Amplify } from 'aws-amplify';

const envConfig = {
  region: 'ap-northeast-2',
  redirectUrls: {
    signIn: import.meta.env.VITE_REDIRECT_SIGNIN,
    signOut: import.meta.env.VITE_REDIRECT_SIGNOUT,
    // Production에서만 사용되는 www 도메인 URL
    signInWWW: import.meta.env.VITE_REDIRECT_SIGNIN_WWW,
    signOutWWW: import.meta.env.VITE_REDIRECT_SIGNOUT_WWW
  }
};

const getRedirectUrls = (baseUrl, wwwUrl) => {
  const urls = [baseUrl];
  if (import.meta.env.PROD && wwwUrl) {
    urls.push(wwwUrl);
  }
  return urls;
};

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      region: envConfig.region,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN,
          scopes: [
            'email',
            'profile',
            'openid',
            'aws.cognito.signin.user.admin'
          ],
          redirectSignIn: getRedirectUrls(
              envConfig.redirectUrls.signIn,
              envConfig.redirectUrls.signInWWW
          ),
          redirectSignOut: getRedirectUrls(
              envConfig.redirectUrls.signOut,
              envConfig.redirectUrls.signOutWWW
          ),
          responseType: 'code',
          providers: ['Google']
        },
        email: true
      }
    }
  }
});
