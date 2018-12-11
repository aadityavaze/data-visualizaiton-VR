



const Graph = ForceGraphVR()
      (document.getElementById('3d-graph'))
        .jsonUrl('final.json')
        .d3Force("link", d3.forceLink().distance(d => d.distance))
		.d3Force("Random_force", RadialRepulsionForce)
 		.linkVisibility(false)
 		/*.nodeThreeObject(({ id }) => new THREE.Mesh(
          [
            new THREE.BoxGeometry(Math.random() * 20, Math.random() * 20, Math.random() * 20),
            new THREE.ConeGeometry(Math.random() * 10, Math.random() * 20),
            new THREE.CylinderGeometry(Math.random() * 10, Math.random() * 10, Math.random() * 20),
            new THREE.DodecahedronGeometry(Math.random() * 10),
            new THREE.SphereGeometry(Math.random() * 10),
            new THREE.TorusGeometry(Math.random() * 10, Math.random() * 2),
            new THREE.TorusKnotGeometry(Math.random() * 10, Math.random() * 2)
          ][id%7],
          new THREE.MeshLambertMaterial({
            color: Math.round(Math.random() * Math.pow(2, 24)),
            transparent: true,
            opacity: 0.75
          })
        ))*/
 		/*.onNodeClick(node => {
          // Aim at node from outside it
          const distance = 40;
          const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
          Graph.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            node, // lookAt ({ x, y, z })
            3000  // ms transition duration
          );
        })*/
 		//.cameraPosition({ x:0, y:0, z: 100 })
 		//.d3Force("radial force", d3.forceRadial(100))
 		//.nodeThreeObject(node => {
        	//const sprite = new SpriteText(node.name);
            //sprite.color = new RGBColour(255, 255, 255);
           //sprite.textHeight = 8;
           // return sprite;
       // })
 		//.numDimensions(2)
 ;


var nodes;

var worldPos;




	function restartForces(){
		state.d3ForceLayout().restart();
}	    
	var t=setInterval(restartForces,10000);

//Defining the Rdial Repulsion Force 

RadialRepulsionForce.initialize = function(_) {
    nodes = _;
  };
function RadialRepulsionForce(alpha) {

	//Get camera position
	var cameraEl = document.querySelector('a-entity');
	worldPos = new THREE.Vector3();
	worldPos.setFromMatrixPosition(cameraEl.object3D.matrixWorld);


	


    //nodes[0].fixed=true;//nodes[0].x=0;//nodes[0].y=0;
    //viewNode= nodes[nodes.length-1];
    var thetaArray= [];  

    //Adding angle in radians (-pi,pi] corresponding to each node
  	for (var i = 1, n = nodes.length, node; i < n; i++) {
	    node = nodes[i];
	    var theta=Math.atan2(node.y,node.x);
	    thetaArray.push({theta:theta,index:i});
	}
    
   
 	var idealAngle = 4*Math.PI/(nodes.length);
 	//Sorting the angles
    thetaArray.sort(function(a,b){return a.theta-b.theta});
    
 	//Force vector field mimicing radial replusion between consecutive pairs of angular-sorted nodes
  	for (var i = 0, n = thetaArray.length, node1, node2, k = alpha * 0.4; i < n; i++){
     	var j = (i+1)%n;


		

    	node1 = nodes[(thetaArray[i].index)];
    	node2 = nodes[(thetaArray[j].index)]; 


    	var theta1=Math.atan2(node1.y,node1.x);
    	var theta2=Math.atan2(node2.y,node2.x);


    	//idealAngle=theta1+theta2+0.26;
    	var deltaTheta = (Math.abs(thetaArray[i].theta-thetaArray[j].theta))-idealAngle;
    	deltaZ=Math.abs(node1.z-node2.z);
    	idealDeltaZ=30;
		if(deltaTheta<0 && deltaZ <= idealDeltaZ) {


			var node1Relative = {x: node1.x -worldPos.x, 
			y: node1.y-worldPos.y, z:  node1.z-worldPos.z};


			var node2Relative = {x: node2.x -worldPos.x, 
			y: node2.y-worldPos.y, z:  node2.z-worldPos.z};


			var modulusNode1 = Math.sqrt(node1Relative.x*node1Relative.x + 
				node1Relative.y*node1Relative.y + node1Relative.z*node1Relative.z);

			var modulusNode2= Math.sqrt(node2Relative.x*node2Relative.x + 
				node2Relative.y*node2Relative.y + node2Relative.z*node2Relative.z);


			var unitNode1 = {x: node1Relative.x / modulusNode1, y: node1Relative.y / modulusNode1, z: node1Relative.z / modulusNode1};

			var unitNode2 = {x: node2Relative.x / modulusNode2,y: node2Relative.y / modulusNode2, z: node2Relative.z / modulusNode2};


			

			var dotProductNode1Node2 = unitNode1.x*unitNode2.x+ unitNode1.y*unitNode2.y+ unitNode1.z*unitNode2.z;


			

			node1.vx += k * deltaTheta * ((node1Relative.x * dotProductNode1Node2) - node2Relative.x );
			node1.vy += k * deltaTheta * ((node1Relative.y * dotProductNode1Node2) - node2Relative.y );
			node1.vz += k * deltaTheta * ((node1Relative.z * dotProductNode1Node2) - node2Relative.z );



			node2.vx += k * deltaTheta * ((node2Relative.x * dotProductNode1Node2) - node1Relative.x );
			node2.vy += k * deltaTheta * ((node2Relative.y * dotProductNode1Node2) - node1Relative.y );
			node2.vz += k * deltaTheta * ((node2Relative.z * dotProductNode1Node2) - node1Relative.z );

		    }



	
  }

    }
 