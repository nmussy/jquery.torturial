Changelog
=========

---

### 0.1.0    June 10, 2013

* Custom event triggers are now fired, see the README
* Fixed elements not being brought back to the background on `hide` and `destroy`

### 0.0.8    June 8, 2013

* Fixed page getting cleaned twice when it reached its natural destruction

### 0.0.7    June 8, 2013

* Cleaned up CSS, no longer directly managed by the Javascript, except for the popover positionning
* Fixed stack ordering for attached and foregrounded elements

### 0.0.6    June 8, 2013

* Fixed issues created by the last patch

### 0.0.5    June 8, 2013

* End of tutorial clean up

### 0.0.4    June 7, 2013

* `delay` fix

### 0.0.3    June 7, 2013

* The `changeOn` handler is now removed on whether or not it was successfully executed, notably on `destroy` or when another step is loaded
* The `delay` timeout is now removed whether or not it was reached, notably on `destroy` or when another step is loaded

### 0.0.2    June 7, 2013

* Fixed arrow position, taking in consideration the border radius of the popover
* The popover can't be out of the page bounds anymore (experimental)

### 0.0.1    June 6, 2013

* Initial version