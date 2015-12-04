
$(function() {
	var connection = new mendeleyConnection();
	var viz = new visualization();
	connection.init();
	viz.init();
	connection.setNextFunction(viz.setData);
})