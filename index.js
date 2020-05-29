import fetch from 'node-fetch';

const tests = [
  ['default', {}],
  ['googleReferer', {
    'headers': {
      'Referer': 'https://www.google.com',
    },
  }],
];

const main = async () => {
  const urls = process.argv.filter(value => value && value.startsWith('http'));

  const results = await measure(urls);
  console.log(results);
};

const measure = (urls) => {
  return Promise.all(
    urls.map(url =>
      measureUrl(url).then(value => [url, new Map(value)])
    )
  );
};

const measureUrl = (url) => {
  return Promise.all(
    tests.map(test =>
     checkLength(url, test[1]).then(value => [test[0], value])
    )
  );
};

const checkLength = async (url, opts) => {
  const response = await fetch(url, {
    ...opts,
    method: 'GET',
  });
  if (response.ok) {
    const length = response.headers.get('content-length');
    if (length) {
      return Number(length);
    }
  }
  return 0;
};

main();
