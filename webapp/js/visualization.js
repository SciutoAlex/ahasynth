var visualization = function() {
	
	var vizApp = this;
	
	var vizData;
	
	var arrayOfNotes = [];
	
	var folderNameH6, vizContainer, colorButtons, layoutButtons, saveLayoutButton;
	
	var init = function() {
		folderNameH6 = $('.js-group-name');
		vizContainer = $('.js-vizContainer');
		colorButtons = $('.coloring li');
		layoutButtons = $('.positioning .layout');
		saveLayoutButton = $('li[data-action="save_custom"]').hide()	
	}
	
	var setData = function(data) {
		vizData = data;
		startViz();		
	}
	
	var startViz = function() {
		console.log(vizData);
		
		vizContainer.fadeIn();
		vizData.folderSpecificAnnotations.map(createNote);
		
		colorButtons.on('click', function() {
			var cat = $(this).attr('data-color')
			console.log(cat);
			colorNotes(cat);
		});
		
		layoutButtons.on('click', function() {
			var cat = $(this).attr('data-layout')
			console.log(cat);
			rearrangeNotes(cat);
		});
		
		saveLayoutButton.on('click', saveCustomLayout)
	}
	
	var createNote = function(noteObj) {
		var newNote = new Note(noteObj, vizApp, arrayOfNotes.length-1);
		newNote.setBackground(
			colorArray[Math.floor(Math.random()*colorArray.length)]);
		arrayOfNotes.push(newNote);
	}
	
	
	var rearrangeNotes = function(arrangement) {
		if(arrangement == "custom") {
			arrayOfNotes.map(function(note) {
				var pos = note.customPosition();
				note.position(pos);
			});
			saveLayoutButton.fadeOut();
		} else {
			arrayOfNotes.map(function(note) {
				note.position([vizContainer.width()*Math.random(),vizContainer.height()*Math.random()]);
			});
		}
	}
	
	var colorNotes = function(criteria) {
		if(criteria != "") {
			var arrayOfCriteria = generateArrayOfAttributes(criteria, arrayOfNotes);
			arrayOfNotes.map(function(note) {
				var attr = note.getNoteAttr(criteria);
				note.setBackground(colorArray[arrayOfCriteria.indexOf(attr)])
			});
		} else {
			arrayOfNotes.map(function(note) {
				note.setBackground('#eee')
			});
		}
	}
	
	var saveCustomLayout = function() {
		arrayOfNotes.map(function(note) {
			var pos = note.position();
			note.customPosition(pos);
		});
		saveLayoutButton.fadeOut();
	}
	
	this.showSaveLayoutButton = function() {
		console.log('save button')
		saveLayoutButton.fadeIn();
	}

	return {
		setData : setData,
		init : init
	}
}


function generateArrayOfAttributes(criteria, arrayOfNotes) {
	var rawArray = arrayOfNotes.map(function(note) {
		return note.getNoteAttr(criteria);
	});
	
	return rawArray.getUnique();
}

//http://stackoverflow.com/questions/1960473/unique-values-in-an-array
Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

var colorArray = 
[
	"#E1BEE7",
	"#D1C4E9",
	"#C5CAE9",
	"#BBDEFB",
	"#B2EBF2",
	"#DCEDC8",
	"#FFECB3",
	"#D7CCC8",
	"#CFD8DC",
	"#FFCDD2",
	"#F8BBD0"
]