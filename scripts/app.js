"use strict";

//https://codepen.io/Yellarkh/pen/QwWxJoo/1c23d8c282adc0a0795a24080033e82b?editors=1010  Codepen Monsieur Dekens pour se déplacer dans le viewport :
function clamp( min, value, max ) {
    return Math.max( Math.min( value, max ), min );
  }

  var mx = null;
  var my = null;
  var lastOffsetX = 0;
  var lastOffsetY = 0;
  var offsetX = 0;
  var offsetY = 0;
  let haikuValidated = [];
  var compteur = document.querySelector('.compteur');

  var board = document.querySelector('.js-board');
  var body = document.querySelector( 'body' );
  var boardWidth = board.offsetWidth;
  var boardHeight = board.offsetHeight;
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  var states = {
    isDown: false,
  };

  window.addEventListener( 'mousedown', (e) => {
    board.classList.add( 'grabbing' );
    states.isDown = true;
    mx = e.clientX;
    my = e.clientY;
  } );

  window.addEventListener( 'mouseup', (e) => {
    board.classList.remove( 'grabbing' );
    states.isDown = false;
    lastOffsetX = offsetX;
    lastOffsetY = offsetY;
    //console.log(lastOffsetX, lastOffsetY);
  } );

  window.addEventListener( 'mouseleave', (e) => {
    states.isDown = false;
    lastOffsetX = offsetX;
    lastOffsetY = offsetY;
  } );

  window.addEventListener( 'mousemove', (e) => {

    if( states.isDown){
      offsetX = clamp( (boardWidth - windowWidth) * -1, e.clientX - mx + lastOffsetX, 0 );
      offsetY = clamp( (boardHeight - windowHeight) * -1, e.clientY - my + lastOffsetY, 0 );
      board.style.translate = `${offsetX}px ${offsetY}px`;

      if(activeHaikuBox){
       // ChatGPT formulaire haïku : Si l'utilisateur déplace la fresque alors qu'un haïku est actif
      activeHaikuBox.remove();              // Supprime la boîte
      activeHaikuBox = null;               // Réinitialise la variable
      // Restaure uniquement les boutons NON validés
      document.querySelectorAll('.button').forEach((btn, idx) => {
      if (!haikuValidated[idx]) {
        btn.style.display = "block";
    }
  }); 
  }
}} );

function computeSizes() {
  boardWidth = board.offsetWidth;
  boardHeight = board.offsetHeight;
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  console.log(boardWidth, windowWidth);
  offsetX = clamp( (boardWidth - windowWidth) * -1, lastOffsetX, 0 );
  console.log(offsetX);
    offsetY = clamp( (boardHeight - windowHeight) * -1, lastOffsetY, 0 );
    board.style.translate = `${offsetX}px ${offsetY}px`;
}

function startExperience(){
  offsetX = -window.innerWidth;
  offsetY = -window.innerHeight;
  board.style.translate = `${offsetX}px ${offsetY}px`;
  lastOffsetX = offsetX;
  lastOffsetY = offsetY;
}

window.addEventListener( 'resize', () => {
  computeSizes();
});

window.addEventListener( "load", () => {
  computeSizes();
  startExperience();

  // ChatGPT pour Affichage temporaire du message d'introduction. 
  const introMessage = document.querySelector('.intro__message');
  if (introMessage) {
    setTimeout(() => {
      introMessage.classList.add('fade-out');
    }, 2000); // Délai avant le fondu (en ms)

    setTimeout(() => {
      introMessage.remove(); // Nettoyage après animation
    }, 10000); // Temps total avant suppression (5s délai + 2s transition)
  }
});

//ChatGPT : variable afin de faire disparaître le formulaire de haïku quand on veut se déplacer dans la fresque sans remplir le haïku
let activeHaikuBox = null;

//ChatGPT pour remplacer le bouton par une boîte de texte + avoir différents haikus pour chaque bouton :
document.querySelectorAll('.button').forEach((button, index) => {
  // Définir un haïku différent pour chaque bouton via data-attribute ou tableau
  const haikus = [
    {
      lines: [
        "<input type='text' class='blank'> au loin",
        "Où la <input type='text' class='blank'> du jour",
        "S'en est allée."
      ],
      infoClass: 'info__bloc1'  // Référence à la classe d'information spécifique
    },
    {
      lines: [
        "Les pétales de <input type='text' class='blank'>",
        "Se cambrent dans <input type='text' class='blank'>",
        "Sous la lune."
      ],
      infoClass: 'info__bloc2'
    },
    {
      lines: [
        "J’ai reçu un pétale tombé <input type='text' class='blank'>.",
        "Ouvrant le poing",
        "je n’y trouve <input type='text' class='blank'>."
      ],
      infoClass: 'info__bloc3'
    },
    // Ajouter plus de haïkus ici si nécessaire
  ];

  button.addEventListener('click', () => {
    // Création de la boîte de texte
    let textBox = document.createElement("div");
    textBox.classList.add("text-box");
    activeHaikuBox = textBox;
    haikuValidated[index] = false;

    // Sélectionner le haïku correspondant au bouton cliqué
    const haiku = haikus[index];

    // Ajouter le formulaire avec le haïku correspondant
    textBox.innerHTML = `
      <p>${haiku.lines[0]}</p>
      <p>${haiku.lines[1]}</p>
      <p>${haiku.lines[2]}</p>
      <button class="validate">Valider</button>
    `;

      // Positionner la boîte
      let rect = button.getBoundingClientRect();


      // Remplacement du bouton par la boîte de texte
      document.body.append( textBox );

      button.style.display = "none";


      // Ajout de l'événement "Valider"
      textBox.querySelector(".validate").addEventListener("click", () => {
          let inputs = textBox.querySelectorAll(".blank");
          let allFilled = Array.from(inputs).every(input => input.value.trim() !== "");

          
      if (allFilled) {
        // Afficher l'info correspondant au haïku (basé sur la classe) -> ChatGPT :
        haikuValidated[index] = true;
        let infoElements = document.querySelectorAll(`.${haiku.infoClass}`);
        infoElements.forEach(infoElement => {

          infoElement.classList.add('visible');  // Affiche l'élément
        });

        // Crédits pour le texte animé gsap: https://youtu.be/ZW-nnG4U2d0?feature=shared
        gsap.from(`.${haiku.infoClass} .text`, {
        duration: 2.5,
        attr: { startOffset: "100%" },
        ease: "power1",
        onComplete: () => { // Correction avec une tierce personne pour la décrémentation du compteur ajoutée au gsap
              let compteurSpan = document.getElementById("compteur_num");
              let compteur = parseInt(compteurSpan.textContent, 10);
      
              if (compteur > 0) {
                  compteur--;
                  compteurSpan.textContent = compteur;
              }
          }

        });
        

        // Optionnel : cacher la boîte de texte après la validation
        textBox.style.display = "none";
        activeHaikuBox = null;
      }
    });

    // Valider avec la touche Entrée -> Crédits:ChatGPT
    textBox.querySelectorAll(".blank").forEach(input => {
    input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Empêche le saut de ligne ou autre comportement par défaut
      textBox.querySelector(".validate").click(); // Déclenche le clic sur le bouton
    }
  });
  });

  });
});



