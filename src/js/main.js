"use strict";

/*!
 * @see {@link https://github.com/englishextra/iframe-lightbox}
 * modified Simple lightbox effect in pure JS
 * @see {@link https://github.com/squeral/lightbox}
 * @see {@link https://github.com/squeral/lightbox/blob/master/lightbox.js}
 * @params {Object} elem Node element
 * @params {Object} settings object
 * el.lightbox = new IframeLightbox(elem, settings)
 * passes jshint
 */
/*jslint browser: true */
/*jslint node: true */
/*jshint -W014 */

/* _________ iframe-lightbox Abre ventanas para iframes ________________*/

(function(root, document) {
    "use strict";
    var docElem = document.documentElement || "";
    var docBody = document.body || "";
    var containerClass = "iframe-lightbox";
    var iframeLightboxWindowIsBindedClass = "iframe-lightbox-window--is-binded";
    var iframeLightboxOpenClass = "iframe-lightbox--open";
    var iframeLightboxLinkIsBindedClass = "iframe-lightbox-link--is-binded";
    var isLoadedClass = "is-loaded";
    var isOpenedClass = "is-opened";
    var isShowingClass = "is-showing";
    var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i);
    var isTouch = isMobile !== null || document.createTouch !== undefined || "ontouchstart" in root || "onmsgesturechange" in root || navigator.msMaxTouchPoints;
    var IframeLightbox = function(elem, settings) {
        var options = settings || {};
        this.trigger = elem;
        this.el = document.getElementsByClassName(containerClass)[0] || "";
        this.body = this.el ? this.el.getElementsByClassName("body")[0] : "";
        this.content = this.el ? this.el.getElementsByClassName("content")[0] : "";
        this.src = elem.dataset.src || "";
        this.href = elem.getAttribute("href") || "";
        this.dataPaddingBottom = elem.dataset.paddingBottom || "";
        this.dataScrolling = elem.dataset.scrolling || "";
        this.dataTouch = elem.dataset.touch || "";
        this.rate = options.rate || 500;
        this.scrolling = options.scrolling;
        this.touch = options.touch;
        this.onOpened = options.onOpened;
        this.onIframeLoaded = options.onIframeLoaded;
        this.onLoaded = options.onLoaded;
        this.onCreated = options.onCreated;
        this.onClosed = options.onClosed;
        this.init();
    };
    IframeLightbox.prototype.init = function() {
        var _this = this;
        if (!this.el) {
            this.create();
        }
        var debounce = function(func, wait) {
            var timeout,
                args,
                context,
                timestamp;
            return function() {
                context = this;
                args = [].slice.call(arguments, 0);
                timestamp = new Date();
                var later = function() {
                    var last = (new Date()) - timestamp;
                    if (last < wait) {
                        timeout = setTimeout(later, wait - last);
                    } else {
                        timeout = null;
                        func.apply(context, args);
                    }
                };
                if (!timeout) {
                    timeout = setTimeout(later, wait);
                }
            };
        };
        var logic = function() {
            _this.open();
        };
        var handleIframeLightboxLink = function(e) {
            e.stopPropagation();
            e.preventDefault();
            debounce(logic, this.rate).call();
        };
        if (!this.trigger.classList.contains(iframeLightboxLinkIsBindedClass)) {
            this.trigger.classList.add(iframeLightboxLinkIsBindedClass);
            this.trigger.addEventListener("click", handleIframeLightboxLink);
            if (isTouch && (_this.touch || _this.dataTouch)) {
                this.trigger.addEventListener("touchstart", handleIframeLightboxLink);
            }
        }
    };
    IframeLightbox.prototype.create = function() {
        var _this = this,
            backdrop = document.createElement("div");
        backdrop.classList.add("backdrop");
        this.el = document.createElement("div");
        this.el.classList.add(containerClass);
        this.el.appendChild(backdrop);
        this.content = document.createElement("div");
        this.content.classList.add("content");
        this.body = document.createElement("div");
        this.body.classList.add("body");
        this.content.appendChild(this.body);
        this.contentHolder = document.createElement("div");
        this.contentHolder.classList.add("content-holder");
        this.contentHolder.appendChild(this.content);
        this.el.appendChild(this.contentHolder);
        this.btnClose = document.createElement("a");
        this.btnClose.classList.add("btn-close");
        /* jshint -W107 */
        this.btnClose.setAttribute("href", "javascript:void(0);");
        /* jshint +W107 */
        this.el.appendChild(this.btnClose);
        docBody.appendChild(this.el);
        backdrop.addEventListener("click", function() {
            _this.close();
        });
        this.btnClose.addEventListener("click", function() {
            _this.close();
        });
        if (!docElem.classList.contains(iframeLightboxWindowIsBindedClass)) {
            docElem.classList.add(iframeLightboxWindowIsBindedClass);
            root.addEventListener("keyup", function(ev) {
                if (27 === (ev.which || ev.keyCode)) {
                    _this.close();
                }
            });
        }
        var clearBody = function() {
            if (_this.isOpen()) {
                return;
            }
            _this.el.classList.remove(isShowingClass);
            _this.body.innerHTML = "";
        };
        this.el.addEventListener("transitionend", clearBody, false);
        this.el.addEventListener("webkitTransitionEnd", clearBody, false);
        this.el.addEventListener("mozTransitionEnd", clearBody, false);
        this.el.addEventListener("msTransitionEnd", clearBody, false);
        this.callCallback(this.onCreated, this);
    };
    IframeLightbox.prototype.loadIframe = function() {
        var _this = this;
        this.iframeId = containerClass + Date.now();
        this.iframeSrc = this.src || this.href || "";
        var html = [];
        html.push('<iframe src="' + this.iframeSrc + '" name="' + this.iframeId + '" id="' + this.iframeId + '" onload="this.style.opacity=1;" style="opacity:0;border:none;" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" height="166" frameborder="no"></iframe>');
        html.push('<div class="half-circle-spinner"><div class="circle circle-1"></div><div class="circle circle-2"></div></div>');
        this.body.innerHTML = html.join("");
        (function(iframeId, body) {
            var iframe = document.getElementById(iframeId);
            iframe.onload = function() {
                this.style.opacity = 1;
                body.classList.add(isLoadedClass);
                if (_this.scrolling || _this.dataScrolling) {
                    iframe.removeAttribute("scrolling");
                    iframe.style.overflow = "scroll";
                } else {
                    iframe.setAttribute("scrolling", "no");
                    iframe.style.overflow = "hidden";
                }
                _this.callCallback(_this.onIframeLoaded, _this);
                _this.callCallback(_this.onLoaded, _this);
            };
        })(this.iframeId, this.body);
    };
    IframeLightbox.prototype.open = function() {
        this.loadIframe();
        if (this.dataPaddingBottom) {
            this.content.style.paddingBottom = this.dataPaddingBottom;
        } else {
            this.content.removeAttribute("style");
        }
        this.el.classList.add(isShowingClass);
        this.el.classList.add(isOpenedClass);
        docElem.classList.add(iframeLightboxOpenClass);
        docBody.classList.add(iframeLightboxOpenClass);
        this.callCallback(this.onOpened, this);
    };
    IframeLightbox.prototype.close = function() {
        this.el.classList.remove(isOpenedClass);
        this.body.classList.remove(isLoadedClass);
        docElem.classList.remove(iframeLightboxOpenClass);
        docBody.classList.remove(iframeLightboxOpenClass);
        this.callCallback(this.onClosed, this);
    };
    IframeLightbox.prototype.isOpen = function() {
        return this.el.classList.contains(isOpenedClass);
    };
    IframeLightbox.prototype.callCallback = function(func, data) {
        if (typeof func !== "function") {
            return;
        }
        var caller = func.bind(this);
        caller(data);
    };
    root.IframeLightbox = IframeLightbox;

    [].forEach.call(document.getElementsByClassName("iframe-lightbox-link"), function(el) {
        el.lightbox = new IframeLightbox(el, {
            onCreated: function() {
                /* show your preloader */
            },
            onLoaded: function() {
                /* hide your preloader */
            },
            onError: function() {
                /* hide your preloader */
            },
            onClosed: function() {
                /* hide your preloader */
            },
            scrolling: false,
            /* default: false */
            rate: 500 /* default: 500 */ ,
            touch: false /* default: false - use with care for responsive images in links on vertical mobile screens */
        });
    });
})("undefined" !== typeof window ? window : this, document);

//Del preload
window.addEventListener('load', function() {
    document.querySelector('body').classList.add("loaded")
});

document.addEventListener("DOMContentLoaded", function() {
    // Handler when the DOM is fully loaded

    const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);

    window.addEventListener('scroll', function() {
        if ((this.window.scrollY > 40) && (this.window.scrollY < documentHeight - 900)) {
            document.querySelector('.sheksocialShare').style.display = 'inline-flex';
            document.querySelector('.shektrigger').style.display = 'inline-flex';
            document.querySelector('.sheksocialShare').style.zIndex = 1;
        } else {
            document.querySelector('.sheksocialShare').style.display = 'none';
            document.querySelector('.shektrigger').style.display = 'none';
            document.querySelector('.sheksocialShare').style.zIndex = -1;
        }

        if (this.window.scrollY > 40) {
            document.querySelector('.back-to-top').style.display = 'block';
        } else {
            document.querySelector('.back-to-top').style.display = 'none';
        }
    });

   
    // Del template       
    // Toggle between showing and hiding the sidebar when clicking the menu icon
    var mySidebar = document.getElementById("mySidebar");

    function w3_open() {
        if (mySidebar.style.display === 'block') {
            mySidebar.style.display = 'none';
        } else {
            mySidebar.style.display = 'block';
        }
    }
    // Close the sidebar with the close button
    function w3_close() {
        mySidebar.style.display = "none";
    }
    document.getElementById("abre").onclick = w3_open;
    document.getElementById("mySidebar").onclick = w3_close;

    // aos function scroll
    var AOS = require('aos');
    AOS.init({
            duration: 1800,
            mobile: false,
            disable: 'mobile',
        })
        // para sheksocialShare
        // URLs de shares
    function tamVentana() {
        var tam = [0, 0];
        if (typeof window.innerWidth != 'undefined') {
            tam = [window.innerWidth, window.innerHeight];
        } else if (typeof document.documentElement != 'undefined' &&
            typeof document.documentElement.clientWidth !=
            'undefined' && document.documentElement.clientWidth != 0) {
            tam = [
                document.documentElement.clientWidth,
                document.documentElement.clientHeight
            ];
        } else {
            tam = [
                document.getElementsByTagName('body')[0].clientWidth,
                document.getElementsByTagName('body')[0].clientHeight
            ];
        }
        return tam;
    }
    var ventana = tamVentana();
    var ancho = ventana[0] * 0.8;
    var alto = ventana[1] * 0.8;
    var izqui = (ventana[0] - ancho) / 2;
    var arriba = (ventana[1] - alto) / 2;
    var forma = "scrollbars=yes,resizable=yes,replace=false,toolbar=no,width=" + ancho + ",height=" + alto + ",left=" + izqui + ",top=" + arriba;

    const linkd = "http://www.linkedin.com/shareArticle?mini=true&url=https://avoidnote.studio&title=Musical%20Productions&summary=Musica%20personalizada%20para%20tus%20producciones%20Multimedia&source=avoidnote.studio";

    const twitt = "https://twitter.com/intent/tweet?text=AvoidNote%20Musical%20Production%20&amp;url=https%3A%2F%2Favoidnote.studio";

    const face = "https://facebook.com/sharer/sharer.php?u=https%3A%2F%2Favoidnote.studio";

    const tlgr = "tg://msg_url?url=https%3A%2F%2Favoidnote.studio&text=Musica%20Personalizada%20para%20tus%20Producciones%20Multimedia%20&amp";

    document.getElementById("linkedin").onclick = function() {
        var newwindow = window.open(linkd, "parashare", forma);
    };
    document.getElementById("twitter").onclick = function() {
        var newwindow = window.open(twitt, "parashare", forma);
    };
    document.getElementById("facebook").onclick = function() {
        var newwindow = window.open(face, "parashare", forma);
    };
    document.getElementById("telegram").onclick = function() {
        var newwindow = window.open(tlgr, "parashare", forma);
    };

    // abrir los iconos de shares
    const el = document.querySelector('.shektrigger');
    el.onclick = function() {
        document.querySelector('.sheksocialShare').classList.toggle('shekactive');
    }

    // __________________ VALIDAR FORMULARIO Y ENVIAR __________________

    /* _________________ de mozzilla ___________________ */
    // There are many ways to pick a DOM node; here we get the form itself and the email
    // input box, as well as the span element into which we will place the error message.


    // There are many ways to pick a DOM node; here we get the form itself and the email
    // input box, as well as the span element into which we will place the error message.
    var form = document.getElementsByTagName('form')[0];
    var email = document.getElementById('smail');
    var emailError = document.getElementById('mailerr');
    var nombre = document.getElementById('snombre');
    var nombreError = document.getElementById('nombrerr');

    var sujeto = document.getElementById('sujeto');
    var sujetoError = document.getElementById('suberr');

    var mensaje = document.getElementById('mensaje');
    var mensajeError = document.getElementById('mensaerr');
    var valorvuelta = document.getElementById('vuelta').value;

    // As per the HTML5 Specification
    var emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var nombreRegExp = /[A-Za-z]{2,}\s[A-Za-z]{2,}/;
    var linkRegExp = /(((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?))|(<[^>]*script)/;

    // var noLinkmensa = !linkRegExp.test(mensaje.value);

    email.addEventListener('input', function(event) {
        // Each time the user types something, we check if the
        // form fields are valid.
        var mailtest = emailRegExp.test(email.value);
        if (mailtest && email.validity.valid) {
            // In case there is an error message visible, if the field
            // is valid, we remove the error message.
            email.className = 'w3-input w3-border w3-round valido';
            emailError.innerHTML = ' '; // Reset the content of the message
            emailError.className = 'error'; // Reset the visual state of the message
        } else {
            // If there is still an error, show the correct error
            showEmailError();
        }
    });

    function showEmailError() {
        var mailtest = emailRegExp.test(email.value);
        if (email.validity.valueMissing) {
            // If the field is empty
            // display the following error message.
            emailError.innerHTML = 'You need to enter an e-mail address.';
        } else if (email.validity.typeMismatch) {
            // If the field doesn't contain an email address
            // display the following error message.
            emailError.innerHTML = 'Entered value needs to be an e-mail address.';
        } else if (email.validity.tooShort) {
            // If the data is too short
            // display the following error message.
            emailError.innerHTML = `Email should be at least ${email.minLength } characters; you entered ${ email.value.length }.`;
        } else if (!mailtest) {
            emailError.innerHTML = `The email must be in the following format: xxxxx@xxxx.xx`;
        };
        // Set the styling appropriately
        email.className = 'w3-input w3-border w3-round invalido';
        emailError.className = 'error active';
    };

    nombre.addEventListener('input', function(event) {
        // Each time the user types something, we check if the
        // form fields are valid.
        var nombretest = nombreRegExp.test(nombre.value);
        if (nombretest && nombre.validity.valid) {
            // In case there is an error message visible, if the field
            // is valid, we remove the error message.
            nombre.className = 'w3-input w3-border w3-round valido';
            nombreError.innerHTML = ' '; // Reset the content of the message
            nombreError.className = 'error'; // Reset the visual state of the message
        } else {
            // If there is still an error, show the correct error
            showNombreError();
        }
    });

    function showNombreError() {
        var nombretest = nombreRegExp.test(nombre.value);
        if (nombre.validity.valueMissing) {
            // If the field is empty
            // display the following error message.
            nombreError.innerHTML = 'You need to enter your Name Surname .';
        } else if (nombre.validity.typeMismatch) {
            // If the field doesn't contain an email address
            // display the following error message.
            emailError.innerHTML = 'Entered value needs to be only letters.';
        } else if (nombre.validity.tooShort) {
            // If the data is too short
            // display the following error message.
            nombreError.innerHTML = `The Name should be at least ${nombre.minLength } characters; you entered ${nombre.value.length }.`;
        } else if (!nombretest) {
            nombreError.innerHTML = `The email must be in the following format: Name Surname`;
        };
        // Set the styling appropriately
        nombre.className = 'w3-input w3-border w3-round invalido';
        nombreError.className = 'error active';
    };

    sujeto.addEventListener('input', function(event) {
        // Each time the user types something, we check if the
        // form fields are valid.
        var noLinksub = !linkRegExp.test(sujeto.value);
        if (noLinksub && sujeto.validity.valid) {
            // In case there is an error message visible, if the field
            // is valid, we remove the error message.
            sujeto.className = 'w3-input w3-border w3-round valido';
            sujetoError.innerHTML = ' '; // Reset the content of the message
            sujetoError.className = 'error'; // Reset the visual state of the message
        } else {
            // If there is still an error, show the correct error
            showsujetoError();
        }
    });

    function showsujetoError() {
        var noLinksub = !linkRegExp.test(sujeto.value);
        if (sujeto.validity.valueMissing) {
            // If the field is empty
            // display the following error message.
            sujetoError.innerHTML = 'Put what you want the music for.';
        } else if (sujeto.validity.typeMismatch) {
            // If the field doesn't contain an email address
            // display the following error message.
            sujetoError.innerHTML = 'Entered value needs to be letters.';
        } else if (sujeto.validity.tooShort) {
            // If the data is too short
            // display the following error message.
            sujetoError.innerHTML = `Subject should be at least ${sujeto.minLength } characters; you entered ${ sujeto.value.length }.`;
        } else if (!noLinksub) {
            sujetoError.innerHTML = 'Please no link or code';
        }
        // Set the styling appropriately
        sujeto.className = 'w3-input w3-border w3-round invalido';
        sujetoError.className = 'error active';
    }

    mensaje.addEventListener('input', function(event) {
        // Each time the user types something, we check if the
        // form fields are valid.
        var noLinkmen = !linkRegExp.test(mensaje.value);
        if (noLinkmen && mensaje.validity.valid) {
            // In case there is an error message visible, if the field
            // is valid, we remove the error message.
            mensaje.className = 'w3-input w3-border w3-round valido';
            mensajeError.innerHTML = ' '; // Reset the content of the message
            mensajeError.className = 'error'; // Reset the visual state of the message
        } else {
            // If there is still an error, show the correct error
            showmensajeError();
        }
    });

    function showmensajeError() {
        var noLinkmen = !linkRegExp.test(mensaje.value);
        if (mensaje.validity.valueMissing) {
            // If the field is empty
            // display the following error message.
            mensajeError.innerHTML = 'Put what you want the music for.';
        } else if (mensaje.validity.typeMismatch) {
            // If the field doesn't contain an email address
            // display the following error message.
            mensajeError.innerHTML = 'Entered value needs to be letters.';
        } else if (mensaje.validity.tooShort) {
            // If the data is too short
            // display the following error message.
            mensajeError.innerHTML = `Tell us your ideas without hesitation, should be at least` + mensaje.minLength + `characters; you entered` + mensaje.value.length + ` }.`;
        } else if (!noLinkmen) {
            mensajeError.innerHTML = 'Please no link or code';
        }
        // Set the styling appropriately
        mensaje.className = 'w3-input w3-border w3-round invalido';
        mensajeError.className = 'error active';
    };


    //Validacion final del formulario al dar al boton enviar

    form.addEventListener('submit', function(event) {

        event.preventDefault();
        // if the form contains valid data, we let it submit
        // acuerdate de testar el campo oculto 
        var mailtest = emailRegExp.test(email.value);
        var nombretest = nombreRegExp.test(nombre.value);
        var noLinksub = !linkRegExp.test(sujeto.value);
        var noLinkmen = !linkRegExp.test(mensaje.value);


        if (!nombretest || !nombre.validity.valid) {
            // If it isn't, we display an appropriate error message
            showNombreError();
            // Then we prevent the form from being sent by canceling the event

        } else if (!mailtest || !email.validity.valid) {
            // If it isn't, we display an appropriate error message
            showEmailError();
            // Then we prevent the form from being sent by canceling the event

        } else if (!noLinksub || !sujeto.validity.valid) {
            // If it isn't, we display an appropriate error message
            showsujetoError();
            // Then we prevent the form from being sent by canceling the event

        } else if (!noLinkmen || !mensaje.validity.valid) {
            // If it isn't, we display an appropriate error message
            showmensajeError();
            // Then we prevent the form from being sent by canceling the event

        } else if (!(valorvuelta === "1286705410")) {
            // se ha cambiado el campo vuelta

            // No se dice nada

        } else {
            sendData();

        }
    });



    function sendData() {
        const XHR = new XMLHttpRequest();
        let urlEncodedData = "";
        // Turn the data object into an array of URL-encoded key/value pairs.
        const urlEncodedDataPairs = [encodeURIComponent(nombre.name) + '=' + encodeURIComponent(nombre.value), encodeURIComponent(email.name) + '=' + encodeURIComponent(email.value), encodeURIComponent(sujeto.name) + '=' + encodeURIComponent(sujeto.value), encodeURIComponent(mensaje.name) + '=' + encodeURIComponent(mensaje.value)];
        // Combine the pairs into a single string and replace all %-encoded spaces to 
        // the '+' character; matches the behaviour of browser form submissions.
        urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

        console.log(urlEncodedData);
        var http = new XMLHttpRequest();
        var url = 'contactform.php';
        const resultado = document.getElementById("resultado");
        // metido para hacer lo que se pueda
        http.open('POST', url, true);
        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
         // Define what happens on successful data submission
         http.addEventListener( 'load', function(event) {
            console.log( 'Yeah! Data sent and response loaded.' );
            document.querySelector("#sendmessage").classList.add("show");
            document.querySelector("#errormessage").classList.remove("show");
            document.getElementById('snombre').value = "";
            nombre.className = 'w3-input w3-border w3-round';
            document.getElementById('smail').value = "";
            email.className = 'w3-input w3-border w3-round';
            document.getElementById('sujeto').value = "";
            sujeto.className = 'w3-input w3-border w3-round';
            document.getElementById('mensaje').value = "";
            mensaje.className = 'w3-input w3-border w3-round';
        } );

        // Define what happens in case of error
        http.addEventListener( 'error', function(event) {
            alconsole.log( 'Oops! Something went wrong.' );
            document.querySelector("#sendmessage").classList.remove("show");
            document.querySelector("#errormessage").classList.add("show");
            document.getElementById('errormessage').innerHTML = "The message couldn't be sent. Please try again later.";
        } );
        http.onreadystatechange = function() { //Call a function when the state changes.
            if (http.readyState == 4) {
                if(http.status == 200) {
                    resultado.innerHTML = http.responseText;
                    console.log("respnseOK = " + resultado.innerHTML);
                    
                } else {
                    console.log("Error loading page\n");
                }
            }
        }
        http.send(urlEncodedData);

        
        return false;

    };

});


//Fin de document.addEventListener("DOMContentLoaded"