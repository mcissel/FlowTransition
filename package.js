Package.describe({
  name: 'mcissel:flow-transition',
  version: '1.0.1',
  summary: 'A transition and layout renderer for FlowRouter',
  git: 'https://github.com/mcissel/FlowTransition',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1');
  api.use('blaze');
  api.use('templating');
  api.use('underscore');
  api.use('velocityjs:velocityjs');
  api.use('kadira:flow-router');

  api.addFiles([
    'section.html',
    'flow-transition.js'
  ], ['client']);

  api.export("FlowTransition", 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mcissel:flow-transition');
  api.addFiles('flow-transition-tests.js');
});
