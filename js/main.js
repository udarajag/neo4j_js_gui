var glayout = 'breadthfirst';

$(document).ready(function(){
	initialize();
	//To set different layouts
	$("#b1").click(function(){
		glayout = 'random';
		initialize();
	});
		$("#b2").click(function(){
		glayout = 'cose';
		initialize();
	});
		$("#b3").click(function(){
		glayout = 'breadthfirst';
		initialize();
	});
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
	sendAjax("POST", "http://localhost:7474/db/data/transaction/commit", data, intiGraph, null);
	var data2 = {
			  "statements" : [ {
				  "statement" : "MATCH (x )-[r]-(y) RETURN x,r,y LIMIT 25",
				    "resultDataContents" : [  "graph" ]
				  } ]
				};
	sendAjax("POST", "http://localhost:7474/db/data/transaction/commit", data2, initBadge, null);

}

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

function initBadge(returnData){
	//alert(returnData);
}


function intiGraph(returnData){
	
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
		  

		  style: [
						{
							selector: 'node',
							style: {
								'content': 'data(name)'
							}
						},

						{
							selector: 'edge',
							style: {
								'target-arrow-shape': 'triangle',
								'label': 'data(name)',
								'text-rotation': 'autorotate'
							}
						},

						{
							selector: ':selected',
							style: {

							}
						}
					],
					layout: {
						name: glayout
					},

		});

	var selectAllOfTheSameType = function(ele) {
                                    cy.elements().unselect();
                                    if(ele.isNode()) {
                                        cy.nodes().select();
                                    }
                                    else if(ele.isEdge()) {
                                        cy.edges().select();
                                    }
                                };
  	cy.cxtmenu({
					selector: 'node, edge',

					commands: [
						{
							content: 'Data',
							select: function(ele){
								console.log( ele.id() );
							}
						},

						{
							content: 'Meta Data',
							select: function(ele){
								console.log( ele.data('name') );
							}
						},

						{
							content: 'Children',
							select: function(ele){
								console.log( ele.position() );
							}
						}
					]
				});
  	cy.on('select unselect', 'node', _.debounce( function(e){
      var node = cy.$('node:selected');

      if( node.nonempty() ){
        //showNodeInfo( node );

        Promise.resolve().then(function(){
          return highlight( node );
        });
      } else {
        //hideNodeInfo();
        //clear();
      }

    }, 100 ) );
}