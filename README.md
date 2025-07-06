# Сборка GULP для верстки

## Особенности

Работает с препроцессором SCSS

| Команды           | Описание                            |
| ----------------- | ----------------------------------- |
| gulp otf2ttf      | Преобразование шрифтов в `.ttf`     |
| gulp svgSprite    | Собирает все `.svg` иконки в 1 файл |
| gulp / gulp watch | Запуск watch                        |

### Структура

```angular2html
#src/
  |----- fonts/
  |----- iconsprite/
  |----- images/
  |----- js/
  |----- scss/
  |----- index.html
```

### Как пользоваться

Перед использованием, желательно, подготовить все шрифты и разместить в папке `fonts` и запустить команду `gulp otf2ttf`.
По желанию можно запустить `gulp svgSprite`.
Первый запуск пропишет все шрифты в `_fonts.scss` с помощью миксина в виде:

```scss
@font-face {
  font-family: "Lato-Black";
  src: url("../fonts/Lato-Black.woff2") format("woff2"), url("../fonts/Lato-Black.woff")
      format("woff"), url("../fonts/Lato-Black.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}
```

Остается только изменить семейство и "толщину". Пример выше нужно привести к виду:

```scss
@font-face {
  font-family: "Lato";
  src: url("../fonts/Lato-Black.woff2") format("woff2"), url("../fonts/Lato-Black.woff")
      format("woff"), url("../fonts/Lato-Black.ttf") format("truetype");
  font-weight: 900;
  font-style: normal;
}
```

## ☝ Уточнения

- Папка проекта не должна называться gulp
- Запускать можно и отдельные функции, например gulp css
- У кого копирует в dist только .jpg попробуйте немного изменить запись форматов с `/*.{jpg, png, svg, gif, ico, webp}` на `/*.+(png|jpg|gif|ico|svg|webp)`
- В названиях файлов изображений не должно быть пробелов и кириллицы

### 👉 Сервисы хелперы

- https://transfonter.org/ - удобный сервис для преобразования шрифтов

### 👉 Ссылки

- NodeJS - https://nodejs.org/ru/
- Gulp - https://gulpjs.com/
- Sass - https://sass-lang.com/

### 👉 Страницы плагинов

- BrowserSync - https://www.browsersync.io/docs/gulp
- File Include - https://www.npmjs.com/package/gulp-file-include
- Del - https://www.npmjs.com/package/del
- Sass - https://www.npmjs.com/package/gulp-sass
- Autoprefixer - https://www.npmjs.com/package/gulp-autoprefixer
- Group CSS media-queries - https://www.npmjs.com/package/gulp-group-css-media-queries
- Rename - https://www.npmjs.com/package/gulp-rename
- Clean CSS - https://www.npmjs.com/package/gulp-clean-css
- Uglify ES - https://www.npmjs.com/package/gulp-uglify-es
- Imagemin - https://www.npmjs.com/package/gulp-imagemin
- WEBP - https://www.npmjs.com/package/gulp-webp
- WEBP HTML - https://www.npmjs.com/package/gulp-webp-html
- Fonter - https://www.npmjs.com/package/gulp-fonter
- ttf2woff - https://www.npmjs.com/package/gulp-ttf2woff
- ttf2woff2 - https://www.npmjs.com/package/gulp-ttf2woff2
- SVG Sprite - https://www.npmjs.com/search?q=gulp-svg-sprite

### 👉 Решения проблем

- `npm cache clean --force` (очистка npm)
- `npm i npm -g` (установка npm)
