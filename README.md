# FlowTransition (mcissel:flow-transition)

## A Blaze Layout Renderer and Transitioner
A Blaze layout renderer that uses VelocityJS powered transitions. It currently works only with [Kadira Flow-Router](https://github.com/kadirahq/flow-router) (previously meteorhacks:flow-router). This renderer enables:

* Rendering layouts to different sections (regions) using Blaze
* Assign transitions for each section, organized by route name
* Transitions can be:
.. * Pre-defined full page transitions: sliding up, right, down, or left
.. * Velocity or VelocityUI Pack animations
* Custom options can be included to override default transitions
* Sections will only re-render when necessary or when explicitly requested
* Not all sections have to be used on every route

## To Do

- Allow for multiple parent layouts
- Offer default animation on a per section basis
- Add automatic reverse animation for return routes
- Put a delay or stop all animations to fix the multiple animations bug
- Add a CSS suggestions section to this readme file
- Make some tests for tinyTest

## Getting Started

~~~
meteor add mcissel:flow-transition
~~~

You will need a few templates and a couple routes, before you can add a transition.

~~~html
<body>
  <section name="head"></section>
  <section name="body"></section>
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

FlowRouter.route("/",
  name: "articles", // required
  action: function() {
    FlowTransition.flow({head: "header"}, {body: "articles"});
  }
~~~

Now you can set up these transitions by assigning the:

* Section that will be animated (`section`)
* Name of destination route (`from`)
* Name of departure route (`to`)
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
    pre: {translateY: '-100%'},
    animation: {translateY: [0, '-100%']},
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
A section will not be re-rendered if its content is the same, UNLESS a transition is explicitly assigned to that route. For example, change your header template, and add another template to your html:

~~~html
<template name="header">
  <h1><a href="/">link to the Welcome page</a> <a href="/about">About Us</a></h1>
</template>

<template name="about_us"><h2>Mission Statement and Contact Info</h2></template>
~~~

And add this route:

~~~js
FlowRouter.route("/about",
  name: "about",
  action: function() {
    FlowTransition.flow({head: "header"}, {body: "about_us"});
  }
});
~~~

In this case, the header section is not re-rendered, because the content is the same. However, if you were to assign a transition to the head section for this route, that would trigger a re-render and the transition animation would occur.

## Transition Animations

### Full Screen (full section) Transitions
4 full screen transitions are included by default. Technically, they are "full section" transitions, wherein they use 100% of the width and height of the section. Also see: [CSS Suggestions](#css-suggestions)

Use a txFull transition object (string or 2 part array). The name is one of `[left, right, down, up]` referring to the content's direction of travel. When using the 2 part array, the string name is the first array element, and a standard VelocityJS options object is the second array element. An example of forward and backward transitions using both forms:

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
  txFull: ['right', {
      duration: 350,
      easing: 'spring',
      queue: false
    }]
});
~~~

Currently, if you use `txFull`, the Flow Transition package will not evaluate the `txIn` or `txOut` objects.

### VelocityJS Animations
The last transition example in the [Getting Started](#getting-started) section shows a VelocityJS animation for the transion in object (`txIn`). Both `txIn` and `txOut` are optional. In that example, I did not include a transition out object (`txOut`) since there was no `head` content present in the `from` route.

Let's take apart the `txIn` object:

The `pre` object is applied to the content using a $.Velocity.hook() call
```
.. pre: {translateY: '-100%'},
```
This is the animation object
```
.. animation: {translateY: [0, '-100%']},
```


`options: { ..
  duration: 220, ..
  easing: 'spring', ..
  queue: false, ..
  complete: function() { ..
    console.log('You can add a callback function here'); ..
  } ..
}`

## CSS Suggestions
CSS info
