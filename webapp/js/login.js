$(function() {
	$('a').attr('href', createMendeleyUrl())
});

function createMendeleyUrl() {
	params = {
		client_id : 2455,
		redirect_uri : "http://localhost:3000/viz.html",
		response_type : "code",
		scope : "all"
	}
	return "https://api.mendeley.com/oauth/authorize?"+$.param(params)
}