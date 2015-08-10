Package.describe({
  name: 'mcissel:flow-transition',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0');
  api.use(['blaze', 'templating', 'underscore']);

  api.addFiles('flow-transition.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mcissel:flow-transition');
  api.addFiles('flow-transition-tests.js');
});
