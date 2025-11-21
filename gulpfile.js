const { src, dest, watch, series } = require('gulp');
const postcss = require('gulp-postcss');
const atImport = require('postcss-import');
const nesting = require('postcss-nesting');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const terser = require('gulp-terser'); // JS minifier
const { pipeline } = require('stream');
const { promisify } = require('util');

const pipe = promisify(pipeline);

// --- CSS Task ---
async function cssTask() {
    await pipe(
        src('css/main.css'),
        postcss([
            atImport({ path: ['css'] }),
            nesting()
        ]),
        cleanCSS(),
        rename('main.min.css'),
        dest('dist/css')
    );
}

// --- JS Task ---
async function jsTask() {
    await pipe(
        src('js/theme.js'),
        terser(),
        rename('theme.min.js'),
        dest('dist/js')
    );
}

// --- Watch Task ---
function watchTask() {
    watch('css/**/*.css', cssTask);
    watch('js/**/*.js', jsTask);
}

// --- Exports ---
exports.css = cssTask;
exports.js = jsTask;
exports.build = series(cssTask, jsTask);
exports.default = series(cssTask, jsTask, watchTask);
