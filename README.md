# xhr2-uploader
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

## License
MIT
