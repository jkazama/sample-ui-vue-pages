export const state = () => ({
  // メッセージ
  message: {
    // 汎用グローバルメッセージ [message: string, level: Level]
    global: null,
    // カラムスコープのメッセージ一覧 [key: string, level: Level, messages: array]
    columns: []
  },
  // セッション
  session: null
});

export const actions = {
  message({ commit }, message) {
    commit('updateMessageGlobal', message.global);
    commit('updateMessageColumns', message.columns);
  },
  session({ commit }, session) {
    commit('updateSession', session);
  }
};

export const mutations = {
  updateMessageGlobal(state, message) {
    state.message.global = message;
  },
  updateMessageColumns(state, columns) {
    state.message.columns = columns;
  },
  updateSession(state, session) {
    state.session = session;
  }
};
