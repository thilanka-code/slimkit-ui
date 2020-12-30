import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import autoPreprocess from 'svelte-preprocess';
import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';

const name = pkg.name
	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
	.replace(/^\w/, m => m.toUpperCase())
	.replace(/-\w/g, m => m[1].toUpperCase());


const production = !process.env.ROLLUP_WATCH;

// Your Preprocess which compiles source code to sass
const preprocess = autoPreprocess({ 
	scss: { includePaths: ['src'] },
	postcss: {
		plugins: [ require('autoprefixer') ],
	},
});

export default {
	input: 'src/index.js',
	output: [
		{ file: pkg.module, 'format': 'es' },
		{ file: pkg.main, 'format': 'umd', name },
		{ file: pkg.main.replace('.js','.min.js'), format: 'iife', name, plugins: [terser()]}
	],
	plugins: [
		svelte({
            dev: !production,
            css: css => {
                css.write('dist/bundle.css');
            },
            // adding the preprocess into svelte loader
            preprocess
        }),
		// svelte(),
		resolve()
	]
};
