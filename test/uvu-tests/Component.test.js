import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as ENV from '../uvu-setup/env';

// Relies on `setup/register`
import Count from '../../src/Component.svelte';

test.before(ENV.setup);
test.before.each(ENV.reset);

test('should render with "5" by default', () => {
    const name = "Thilanka"
	const { container } = ENV.render(Count, { name });
    // console.log(container.querySelector('h1').innerHTML);
    assert.snapshot(container.querySelector('h1').innerHTML, `Hello ${name}!`)
	// assert.snapshot(
	// 	container.innerHTML,
	// 	`<button id="decr">--</button> <span>5</span> <button id="incr">++</button>`
	// );
});

// test('should accept custom `count` prop', () => {
// 	const { container } = ENV.render(Count, { count: 99 });

// 	assert.snapshot(
// 		container.innerHTML,
// 		`<button id="decr">--</button> <span>99</span> <button id="incr">++</button>`
// 	);
// });

// test('should increment count after `button#incr` click', async () => {
// 	const { container } = ENV.render(Count);

// 	assert.snapshot(
// 		container.innerHTML,
// 		`<button id="decr">--</button> <span>5</span> <button id="incr">++</button>`
// 	);

// 	await ENV.fire(
// 		container.querySelector('#incr'),
// 		'click'
// 	);

// 	assert.snapshot(
// 		container.innerHTML,
// 		`<button id="decr">--</button> <span>6</span> <button id="incr">++</button>`
// 	);
// });

// test('should decrement count after `button#decr` click', async () => {
// 	const { container } = ENV.render(Count);

// 	assert.snapshot(
// 		container.innerHTML,
// 		`<button id="decr">--</button> <span>5</span> <button id="incr">++</button>`
// 	);

// 	await ENV.fire(
// 		container.querySelector('#decr'),
// 		'click'
// 	);

// 	assert.snapshot(
// 		container.innerHTML,
// 		`<button id="decr">--</button> <span>4</span> <button id="incr">++</button>`
// 	);
// });

test.run();