const buildConfirmationUrl = (baseUrl, values) => {
  const url = new URL('dashboard.html', baseUrl);
  url.searchParams.set('username', values.username || '');
  url.searchParams.set('province', values.province || '');
  url.searchParams.set('hospital', values.hospital || '');
  return url;
};

if (typeof module !== 'undefined') {
  module.exports = { buildConfirmationUrl };
}
