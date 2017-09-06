function search(){
	var statementx = $('#freeTS').val();
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

function searchByQuery(query){
    var data = {
            "statements" :[ {
              statement : query,
                resultDataContents : [  "graph" ]
              } ]
            };
    sendAjax("POST", "http://localhost:7474/db/data/transaction/commit", data, intiGraphCy, null);
}

function getNodeNameCy(node) {
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
}

function intiGraphCy(returnData){

	var elements = [];
	var elementObjs = returnData.results[0].data;
	$.each(elementObjs, function( index, value ) {
		$.each(value.graph.nodes, function( index1, nodeObj ) {
		    //var nodeType = getNodeType(nodeObj.labels);
			var nodeName = getNodeNameCy(nodeObj);
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

		  var node = {data: {id:relationObj.id,
			  				name:relationObj.properties.name }};

		  elements.push(node);

		})

		$.each(value.graph.relationships, function( index2, relationObj ) {
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

								'width': '100px',
						        'height': '100px',
								'background-color': '#40E0D0',
								'label': 'data(name)',
								'border-style': 'solid',
								'border-color': '#008B8B',
								'border-width': '1px',
								'caption-side': 'bottom',
								'text-valign': 'center',
						        'text-halign': 'center',
								'content': 'data(name)',
								'color': 'white',
                                'text-outline-width': 2,
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
                                'background-color': 'black',
                                'line-color': 'black',
                                'target-arrow-color': 'black',
                                'source-arrow-color': 'black',
                                'text-outline-color': 'black'
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


						//Check

						{
							content: 'Children',
							select: function(ele){
								console.log( ele.position() );
							}
						}
					]
				});

  	cy.on('select unselect', 'node', function(e){
      if( e!=null ){
        var json = JSON.stringify(e.target._private.data);
        $("#selData").val(json);
        Promise.resolve().then(function(){
        });
      } else {
        $("selData").val('');
      }

    });
}