var Note = function(noteObj, vizApp, i) {
	var index = i;
	var sourceHTMLTemplate   = $("#note-template").html();
	var vizContainer   = $(".viz > div");
	var noteObj = noteObj;
	var customPositionData = [ vizContainer.height() * Math.random(),vizContainer.width() * Math.random()];
	
	noteTemplate = Handlebars.compile(sourceHTMLTemplate);
	
	var noteEl = $("<div>", {
		html : noteTemplate(noteObj)
	})
	.draggable({
		scroll: true,
		start: dragged
	})
	.appendTo(vizContainer)
	.css({
		"top" : customPositionData[0],
		"left" : customPositionData[1]
	});
		
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
	
	function dragged() {
		vizApp.showSaveLayoutButton();
	}
	
	return {
		setBackground :setBackground,
		getNoteAttr : getNoteAttr,
		customPosition : customPositionGetSet,
		position : positionGetSet
	}
	
}

function calculatFontSize(importance) {
	var fontSize = [14,16,18,20];
	return fontSize[importance];
}
