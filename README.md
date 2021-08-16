# Сборка GULP для верстки
## Особенности.
Работает с препроцессором SASS

Команды               | Описание                 
--------------------  | -----------   
gulp otf2ttf     | Преобразование шрифтво в `.ttf` 
gulp svgSprite     | Собирает все `.svg` иконки в 1 файл
gulp / gulp watch     | Запуск watch

###Структура
```angular2html
#src/
  |----- fonts/
  |----- iconsprite/
  |----- images/
  |----- js/
  |----- sass/
  |----- idnex.html
```
###Как пользоваться
Перед использованием, желательно, подготовить все шрифтыи разместить в папке `fonts` и запустиь команду `gulp otf2ttf`.
По желанию можно запустить `gulp svgSprite`.
Первый запуск пропишет все шрифты в `fonts.sass` с помощью миксина в виде:
```
+font-face("Lato-Black", "../fonts/Lato-Black", 400)
+font-face("Lato-Bold", "../fonts/Lato-Bold", 400)
+font-face("Lato-Light", "../fonts/Lato-Light", 400)
+font-face("Lato-Regular", "../fonts/Lato-Regular", 400)
```
Остается только указать семейство первым параметром и "толщину". Пример выше нужно привести к виду:
```
+font-face("Lato", "../fonts/Lato-Black", 900)
+font-face("Lato", "../fonts/Lato-Bold", 700)
+font-face("Lato", "../fonts/Lato-Light", 300)
+font-face("Lato", "../fonts/Lato-Regular", 500)
```

##☝ Уточнения.
* У кого проблемы с плагином WEBPCSS нужно установить converter командой -
  `npm install webp-converter@2.2.3 --save-dev`
* Папка проекта не должна называться gulp
* Запускать можно и отдельные функции, например gulp css
* У кого копирует в dist только .jpg попробуйте немного изменить запись форматов с `/*.{jpg, png, svg, gif, ico, webp} на /*.+(png|jpg|gif|ico|svg|webp)`
* Для WEBP-CSS следует использовать настройки: `webpcss({webpClass: '.webp',noWebpClass: '.no-webp'}`
* WEBP-CSS выдает ошибку если в названии файла картинки есть пробелы и/или кириллица

###👉 Ссылки:
* NodeJS - https://nodejs.org/ru/
* Gulp - https://gulpjs.com/

###👉 Страницы плагинов:
* BrowserSync - https://www.browsersync.io/docs/gulp
* File Include - https://www.npmjs.com/package/gulp-file-include
* Del - https://www.npmjs.com/package/del
* Sass - https://www.npmjs.com/package/gulp-sass
* Autoprefixer - https://www.npmjs.com/package/gulp-autoprefixer
* Group CSS media-queries - https://www.npmjs.com/package/gulp-group-css-media-queries
* Rename - https://www.npmjs.com/package/gulp-rename
* Clean CSS - https://www.npmjs.com/package/gulp-clean-css
* Uglify ES - https://www.npmjs.com/package/gulp-uglify-es
* Babel - https://www.npmjs.com/package/gulp-babel
* Imagemin - https://www.npmjs.com/package/gulp-imagemin
* WEBP - https://www.npmjs.com/package/gulp-webp
* WEBP HTML - https://www.npmjs.com/package/gulp-webp-html
* WEBP CSS - https://www.npmjs.com/package/gulp-webpcss
* Fonter - https://www.npmjs.com/package/gulp-fonter
* ttf2woff - https://www.npmjs.com/package/gulp-ttf2woff
* ttf2woff2 - https://www.npmjs.com/package/gulp-ttf2woff2
* SVG Sprite - https://www.npmjs.com/search?q=gulp-svg-sprite


### 👉Решения проблем:
* `npm cache clean --force` (очистака npm)
* `npm i npm -g` (установка npm)