import WebGL from 'three/addons/capabilities/WebGL.js';

function CheckWebGL() {
    if ( !WebGL.isWebGLAvailable() ) {

        // Initiate function or other initializations here
        console.log("1")
        // animate();
    
    } else {
    
        const warning = WebGL.getWebGLErrorMessage();
        document.getElementById( 'container' ).appendChild( warning );
    
    }
}

export default CheckWebGL

