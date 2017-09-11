var glayout = 'breadthfirst';

$(document).ready(function(){
	initialize();
	//To set different layouts
	$("[id^='layoutBtn_']").click(function(){
		glayout = $(this).attr('id').split("_")[1];
		initialize();
	});
});

function searchByQuery(query){
    var data = {
            "statements" :[ {
              statement : query,
                resultDataContents : [  "graph" ]
              } ]
            };
    sendAjax("POST", "http://localhost:7474/db/data/transaction/commit", data, intiGraphCy, null);
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
        return "DCI";
    }else if(nodeLabel == "DemVal"){
        return "DV";
    }else if(nodeLabel == "DemConcept"){
        return "DC";
    }else if(nodeLabel == "Publication"){
        return "PB";
    }else if(nodeLabel == "ResearchQuestion"){
        return "RQ";
    }else if(nodeLabel == "ConceptInstance"){
        return "CI";
    }else if(nodeLabel == "CRC"){
        return "CRC";
    }else if(nodeLabel == "OntConceptInstance"){
        return "OCI";
    }else if(nodeLabel == "Variable"){
        return "VAR";
    }else if(nodeLabel == "Value"){
        return "VAL";
    }else {
        return "UN";
    }
}

function getNodeNameCy(nodeType, node) {
    if(nodeType=="DR"){
        return node.properties.uri;
    }else if(nodeType =="DCI"){
        return node.properties.label;
    }else if(nodeType == "DV"){
        return "";
    }else if(nodeType == "DC"){
        return node.properties.name;
    }else if(nodeType == "PB"){
        return node.properties.doi;
    }else if(nodeType == "RQ"){
        return node.properties.questionNo;
    }else if(nodeType == "CI"){
        return node.properties.name;
    }else if(nodeType == "CRC"){
        return node.properties.relation;
    }else if(nodeType == "OCI"){
        return node.properties.name;
    }else if(nodeType == "VAR"){
        return node.properties.label;
    }else if(nodeType == "VAL"){
        return node.properties.label;
    }else {
        return "Unknown node";
    }
}

function getNodeByType(nodeObj){
	var nodeType = getNodeType(nodeObj);
	var nodeName = getNodeNameCy(nodeType, nodeObj);
//	if(nodeName.length > 8){
//		nodeName = nodeName.substring(0, 8) + '...';
//	}

	//var nodeObj = value.graph.nodes[0];
	//var nodeType = getNodeType(nodeObj);
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
  }else if(nodeType == 'RQ'){
	  //node.data['id'] = nodeObj.properties.id;
	  node.data['questionNo'] = nodeObj.properties.questionNo;
	  node.data['sentence'] = nodeObj.properties.sentence;
  }else if(nodeType == 'CI'){
	  node.data['uri'] = nodeObj.properties.uri;
	  node.data['name'] = nodeObj.properties.name;
  }else if(nodeType == 'CRC'){
	  //node.data['id'] = nodeObj.properties.id;
	  node.data['crcNo'] = nodeObj.properties.crcNo;
	  node.data['relation'] = nodeObj.properties.relation;
  }else if(nodeType == 'OCI'){
	  node.data['uri'] = nodeObj.properties.uri;
	  node.data['prefix'] = nodeObj.properties.prefix;
	  node.data['name'] = nodeObj.properties.name;
  }else if(nodeType == 'VAR'){
	 // node.data['id'] = nodeObj.properties.id;
	  node.data['label'] = nodeObj.properties.label;
	  node.data['varName'] = nodeObj.properties.varName;
	  node.data['question'] = nodeObj.properties.question;
	  node.data['dataType'] = nodeObj.properties.dataType;
  }else if(nodeType == 'VAL'){
	  //node.data['id'] = nodeObj.properties.id;
	  node.data['label'] = nodeObj.properties.label;
	  node.data['value'] = nodeObj.properties.value;
  }
  return node;
}
