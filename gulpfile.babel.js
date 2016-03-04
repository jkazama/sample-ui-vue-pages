const root = {
  src:   `${__dirname}/source`,
  dist:  `${__dirname}/public`,
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
    font: `${root.dist}/fonts`
  },
  node: {
    modules: `${__dirname}/node_modules`
  }
}
const resource = {
  src: {
    jade: `${paths.src.html}/**/*.jade`,
    webpack: {
      babel: `${paths.src.js}/**/*.js`,
      vue:   `${paths.src.js}/**/*.vue`
    },
    sass:   `${paths.src.css}/**/*.s+(a|c)ss`,
    static: `${paths.src.static}/**/*`
  },
  vendor: {
    js: {
      jquery:     `${paths.node.modules}/jquery/dist/jquery.js`,
      lodash:     `${paths.node.modules}/lodash/lodash.js`,
      moment:     `${paths.node.modules}/moment/moment.js`,
      vue:        `${paths.node.modules}/vue/dist/vue.js`,
      vueRouter:  `${paths.node.modules}/vue-router/dist/vue-router.js`,
      bootstrap:  `${paths.node.modules}/bootstrap-sass/assets/javascripts/bootstrap.js`,
      datepicker: `${paths.node.modules}/bootstrap-datepicker/dist/js/bootstrap-datepicker.js`,
      datelocale: `${paths.node.modules}/bootstrap-datepicker/dist/locales/bootstrap-datepicker.ja.min.js`
    },
    css: {
      datepicker: `${paths.node.modules}/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css`
    },
    fontawesome: `${paths.node.modules}/font-awesome/fonts/**/*`
  }
}

import gulp from 'gulp'
import gulpLoaderPlugins from 'gulp-load-plugins'
import del from 'del'
import path from 'path'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import runSequence from 'run-sequence'
import browserSyncTool from 'browser-sync'
import named from 'vinyl-named'
import RevAll from 'gulp-rev-all'

const $ = gulpLoaderPlugins()
const browserSync   = browserSyncTool.create()

let production = false

// build and watch for developer
gulp.task('default', ['build', 'server'])

//## build for developer
gulp.task('build', (callback) =>
  runSequence('clean', ['build:jade', 'build:sass', 'build:webpack', 'build:static'], callback)
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

// compile Webpack [ ES6(Babel) / Vue -> SPA(main.js) ]
gulp.task('build:webpack', () => {
  process.env.NODE_ENV = (production == true) ? 'production' : 'development'
  let plugins = [ new webpack.optimize.DedupePlugin() ]
  if (production) plugins.push(new webpack.optimize.UglifyJsPlugin({compress: { warnings: false　}}))
  gulp.src([resource.src.webpack.babel, resource.src.webpack.vue])
    .pipe(named())
    .pipe($.plumber())
    .pipe(webpackStream({
      watch: !production,
      module: {
        loaders: [
          {test: /\.js$/, loader: 'babel'},
          {test: /\.vue$/, loader: 'vue'}
        ]
      },
      resolve: {
        modulesDirectories: ['node_modules', paths.src.js],
        extensions: ['', '.js', '.vue']
      },
      plugins: plugins
     }, webpack))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream())  
})

// compile Jade -> HTML
gulp.task('build:jade', () => {
  gulp.src(resource.src.jade)
    .pipe($.plumber())
    .pipe($.jade())
    //.pipe($.htmlhint())
    //.pipe($.htmlhint.reporter())
    .pipe(gulp.dest(paths.dist.root))
    .pipe(browserSync.stream())  
})

// compile Sass -> CSS
gulp.task('build:sass', () => {
  gulp.src(resource.src.sass)
    .pipe($.plumber())
    .pipe($.sass())
    .pipe($.concat('style.css'))
    .pipe($.pleeease())
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream())
})

// copy Static Resource
gulp.task('build:static', () => {
  const libcss = resource.vendor.css
  gulp.src(Object.keys(libcss).map((key) => libcss[key]))
    .pipe($.concat("vendor.css"))
    .pipe($.if(production, $.uglify()))
    .pipe(gulp.dest(paths.dist.css))
  const libjs = resource.vendor.js
  gulp.src(Object.keys(libjs).map((key) => libjs[key]))
    .pipe($.concat("vendor.js"))
    .pipe($.if(production, $.uglify()))
    .pipe(gulp.dest(paths.dist.js))
  gulp.src(resource.vendor.fontawesome)
    .pipe(gulp.dest(paths.dist.font))
  gulp.src(resource.src.static)
    .pipe(gulp.dest(paths.dist.root))
})

// run Development Web Server (BrowserSync) [localhost:3000]
gulp.task('server', () => {
  browserSync.init({
    server: {baseDir: paths.dist.root},
    notify: false
  })
  // watch for source
  gulp.watch(resource.src.jade,   ['build:jade'])
  gulp.watch(resource.src.sass,   ['build:sass'])
  gulp.watch(resource.src.static, ['build:static'])
})

// append Resource Revision
gulp.task('revision:clean', () => {
  del.sync([root.tmp], { force: true })
})

gulp.task('revision:append', () => {
  let revAll = new RevAll({dontRenameFile: [/^\/favicon.ico$/g, '.html']})
  gulp.src(`${paths.dist.root}/**/*`)
    .pipe(revAll.revision())
    .pipe(gulp.dest(root.tmp))
})

gulp.task('revision:copy', () => {
  gulp.src(`${root.tmp}/**/*`)
    .pipe(gulp.dest(paths.dist.root))
})
