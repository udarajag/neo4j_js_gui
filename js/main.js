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

function initBadge(returnData){
	//alert(returnData);
}


function intiGraph(returnData){
	
	var elements = [];
	var elementObjs = returnData.results[0].data;
	$.each(elementObjs, function( index, value ) {
		$.each(value.graph.nodes, function( index1, nodeObj ) {
			var nodeName = nodeObj.properties.name;
			if(nodeName.length > 8){
				nodeName = nodeName.substring(0, 8) + '...';
			}
		
			//var nodeObj = value.graph.nodes[0];
		  var node = {data: {id:nodeObj.id, 
			  				name:nodeName,
			  				fullName: nodeObj.properties.name
		  }};
		  
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
								/*'content': 'data(name)',
								'text-wrap': 'wrap',
								'text-max-width': '100px',
								'text-valign': 'center',
						        'text-halign': 'center',
						        'width': '100px',
						        'height': '100px',
						        'font-size': '30px'*/
								 'font-size': '23px',
								'width': '80px',
						        'height': '80px',
								'background-color': '#40E0D0',
								//'label': 'data(id)',
								'label': 'data(name)',
								//'display':'flex',
								//'text-align': 'center',
								'border-style': 'solid',
								'border-color': '#008B8B',
								'border-width': '1px',
								'padding': '10px 2% 15px 15px',
								//'content': 'data(name)',
								//'justify-content': 'space-around',
								//caption-side: top|bottom|initial|inherit
								'caption-side': 'bottom',
								'text-valign': 'center',
						    'text-halign': 'center',
								'content': 'data(name)',
							}
						},

						{
							selector: 'edge',
							style: {
								'curve-style': 'bezier',
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