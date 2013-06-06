jquery.torturial
================

An advanced tutorial plugin for jQuery.

Getting started
---------------

Download both the latest version of [torturial.js](torturial-0.1.js) and [torturial.css](torturial.css), and load them into your project.

The plugin is known to work with the following versions, but it may be compatible with earlier versions.
Please contact me if you have succesfully tested it on a previous version.

Dependency: [jQuery](http://jquery.com/download/) 1.9+ or 2.0+.
Browser compatibility: Google Chrome 27+, Mozilla Firefox 20+, Internet Explorer 8+.

Features
--------

* Editables views, broke down into steps
* Each step is composed of popovers, and elements of the page can be brought back to the front
* Steps follow each other and are triggered by a delay and/or an `on()` event
* Eased navigation

Planned features
----------------

* Event triggered at key moments of the execution
* Option: Making the delay visible to the user, perhaps with a circular progress widget
* Option: Pausing/Resuming the delay for the user
* Option: Giving control to the user on the flow of the steps (previous, next)

Usage
-----

### Methods

#### Initialization

```javascript
$('<div id="torturial"></div>').append('body').torturial({
[ // views
    {
       title: 'Usage',
       steps: [
           {
             popovers: [
                 {
                     id: 'popover-textarea',
                     text: 'Here\'s a text area',
                     attachTo: $('#foo'),
                     attachPos: 'left'
                 }
             ],
             changeOn: ['keypress', 'input', {foo: 'bar'}, function(e) {
                    if(e.which != 23)
                      return false;
                 }],
             delay: 5000,
             foreground: $('li')
           }
        ]
    },
    {
        title: 'Another view',
        steps: [
           {
              popovers: [
                 {
                    text: 'Another popover',
                    attachTo: $('#torturial-title'),
                    attachPos: 'bottom'
                 }
              ],
              delay: 300
           }
        ]
    }
],
{
   startingView: 1,
   startingStep: 0
}
]);
```

#### Visibility


```javascript
$('#torturial').torturial('show');

$('#torturial').torturial('hide');
```

#### Destruction

It first triggers a `.torturial('hide')`, no need to do it twice.

```javascript
$('#torturial').torturial('destroy');
```

### View

The tutorial will be composed of views, that the user will be able to navigate through using his mouse or keyboard. 
Each view acts as a placeholder for different steps.

* `steps` – The array containing the steps of the view.
* `title` – The view's title, selectable with `#turtorial-title`.

### Step

The step is the actual tutoring unit of the plugin.
They give out the information, and show the important elements of the web page.

* `popovers` – The array containing the popovers of the step, to be deleted when it is changed.
* `changeOn` – The array containing the options of the `on()` function of jQuery, please refer to the [API documentation](http://api.jquery.com/on/).
The step changing function will be called after the execution of the event handler. You can return `false` in order to prevent the next step to be loaded and keep your listener alive.
* `delay` – Value in milliseconds. __IMPORTANT__: A delay with the value `0` will result in an imediate change in the step, much like Javascript's [setTimeout](http://www.w3schools.com/jsref/met_win_settimeout.asp) and jQuery's [.delay](http://api.jquery.com/delay/).
* `foreground` – jQuery element or elements to be brought to the forground. Note that all their descendants will be advanced too.

### Popover

Text-containing bubbles that give out indication to the user.

* `text` – The string that the popover will contain.
* `id` – The string for the id attribute of the popover container.
* `attachTo` – jQuery element to which to popover will be attached to. It and its descendants will autoamatically be brought to the foreground.
* `attachPos` – The position of the popover relative to its attachment : `left`, `top`, `right` or `bottom`.
* `position` – Array of offset `top` and `left` positionning the popover absolutely.

### Options

* `startingView` – The index of the view that will be displayed at the creation of the torturial. `Default: 0`
* `startingStep` – The index of the step within the `startingView` to be first displayed at the creation of the torturial. `Default: 0`


### Keyboard shortcuts

* `Right arrow` : Next view (if any)
* `Left arrow` : Previous view (if any)
* `ESC` : Destroy the torturial
