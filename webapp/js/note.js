var Note = function(noteObj) {
	var sourceHTMLTemplate   = $("#note-template").html();
	var vizContainer   = $(".viz > div");
	
	noteTemplate = Handlebars.compile(sourceHTMLTemplate);
	
	noteEl = $("<div>", {
		html : noteTemplate(noteObj)
	})
		.draggable({scroll: true })
		.appendTo(vizContainer)
		.css({"top" : vizContainer.height() * Math.random(),
			   "left" : vizContainer.width() * Math.random()
			})
	
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
	
	return {
		setBackground :setBackground
	}
	
}

function calculatFontSize(importance) {
	var fontSize = [14,16,21,24];
	return fontSize[importance];
}
