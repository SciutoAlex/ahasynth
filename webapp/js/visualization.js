var visualization = function() {
	
	var vizData;
	
	var arrayOfNotes = [];
	
	var folderNameH6, vizContainer
	
	var init = function() {
		folderNameH6 = $('.js-group-name');
		vizContainer = $('.js-vizContainer');
	}
	
	var setData = function(data) {
		vizData = data;
		startViz();		
	}
	
	var startViz = function() {
		console.log(vizData);
		vizContainer.fadeIn();
		
		vizData.folderSpecificAnnotations.map(createNote)
	}
	
	var createNote = function(noteObj) {
		var newNotes = new Note(noteObj);
		newNotes.setBackground(
			colorArray[Math.floor(Math.random()*colorArray.length)]);
		arrayOfNotes.push(newNotes);
	}
	
	return {
		setData : setData,
		init : init
	}
}

var colorArray = 
[
	"#EDDEDE",
	"#EDE3DE",
	"#EDE8DE",
	"#EDEDDE",
	"#E6EDDE",
	"#E0EDDE",
	"#DEEDE0",
	"#DEEDE6",
	"#DEEDEB",
	"#DEEBED",
	"#DEE6ED"
]