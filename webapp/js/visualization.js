var visualization = function() {
	var vizData;

	var padding = 30; // padding between groups
	var max_group_width = 600;

	// TODO: this assumes fixed note width and height, potentially handle for importance of notes
	var max_note_width = 250;
	var max_note_height = 150;

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
		max_groups_in_row = parseInt(container_width / max_group_width) + 1;

		vizData.folderSpecificAnnotations.map(createNote);

		// TODO: should set type to be either 'topic' or 'papers', have separate thing for 'custom'
		var grouping_type = 'topic';
		setGroupPositions(arrayOfNotes, grouping_type);
	}

	var setGroupPositions = function(notes, type) {
		// create a map representing a group:
		// category:{'notes': [notes], 'height': height of a group based on num notes in group, 'posy': y position}
		var groups = {};
		var category;
		notes.map(function(note) {
			if (type == 'topic') { // group by topic
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
				note.setPosition(top,left);
			}
			left_order++;
			if (left_order >= max_groups_in_row) {
				left_order = 0;
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