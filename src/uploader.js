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

	$.fn.uploader = function (o)
	{
		var o = $.extend({
			fileDataValidator: function (name, size, type) {},
			url: 'upload.php'
		}, o),

		attachFiles = function (files)
		{
			$.each(files, function (index, file)
			{
				var
					name = file.name, size = file.size, type = file.type, hash = name.hashCode() + Math.random(),

					xhrUploadEvents = {

						loadstart: function (e)
						{
							o.xhrUploadEvents.loadstart(e, hash);
						},
						progress: function (e)
						{
							o.xhrUploadEvents.progress(e, hash);
						}
					},

					ajaxEvents = {

						success: function (data)
						{
							o.ajaxEvents.success(data, hash);
						},
						error: function (jqXHR, textStatus, errorThrown)
						{
							o.ajaxEvents.error(jqXHR, textStatus, errorThrown, hash);
						}
					};

				if (o.fileDataValidator(name, size, type) === true)
				{
					if (o.reader)
					{
						var reader = new FileReader();
						reader.onload = function ()
						{
							$('textarea#' + $element.attr('id')).val(this.result);
						}
						reader.readAsText(file);

						return;
					}
					var formData = new FormData();
					formData.append('filename', file);

					$.ajax
					({
						url: o.url + ';filename=' + encodeURIComponent(name),
						type: 'POST',
						xhr: function() {  // custom xhr
							myXhr = $.ajaxSettings.xhr();;
							if (myXhr.upload){ // check if upload property exists
								myXhr.upload.addEventListener("loadstart", xhrUploadEvents.loadstart, false);
								myXhr.upload.addEventListener('progress', xhrUploadEvents.progress, false); // for handling the progress of the upload
							}
							return myXhr;
						},
						//Ajax events
						success: ajaxEvents.success,
						error: ajaxEvents.error,
						// Form data
						data: formData,
						//Options to tell JQuery not to process data or worry about content-type
						cache: false,
						contentType: false,
						processData: false
					});
				}
			});
		};

		// Chain methods!
		return this.each(function ()
		{
			var element = this, $element = $(element);

			var $dropZone = ($('<div id="dropzone' + $element.attr('id') + '" style="text-align: center; border: 1px solid black; padding: 20px;" class="windowbg2"><div class="largetext">' + txt_drag_help + '</div><div class="mediumtext">' + txt_drag_help_subtext  + '</div></div>'));

			$dropZone.hide().prependTo($element.parent());

			var dragUIOpened = false;
			var dragTimer = new Date().getTime(),

		documentEvents =
		{
			dragover: function (e)
			{
				if ($element.parent().parent().parent().is(':visible'))
				{
					e.dataTransfer.dropEffect = 'none';

					e.stopPropagation();
					e.preventDefault();

					// Expand the additional option if it's collapsed
					if (!dragUIOpened)
					{
						// Show a neat "Drop the file here" notice
						$element.fadeOut('fast', function()
						{
							$dropZone.fadeIn();
						});
						dragUIOpened = true;
					}
					dragTimer = new Date().getTime();
				}
			},

			dragleave: function(e)
			{
				if ($element.parent().parent().parent().is(':visible'))
				{
					setTimeout(function()
					{
						if (new Date().getTime() - dragTimer > 200)
						{
							$dropZone.fadeOut('fast', function()
							{
								$element.fadeIn();
							});
							dragUIOpened = false;
						}
					}, 200);
				}
			}
		},

		dropZoneEvents =
		{

			dragover: function (e)
			{
				e.dataTransfer.dropEffect = 'copy';
				dragTimer = new Date().getTime();
				$dropZone.toggleClass('highlight', true);
				e.stopPropagation();
				e.preventDefault();
			},
			dragleave: function (e)
			{
				$dropZone.toggleClass('highlight', false);
			},

			drop: function (e)
			{
				var dt = e.dataTransfer;
				e.stopPropagation();
				e.preventDefault();

				// Make sure we are dragging a file over
				if (!dt && !(dt.files || (!$.browser.webkit && dt.types.contains && dt.types.contains('Files'))))
					return false;

				dragUIOpened = false;

				var files = dt.files;
				$dropZone.fadeOut('fast', function()
				{
					$element.fadeIn(function()
					{
						attachFiles(files);
					});
				});
			}
		};

			$.each(documentEvents, function (index, documentEvent)
			{
				document.body.addEventListener(index, documentEvent, false);
			});

			$.each(dropZoneEvents, function (index, dropZoneEvent)
			{
				document.getElementById("dropzone" + element.id).addEventListener(index, dropZoneEvent, false);
			});

			$element.change(function ()
			{
				attachFiles(this.files);
			});
		});
	};
}) (jQuery);