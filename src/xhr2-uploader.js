String.prototype.hashCode = function () {
	var h = 0, i = 0, l = this.length;
	if (l === 0) return h;
	for (; i < l; i++) {
		h = ((h << 5) - h) + this.charCodeAt(i);
		h |= 0; // Convert to 32bit integer
	}
	return h;
};

(function ($) {
	$.fn.uploader = function (conf) {
		var
			conf = $.extend({
				url: 'upload.php',
				maxSize: 10240,
				locale: {
					dropZoneTitle: 'Drop files here',
					dropZoneSubText: 'In order to attach them to this post'
				},
				fileDataValidator: function (name, size, type) {
					if (size > maxSize) {
						alert(name + ': icon too large. Try to get it to be under ' + (maxSize / 1024) + ' KB.');
						return false;
					}
					return true;
				},
				ajaxEvents: {
					error: function (jqXHR, textStatus, errorThrown, hash) {
						var errData = $.parseJSON(jqXHR.responseText), ret = '';
						$.each(errData, function (index, value) {
							ret += '<div class="error">' + value + '</div>';
						});
						$('div#icon' + hash).addClass('errorbox').removeClass('information').html(ret);
					},
					success: function (data, hash) {
						$('div#icon' + hash).html(data);
						$('input[type=file]#icon').remove();
					}
				},
				xhrUploadEvents: {
					progress: function (e, hash) {
						if (e.lengthComputable) {
							var percentComplete = e.loaded / e.total;
							$('progress#icon' + hash).attr({value: e.loaded, max: e.total});
						}
						else {
							// Unable to compute progress information since the total size is unknown
						}
					},
					loadstart: function (e, hash) {
						$('#icon_container').children('div:not([id^=dropzone])').remove().end().append('<div id="icon' + hash + '" class="information center"><progress id="icon' + hash + '"/></div>');
					},
					abort: function (e, hash) {
						$('progress').remove();
					},
					cancel: function (e, hash) {
						$('progress').remove();
					}
				}
			}, conf),

			attachFiles = function (files) {
				$.each(files, function (index, file) {
					var name = file.name, size = file.size, type = file.type, hash = name.hashCode() + Math.random();

					if (conf.fileDataValidator(name, size, type) === true) {
						if (conf.reader) {
							var reader = new FileReader();
							reader.onload = function () {
								$('textarea#' + $element.attr('id')).val(this.result);
							}
							reader.readAsText(file);

							return;
						}
						var formData = new FormData();
						formData.append('filename', file);

						$.ajax({
							url: conf.url + ';filename=' + encodeURIComponent(name),
							type: 'POST',
							xhr: function () {  // custom xhr
								myXhr = $.ajaxSettings.xhr();

								if (myXhr.upload) { // check if upload property exists
									$.each(xhrUploadEvents, function (index, xhrUploadEvent) {
										myXhr.upload.addEventListener(index, xhrUploadEvent, false);
									});
								}
								return myXhr;
							},
							// Ajax events
							success: conf.ajaxEvents.success,
							error: conf.ajaxEvents.error,
							// Form data
							data: formData,
							// Options to tell JQuery not to process data or worry about content-type
							cache: false,
							contentType: false,
							processData: false
						});
					}
				});
			};

		// Chain methods!
		return this.each(function () {
			var element = this, $element = $(element);

			var $dropZone = $('<div id="dropzone' + $element.attr('id') + '" class="dropzone"><div class=" ">' + dropZoneTitle + '</div><small>' + dropZoneSubText + '</small></div>').hide().prependTo($element.parent());

			var dragUIOpened = false;
			var dragTimer = new Date().getTime(),

				documentEvents = {
					dragover: function (e) {
						if ($element.parent().parent().parent().is(':visible')) {
							e.dataTransfer.dropEffect = 'none';

							e.stopPropagation();
							e.preventDefault();

							// Expand the additional option if it's collapsed
							if (!dragUIOpened) {
								// Show a neat "Drop the file here" notice
								$element.fadeOut('fast', function () {
									$dropZone.fadeIn();
								});
								dragUIOpened = true;
							}
							dragTimer = new Date().getTime();
						}
					},

					dragleave: function (e) {
						if ($element.parent().parent().parent().is(':visible')) {
							setTimeout(function () {
								if (new Date().getTime() - dragTimer > 200) {
									$dropZone.fadeOut('fast', function () {
										$element.fadeIn();
									});
									dragUIOpened = false;
								}
							}, 200);
						}
					}
				},

				dropZoneEvents = {
					dragover: function (e) {
						e.dataTransfer.dropEffect = 'copy';
						dragTimer = new Date().getTime();
						$dropZone.toggleClass('highlight', true);
						e.stopPropagation();
						e.preventDefault();
					},
					dragleave: function (e) {
						$dropZone.toggleClass('highlight', false);
					},

					drop: function (e) {
						var dt = e.dataTransfer;
						e.stopPropagation();
						e.preventDefault();

						// Make sure we are dragging a file over
						if (!dt && !(dt.files || (!$.browser.webkit && dt.types.contains && dt.types.contains('Files'))))
							return false;

						dragUIOpened = false;

						var files = dt.files;
						$dropZone.fadeOut('fast', function () {
							$element.fadeIn(function () {
								attachFiles(files);
							});
						});
					}
				};

			$.each(documentEvents, function (index, documentEvent) {
				document.body.addEventListener(index, documentEvent, false);
			});

			$.each(dropZoneEvents, function (index, dropZoneEvent) {
				document.getElementById("dropzone" + element.id).addEventListener(index, dropZoneEvent, false);
			});

			$element.change(function () {
				attachFiles(this.files);
			});
		});
	};
})(jQuery);