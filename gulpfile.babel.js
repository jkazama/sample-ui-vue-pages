const root = {
  src:   `${__dirname}/src`,
  dist:  `${__dirname}/dist`,
  tmp:   `${__dirname}/tmp`
}

const paths = {
  src: {
    root: `${root.src}`,
    html: `${root.src}/html`,
    js:   `${root.src}/js`,
    css:  `${root.src}/css`,
    static: `${root.src}/static`
  },
  dist: {
    root: `${root.dist}`,
    js:   `${root.dist}/js`,
    css:  `${root.dist}/css`,
    font: `${root.dist}/webfonts`
  },
  node: {
    modules: `${__dirname}/node_modules`
  }
}
const resource = {
  src: {
    pug: `${paths.src.html}/**/*.pug`,
    webpack: {
      babel: `${paths.src.js}/entry/**/*.js`
    },
    sass:   `${paths.src.css}/**/*.s+(a|c)ss`,
    static: `${paths.src.static}/**/*`
  },
  vendor: {
    js: {
      jquery:     `${paths.node.modules}/jquery/dist/jquery.js`,
      lodash:     `${paths.node.modules}/lodash/lodash.js`,
      moment:     `${paths.node.modules}/moment/moment.js`,
      flatpickr:  `${paths.node.modules}/flatpickr/dist/flatpickr.js`,
      bootstrap:  `${paths.node.modules}/bootstrap/dist/js/bootstrap.js`,
    },
    css: [`${paths.node.modules}/flatpickr/dist/flatpickr.min.css`],
    fontawesome: `${paths.node.modules}/@fortawesome/fontawesome-free/webfonts/**/*`
  }
}

import gulp from 'gulp'
import gulpLoaderPlugins from 'gulp-load-plugins'
import del from 'del'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import runSequence from 'run-sequence'
import browserSyncTool from 'browser-sync'
import RevAll from 'gulp-rev-all'
import named from 'vinyl-named'

const $ = gulpLoaderPlugins()
const browserSync   = browserSyncTool.create()

let production = false

// build and watch for developer
gulp.task('default', ['build', 'server'])

//## build for developer
gulp.task('build', (callback) =>
  runSequence('clean', ['build:pug', 'build:sass', 'build:webpack', 'build:static'], callback)
)

//## build production
gulp.task('build-prod', (callback) => 
  runSequence('production', 'build', 'revision', callback)
)

// clean dist
gulp.task('clean', () =>
  del.sync([`${paths.dist.root}/*`, `!${paths.dist.root}/.git*`], { force: true })
)

// production option
gulp.task('production', () => production = true )

// support Resource Revision
gulp.task('revision', (callback) =>
  runSequence('revision:clean', 'revision:append', 'clean', 'revision:copy', 'revision:clean', callback)
)

// compile Webpack [ ES201x(Babel) / Vue -> Multipage ]
import VueLoaderPlugin from 'vue-loader/lib/plugin'
gulp.task('build:webpack', () => {
  process.env.NODE_ENV = (production == true) ? 'production' : 'development'
  const plugins = [
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)}),
    new VueLoaderPlugin(),
  ]
  return gulp.src([resource.src.webpack.babel])
    .pipe(named())
    .pipe($.plumber())
    .pipe(webpackStream({
      mode: process.env.NODE_ENV,
      devtool: production ? false : '#source-map',
      output: {filename: '[name].js'},
      optimization: {
        noEmitOnErrors: true,
      },
      watch: !production,
      module: {
        rules: [
          { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
          { test: /\.vue$/, use: 'vue-loader', exclude: /node_modules/ },
          { test: /\.pug$/, use: 'pug-plain-loader', exclude: /node_modules/ },
          {
            test: /\.scss$/,
            use: [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            exclude: /node_modules/
          },
          {
            test: /\.sass$/,
            use: [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ],
            exclude: /node_modules/
          },
        ],
      },
      resolve: {
        modules: ['node_modules', paths.src.js],
        extensions: ['*', '.js', '.vue'],
        alias: {
          vue: 'vue/dist/vue.common.js',
          constants: `${paths.src.js}/constants`,
        }
      },
      plugins: plugins
     }, webpack))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream())
})

// compile Pug -> HTML
gulp.task('build:pug', () => {
  return gulp.src(resource.src.pug)
    .pipe($.plumber())
    .pipe($.pug())
    .pipe(gulp.dest(paths.dist.root))
    .pipe(browserSync.stream())  
})

// compile Sass -> CSS
gulp.task('build:sass', () => {
  return gulp.src(resource.src.sass)
    .pipe($.plumber())
    .pipe($.concat('style.css'))
    .pipe($.sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream())
})

// copy Static Resource
gulp.task('build:static', () => {
  const libjs = resource.vendor.js
  gulp.src(Object.keys(libjs).map((key) => libjs[key]))
    .pipe($.concat("vendor.bundle.js"))
    .pipe($.if(production, $.uglify()))
    .pipe(gulp.dest(paths.dist.js))
  gulp.src(resource.vendor.css)
    .pipe($.concat('vendor.css'))
    .pipe($.sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest(paths.dist.css))
  gulp.src(resource.vendor.fontawesome)
    .pipe(gulp.dest(paths.dist.font))
  return gulp.src(resource.src.static)
    .pipe(gulp.dest(paths.dist.root))
})

// run Development Web Server (BrowserSync) [localhost:3000]
gulp.task('server', () => {
  browserSync.init({
    server: {baseDir: paths.dist.root},
    notify: false
  })
  // watch for source
  gulp.watch(resource.src.pug,    ['build:pug'])
  gulp.watch(resource.src.sass,   ['build:sass'])
  gulp.watch(resource.src.static, ['build:static'])
})

// append Resource Revision
gulp.task('revision:clean', () =>
  del.sync([root.tmp], { force: true })
)

gulp.task('revision:append', () => {
  return gulp.src(`${paths.dist.root}/**/*`)
    .pipe(RevAll.revision({dontRenameFile: [/^\/favicon.ico$/g, '.html']}))
    .pipe(gulp.dest(root.tmp))
})

gulp.task('revision:copy', () => {
  return gulp.src(`${root.tmp}/**/*`)
    .pipe(gulp.dest(paths.dist.root))
})
