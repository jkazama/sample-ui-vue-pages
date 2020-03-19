import { Ajax } from '@/platform/plain';

export default {
  // 出金依頼をします。
  withdraw(data, success, failure) {
    Ajax.postForm('/asset/cio/withdraw', data, success, failure);
  },
  // 未処理の出金情報を検索します。
  findUnprocessedOut(data, success, failure) {
    Ajax.get('/asset/cio/unprocessedOut/', data, success, failure);
  }
};
