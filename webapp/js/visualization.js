var visualization = function() {
	var vizData;
	var vizApp = this;

	var padding = 40; // padding between groups
	var max_group_width = 600;

	// TODO: this assumes fixed note width and height, potentially handle for importance of notes
	var max_note_width = 240;
	var max_note_height = 110;

	var container_width;
	var max_groups_in_row;

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
		container_width = vizContainer.width();
		max_groups_in_row = parseInt(container_width / max_group_width) + 1;

		vizData.folderSpecificAnnotations.map(createNote);

		setGroupPositions(arrayOfNotes, 'category');

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

	var setGroupPositions = function(notes, type) {
		// create a map representing a group:
		// category:{'notes': [notes], 'height': height of a group based on num notes in group, 'posy': y position}
		var groups = {};
		var category;
		notes.map(function(note) {
			if (type == 'category') { // group by topic
				category = note.getCategory();
			} else { // group by paper
				category = note.getPaperId();
			}
			if (category in groups) {
				groups[category]['notes'].push(note);
			} else {
				groups[category] = {'notes':[note], 'height': 0, 'posy': 0};
			}
		})

		// create grid-positioning for groups
		// determine the height of each by the number of notes in the group
		// height will be used to offset groups underneath other groups
		// width is limited by max_group_width, which currently only fits 2 notes (2 notes in a row within a group)
		for (var category in groups) {
			var group_notes = groups[category]['notes'];
			groups[category]['height'] = Math.ceil(group_notes.length/2) * (max_note_height + padding);
		}

		// set height for groups in rows in the viz beyond first row
		var group_keys = Object.keys(groups);
		for (var i = max_groups_in_row; i < group_keys.length; i++) {
			var key = group_keys[i];
			// get key of the group directly above this group in the grid
			var group_above_key = group_keys[i-max_groups_in_row];
			groups[key]['posy'] += groups[group_above_key]['height'] + groups[group_above_key]['posy'];
		}

		console.log(groups);

		// set note positions

		left_order = 0; // order of groups in a row

		for (var category in groups) {
			console.log(category);
			var group_notes = groups[category]['notes'];
			for (var i = 0; i < group_notes.length; i++) {
				var note = group_notes[i];
				// get left position
				var left;
				if (i % 2 == 0) {
					left = left_order * max_group_width;
				} else {
					left = left_order * max_group_width + max_note_width;
				}
				// get top position
				var top;
				if (i % 2 == 0) {
					top = groups[category]['posy'] + ((i/2)*max_note_height)
				} else {
					top = groups[category]['posy']  + (parseInt(i/2)*max_note_height)
				}
				note.position([top,left]);
			}
			left_order++;
			if (left_order >= max_groups_in_row) {
				left_order = 0;
			}
		}
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
				console.log("rearrange custom ");
				console.log(pos);
				note.position(pos);
			});
			saveLayoutButton.fadeOut();
		} else {
			setGroupPositions(arrayOfNotes, arrangement);
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
			console.log("custom layout");
			console.log(pos);
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