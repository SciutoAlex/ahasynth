var Note = function(noteObj, vizApp, i) {
	var index = i;
	var sourceHTMLTemplate   = $("#note-template").html();
	var vizContainer   = $(".viz > div");
	var noteObj = noteObj;
	var category = noteObj.category;
	var paperid = noteObj.document_id;
	var noteid = noteObj.id;

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

	var getCategory = function() {
		return category;
	}

	var getPaperId = function() {
		return paperid;
	}

	var getId = function() {
		return noteid;
	}

	var setBackground = function(color) {
		console.log(color);
		noteEl.find('.note').css('background', color)
	}

	var movePosition = function(arr) {
		noteEl.animate({
			left: arr[0],
			top: arr[1]
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
			console.log(arr)
			customPositionData = arr;
		}
	}

	var positionGetSet = function(arr) {
		if (typeof arr == 'undefined') {
			return [noteEl.css('left'),noteEl.css('top')];
		} else {
			movePosition(arr);
		}
	}

	var setPosition = function(top, left) {
		// id to differentiate from other notes
		$("#" + getId()).css({
			"top" : top,
			"left" : left
		})
	}

	var getCategory = function() {
		return category;
	}

	var getPaperId = function() {
		return paperid;
	}

	var getId = function() {
		return noteid;
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
		getPaperId: getPaperId,
		setPosition: setPosition,
		getId: getId
	}

}
function calculatFontSize(importance) {
	var fontSize = [14,16,18,20];
	return fontSize[importance];
}
