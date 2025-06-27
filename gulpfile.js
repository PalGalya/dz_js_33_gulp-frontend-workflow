const { src, dest, task, watch, series, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create()
const cssnano = require('cssnano')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const csscomb = require('gulp-csscomb')
const autoprefixer = require('autoprefixer')
const mqpacker = require('css-mqpacker')
const sortCSSmq = require('sort-css-media-queries')

const PATH = {
  scssFolder: './assets/scss',
  scssRoot: './assets/scss/style.scss',
  scssAllFiles: './assets/scss/**/*.scss',
  cssFolder: './assets/css',
  htmlAllFiles: './**/*.html',
  jsALlFiles: './assets/js/**/*.js'
}

const PLUGINS = [
  autoprefixer({
    overrideBrowserslist: ['last 5 versions', '> 1%']
  }),
  mqpacker({
    sort: sortCSSmq
  })
]

function scssBase() {
  return src(PATH.scssRoot)
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(postcss(PLUGINS))
    .pipe(dest(PATH.cssFolder))
    .pipe(browserSync.stream())
}

function scssDev() {
  const pluginsForDevMode = [...PLUGINS]
  pluginsForDevMode.splice(0, 1)
  return src(PATH.scssRoot, { sourcemaps: true })
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(postcss(pluginsForDevMode))
    .pipe(dest(PATH.cssFolder, { sourcemaps: true }))
    .pipe(browserSync.stream())
}

function scssMin() {
  const pluginsForMinified = [...PLUGINS, cssnano()]
  return src(PATH.scssRoot)
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(postcss(pluginsForMinified))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(PATH.cssFolder))
}

function scssComb() {
  return src(PATH.scssAllFiles).pipe(csscomb('./.config.json')).pipe(dest(PATH.scssFolder))
}

function synInit() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  })
}

async function reload() {
  browserSync.reload()
}

function watchFiles() {
  synInit()
  watch(PATH.scssAllFiles, scssBase)
  watch(PATH.htmlAllFiles, reload)
  watch(PATH.jsALlFiles, reload)
}

task('scss', series(scssBase, scssMin))
task('min', scssMin)
task('dev', scssDev)
task('comb', scssComb)
task('watch', watchFiles)
