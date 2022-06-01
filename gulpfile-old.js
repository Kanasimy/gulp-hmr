import gulp from 'gulp';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import pxtorem from 'postcss-pxtorem';
import combineMq from 'gulp-combine-mq';
import cssnano from 'gulp-cssnano';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import browser from 'browser-sync';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import del from 'del';

const  paths = {
        src: {
            html: 'src/*.html',
            scss: 'src/assets/scss/**/*.scss',
            css: 'src/assets/css/*.css',
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

//
// TASKS
//

// default
gulp.task('default', ['serve']);

// clean
gulp.task('clean', function(){
    return del.sync('dist');
});

// serve
gulp.task('serve', ['scss-to-css', 'vendor-scripts', 'main-js'], function() {
    browserSync.init({
        server: ['src/']
    });

    gulp.watch(paths.src.scss, ['scss-to-css']);
    gulp.watch(paths.src.main_js, ['main-js']);
    gulp.watch(paths.src.vendor_scripts, ['vendor-scripts']);
    gulp.watch(paths.src.html).on('change', browserSync.reload);
});


// build
gulp.task('build', ['clean', 'scss-to-css', 'scss-to-css-beauty', 'vendor-scripts', 'vendor-scripts-beauty', 'main-js', 'main-js-beauty'], function(){
    var html = gulp.src(paths.src.html)
        .pipe(gulp.dest(paths.dist.html));

    var css = gulp.src(paths.src.css)
        .pipe(gulp.dest(paths.dist.styles));

    var js = gulp.src(paths.src.scripts)
        .pipe(gulp.dest(paths.dist.scripts));
    
    var js_beauty = gulp.src(paths.src.scripts_beauty)
        .pipe(gulp.dest(paths.dist.scripts));

    var fonts = gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.dist.fonts));

    var imgs = gulp.src(paths.src.images)
        .pipe(gulp.dest(paths.dist.images));
});


// public
gulp.task('public', ['scss-to-css', 'scss-to-css-beauty', 'vendor-scripts', 'vendor-scripts-beauty', 'main-js', 'main-js-beauty'], function(){
    var css = gulp.src(paths.src.css)
        .pipe(gulp.dest(paths.public.styles));

    var js = gulp.src(paths.src.scripts)
        .pipe(gulp.dest(paths.public.scripts));
    
    var js_beauty = gulp.src(paths.src.scripts_beauty)
        .pipe(gulp.dest(paths.public.scripts));

    var fonts = gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.public.fonts));

    var imgs = gulp.src(paths.src.images)
        .pipe(gulp.dest(paths.public.images));
});



//
// STYLES
//
gulp.task('scss-to-css', function() {
    var processors = [
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
        })
    ];

    return gulp.src(paths.src.scss)
        .pipe(sass().on('error', sass.logError))
        //.pipe(combineMq({beautify: false}))
        .pipe(autoprefixer())
        .pipe(concat('main.min.css'))
        .pipe(cssnano({ minifyFontValues: false, discardUnused: false, zindex: false }))
        .pipe(postcss(processors))
        .pipe(gulp.dest(paths.src.css_dest))
        .pipe(browserSync.stream());
});

// Styles

export const styles = () => {
    return gulp.src('source/less/style.less', { sourcemaps: true })
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
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
            autoprefixer(),
            cssnano({ minifyFontValues: false, discardUnused: false })
        ]))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('paths.src.css_dest', { sourcemaps: '.' }))
        .pipe(browser.stream());
}


// gulp.task('scss-to-css-beauty', function() {
//     var processors = [
//         pxtorem({
//             rootValue: 16,
//             unitPrecision: 5,
//             propWhiteList: [
//                 'font',
//                 'font-size',
//                 'margin',
//                 'margin-top',
//                 'margin-right',
//                 'margin-bottom',
//                 'margin-left',
//                 'padding',
//                 'padding-top',
//                 'padding-right',
//                 'padding-bottom',
//                 'padding-left',
//                 'width',
//                 'height',
//                 'top',
//                 'right',
//                 'bottom',
//                 'left'
//             ],
//             selectorBlackList: [
//                 'html',
//                 '.menu-trigger',
//                 '.container',
// 		        '.container-wide',
//                 '.contaniner-fluid',
//                 '.fullhd-limiter'
//             ],
//             replace: true,
//             mediaQuery: false,
//             minPixelValue: 0
//         })
//     ];
//
//     return gulp.src(paths.src.scss)
//         .pipe(sass().on('error', sass.logError))
//         //.pipe(combineMq({beautify: false}))
//         .pipe(autoprefixer())
//         .pipe(concat('main.css'))
//         //.pipe(cssnano({ minifyFontValues: false, discardUnused: false }))
//         .pipe(postcss(processors))
//         .pipe(gulp.dest(paths.src.css_dest))
//         .pipe(browserSync.stream());
// });




//
// SCRIPTS
//

// vendor scripts
gulp.task('vendor-scripts', function(){
    return gulp.src(paths.src.vendor_scripts)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.src.scripts_dest));
});

gulp.task('vendor-scripts-beauty', function(){
    return gulp.src(paths.src.vendor_scripts)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.src.scripts_dest));
});

// main js
gulp.task('main-js', function(){
    return gulp.src(paths.src.main_js)
        .pipe(rename({basename: 'main', suffix: '.min', extname: '.js'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.src.scripts_dest))
        .pipe(browserSync.stream());
});

gulp.task('main-js-beauty', function(){
    return gulp.src(paths.src.main_js)
        .pipe(gulp.dest(paths.src.scripts_dest))
        .pipe(browserSync.stream());
});

// Default

export default gulp.series(
    // clean,
    // copy,
    // copyImages,
    gulp.parallel(
        styles,
        // html,
        // scripts,
        // svg,
        // sprite,
        // createWebp
    ),
    gulp.series(
        // server,
        // watcher
    ));
