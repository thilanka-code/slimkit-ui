import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import {terser} from 'rollup-plugin-terser';
import pkg from '../package.json';
import { sveltePreprocess } from 'svelte-preprocess/dist/autoProcess';
import babel from 'rollup-plugin-babel'

const name = pkg.name
	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
	.replace(/^\w/, m => m.toUpperCase())
	.replace(/-\w/g, m => m[1].toUpperCase());


const production = !process.env.ROLLUP_WATCH;

// enable for IE11 Support
const legacySupport = false

const babelConfig = {
	extensions: ['.js', '.mjs', '.html', '.svelte'],
	runtimeHelpers: true,
	// exclude: ['../node_modules/@babel/**', '../node_modules/core-js/**', '../node_modules/core-*/**', '../node_modules/webpack/**', '../node_modules/babel-runtime/**', '../node_modules/babel-*/**'],
	exclude: ['node_modules/@babel/**', 'node_modules/core-js/**', 'node_modules/core-*/**', 'node_modules/webpack/**', 'node_modules/babel-runtime/**', 'node_modules/babel-*/**'],
	// exclude: ['node_modules/@babel/runtime/**'],
	// exclude: ['../node_modules/**', './node_modules/**', 'node_modules/**'],
	presets: [
	  [
		'@babel/preset-env',
		{
		  targets: {
			ie: '11',
			chrome: '58',
		  },
		  useBuiltIns: 'usage',
		  corejs: 3,
		},
	  ],
	],
	plugins: [
	  '@babel/plugin-syntax-dynamic-import',
	  [
		'@babel/plugin-transform-runtime',
		{
		  useESModules: true,
		},
	  ],
	],
  }

function serve() {
	let server;
	
	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: './component-demos/index.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: './component-demos/public/build/index.js'
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({
				defaults: { style: 'scss'},
				scss: { prependData: `@import 'component-demos/variables.scss';`} //Customize bulma colors
			}),
            dev: !production,
            css: css => {
                css.write('./component-demos/public/build/bundle.css');
            },
            // // adding the preprocess into svelte loader
            // preprocess
        }),
		// svelte(),
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),

		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('component-demos'),

		// compile to ES 2in oder to support chromium 59+
		legacySupport && babel(babelConfig),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
