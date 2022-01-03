// 1) otf2ttf
// 2) svgSprite
// 3) watch

let projectFolder = 'dist';
let sourceFolder  = "#src";

let fs = require('fs');

let path = {
    build: {
        html:  projectFolder + "/",
        css:   projectFolder + "/css/",
        js:    projectFolder + "/js/",
        img:   projectFolder + "/images/",
        fonts: projectFolder + "/fonts/"
    },
    src: {
        html:  [
            sourceFolder + "/*.html" , "!" + sourceFolder + "/_*.html"
        ],
        css:   sourceFolder + "/sass/style.sass",
        js:    sourceFolder + "/js/common.js",
        img:   sourceFolder + "/images/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
        fonts: sourceFolder + "/fonts/*.ttf"
    },
    watch: {
        html:  sourceFolder + "/**/*.html",
        css:   sourceFolder + "/sass/**/*.sass",
        js:    sourceFolder + "/js/**/*.js",
        img:   sourceFolder + "/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}"
    },
    clean: "./" + projectFolder + "/"
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    bSync = require("browser-sync").create(),
    fileInclude = require("gulp-file-include"),
    del = require("del"),
    sass = require('gulp-sass')(require('sass')),
    autoprefixer = require("gulp-autoprefixer"),
    groupMedia = require("gulp-group-css-media-queries"),
    cleanCss = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify-es").default,
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp');
/**
 *  Конвертирует тег <img src=""> в
 *        <picture>
 *           <source srcset="img/image.webp" type="image/webp">
 *           <img src="img/image.jpg" alt="">
 *       </picture>
 * @type {function(*): *}
 */
const webpHtml = require('gulp-webp-html');
const webpCss = require('gulp-webp-css');

const svgSprite = require('gulp-svg-sprite');

const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter');



function browserSync(params) {
    bSync.init({
        server: {
            baseDir: path.clean
        },
        port: 3000,
        notify: false
    })
}

function html(){
    return src(path.src.html)
        .pipe(fileInclude())
        .pipe(webpHtml())
        .pipe(dest(path.build.html))
        .pipe(bSync.stream())
}

function images(){
    return src(path.src.img)
        .pipe(
            webp({
                quality: 70 //0 to 100
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false}],
                interlaced: true,
                optimizationLevel: 3 //0 to 7
            })
        )
        .pipe(dest(path.build.img))
        .pipe(bSync.stream())
}

function js(){
    return src(path.src.js)
        .pipe(fileInclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(bSync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            sass({
                outputStyle: "expanded"
             }).on('error', sass.logError)
        )
        .pipe(groupMedia())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: true
        }))
        .pipe(
            webpCss()
        )
        .pipe(dest(path.build.css)) //выгрузка
        .pipe(cleanCss())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css)) //выгрузка сжатого файла
        .pipe(bSync.stream())
}

function fonts(){
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
    src(path.src.fonts)
        .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
}
// Команда для сбора всех svg иконок в 1 файл
gulp.task('svgSprite', function (){
    return gulp.src([sourceFolder + '/iconsprite/*.svg'])
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../icons/icons.svg", //sprite file name
                    // example: true  //выгрузка .html с примером
                }
            }
        }))
})
// Команда для преобразования шрифтов otf в ttf
gulp.task('otf2ttf', function (){
    return gulp.src([sourceFolder + '/fonts/*.otf'])
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(sourceFolder + '/fonts/'))
})

function fontsStyle() {

    let file_content = fs.readFileSync(sourceFolder + '/sass/_fonts.sass');
    if (file_content == '') {
        fs.writeFile(sourceFolder + '/sass/_fonts.sass', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(sourceFolder + '/sass/_fonts.sass', '+font-face("' + fontname + '", "../fonts/' + fontname + '", 400)\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}

function cb() { }

function watchFiles(params){
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], images)
}

function clean(params){
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle;
exports.images = images;
exports.fonts = fonts;
exports.js     = js;
exports.css     = css;
exports.html    = html;
exports.build   = build;
exports.watch   = watch;
exports.default = watch;