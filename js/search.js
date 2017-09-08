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
        return node.properties.name;
    }else if(nodeLabel =="DemConceptInstance"){
        return node.properties.name;
    }else if(nodeLabel == "DemVal"){
        return node.properties.name;
    }else if(nodeLabel == "DemConcept"){
        return node.properties.name;
    }else {
        return "Unknown node";
    }
}

/*function getNodeLabel(node){
	var nodeLabel = node.labels;
    if(nodeLabel =="DemConceptInstance"){
        return node.properties.name;
    }else{
    	return "";
    }
}*/

function getNodeColor(node){
    var nodeLabel = node.labels;
    if(nodeLabel=="DataRecord"){
        return "#f7b738";
    }else if(nodeLabel =="DemConceptInstance"){
        return "#d17fcb";
    }else if(nodeLabel == "DemVal"){
        return "#86dce8";
    }else if(nodeLabel == "DemConcept"){
        return "#8ced80";
    }else {
        return "#40E0D0";
    }
}

function getEdgeColor(edge){
    //alert(edge);
    var relType = edge.type;
    if(relType == "ofDemConcInst"){
        return "#7c1655"
    }else{
        return "#0f0009"
    }
}

function getNodeType(node){
    var nodeLabel = node.labels;
    if(nodeLabel=="DataRecord"){
        return "DR";
    }else if(nodeLabel =="DemConceptInstance"){
        return "CI";
    }else if(nodeLabel == "DemVal"){
        return "DV";
    }else if(nodeLabel == "DemConcept"){
        return "DC";
    }else {
        return "UN";
    }
}

function getNodeByType(nodeObj){
	var nodeName = getNodeNameCy(nodeObj);
//	if(nodeName.length > 8){
//		nodeName = nodeName.substring(0, 8) + '...';
//	}

	//var nodeObj = value.graph.nodes[0];
	var nodeType = getNodeType(nodeObj);
  var node = {data: {id:nodeObj.id
                    , name:nodeName
                    ,fullName: nodeObj.properties.name
                    ,nodeColor: getNodeColor(nodeObj)
                    ,nodeType: nodeType
                    //,label : getNodeLabel(nodeObj)
  }};
  
  if(nodeType == 'CI'){
	  //node.data.push({'question':nodeObj.question});
	  node.data['question'] = nodeObj.properties.question;
	  node.data['dataType'] = nodeObj.properties.dataType;
	  node.data['uri'] = nodeObj.properties.uri;
	  node.data['label'] = nodeObj.properties.label;
  }else if(nodeType == 'DC'){
	  node.data['uri'] = nodeObj.properties.uri;
  }else if(nodeType == 'DV'){
	  node.data['uri'] = nodeObj.properties.uri;
	  node.data['label'] = nodeObj.properties.label;
	  node.data['value'] = nodeObj.properties.value;
  }
  return node;
}

function intiGraphCy(returnData){

	var elements = [];
	var elementObjs = returnData.results[0].data;
	$.each(elementObjs, function( index, value ) {
		$.each(value.graph.nodes, function( index1, nodeObj ) {
		    //var nodeType = getNodeType(nodeObj.labels);
		  elements.push(getNodeByType(nodeObj));

		})

		$.each(value.graph.relationships, function( index2, relationObj ) {
		  var relationship = {data: {  source: relationObj.startNode
		    , target: relationObj.endNode
		    , name:relationObj.type
		    , edgeColor: getEdgeColor(relationObj)}};
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
								//'background-color': '#40E0D0',
								'background-color': 'data(nodeColor)',
								'label': 'data(name)',
								'border-style': 'solid',
								'border-color': '#008B8B',
								'border-width': '1px',
								//'caption-side': 'bottom',
								'text-valign': 'center',
						        'text-halign': 'center',
								'content': 'data(name)',
								'color': 'white',
                                'text-outline-width': 2,
                                'background-opacity': 0.9,
							}
						},

						{
							selector: 'edge',
							style: {
								'curve-style': 'bezier',
								'target-arrow-shape': 'triangle',
								'label': 'data(name)',
								'text-rotation': 'autorotate',
								'line-color': 'data(edgeColor)',
								'text-margin-x':-15
							}
						},

						{
							selector: ':selected',
							style: {
								'background-opacity': 1,
                                //'background-color': 'black',
                                'line-color': 'black',
                                'target-arrow-color': 'black',
                                'source-arrow-color': 'black',
                                'text-outline-color': 'black',
                                'width': '130px',
						        'height': '130px',
						        'border-width': '3px',
						        'font-size':'1.3em',
						        'font-weight':'bold'
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
        $("#selNodeDes").html(getNodeDesc(json));
        Promise.resolve().then(function(){
        });
      } else {
        //$("selData").val('');
    	  $("#selNodeDes").html('');
      }

    });

    cy.on('tap', 'node', function(){
        var nodeType = this.data('nodeType');
      try {
        if( nodeType == "DR"){
            window.open( this.data('name') );
        }else if(nodeType == "CI"){
            var query = "match(n1:DemConceptInstance)-[r:hasValue]->(n2:DemVal) where n1.uri='"+this.data('uri')+"' return r,n1,n2";
            searchByQuery(query);
        }
      } catch(e){
        window.location.href = this.data('name');
      }
    });
}


function getNodeDesc(json){
	var html = "";
	var jsonObj = $.parseJSON(json);
	$.each(jsonObj, function(index, element) {
		if(index != 'nodeColor' && index != 'nodeType' && index != 'id'){
			html += "<div class='col-xs-4'>" + index + "</div><div class='col-xs-8'>:" + element + "</div>";
		}
	});
	return html;
}