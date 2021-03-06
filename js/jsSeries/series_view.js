
	makeTarget(document.getElementById("voltageInstance"));
	makeSource(voltageInstance, connector);
	makeDraggable(voltageInstance);
	
	function makeSource(id, connector) {
		jsPlumb.makeSource( connector, {
			parent:id,
			anchor: 'Continuous',
			maxConnections: 1, 
			connector: 'Flowchart',
			connectorStyle : { 
				strokeStyle:"#00C5CD",
				lineWidth: 5
			},
			paintStyle: {
				fillStyle: "none"
			}
		});	
	}
	
	function makeTarget(state) {
		jsPlumb.makeTarget(state, {
			anchor: 'Continuous',
			maxConnections: 1, 
			paintStyle: {
				fillStyle: "#FF8360"
		}});
	}
	
	function makeDraggable(id) {
		jsPlumb.draggable(id, {
			containment:"parent"
		});
	}
	
	function remove(state, event) {
		jsPlumb.detachAllConnections($(state));
		//available_nodes.splice(available_nodes.indexOf(state),1);
		$(state).remove();
	}
	
	var resistance_count = 0;
	$(document).on("click", "#resistanceInstance", function () {
	
		var id = "R" + resistance_count;
		
		var newState = $('<div>').attr('id', id).addClass('resistance');
		var connector = $('<div>').addClass('connector');
		var title = $('<p>').text(id);
		$(newState).append(title);
		
		newState.append(connector);
		$('#diagramContainer').append(newState);
		
		makeTarget(newState);
		makeSource(id, connector);
		makeDraggable(id);
		//available_nodes.push(newState);
		
		if(jQuery.isTouchCapable()){
			newState.doubletap(function(e) {
				remove(this, e);
			});
		}
		else {
			newState.dblclick(function(e) {
				remove(this, e);
			});
		}
		
		resistance_count++;
		
	});
	
	jsPlumb.bind("connection", function(info) {
	
		var connections = jsPlumb.getConnections();
		var lastConnection = connections[connections.length-1];
		
		if(lastConnection.targetId == lastConnection.sourceId)
			jsPlumb.detach(lastConnection);
		else {
			lastConnection.addOverlay([ "Arrow", { foldback:0.85, location:0.50, width:25 } ]);
		}
		
	});

	$(window).resize(function(){
		jsPlumb.repaintEverything();
	});
	
	function connect(source, target, label) {
		if(target != 'voltageInstance') {
			jsPlumb.connect({
				source: source,
				target: target,
				anchor: 'Continuous',
				endpointStyles:[ 
				{ 	fillStyle:"#00C5CD"},
				{ 	fillStyle:"#FF8360"}
				],
				paintStyle:{ strokeStyle:"#00C5CD", lineWidth:5 },
				connector:'Flowchart',
				overlays:[ 
					[ "Label", { label:label } ]
				],
			});
		}
		else {
			jsPlumb.connect({
				source: "R" + (resistance_count - 1),
				target: target,
				anchor: 'Continuous',
				endpointStyles:[ 
				{ 	fillStyle:"#00C5CD"},
				{ 	fillStyle:"#FF8360"}
				],
				paintStyle:{ strokeStyle:"#00C5CD", lineWidth:5 },
				connector:'Flowchart',
				overlays:[ 
					[ "Label", { label:label } ]
				],
			});
		}
	}
	
	function loadSeriesView(source, target, x, y, value, label) {
	
		var id = "R" + resistance_count;
		
		var newState = $('<div>').attr('id', id).addClass('resistance');
		
		newState.css({
			'top': x + "px",
			'left': y + "px"
		});
		
		var connector = $('<div>').addClass('connector');
		var title = $('<p>').text(value);
		$(newState).append(title);
		
		newState.append(connector);
		$('#diagramContainer').append(newState);
		
		makeTarget(newState);
		makeSource(id, connector);
		makeDraggable(id);
		
		
		if(source == 'voltageInstance')
			connect(source, id, label);
		else
			connect("R" + (resistance_count-1) , id, label);
		
		//available_nodes.push(newState);
		
		if(jQuery.isTouchCapable()){
			newState.doubletap(function(e) {
				remove(this, e);
			});
		}
		else {
			newState.dblclick(function(e) {
				remove(this, e);
			});
		}
		
		resistance_count++;
	}
	

