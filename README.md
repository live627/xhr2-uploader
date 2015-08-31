# xhr2-uploader

[![NPM version][npm-image]][npm-link]
[![Dependency status][deps-image]][deps-link]
[![devDependency status][devdeps-image]][devdeps-link]
[![peerDependency status][peerdeps-image]][peerdeps-link]
[![GitHub issues](https://img.shields.io/github/issues/live627/xhr2-uploader.svg)](https://github.com/live627/xhr2-uploader/issues)
[![MIT license](http://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

A pure HTML5 uploader

Here is a reference to all the events that may be called by the XHR upload object:

    xhr.upload.addEventListener('loadstart', function(e) {
      // When the request starts.
    });
    xhr.upload.addEventListener('progress', function(e) {
      // While sending and loading data.
    });
    xhr.upload.addEventListener('load', function(e) {
      // When the request has *successfully* completed.
      // Even if the server hasn't responded that it finished.
    });
    xhr.upload.addEventListener('loadend', function(e) {
      // When the request has completed (either in success or failure).
      // Just like 'load', even if the server hasn't
      // responded that it finished processing the request.
    });
    xhr.upload.addEventListener('error', function(e) {
      // When the request has failed.
    });
    xhr.upload.addEventListener('abort', function(e) {
      // When the request has been aborted.
      // For instance, by invoking the abort() method.
    });
    xhr.upload.addEventListener('timeout', function(e) {
      // When the author specified timeout has passed
      // before the request could complete.
    });

The name of the event directly corresponds to methods in `xhrUploadEvents`.

## Build

`npm install` to grab all the dependenceies<br>
`npm run build` uglify and minify JS, compile LESS into CSS and minify it


## Browser support

- Chrome 7+
- Firefox 4+
- IE 10+
- Opera 12+ (Version 12 for MacOS has a buggy API)
- Safari 6+

For all the other browsers, dropzone provides an oldschool file input fallback.

## Why another library?

I find that all good librraries which feature what I want are too big asnd hard to read.

My goals with this script are:
- to keep it as lean and readable as possible
- to be as customisable/modular as possible
- to take full advantage of the latest browser APIs
- to ditch jQuery as a dependency

[npm-image]: https://img.shields.io/npm/v/xhr2-uploader.svg?style=flat
[npm-link]: https://npmjs.org/package/xhr2-uploader
[deps-image]: https://img.shields.io/david/live627/xhr2-uploader.svg?style=flat
[deps-link]: https://david-dm.org/live627/xhr2-uploader
[devdeps-image]: https://img.shields.io/david/dev/live627/xhr2-uploader.svg?style=flat
[devdeps-link]: https://david-dm.org/live627/xhr2-uploader#info=peerDependencies
[peerdeps-image]: https://img.shields.io/david/peer/live627/xhr2-uploader.svg?style=flat
[peerdeps-link]: https://david-dm.org/live627/xhr2-uploader#info=peerDependencies
