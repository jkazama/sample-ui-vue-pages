root = 
  src:         "#{__dirname}/source"
  dist:        "#{__dirname}/public"
  # dist:      "../src/main/resources/static"
paths =
  src:
    root:      "#{root.src}"
    html:      "#{root.src}/html"
    js:        "#{root.src}/js"
    css:       "#{root.src}/css"
    static:    "#{root.src}/static"
  dist:
    root:      "#{root.dist}"
    js:        "#{root.dist}/js"
    css:       "#{root.dist}/css"
    font:      "#{root.dist}/fonts"
  bower:
    component: "#{__dirname}/bower_components"
    file:      "#{__dirname}/bower.json"
resource =
  src:
    jade:      "#{paths.src.html}/**/*.jade"
    webpack:
      babel:   "#{paths.src.js}/pages/**/*.js"
    sass:      "#{paths.src.css}/**/*.s+(a|c)ss"
    static:    "#{paths.src.static}/**/*"
    font:      "#{paths.bower.component}/fontawesome/fonts/**/*"

gulp   = require "gulp"
$      = do require "gulp-load-plugins"
del    = require "del"
path   = require "path"

bower         = require "bower"
bowerFiles    = require "main-bower-files"
webpack       = require "webpack"
webpackStream = require "webpack-stream"
named         = require "vinyl-named"
browserSync   = require("browser-sync").create()

production = false

# build and watch for developer
gulp.task "default", ["build", "server"]

## build for developer
gulp.task "build", ["clean", "bower", "build:jade", "build:sass", "build:webpack", "build:static"]

## build production
gulp.task "build-prod", ["production", "build"]

# clean dist
gulp.task "clean", -> del.sync ["#{paths.dist.root}/*", "!#{paths.dist.root}/.git*"], { dot: true, force: true }

gulp.task "production", -> production = true

# build Vendor UI Library (bower.json) [Load/Concat]
gulp.task "bower", ->
  bower.commands.install().on "end", ->
    filterCss =
      "**/bootstrap-datepicker3.css"
    gulp.src(bowerFiles({filter: filterCss}))
      .pipe($.concat("vendor.css"))
      .pipe($.pleeease())
      .pipe(gulp.dest(paths.dist.css))
    gulp.src(resource.src.font)  # for font-awesome
      .pipe(gulp.dest(paths.dist.font))
    filterJs = (file) ->         # for bootstrap-sass-official
      /.*\.js/.test(file) and $.slash(file).indexOf("/bootstrap/") is -1
    appendJs =
      path.join(paths.bower.component, "bootstrap-datepicker/dist/locales/bootstrap-datepicker.ja.min.js")
    gulp.src(bowerFiles({filter: filterJs}).concat(appendJs))
      .pipe($.concat("vendor.js"))
      .pipe($.if(production, $.uglify()))
      .pipe(gulp.dest(paths.dist.js))

# compile Webpack [ ES6(Babel) / Vue -> SPA(main.js) ]
gulp.task "build:webpack", ->
  process.env.NODE_ENV = if production is true then "production" else "development"
  plugins =
    if production
      [
        new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"]))
        new webpack.optimize.DedupePlugin()
        new webpack.optimize.UglifyJsPlugin({compress: { warnings: false　}})
      ]
    else
      [
        new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"]))
        new webpack.optimize.DedupePlugin()
      ]
  gulp.src([resource.src.webpack.babel])
    .pipe(named())
    .pipe(webpackStream({
      watch: !production
      module:
        loaders: [
          {test: /\.js$/, loader: "babel?blacklist[]=regenerator"}
          {test: /\.vue$/, loader: "vue"}
        ]
      resolve:
        modulesDirectories: ["node_modules", "bower_components", paths.src.js]
        extensions: ["", ".js", ".vue"]
      plugins: plugins
     }, webpack))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream())  

# compile Jade -> HTML
gulp.task "build:jade", ->
  gulp.src(resource.src.jade)
    .pipe($.plumber())
    .pipe($.jade())
    # .pipe($.htmlhint())
    # .pipe($.htmlhint.reporter())
    .pipe(gulp.dest(paths.dist.root))
    .pipe(browserSync.stream())  

# compile Sass -> CSS
# check https://github.com/sasstools/sass-lint/pull/168
gulp.task "build:sass", ->
  gulp.src(resource.src.sass)
    .pipe($.plumber())
    # .pipe($.sassLint())
    # .pipe($.sassLint.format())
    # .pipe($.sassLint.failOnError())
    .pipe($.sass())
    .pipe($.concat("style.css"))
    .pipe($.pleeease())
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream())

# copy Static Resource
gulp.task "build:static", ->
  gulp.src(resource.src.static)
    .pipe(gulp.dest(paths.dist.root))

# run Development Web Server (BrowserSync) [localhost:3000]
gulp.task "server", ->
  browserSync.init({
    server: {baseDir: paths.dist.root}
    notify: false
  })
  # watch for source
  gulp.watch paths.bower.file,       ["bower"]
  gulp.watch resource.src.jade,      ["build:jade"]
  gulp.watch resource.src.sass,      ["build:sass"]
  gulp.watch resource.src.static,    ["build:static"]
