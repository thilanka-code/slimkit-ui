import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import {terser} from 'rollup-plugin-terser';
import pkg from '../package.json';
import { sveltePreprocess } from 'svelte-preprocess/dist/autoProcess';

const name = pkg.name
	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
	.replace(/^\w/, m => m.toUpperCase())
	.replace(/-\w/g, m => m[1].toUpperCase());


const production = !process.env.ROLLUP_WATCH;

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
		format: 'es',
		name: 'app',
		dir: './component-demos/public/build/'
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
		resolve(),
		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('component-demos'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
