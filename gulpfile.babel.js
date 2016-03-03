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
  bower: {
    component: `${__dirname}/bower_components`,
    file:      `${__dirname}/bower.json`
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
    static: `${paths.src.static}/**/*`,
    font:   `${paths.bower.component}/fontawesome/fonts/**/*`
  }
}

import gulp from 'gulp'
import gulpLoaderPlugins from 'gulp-load-plugins'
import del from 'del'
import path from 'path'
import bower from 'bower'
import bowerFiles from 'main-bower-files'
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
  runSequence('clean', 'bower', ['build:jade', 'build:sass', 'build:webpack', 'build:static'], callback)
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

// build Vendor UI Library (bower.json) [Load/Concat]
gulp.task('bower', () => {
  bower.commands.install().on('end', () => {
    const filterCss = ['**/bootstrap-datepicker3.css']
    gulp.src(bowerFiles({filter: filterCss}))
      .pipe($.concat('vendor.css'))
      .pipe($.pleeease())
      .pipe(gulp.dest(paths.dist.css))
    gulp.src(resource.src.font)  // for font-awesome
      .pipe(gulp.dest(paths.dist.font))
    const filterJs = (file) => { // for bootstrap-sass-official
      return /.*\.js/.test(file) && ($.slash(file).indexOf('/bootstrap/') == -1)
    }
    const appendJs = path.join(paths.bower.component, 'bootstrap-datepicker/dist/locales/bootstrap-datepicker.ja.min.js')
    gulp.src(bowerFiles({filter: filterJs}).concat(appendJs))
      .pipe($.concat('vendor.js'))
      .pipe($.if(production, $.uglify()))
      .pipe(gulp.dest(paths.dist.js))
  })
})

// compile Webpack [ ES6(Babel) / Vue -> SPA(main.js) ]
gulp.task('build:webpack', () => {
  process.env.NODE_ENV = (production == true) ? 'production' : 'development'
  let plugins = [
      new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])),
      new webpack.optimize.DedupePlugin()
  ]
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
        modulesDirectories: ['node_modules', 'bower_components', paths.src.js],
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
// check https://github.com/sasstools/sass-lint/pull/168
gulp.task('build:sass', () => {
  gulp.src(resource.src.sass)
    .pipe($.plumber())
    // .pipe($.sassLint())
    // .pipe($.sassLint.format())
    // .pipe($.sassLint.failOnError())
    .pipe($.sass())
    .pipe($.concat('style.css'))
    .pipe($.pleeease())
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream())
})

// copy Static Resource
gulp.task('build:static', () => {
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
  gulp.watch(paths.bower.file,    ['bower'])
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
