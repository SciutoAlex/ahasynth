var mendeleyConnection = function() {
	var appKey = "";
	var nextFunction = {};
	
	var signinContainer = $('.signin');
	var progressBar = $(".js-step-3 .progress-bar");
	var step1Container = $('.js-step-1')
	var step2Container = $('.js-step-2')
	var step3Container = $('.js-step-3')
	var listOfFolders = $('.js-step-2-content .list-group')
	var totalCalls = 1;
	var madeCalls = 0;
	
	var init = function() {
		$('#js-sign-in-button').click(authenticate)
	}
	
	var authenticate = function() {
		step1Container.hide();
		var options = { 
			clientId: 2455			
		};
		var auth = MendeleySDK.Auth.implicitGrantFlow(options);
		MendeleySDK.API.setAuthFlow(auth);
		showListOfGroups();
	}
	
	var showListOfGroups = function() {

		
		MendeleySDK.API.folders.list().done(function(groups) {
			groups.map(function(group) {
				link = $('<a>', {
					text : group.name,
					click: function(){ gatherDataForViz(group) },
					class: "list-group-item"
				})
				listOfFolders.append(link)
			})
			
			step2Container.fadeIn();
		}).fail(function(request, response) {
			window.alert('uh oh! there was a problem getting your list of folders. :-(')
		});		
	}
	
	var gatherDataForViz = function(group) {
		step2Container.hide();
		step3Container.show();
		var asyncTasks = []
		asyncTasks.push(getAllAnnotations)
		asyncTasks.push(getIdsinFolder(group.id))
		async.parallel(asyncTasks, function(err, results) {
			var allAnnotations = results[0];
			var documents = results[1];
			var docIds = documents.map(function(doc) { return doc.id})
			var folderSpecificAnnotations = allAnnotations.filter(function(note) { return docIds.indexOf(note.document_id) != -1 })
			setTimeout(function() {
				nextFunction({
					allAnnotations : allAnnotations,
					documents : documents,
					folderSpecificAnnotations : folderSpecificAnnotations,
					selectedGroup : group
				});
				signinContainer.fadeOut();
			}, 500)
			
		});
	}
	
	var gatherAnnotationsFromFolder = function(id, next) {
		getAllNotes(function(allNotes) {
			next(allNotes.filter(function(note) {
				return documentIds.indexOf(note.document_id) != -1
			}));
		});
	}
	
	
	var getIdsinFolder = function(id) {
		return function(next) {
			MendeleySDK.API.documents.list({folderId : id}).done(function(docs) {
				totalCalls += docs.length;
				var docIds = docs.map(function(doc) { return doc.id });
				async.map(docIds, getDocData, next)
			});
		}
	}
	
	var incrementProgressBar = function() {
		madeCalls += 1;
		progressBar.css('width', Math.floor(100*madeCalls/totalCalls) + "%")
	}
	
	var getDocData = function(docId, next) {
		MendeleySDK.API.documents.retrieve(docId)
		.done(function(doc) {
			incrementProgressBar();
			next(null,doc);
		});
	}
	
	var getAllAnnotations = function(next) {
		var allNotes = [];
		MendeleySDK.API.annotations.list().done(function(notes) {
			allNotes = allNotes.concat(notes)
			totalStoredNotesCount = MendeleySDK.API.annotations.count;
			totalCalls += Math.floor(totalStoredNotesCount/20);
			incrementProgressBar();
			if(totalStoredNotesCount !== allNotes.length) {
				getNotes(allNotes, next);
			}
		});
	}
	
	var getNotes = function(allNotes, next) {
		totalStoredNotes = MendeleySDK.API.annotations.count;
		MendeleySDK.API.annotations.nextPage().done(function(notes) {
			incrementProgressBar();
			allNotes = allNotes.concat(notes)
			if(totalStoredNotes !== allNotes.length) {
				getNotes(allNotes, next);
			} else {
				next(null, allNotes)
			}
		})
	}


	
	return {
		init : init,
		setNextFunction : function(func) {
			nextFunction = func;
		}
	}
}