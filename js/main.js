/*var glayout = 'breadthfirst';

$(document).ready(function(){
	initialize();
	//To set different layouts
	$("[id^='layoutBtn_']").click(function(){
		glayout = $(this).attr('id').split("_")[1];
		initialize();
	});
});*/


/* AJAX send function */
function sendAjax(method, url, data, success, error){
	$.ajax({
		headers: { 
	        'Accept': 'application/json',
	        'Content-Type': 'application/json' 
	    },
		  method: method,
		  url: url,
		  data: JSON.stringify(data),
		  dataType: 'json',
		  success: success,
		  error: error
		});
}

/*function initialize(){
    searchByQuery("match (n1:DataRecord)-[r1:ofDemConcInst]->(n2), (n2)-[r2:ofDemConcept]->(n3) return r1,r2,n1,n2,n3 limit 2500");
}

function search(){
	var statementx = $('#freeTS').val();
	if(statementx!='undefined' && statementx != ''){
		var query = "MATCH ((x)-[r]-(y)) WHERE x.name =~ '(?i).*" + statementx + ".*' or y.name =~ '(?i).*" + statementx + ".*' RETURN x,r,y";
		searchByQuery(query);
	}
	else{
		alert("Please enter search text");
	}
	
}

function initBadge(returnData){
	//alert(returnData);
}*/

function prettyJson(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

/*function getNodeName(node) {
    var nodeLabel = node.labels;
    if(nodeLabel=="DataRecord"){
        return node.properties.uri;
    }else if(nodeLabel =="DemConceptInstance"){
        return node.properties.label;
    }else if(nodeLabel == "DemVal"){
        return "";
    }else if(nodeLabel == "DemConcept"){
        return node.properties.name;
    }else {
        return "Unknown node";
    }
}*/
