import {API_HOST, setCookie, getCookie, ajaxPost, ajaxGet, clearCookie} from './config';

class AuthService {
  isSigned() {
    const is_loged_in = getCookie('is_loged_in');
    console.log("cookie ", is_loged_in);
    if (is_loged_in === "true") {
      return true;
    }
    return false;
  }
  userName() {
    const user_name = getCookie('user_name');
    console.log("cookie ", user_name);
    return user_name;
  }

  signIn(email, password) {
    console.log('service->signIn', email, password);

    return ajaxPost(API_HOST + '/ajax/login', {email, password}, false)
      .then(res => {
        if (res && res.success === true) {
          setCookie('is_loged_in', 'true', 1);
          setCookie('user_name', res.userinfo.first_name, 1);
          setCookie('user_id', res.userinfo.id, 1);
          setCookie('user_type', res.userinfo.user_type, 1);
          setCookie('token', res.token, 1);
        }
        return res;
      });
  }

  signUp(req) {
    return ajaxPost(API_HOST + '/ajax/signup', req);
  }

  signOut() {
    return ajaxGet(API_HOST + '/logout')
      .then( res => {
        clearCookie();
        window.location.herf = '/';
        return res;
      });
  }

  forgotPassword(email) {
    return ajaxPost(API_HOST + '/ajax/forgot-password', {email});
  }

  verifyUser(id) {
    return ajaxGet(API_HOST + '/verify-user/' + id);
  }
}

export const authService = new AuthService();
