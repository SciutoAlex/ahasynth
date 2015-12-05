var Note = function(noteObj, vizApp, i) {
	var index = i;
	var sourceHTMLTemplate   = $("#note-template").html();
	var vizContainer   = $(".viz > div");
	var noteObj = noteObj;
	var category = noteObj.category;
	var paperid = noteObj.document_id;
	noteObj.copyString = "(" + noteObj.documentObj.authors[0].last_name + " " + noteObj.documentObj.year + ")";
	var customPositionData = [ vizContainer.height() * Math.random(),vizContainer.width() * Math.random()];

	noteTemplate = Handlebars.compile(sourceHTMLTemplate);

	var noteEl = $("<div>", {
		html : noteTemplate(noteObj)
	})
	.draggable({
		scroll: true,
		start: dragged
	})
	.appendTo(vizContainer);

	var sourceEl = noteEl.find('.source').hide();

	noteEl.find('h4').css('font-size', calculatFontSize(noteObj.importance));

	noteEl.find('.source-button').hover(function() {
		console.log('hover')
		sourceEl.stop();
		sourceEl.slideDown();
	}, function() {
		sourceEl.stop();
		sourceEl.slideUp();
	})

	new Clipboard(noteEl.find('.copy-button')[0]);


	var getCategory = function() {
		return category;
	}

	var getPaperId = function() {
		return paperid;
	}

	var setBackground = function(color) {
		console.log(color);
		noteEl.find('.note').css('background', color)
	}

	var setPosition = function(arr) {
		noteEl.css({
			"top" : arr[0],
			"left" : arr[1]
		});
	}

	var movePosition = function(arr) {
		noteEl.animate({
			'top' : arr[0],
			'left' : arr[1]
		});
	}

	var returnSize = function() {
		return [noteEl.width(), noteEl.height()];
	}

	var getNoteAttr = function(attr) {
		console.log(attr)
		console.log(noteObj[attr])
		return noteObj[attr];
	}

	var customPositionGetSet = function(arr) {
		if (typeof arr == 'undefined') {
			return customPositionData;
		} else {
			customPositionData = arr;
		}
	}

	var positionGetSet = function(arr, start) {
		if (typeof arr == 'undefined') {
			return [noteEl.css('top'), noteEl.css('left')];
		} else if (start) {
			setPosition(arr);
		} else {
			movePosition(arr);
		}
	}

	function dragged() {
		vizApp.showSaveLayoutButton();
	}

	return {
		setBackground :setBackground,
		getNoteAttr : getNoteAttr,
		customPosition : customPositionGetSet,
		position : positionGetSet,
		getCategory: getCategory,
		getPaperId: getPaperId
	}

}
function calculatFontSize(importance) {
	var fontSize = [14,16,18,20];
	return fontSize[importance];
}
