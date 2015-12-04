var Note = function(noteObj) {
	var category = noteObj.category;
	var noteid = noteObj.id;
	var sourceHTMLTemplate = $("#note-template").html();
	var vizContainer = $(".viz > div");

	noteTemplate = Handlebars.compile(sourceHTMLTemplate);

	noteEl = $("<div>", {
		html : noteTemplate(noteObj)
	})
		.draggable({scroll: true })
		.appendTo(vizContainer)
		.attr("id", noteid)

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

	var getId = function() {
		return noteid;
	}

	var setBackground = function(color) {
		console.log(color);
		noteEl.find('.note').css('background', color)
	}

	var setPosition = function(top, left) {
		// id to differentiate from other notes
		$("#" + getId()).css({
			"top" : top,
			"left" : left
		})
	}

	return {
		setBackground: setBackground,
		setPosition: setPosition,
		getCategory: getCategory,
		getId: getId
	}

}
function calculatFontSize(importance) {
	var fontSize = [14,16,21,24];
	return fontSize[importance];
}
