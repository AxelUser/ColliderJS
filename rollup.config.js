import uglify from 'rollup-plugin-uglify';

export default {
    input: 'src/main.js',
    output: [
      {file: 'dist/collider.js', format: 'umd'},
      {file: 'dist/collider.min.js', format: 'umd'},
      {file: 'demo/js/collider.min.js', format: 'umd'}
    ],
    plugins: [uglify()]
  };