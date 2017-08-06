$(document).ready(function(){
	initialize();
});


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

function initialize(){
	var data = {
			  "statements" : [ {
				  "statement" : "MATCH (x )-[r]-(y) RETURN x,r,y LIMIT 25",
				    "resultDataContents" : [  "graph" ]
				  } ]
				};
	sendAjax("POST", "http://localhost:7474/db/data/transaction/commit", data, initializeLoad, null);
}

function search(){
	var statementx = $('#freeTS').val();
	var data = {
			  "statements" : [ {
				  "statement" : "MATCH (x )-[r]-(y) RETURN x,r,y LIMIT 25",
				    "resultDataContents" : [  "graph" ]
				  } ]
				};
	if(statementx!='undefined'){
		data = {
			  	"statements" :[ {
				  statement : statementx,
				    resultDataContents : [  "graph" ]
				  } ]
				};
	}
	sendAjax("POST", "http://localhost:7474/db/data/transaction/commit", data, initializeLoad, null);
}


function initializeLoad(returnData){
	
	var elements = [];
	var elementObjs = returnData.results[0].data;
	$.each(elementObjs, function( index, value ) {
		$.each(value.graph.nodes, function( index1, nodeObj ) {
		
			//var nodeObj = value.graph.nodes[0];
		  var node = {data: {id:nodeObj.id, 
			  				name:nodeObj.properties.name }};
		  
		  elements.push(node);
		
		})
		
		
		$.each(value.graph.relations, function( index1, relationObj ) {
		
			//var nodeObj = value.graph.nodes[0];
		  var node = {data: {id:relationObj.id, 
			  				name:relationObj.properties.name }};
		  
		  elements.push(node);
		
		})
		
		$.each(value.graph.relationships, function( index2, relationObj ) {
		
			//var nodeObj = value.graph.nodes[0];
		  var relationship = {data: { id: relationObj.id, source: relationObj.startNode, target: relationObj.endNode, name:relationObj.type }};
		  
		  elements.push(relationship);
		
		})
		
		});
	
	
	var cy = cytoscape({
		
		  container: $('#cy'), // container to render in

		  elements: elements,
		  

		  style: [ // the stylesheet for the graph
		    {
		      selector: 'node',
		      style: {
		        'background-color': '#4169E1',
		        'label': 'data(name)'
		      }
		    },

		    {
		      selector: 'edge',
		      style: {
		        'width': 3,
		        'line-color': '#ccc',
		        'target-arrow-color': '#ccc',
		        'target-arrow-shape': 'triangle',
		        'label': 'data(name)'
		      }
		    }
		  ],

		  layout: {
		    name: 'random',
		  }

		});
}