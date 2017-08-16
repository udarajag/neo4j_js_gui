function search(){
	var statementx = $('#freeTS').val();
	/*var data = {
			  "statements" : [ {
				  "statement" : "MATCH (x )-[r]-(y) RETURN x,r,y LIMIT 25",
				    "resultDataContents" : [  "graph" ]
				  } ]
				};*/
	if(statementx!='undefined' && statementx != ''){
		var query = "MATCH ((x )-[r]-(y)) WHERE x.name =~ '(?i).*" + statementx + ".*' or y.name =~ '(?i).*" + statementx + ".*' RETURN x,r,y";
		
		var data = {
			  	"statements" :[ {
				  statement : query,
				    resultDataContents : [  "graph" ]
				  } ]
				};
		sendAjax("POST", "http://localhost:7474/db/data/transaction/commit", data, intiGraph, null);
	}
	else{
		alert("Please enter search text");
	}
	
}