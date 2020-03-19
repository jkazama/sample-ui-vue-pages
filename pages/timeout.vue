<template>
  <div class="row justify-content-center">
    <div class="col-md-4">
      <div class="card m-2">
        <div class="card-body">
          <div class="card-title p-1">
            <h5>セッションタイムアウト</h5>
          </div>
          <div class="card-text">
            <div class="alert alert-warning mb-2">
              ログインしていないか一定時間操作がありませんでした。
            </div>
            <nuxt-link class="btn btn-block btn-default" to="/login">
              ログイン画面へ戻る
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: 'Timeout' };
</script>
