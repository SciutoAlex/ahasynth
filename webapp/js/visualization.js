var visualization = function() {
	var vizData;

	var max_group_height = 300; // TODO: this won't work, because group height depends on num notes
	var max_note_height = 100;

	var max_group_width = 600;
	var max_note_width = 250;

	var container_width;
	var max_groups_in_row;

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
		console.log(folderNameH6);
		vizContainer.fadeIn();
		container_width = vizContainer.width();
		max_groups_in_row = parseInt(container_width / max_group_width);

		console.log("container width is " + container_width);
		console.log(max_groups_in_row);

		vizData.folderSpecificAnnotations.map(createNote)

		setGroupPositions(arrayOfNotes);
	}

	var setGroupPositions = function(notes) {
		// create a category:[notes] map representing groups
		var groups = {};
		notes.map(function(note) {
			category = note.getCategory();
			if (category in groups) {
				groups[category].push(note);
			} else {
				groups[category] = [note];
			}
		})

		// create grid-positioning for groups

		top_order = 0; // order of groups in a col
		left_order = 0; // order of groups in a row

		for (var category in groups) {
			console.log(category);
			var group_notes = groups[category];
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
					top = top_order * max_group_height + ((i/2)*max_note_height)
				} else {
					top = top_order * max_group_height + (parseInt(i/2)*max_note_height)
				}
				console.log("top: " + top + " left: " + left);
				note.setPosition(top,left);
			}
			left_order++;
			if (left_order > max_groups_in_row) {
				left_order = 0;
				top_order++;
			}
		}
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