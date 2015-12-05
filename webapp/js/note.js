var Note = function(noteObj, vizApp, i) {
	var index = i;
	var sourceHTMLTemplate   = $("#note-template").html();
	var vizContainer   = $(".viz > div");
	var noteObj = noteObj;
	var category = noteObj.category;
	var paperid = noteObj.document_id;
	var noteid = noteObj.id;
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
	.attr("id", noteid)
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

	var movePosition = function(arr) {
		$("#" + noteid).animate({
			"top" : arr[1],
			"left" : arr[0]
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
			console.log("has array? " + arr)
			return customPositionData;
		} else {
			console.log("set custom pos " + arr);
			customPositionData = arr;
		}
	}

	var positionGetSet = function(arr) {
		if (typeof arr == 'undefined') {
			return [noteEl.css('top'),noteEl.css('left')];
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
