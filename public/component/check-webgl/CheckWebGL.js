import WebGL from 'three/addons/capabilities/WebGL.js';


if (WebGL.isWebGLAvailable() ) {

    // Initiate function or other initializations here
    const node = document.createElement("div");
    const textnode = document.createTextNode("WebGL Available");
    node.appendChild(textnode);
    document.getElementById( 'container' ).appendChild( node );
    // animate();

} else {

    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById( 'container' ).appendChild( warning );

}


