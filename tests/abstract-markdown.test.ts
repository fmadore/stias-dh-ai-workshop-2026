import assert from 'node:assert/strict';
import test from 'node:test';
import { renderAbstract } from '../src/lib/utils/markdown';

test('tags a paragraph that is entirely one bold run as a subhead', () => {
	const html = renderAbstract('Intro paragraph.\n\n**Digital Literacy Gap**\n\nThe section body.');
	assert.match(html, /<p class="prose-subhead"><strong>Digital Literacy Gap<\/strong><\/p>/);
	assert.equal(html.match(/prose-subhead/g)?.length, 1);
});

test('leaves a paragraph that merely opens with a bold run alone', () => {
	// masakhane-4d-framework does exactly this: "**ECHO** focuses on…".
	const html = renderAbstract('**ECHO** focuses on understanding the impact of language AI.');
	assert.doesNotMatch(html, /prose-subhead/);
});

test('leaves a paragraph that ends with a bold run alone', () => {
	const html = renderAbstract('The model is named **4D**');
	assert.doesNotMatch(html, /prose-subhead/);
});

test('does not swallow the text between two separate bold paragraphs', () => {
	const html = renderAbstract('**One**\n\nBody between.\n\n**Two**');
	assert.match(html, /<p class="prose-subhead"><strong>One<\/strong><\/p>/);
	assert.match(html, /<p class="prose-subhead"><strong>Two<\/strong><\/p>/);
	assert.match(html, /<p>Body between\.<\/p>/);
});

test('renders the inline markup the abstracts actually use', () => {
	const html = renderAbstract('A *term*, a **phrase**, and a [link](https://example.test).');
	assert.match(html, /<em>term<\/em>/);
	assert.match(html, /<strong>phrase<\/strong>/);
	assert.match(html, /<a href="https:\/\/example\.test">link<\/a>/);
});
