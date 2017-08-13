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
								'content': 'data(name)',
								
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
						name: 'breadthfirst'
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
    // demo your core ext
				cy.contextMenus({
                                    menuItems: [
                                        {
                                            id: 'remove',
                                            content: 'remove',
                                            tooltipText: 'remove',
                                            image: {src : "remove.svg", width : 12, height : 12, x : 6, y : 4},
                                            selector: 'node, edge',
                                            onClickFunction: function (event) {
                                              var target = event.target || event.cyTarget;
                                              target.remove();
                                            },
                                            hasTrailingDivider: true
                                          },
                                          {
                                            id: 'hide',
                                            content: 'hide',
                                            tooltipText: 'hide',
                                            selector: '*',
                                            onClickFunction: function (event) {
                                              var target = event.target || event.cyTarget;
                                              target.hide();
                                            },
                                            disabled: false
                                          },
                                          {
                                            id: 'add-node',
                                            content: 'add node',
                                            tooltipText: 'add node',
                                            image: {src : "add.svg", width : 12, height : 12, x : 6, y : 4},
                                            coreAsWell: true,
                                            onClickFunction: function (event) {
                                              var data = {
                                                  group: 'nodes'
                                              };
                                              
                                              var pos = event.position || event.cyPosition;
                                              
                                              cy.add({
                                                  data: data,
                                                  position: {
                                                      x: pos.x,
                                                      y: pos.y
                                                  }
                                              });
                                            }
                                          },
                                          {
                                            id: 'remove-selected',
                                            content: 'remove selected',
                                            tooltipText: 'remove selected',
                                            image: {src : "remove.svg", width : 12, height : 12, x : 6, y : 6},
                                            coreAsWell: true,
                                            onClickFunction: function (event) {
                                              cy.$(':selected').remove();
                                            }
                                          },
                                          {
                                            id: 'select-all-nodes',
                                            content: 'select all nodes',
                                            tooltipText: 'select all nodes',
                                            selector: 'node',
                                            onClickFunction: function (event) {
                                              selectAllOfTheSameType(event.target || event.cyTarget);
                                            }
                                          },
                                          {
                                            id: 'select-all-edges',
                                            content: 'select all edges',
                                            tooltipText: 'select all edges',
                                            selector: 'edge',
                                            onClickFunction: function (event) {
                                              selectAllOfTheSameType(event.target || event.cyTarget);
                                            }
                                          }
                                        ]
                                      });
}