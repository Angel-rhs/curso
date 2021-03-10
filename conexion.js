	// Configuracion de mi appweb.. accesos a mi bbdd en firebase:
	var firebaseConfig = {
		apiKey: "AIzaSyB0v-8WClQnuQaOq9E_tgHppy3dAavbMiU",
		authDomain: "nuevaapp-fb9f5.firebaseapp.com",
		databaseURL: "https://nuevaapp-fb9f5-default-rtdb.firebaseio.com",
		projectId: "nuevaapp-fb9f5",
		storageBucket: "nuevaapp-fb9f5.appspot.com",
		messagingSenderId: "440404216310",
		appId: "1:440404216310:web:fbae0e117364a5fd3cdfd7"
	};
	// Initializar firebase:
	firebase.initializeApp(firebaseConfig);
    // Trabajar la authentication de firebase de manera mas "manual"
    const auth = firebase.auth();
	// Asignar a una variable a mi conexion:
	const bbdd = firebase.database().ref('comentarios');