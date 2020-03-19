import { Ajax } from '@/platform/plain';

export default {
  login(data, success, failure) {
    Ajax.postForm('/login', data, success, failure);
  },
  logout() {
    Ajax.postForm(
      '/logout',
      {},
      v => true,
      e => false
    );
  },
  loginStatus(success, failure) {
    Ajax.get('/account/loginStatus', {}, success, failure);
  },
  loginAccount(success) {
    Ajax.get('/account/loginAccount', {}, success, e => false);
  }
};
