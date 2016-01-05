# FlowTransition (mcissel:flow-transition)

## A Blaze Layout Renderer and Transitioner
A Blaze layout renderer that uses VelocityJS powered transitions. It currently works only with [Kadira Flow-Router](https://github.com/kadirahq/flow-router) (previously meteorhacks:flow-router). This renderer enables:

* Rendering layouts to different sections (regions) using Blaze
* Assign route-to-route transitions for each section
* Transitions can be full page motion, or Velocity / VelocityUI Pack animations
* Sections will only re-render when necessary or when explicitly requested
* Not all sections have to be used on every route

## Getting Started

Add the package to your project with:
~~~
meteor add mcissel:flow-transition
~~~

You will need a few templates and a couple routes, before you can add a transition.

~~~html
<body>
  {{> section name="head"}}
  {{> section name="body"}}
</body>

<template name="header">
  <h1><a href="/">link to the Welcome page</a></h1>
</template>

<template name="welcome">
  <h2>Welcome Page. with a <a href="/articles">link to the articles page</a></h2>
</template>

<template name="articles">
  <h2>Articles page</h2>
</template>
~~~

And set up these routes. **Route names are required**, because that is how the transitions are assigned
~~~js
FlowRouter.route("/",
  name: "home", // required
  action: function() {
    FlowTransition.flow({body: "welcome"});
  }
);

FlowRouter.route("/articles",
  name: "articles", // required
  action: function() {
    FlowTransition.flow({head: "header"}, {body: "articles"});
  }
);
~~~

Now you can set up these transitions by assigning the:

* Section that will be animated (`section`)
* Name of departure route (`from`)
* Name of destination route (`to`)
* Transition object (`txFull` or `txIn`/`txOut`)

~~~js
FlowTransition.addTransition({
  section: 'body',
  from: 'home',
  to: 'articles',
  txFull: 'left' // direction of motion, content will be moving left
});

FlowTransition.addTransition({
  section: 'head',
  from: 'home',
  to: 'articles',
  txIn: {
    hooks: {translateY: '-100%'},
    properties: {translateY: [0, '-100%']},
    options: {
      duration: 220,
      easing: 'spring',
      queue: false,
      complete: function() {
        console.log('You can add a callback function here');
      }
    }
  }
});
~~~

### Re-rendering
When a section's content doesn't change, it will not re-render, UNLESS you assign a transition to that section for that route. For example, if you change your header template to:

~~~html
<template name="header">
  <h1><a href="/">link to the Welcome page</a> <a href="/about">About Us</a></h1>
</template>

<template name="about_us"><h2>Mission Statement and Contact Info</h2></template>
~~~

and add the following code:

~~~js
FlowRouter.route("/about",
  name: "about",
  action: function() {
    FlowTransition.flow({head: "header"}, {body: "about_us"});
  }
});

FlowTransition.addTransition({
  section: 'head',
  from: 'articles',
  to: 'about',
  txIn: 'flipBounceYIn'
});
~~~

In the above case, the `head` section is re-rendered when navigating from '/articles' to '/about', but it will not be re-rendered when navigating from '/' to '/about'.

~~~js
~~~

## Transition Animations

### Full Screen (full section) Transitions
4 full screen transitions are included by default. Technically, they are "full section" transitions, wherein they use 100% of the width and height of the section. Also see: [CSS Suggestions](#css-suggestions)

Use a txFull transition object. The name is one of `[left, right, down, up]` referring to the content's direction of travel. Use just the string, or use it with an `options` object, just like a VelocityJS UI Pack animation. A pair transitions using both forms:

~~~js
FlowTransition.addTransition({
  section: 'body',
  from: 'home',
  to: 'articles',
  txFull: 'left'
});

FlowTransition.addTransition({
  section: 'body',
  from: 'articles',
  to: 'home',
  txFull:
    properties: 'right',
    options: {
      duration: 350,
      easing: 'spring',
      queue: false
    }
});
~~~

Currently, if you use `txFull`, the Flow Transition package will not evaluate the `txIn` or `txOut` objects.

### VelocityJS Animations
The last transition example in the [Getting Started](#getting-started) section shows a VelocityJS animation for the transion in object (`txIn`). Both `txIn` and `txOut` are optional. In that example, I did not include a transition out object (`txOut`) since there was no `head` content present in the `from` route.

A transition object has three parts, each of which hold "key, value" objects:

The `hooks` will be applied BEFORE the transition animation starts, via a $.Velocity.hook() call
```
hooks: {translateY: '-100%'},
```
The `properties` object holds either a string name or animation properties. These are VelocityJS animation properties
```
properties: {translateY: [0, '-100%']},  // move to translateY = 0, from translateY = -100%
```
The `options` object is a set of VelocityJS options
```
options: {duration: 220, easing: 'spring', queue: false}
```

## CSS Suggestions
CSS info
The `section` templates include a wrapper div with the class `transitionable-section`. This div is where Blaze renders the templates. You can also style them by using their id, which is the same as their section name.

~~~css
body {
  margin: 0;
  overflow: hidden;
}

.transitionable-section {
  position: absolute;
  left: 0;
  right: 0;
}

#head {
  height: 40px;
}

#body {
  top: 40px;
}
~~~
I suggest using at least the above CSS, plus: the inner templates should fill their parent section

## `@TODO:`
- *Put a delay or stop all animations to fix the multiple animations bug
- Offer default animation on a per section basis
- Add automatic reverse animation for return routes
- Allow for multiple parent layouts
- Make some tests for tinyTest
