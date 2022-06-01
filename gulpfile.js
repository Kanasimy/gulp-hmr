import gulp from 'gulp';
import plumber from 'gulp-plumber';
import webpack from 'webpack';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import autoprefixer from 'autoprefixer';
import pxtorem from 'postcss-pxtorem';
import browser from 'browser-sync';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import del from 'del';
import rename from "gulp-rename";
import webpackConfig  from './webpack.cjs';

const sass = gulpSass(dartSass);
const processor = [
    autoprefixer(),
    pxtorem({
        rootValue: 16,
        unitPrecision: 5,
        propWhiteList: [
            'font',
            'font-size',
            'margin',
            'margin-top',
            'margin-right',
            'margin-bottom',
            'margin-left',
            'padding',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
            'width',
            'height',
            'top',
            'right',
            'bottom',
            'left'
        ],
        selectorBlackList: [
            'html',
            '.menu-trigger',
            '.container',
            '.container-wide',
            '.contaniner-fluid',
            '.fullhd-limiter'
        ],
        replace: true,
        mediaQuery: false,
        minPixelValue: 0
    }),
    csso()
];
const bundler = webpack(webpackConfig);
const  paths = {
    src: {
        html: 'src/*.html',
        scss: 'src/assets/scss/**/*.scss',
       //css: 'src/assets/css/*.css',
        css: 'src/assets/css/*.*',
        css_dest: 'src/assets/css',
        main_js: 'src/assets/js/main.js',
        vendor_scripts: 'src/assets/js/plugins/**/*.js',
        scripts_dest: 'src/assets/js',
        scripts: 'src/assets/js/*.min.js',
        scripts_beauty: 'src/assets/js/*.js',
        fonts: 'src/assets/fonts/*',
        images: 'src/assets/img/**/*'
    },
    dist: {
        html: 'dist',
        styles: 'dist/assets/css',
        scripts: 'dist/assets/js',
        fonts: 'dist/assets/fonts',
        images: 'dist/assets/img'
    },
    public: {
        styles: '../../public/assets/css',
        scripts: '../../public/assets/js',
        fonts: '../../public/assets/fonts',
        images: '../../public/assets/img'
    }
};



// Styles

export const styles = () => {
    return gulp.src(paths.src.scss, { sourcemaps: true })
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processor))
        .pipe(rename('add.min.css'))
        .pipe(gulp.dest(paths.src.css_dest,  { sourcemaps: '.' }))
        .pipe(browser.stream());
}

// Vendor scripts
export const vendorScripts = () => {
    return gulp.src(paths.src.vendor_scripts)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.src.scripts_dest));
}

export const vendorScriptsBeauty = () => {
    return gulp.src(paths.src.vendor_scripts)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.src.scripts_dest));
}

export const mainJs = () => {
    return gulp.src(paths.src.main_js)
        .pipe(rename({basename: 'main', suffix: '.min', extname: '.js'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.src.scripts_dest))
        .pipe(browser.stream());
}

// Clean

const clean = () => {
    return del(paths.dist.html)
}

//Copy
const copy = () => {
    return gulp.src([
        paths.src.fonts,
        //paths.src.images,
        paths.src.css,
       paths.src.main_js,
        paths.src.scripts,
       paths.src.html
    ], {
        base: 'src'
    })
        .pipe(plumber())
        .pipe(gulp.dest(paths.dist.html))
        //.done();
}
// Server

const server = (done) => {
    browser.init({
        //Для тестирования новой сборки
        // server: {
        //     baseDir: 'dist'
        // },
        //Для правки текущей верстки
        proxy: "https://example.com/",
        //hot load
        middleware: [
            webpackDevMiddleware(bundler, {
                publicPath: webpackConfig.output.publicPath,
                stats: { colors: true }
            }),
            webpackHotMiddleware(bundler)
        ],
        // open: true,
        // notify: false,
        // logSnippet: true
    });
    done();
}


const reload = (done) => {
    browser.reload();
    done();
}


// Watcher

const watcher = () => {
  gulp.watch(paths.src.scss, gulp.series(styles));
  gulp.watch(paths.src.html).on('change', gulp.series(copy));
  ///gulp.watch(paths.src.scripts_dest).on('change');
}


export default gulp.series (
    clean,
   // mainJs,
    //
     copy,
    gulp.parallel(
        styles,
    ),
    gulp.series (
        server,
        watcher
    )
);
//Задача с использованием gulp
export const proxyRu = gulp.series (
    clean,
    copy,
    gulp.parallel(
        styles,
    ),
    gulp.series (
        server,
        watcher
    )
);

// //export default gulp.series (
//    // clean,
//    // copy,
//    // copyImages,
//     gulp.parallel (
//         styles,
//       //  htmlMinimize,
//       //  scripts,
//         // createWebp,
//        // spriteSvg,
//        // optimizeSvg
//     ),
//     gulp.series (
//       //  server,
//        // watcher
//     ));