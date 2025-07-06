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
        css:   sourceFolder + "/scss/style.scss",
        js:    sourceFolder + "/js/common.js",
        img:   sourceFolder + "/images/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
        fonts: sourceFolder + "/fonts/*.ttf"
    },
    watch: {
        html:  sourceFolder + "/**/*.html",
        css:   sourceFolder + "/scss/**/*.scss",
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
    webp = require('gulp-webp'),
    webpHtml = require('gulp-webp-html'),
    svgSprite = require('gulp-svg-sprite'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    fonter = require('gulp-fonter');

function browserSync(params) {
    bSync.init({
        server: {
            baseDir: path.clean
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileInclude())
        .pipe(webpHtml())
        .pipe(dest(path.build.html))
        .pipe(bSync.stream())
}

function images() {
    return src(path.src.img)
        .pipe(
            webp({
                quality: 70
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(bSync.stream())
}

function js() {
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
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(cleanCss())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(bSync.stream())
}

function fonts() {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
}

gulp.task('svgSprite', function () {
    return gulp.src([sourceFolder + '/iconsprite/*.svg'])
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../icons/icons.svg",
                }
            }
        }))
        .pipe(dest(path.build.img))
});

gulp.task('otf2ttf', function () {
    return gulp.src([sourceFolder + '/fonts/*.otf'])
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(sourceFolder + '/fonts/'));
});

function fontsStyle() {
    let file_content = fs.readFileSync(sourceFolder + '/scss/_fonts.scss');
    if (file_content == '') {
        fs.writeFile(sourceFolder + '/scss/_fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(sourceFolder + '/scss/_fonts.scss', '@font-face {\n    font-family: "' + fontname + '";\n    src: url("../fonts/' + fontname + '.woff2") format("woff2"),\n         url("../fonts/' + fontname + '.woff") format("woff"),\n         url("../fonts/' + fontname + '.ttf") format("truetype");\n    font-weight: 400;\n    font-style: normal;\n}\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}

function cb() { }

function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean(params) {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;