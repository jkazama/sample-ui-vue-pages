<template>
  <div class="row justify-content-center">
    <div class="col-md-4">
      <div class="card.m-2">
        <div class="card-body">
          <div class="card-title p-1">
            <h5>ログインフォーム</h5>
          </div>
          <div class="card-text">
            <div class="mb-2">
              <input-text
                v-model="loginId"
                class="mb-2"
                placeholder="ログインID"
                @enter="login"
              />
            </div>
            <div class="mb-2">
              <input-text
                v-model="password"
                placeholder="パスワード"
                :password="true"
                @enter="login"
              />
            </div>
            <div class="mb-2">
              <command-button
                class="btn-primary"
                :updating="updating"
                @click="login"
              >
                <font-awesome-icon icon="sign-in-alt" /> ログイン
              </command-button>
            </div>
          </div>
          <div class="alert alert-warning small p-2">
            サーバ側（サンプル実装版）の認証モードを有効にした時は sample/sample
            でログインしてください。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Level } from '@/enums';
import { Log } from '@/platform/plain';
import ViewBasic from '@/mixins/view-basic';
import api from '@/api/context';
export default {
  name: 'Login',
  mixins: [ViewBasic],
  data() {
    return {
      loginId: '',
      password: ''
    };
  },
  methods: {
    login() {
      Log.debug(this.loginId);
      this.updating = true;
      const success = ret => {
        this.updating = false;
        Log.debug('ログインに成功しました - ');
        this.forward();
      };
      const failure = error => {
        this.updating = false;
        switch (error.response.status) {
          case 400:
            this.messageError(
              'IDまたはパスワードに誤りがあります',
              [],
              Level.WARN
            );
            break;
          default:
            this.messageError('要求処理に失敗しました');
        }
      };
      api.login(
        { loginId: this.loginId, password: this.password },
        success,
        failure
      );
    },
    forward() {
      this.loginAccount(v => {
        this.$store.dispatch('context/session', v);
        this.$router.push('/asset');
      });
    }
  }
};
</script>
