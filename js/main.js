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
//								'padding': '10px 2% 15px 15px',
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

						{
							content: 'Children',
							select: function(ele){
								console.log( ele.position() );
							}
						}
					]
				});

  	cy.on('select unselect', 'node', function(e){
      //var node = cy.$('node:selected');

      if( e!=null ){
        var json = JSON.stringify(e.target._private.data);
        $("#selData").val(json);
        //$("#dataSel").html(prettyJson(json));
        Promise.resolve().then(function(){
          //return highlight( node );
        });
      } else {
        $("selData").val('');
      }

    });
}