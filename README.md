sample-ui-vue-pages
---

### はじめに

[BootStrap](http://getbootstrap.com/) / [Vue.js](http://jp.vuejs.org/) を元にしたプロジェクト Web リソース ( HTML / CSS / JS ) です。 SPA ではない従来型のマルチページモデルを前提としています。  

サンプル確認用の API サーバとして [sample-boot-hibernate](https://github.com/jkazama/sample-boot-hibernate) を期待します。

`※ライブラリではなく上記ライブラリを用いた単純な実装サンプルです。`

#### ビルド / テスト稼働環境構築

ビルドは [Node.js](http://nodejs.jp/) + [Webpack](https://webpack.github.io/) + [Gulp](http://gulpjs.com/) で行います。以下の手順でインストールしてください。

1. Node.js の[公式サイト](http://nodejs.jp/)からインストーラをダウンロードしてインストール。
1. 「 `npm install -g gulp` 」 を実行して Gulp をインストール。
    - Mac ユーザは 「 `sudo npm install -g gulp` 」 で。
1. コンソールで本ディレクトリ直下へ移動後、 「 `npm install` 」 を実行して Gulp ライブラリをインストール。
    - Windows ユーザは 「 npm install --msvs_version=2013 」 。理由は後述

---

標準で利用想定の [BrowserSync](http://www.browsersync.io/) は LiveReload よりも同期が早く開発生産性に大きく寄与しますが、 Windows ユーザの場合は [Python2.7](https://www.python.org/) と [Visual Studio 2013 Update N](https://www.visualstudio.com/downloads/download-visual-studio-vs) のインストールが必須となります。  
*※ `Express 2013 for Desktop` を推奨します。 ( 手元で試したところ `Community 2015` では正しく動きませんでした ) *

### 動作確認

動作確認は以下の手順で行ってください。

1. clone した [sample-boot-hibernate](https://github.com/jkazama/sample-boot-hibernate) を起動する。
    - 起動方法は該当サイトの解説を参照
    - application.yml の `extension.security.auth.enabled` を true にして起動すればログイン機能の確認も可能
1. コンソールで本ディレクトリ直下へ移動し、 「 `gulp` 」 を実行
    - 確認用のブラウザが自動的に起動する。うまく起動しなかったときは 「 http://localhost:3000 」 へアクセス
    - 画面が白く表示されてしまう時はブラウザの更新を押してみてください
        - webpack のビルドが間に合っていない可能性が高いため

### 開発の流れ

基本的にテンプレート ( .jade / .scss / .js ( ES6 ) [ .vue ] ) を Web リソース ( .html / .css / .js ) へ Gulp / Webpack でリアルタイム変換させながら開発をしていきます。
動作確認は Gulp で独自に Web サーバを立ち上げた後、ブラウザ上で行います。  

#### 各種テンプレートファイルの解説

- [Jade](http://jade-lang.com/)
    - HTML を生成するテンプレートツール。公式サイト TOP にある簡素な記法が特徴。
- [Sass (SCSS)](http://sass-lang.com/)
    - CSS 表記を拡張するツール。変数や mixin 、ネスト表記などが利用可能。
- [ES6 with Babel](https://babeljs.io/)
    - ES6 用の Polyfill 。 ES5 でも ES6 風に記述が可能。

#### 各種テンプレートファイルの変更監視 / Web サーバ起動

+ コンソールで本ディレクトリ直下へ移動し、 「 `gulp` 」 を実行

### 配布用ビルドの流れ

配布リソース生成の流れは開発時と同様ですが、監視の必要が無いことと、配布リソースに対する minify や revison の付与などを行う必要があるため、別タスク （ build-prod ） で実行します。

#### 配布用 Web リソースのビルド / リリース

+ コンソールで本ディレクトリ直下へ移動し、 「 `gulp build-prod` 」 を実行
+ `public` ディレクトリ直下に出力されたファイルをリリース先のディレクトリへコピー

### ポリシー

- JS / CSS の外部ライブラリは bower で管理する
    - グローバルスコープの汚染を許容する
- プロジェクト固有の JS は Webpack を利用して生成する
    - グローバルスコープの汚染を許容せずにモジュールベースで開発する
    - 外部ライブラリのアクセスは従来通りグローバルな名前空間を用いる
- [React.js版](https://github.com/jkazama/sample-ui-react) と異なり、 DOM 表示後の操作を中心とした従来型の実装方式
    - コンポーネント粒度は粗めでなるべく素の HTML を触れるように
    - 上記前提のため、 jQuery を用いた DOM 操作も許容
- 各ページは 「 html/* 」 と 「 js/pages/* 」 をペアで作成していく
    - 基本的に SEO 対策を考慮して動的にコンテンツを生成するコンポーネントは利用しない
    - 各種アクション等、 SEO 絡みの考慮が必要無い時は component [ .vue ] の利用も考える
        - see `js/pages/asset.js`

#### ディレクトリ構成

ディレクトリ構成については以下を参照してください。

```
bower.json                           … bower が利用するライブラリ定義
gulpfile.coffee                      … gulp 実行時に利用されるビルドファイル
package.json                         … node.js が gulp 実行時に利用するライブラリ定義
public                               … 配布公開リソース(自動生成)
  css                                … CSS
    - style.css                      … source / css 直下のリソース
    - vendor.css                     … bower 経由の外部 CSS ライブラリ
  fonts                              … アイコンフォント
  js                                 … JavaScript ( ES5 )
    - [page].js                      … source / js / pages 直下のリソース ( Webpack で生成 )
    - vendor.js                      … Bower 経由の外部 JS ライブラリ
  [page].html                        … source / html 直下のリソース
source
  css                                … CSS テンプレートファイル ( SCSS )
  html                               … HTML テンプレートファイル ( Jade )
  js
    components                       … 各ページから利用されるコンポーネント
    pages                            … ページ毎に利用される JS ファイル
    platform                         … プロジェクト内ライブラリ
    - common.js                      … ページ横断的に利用されるモジュール
    - header.js                      … ページヘッダ部のモジュール
  static                             … 画像等コンパイル不要な静的リソースファイル
```

※gulp コマンドを実行して変更監視を有効にしておくと、 source 配下のリソースを修正した際にリアルタイムで public 直下のファイルが更新されていきます。

### 依存ライブラリ

| ライブラリ                    | バージョン   | 用途/追加理由 |
| ------------------------- | -------- | ------------- |
| `vue`                     | 1.0.+    | アプリケーションの MVVM 機能を提供 |
| `jquery`                  | 2.2.+    | DOM 操作サポート |
| `lodash`                  | 3.10.+   | 汎用ユーティリティライブラリ |
| `moment`                  | 2.11.+   | 日時ライブラリ |
| `bootstrap-sass-official` | 3.3.+    | CSS フレームワーク |
| `bootstrap-datepicker`    | 1.4.+    | 日時入力ライブラリ |
| `fontawesome`             | 4.5.+    | フォントアイコンライブラリ |

### License

本サンプルのライセンスはコード含めて全て *MIT License* です。  
プロジェクト立ち上げ時のベース実装サンプルとして気軽にご利用ください。
