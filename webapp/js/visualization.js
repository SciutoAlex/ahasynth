var visualization = function() {
	
	var folderNameH6, vizContainer
	var init = function() {
		folderNameH6 = $('.js-group-name');
		vizContainer = $('.js-vizContainer')
	}
	
	var setData = function(data) {
		console.log(data)
		folderNameH6.text(data.selectedGroup.name)
		vizContainer.fadeIn();
		
	}
	
	return {
		setData : setData,
		init : init
	}
}