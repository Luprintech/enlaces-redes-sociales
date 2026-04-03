import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createRateLimiter,
  detectImageType,
  normalizeHttpUrl,
  normalizeMediaUrl,
  validateImageUpload,
  MAX_UPLOAD_BYTES,
} from '../lib/security.js';

test('normalizeHttpUrl accepts only http and https', () => {
  assert.equal(normalizeHttpUrl('https://example.com/path'), 'https://example.com/path');
  assert.equal(normalizeHttpUrl('http://example.com'), 'http://example.com/');
  assert.equal(normalizeHttpUrl('javascript:alert(1)'), null);
  assert.equal(normalizeHttpUrl('notaurl'), null);
});

test('normalizeMediaUrl accepts local paths and remote http urls', () => {
  assert.equal(normalizeMediaUrl('/uploads/avatar.png'), '/uploads/avatar.png');
  assert.equal(normalizeMediaUrl('https://cdn.example.com/a.webp'), 'https://cdn.example.com/a.webp');
  assert.equal(normalizeMediaUrl('ftp://bad.example.com/a.webp'), '');
});

test('rate limiter blocks after max attempts and resets', () => {
  let now = 1000;
  const limiter = createRateLimiter(() => now);

  assert.equal(limiter.check('ip:test', 2, 1000).allowed, true);
  assert.equal(limiter.check('ip:test', 2, 1000).allowed, true);
  assert.equal(limiter.check('ip:test', 2, 1000).allowed, false);

  now += 1001;
  assert.equal(limiter.check('ip:test', 2, 1000).allowed, true);
});

test('detectImageType identifies png/jpeg/webp/gif', () => {
  assert.equal(detectImageType(Uint8Array.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,0,0,0,0]))?.mime, 'image/png');
  assert.equal(detectImageType(Uint8Array.from([0xff,0xd8,0xff,0x00,0,0,0,0,0,0,0,0]))?.mime, 'image/jpeg');
  assert.equal(detectImageType(Uint8Array.from([0x47,0x49,0x46,0x38,0,0,0,0,0,0,0,0]))?.mime, 'image/gif');
  assert.equal(detectImageType(Uint8Array.from([0x52,0x49,0x46,0x46,0,0,0,0,0x57,0x45,0x42,0x50]))?.mime, 'image/webp');
});

test('validateImageUpload rejects oversize and invalid content', () => {
  const big = validateImageUpload({
    bytes: new Uint8Array([1, 2, 3, 4]),
    byteLength: MAX_UPLOAD_BYTES + 1,
  });
  assert.equal(big.ok, false);

  const bad = validateImageUpload({
    bytes: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    byteLength: 12,
  });
  assert.equal(bad.ok, false);

  const good = validateImageUpload({
    bytes: Uint8Array.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,0,0,0,0]),
    byteLength: 12,
  });
  assert.equal(good.ok, true);
});
