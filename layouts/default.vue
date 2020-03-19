<template>
  <div class="container-fluid">
    <header
      v-if="logined"
      class="navbar navbar-expand-md navbar-dark bg-secondary mb-2"
    >
      <a class="navbar-brand" href="/">App</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div id="navbarNav" class="collapse navbar-collapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/">
              "取扱い商品名 (TOP)"
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/trade">
              取引情報
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/asset">
              口座資産
            </nuxt-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              data-toggle="dropdown"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span> {{ user.name }} 様 <span class="caret" /> </span>
            </a>
            <ul class="dropdown-menu dropdown-menu-right" role="menu">
              <li class="dropdown-item">
                <a
                  href="#"
                ><font-awesome-icon icon="user" /> アカウント情報
                </a>
              </li>
              <li class="dropdown-divider" />
              <li class="dropdown-item">
                <a href="#" @click.prevent="logout">
                  <font-awesome-icon icon="sign-out-alt" /> ログアウト
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </header>
    <header
      v-if="!logined"
      class="navbar navbar-expand-md navbar-dark bg-secondary mb-2"
    >
      <div class="navbar-brand">
        App
      </div>
    </header>
    <message :global="true" />
    <nuxt />
  </div>
</template>

<script>
import { Log } from '@/platform/plain';
import ViewBasic from '@/mixins/view-basic';
export default {
  name: 'App',
  mixins: [ViewBasic],
  data() {
    return {
      logined: true
    };
  },
  computed: {
    user() {
      const logined = this.$store.state.context.session;
      return logined || { name: 'Anonymous' };
    }
  },
  methods: {
    checkLogin(to, from, next) {
      const success = v => {
        this.logined = true;
        next();
      };
      // eslint-disable-next-line
      const failure = err => {
        Log.debug('ログイン情報を確認できませんでした');
        const current = this.logined; // 事前ログイン状態に応じて表示ページを変更
        this.logoutLocal();
        current ? next('/timeout') : next('/login');
      };
      this.loginStatus(success, failure);
    },
    logout() {
      this.logoutLocal();
      this.doLogout();
      this.$router.push('/login');
    },
    logoutLocal() {
      this.logined = false;
      Log.debug('ログアウトしました');
      this.$store.dispatch('context/session', null);
    }
  }
};
</script>
