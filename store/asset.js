export const state = () => ({
  // 資産 (例: 残高や出金可能金額 等、コンポーネント横断的に保持したい資産情報 )
  asset: {}
});

export const actions = {
  refresh({ commit }) {
    const asset = {}; // low: API経由で資産系サマリの再取得を行う
    commit('update', asset);
  }
};

export const mutations = {
  update(state, asset) {
    state.asset = asset;
  }
};
