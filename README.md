sample-ui-vue-pages
---

### はじめに

[BootStrap](http://getbootstrap.com/) / [Vue.js](http://jp.vuejs.org/) を元にしたプロジェクトWebリソース(HTML/CSS/JS)です。SPAではない従来型のマルチページモデルを前提としています。  

サンプル確認用のAPIサーバとして[sample-boot-hibernate](https://github.com/jkazama/sample-boot-hibernate)を期待します。

`※ライブラリではなく上記ライブラリを用いた単純な実装サンプルです。`

#### ビルド/テスト稼働環境構築

ビルドは [Node.js](http://nodejs.jp/) + [Webpack](https://webpack.github.io/) + [Gulp](http://gulpjs.com/) で行います。以下の手順でインストールしてください。

1. Node.js の[公式サイト](http://nodejs.jp/)からインストーラをダウンロードしてインストール。
1. 「`npm install -g gulp`」を実行してGulpをインストール。
    - Macユーザは「`sudo npm install -g gulp`」で。
1. コンソールで本ディレクトリ直下へ移動後、「`npm install`」を実行してGulpライブラリをインストール。
    - Windowsユーザは「npm install --msvs_version=2013」。理由は後述

---

標準で利用想定の[BrowserSync](http://www.browsersync.io/)はLiveReloadよりも同期が早く開発生産性に大きく寄与しますが、Windowsユーザの場合は[Python2.7](https://www.python.org/)と[Visual Studio 2013 Update N](https://www.visualstudio.com/downloads/download-visual-studio-vs)のインストールが必須となります。  
*※`Express 2013 for Desktop`を推奨します。(手元で試したところ`Community 2015`では正しく動きませんでした)*

### 動作確認

動作確認は以下の手順で行ってください。

1. cloneした[sample-boot-hibernate](https://github.com/jkazama/sample-boot-hibernate)を起動する。
    - 起動方法は該当サイトの解説を参照
    - application.ymlの`extension.security.auth.enabled`をtrueにして起動すればログイン機能の確認も可能
1. コンソールで本ディレクトリ直下へ移動し、「`gulp`」を実行
    - 確認用のブラウザが自動的に起動する。うまく起動しなかったときは「http://localhost:3000」へアクセス
    - 画面が白く表示されてしまう時はブラウザの更新を押してみてください
        - webpackのビルドが間に合っていない可能性が高いため

### 開発の流れ

基本的にAltリソース(.jade/.scss/.js(ES6)[.vue])をWebリソース(.html/.css/.js)へGulpでリアルタイム変換させながら開発をしていきます。
動作確認はGulpで独自にWebサーバを立ち上げた後、ブラウザ上で行います。  

#### Altリソースの解説

- [Jade](http://jade-lang.com/)
- [Sass (SCSS)](http://sass-lang.com/)
- [ES6 with Babel](https://babeljs.io/)

#### Altリソースの変更監視 / Webサーバ起動

+ コンソールで本ディレクトリ直下へ移動し、「`gulp`」を実行

### ポリシー

- JS/CSSの外部ライブラリはbowerで管理する
    - グローバルスコープの汚染を許容する
- プロジェクト固有のJSはWebpackを利用して生成する
    - グローバルスコープの汚染を許容せずにモジュールベースで開発する
    - 外部ライブラリのアクセスは従来通りグローバルな名前空間を用いる
- [React.js版](https://github.com/jkazama/sample-ui-react)と異なり、DOM表示後の操作を中心とした従来型の実装方式
    - コンポーネント粒度は粗めでなるべく素のHTMLを触れるように
    - 上記前提のため、jQueryを用いたDOM操作も許容
- 各ページは「html/*」と「js/pages/*」をペアで作成していく
    - 基本的にSEO対策を考慮して動的にコンテンツを生成するコンポーネントは利用しない
    - 各種アクション等、SEO絡みの考慮が必要無い時はcomponent[.vue]の利用も考える
        - see `js/pages/asset.js`

### TODO

- jQuery利用箇所を随時コンポーネント化
    - 入力系/エラーメッセージ（React.jsのサンプルに近づける）
- ドキュメントリファクタ
