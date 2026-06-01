module.exports = [
  {
    name: 'main entry',
    path: 'dist/assets/index-*.js',
    limit: '60 KB',
    gzip: true,
  },
  {
    name: 'react vendor',
    path: 'dist/assets/react-*.js',
    limit: '50 KB',
    gzip: true,
  },
  {
    name: 'router vendor',
    path: 'dist/assets/router-*.js',
    limit: '25 KB',
    gzip: true,
  },
  {
    name: 'query vendor',
    path: 'dist/assets/query-*.js',
    limit: '18 KB',
    gzip: true,
  },
  {
    name: 'all assets gzipped',
    path: 'dist/assets/*.js',
    limit: '180 KB',
    gzip: true,
  },
]
