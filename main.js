/**
 * TODO:
 * Validar la no construccion de un boton cuando ya este presente.
 * Crear funcion que cierre los comentarios "subPost"
 * Cambiar la pantalla para el usuario no logeado
 */



//INICIAR VARIABLES
var mostrar=[];
//MAIN POST:
class post{
    userEmail;
    comentario;
    likes;
    tipoPost;
    subPost;
    key;
    constructor(key,comentario,userEmail,tipoPost,subPost,likes){
        this.likes=likes;
        this.comentario=comentario;
        this.userEmail=userEmail;
        this.tipoPost=tipoPost;
        this.subPost=subPost;
        this.key=key;
    }
}

//SUB POST:
class subPost{
    idUser;
    postComented;
    constructor(idUser,postComented){
        this.idUser=idUser;
        this.postComented=postComented;
    }
}

//INICIO SESION // AUTHENTICATION 

var loggedUser="";


    //SINGUP EVENTOS_____________________________________________________________________________________
    const signUpForm = document.querySelector('#signUp-form');
    signUpForm.addEventListener('submit', (e)=> {
        e.preventDefault();
        const email = document.querySelector('#signUp-email').value;
        const password = document.querySelector('#singUp-password').value;
        //La forma mas "manual", por asi llamarlo:
        auth
            .createUserWithEmailAndPassword(email,password)
            .then(userCredential => {
                
                $('#signUpModal').modal('hide');
                signUpForm.reset();
            })
    })
    //SINGUP EVENTOS
    const logOutModal = document.querySelector('#logOut');
    logOutModal.addEventListener('click', (e)=> {
        auth.signOut().then(() => {
        })
    })
    
    //AUTH STATE CHANGED
    //Evento que se dispara cada ves que cambie la autenticacion
    auth.onAuthStateChanged(user =>{
        if(user){
			validarLogeo(user);
            //Acceder al nombre
            console.log(user.email);
            loggedUser=user.email;
        }else{
            console.log("El usuario no esta logedo");
			validarLogeo(user);
            loggedUser="";
            //deleteTabla();
        }
    })

    //----------------------------------------------------------------------------------------------
	// LOGEAR CON DIFERENTES TIPOS DE REDES SOCIALES

    //LOGGIN whit E-MAIL:
    const signInForm = document.querySelector('#logIn-form');
    signInForm.addEventListener('submit', (e)=> {
        e.preventDefault();
        const emailLogIn = document.querySelector('#logIn-email').value;
        const passwordLogIn = document.querySelector('#logIn-password').value;

        auth
            .signInWithEmailAndPassword(emailLogIn,passwordLogIn)
            .then(userCredential => {
                    
                $('#signInModal').modal('hide');
                signInForm.reset();
            })
			.catch(err =>{
				Swal.fire(
					'Acceso denegado!',
					'El usuario o contraseña ingresados,no son validos',
					'warning'
				)
				console.log(err);
			})
    })

    //LOGGIN whit GOOGLE:
	const btnGoogleIn = document.querySelector('#signInGoogleBtn');
	btnGoogleIn.addEventListener('click',(e)=>{
		e.preventDefault();
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider)
			.then(result => {
				$('#signInModal').modal('hide');
				signInForm.reset();
				console.log('Si, se conecto con google..!!');
	
			})
			.catch(err =>{
				Swal.fire(
					'Acceso denegado!',
					'El usuario o contraseña ingresados,no son validos',
					'warning'
				)
				console.log(err);
			})
	})
	//LOGGIN whit FACEBOOK:
	const btnFacebookIn = document.querySelector('#signInFacebookBtn');
	btnFacebookIn.addEventListener('click',(e)=>{
		e.preventDefault();
		
		const provider = new firebase.auth.FacebookAuthProvider();
		auth.signInWithPopup(provider)
			.then(result => {
				$('#signInModal').modal('hide');
				signInForm.reset();
				console.log('Si, se conecto con Facebook..!!');
				
			})
			.catch(err =>{
				Swal.fire(
					'Acceso denegado!',
					'El usuario o contraseña ingresados,no son validos',
					'warning'
				)
				console.log(err);
			})
	})

    // PROCESOS DE INTERFACE:
    //------------------------------------------------------------------------------------
    // Cambiar opciones en el navbar, segun logged or not logged
	const elementsLoggedIn = document.querySelectorAll('.logged-in');
	const elementsLoggedOut = document.querySelectorAll('.logged-out');

	const validarLogeo = user => {
		if(user){
            getPost();
			elementsLoggedIn.forEach(link => link.style.display ='block');
			elementsLoggedOut.forEach(link => link.style.display ='none');
		}else{
			elementsLoggedIn.forEach(link =>link.style.display ='none');
			elementsLoggedOut.forEach(link =>link.style.display ='block');
            
		}
	}

//SET MAIN POST
function setMainPost(e){
    e.preventDefault();
    let comentario = $("#txtPost").val();
   
    if(comentario.length==0){
        Swal.fire(
            'Existen campos incompletos!',
            'Revisa la informacion, parace que faltan campos por rellenar.',
            'error'
        ) 
    }else{
        let post = bbdd.push();
        post.set({
            comentario : comentario,
            userEmail : loggedUser,
            likes : "",
            subPost: "",
            tipoPost: "mainPost"
        });
        post.on('value', (snapshot) => {
            const data = snapshot.val();
            console.log(data);
        });
    }
    getPost();
}

//MOSTRAR A TRAVES DE UNA TARJETA MODAL
function getPost(){
    //Extraer y recorrer datos desde firebase
    mostrar=[];
    firebase.database().ref('comentarios').once('value', function(snapshot) {       
        snapshot.forEach(function(childSnapshot) {
            var show =new post(childSnapshot.key, childSnapshot.val().comentario, childSnapshot.val().userEmail,childSnapshot.val().tipoPost,childSnapshot.val().subPost,childSnapshot.val().likes );
            mostrar.push(show);
        });
        
      
        //La variable sera encargada de construir la tabla en el documento html
        var data = "";
        for(var i=0;i<mostrar.length;i++){ 
            //START MODAL:
            data+="<div class='card border-primary mb-3' id='"+mostrar[i].key+"'>";
            //HEADER:
            data+="<div class='card-header'>"+mostrar[i].userEmail+"</div>";
            //POST:
            //Inicia con un div, el cual se cierra al terminar el feedback.
            data+="  <div class='card-body'><p class='card-text'>"+mostrar[i].comentario+"</p>";
            //FEEDBACK:
            data+="<button type='submit'  class='btn btn-secondary' onclick=\"newPost(event,\'"+mostrar[i].key+"\')\"><i class='far fa-comments'></i> Comentarios</button> <button type='submit'  class='btn btn-primary' onclick=\"updateLike(\'"+mostrar[i].key+"\')\"><i class='far fa-thumbs-up'></i> Likes</button> <button type=''  class='btn btn-secondary ml-auto'>"+mostrar[i].likes.length+"</button></div>";
            data+="<div class='container' id='div"+mostrar[i].key+"'></div>";
            //END MODAL
            data+="</div>";
        }
        // Envian datos al documento html:
        $("#contenidoPost").html(data);
    })
}

function getSubPost(kSP){
    //Extraer y recorrer datos desde firebase
    mostrar=[];
    firebase.database().ref('comentarios').once('value', function(snapshot) {       
        snapshot.forEach(function(childSnapshot) {
            var show =new post(childSnapshot.key, childSnapshot.val().comentario, childSnapshot.val().userEmail,childSnapshot.val().tipoPost,childSnapshot.val().subPost,childSnapshot.val().likes );
            mostrar.push(show);
        });
        var data = "";
        for(var i=0;i<mostrar.length;i++){
            if(mostrar[i].key===kSP){
                for(var j=0;j<mostrar[i].subPost.length;j++){
                    //START CARD:
                    data+="<div class='card border-success mb-3'>";
                    //HEADER:
                    data+="<div class='card-header'>"+mostrar[i].subPost[j].idUser+"</div>";
                    //BODY CARD:
                    data+="  <div class='card-body'><p class='card-text'>"+mostrar[i].subPost[j].postComented+"</p></div>";
                    //END CARD:
                    data+="</div>";
                }
            }
        }
        // Envian datos al documento html:
        $("#div"+kSP).html(data);
    })
}
//UPDATE LIKES
function updateLike(postKey){
    let postRef = firebase.database().ref("comentarios").child(postKey);
    
    postRef.once('value', function(data){
        var users = data.val().likes != "" ? data.val().likes : [];
        if(users.includes(loggedUser)){
            alert("Ya has dado tu like..!! gracias..!!")
        }else{
            users.push(loggedUser);postRef.update({'likes' : users});
        }   
    });
    getPost();
}

function createSubPost(idPostToCreate,postComented){
    
    let miObjeto = new subPost(loggedUser,postComented);
    console.log(miObjeto);

    let postRef = firebase.database().ref("comentarios").child(idPostToCreate);
    postRef.once('value', function(data){
        var subPosted = data.val().subPost != "" ? data.val().subPost : [];
        subPosted.push(miObjeto);postRef.update({'subPost' : subPosted});   
    });
}

//CREAR UN NUEVO POST:
//Esta ves el post se crear como un subPost, del cual para llamarlo se debera hacer referencia al mainPost.
function newPost(e, postKey){
    e.preventDefault();
    //DIV:
    const selectedDiv = document.getElementById(postKey);
    const newItem = document.createElement('div');
    newItem.setAttribute("class","container");
    newItem.textContent='Responder:';
    selectedDiv.appendChild(newItem);

    //TEXTBOX:
    const txtBoxNewPost = document.createElement('input');
    txtBoxNewPost.setAttribute("type","text");
    txtBoxNewPost.setAttribute("class","form-control");
    txtBoxNewPost.setAttribute("id","txt"+postKey);
    txtBoxNewPost.setAttribute("placeholder","Escribe tu comentario");
    selectedDiv.appendChild(txtBoxNewPost);

    //BUTTON ENVIAR POST:
    const btnNewPost = document.createElement('button');
    btnNewPost.setAttribute("type","submit");
    btnNewPost.setAttribute("id",postKey);
    btnNewPost.setAttribute("class","btn btn-primary");
    btnNewPost.setAttribute("onclick","funcionTest(event,this)");
    btnNewPost.innerText = 'Enviar';   
    selectedDiv.appendChild(btnNewPost);
    getSubPost(postKey);
}
function funcionTest(e,thisBtn){
    e.preventDefault();
    let idBtn = thisBtn.id;
    let newPosted = $("#txt"+idBtn+"").val();
    createSubPost(idBtn,newPosted);
}