const test = require('node:test');
const assert = require('node:assert/strict');
const { buildConfirmationUrl } = require('../loginFlow');

test('buildConfirmationUrl includes the selected province and hospital', () => {
  const url = buildConfirmationUrl('http://localhost/INDEX.HTML', {
    username: 'testuser',
    province: 'Gauteng',
    hospital: 'Charlotte Maxeke Hospital'
  });

  assert.equal(url.pathname, '/dashboard.html');
  assert.equal(url.searchParams.get('username'), 'testuser');
  assert.equal(url.searchParams.get('province'), 'Gauteng');
  assert.equal(url.searchParams.get('hospital'), 'Charlotte Maxeke Hospital');
});
