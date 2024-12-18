import {resetHighlights, clearInputField, test} from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
  const highlightBtn = document.getElementById("highlightBtn");
  const refreshBtn = document.getElementById("refreshBtn");

  highlightBtn.addEventListener("click", () => {
    const word = document.getElementById("searchWord").value.trim();
    if (word) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: sendTextToServer
        });
      });
    }
  });

  refreshBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: resetHighlights
      });
    });
	
	clearInputField();
	
  });
});

function highlightText(word) {
	console.log("highlightText word: ");
  if (!window.originalContent) {
    window.originalContent = document.body.innerHTML; // Sauvegarder l'état initial de la page
  }

  const regex = new RegExp(`(${word})`, "gi");

  // Fonction pour parcourir et modifier les nœuds texte uniquement
  function highlight(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const matches = node.textContent.match(regex);
      if (matches) {
        const span = document.createElement("span");
        span.innerHTML = node.textContent.replace(
          regex,
          '<mark style="background-color: yellow;">$1</mark>'
        );
        node.replaceWith(span);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (const child of [...node.childNodes]) {
        highlight(child);
      }
    }
  }

  highlight(document.body);
}

function sendTextToServer() {
  const textContent = document.body.innerText || document.body.textContent; // Récupérer le texte de la page
  const url = 'http://localhost:8001/api/endpoint'; // Remplacez par l'URL de votre API

  // Envoyer le texte via une requête POST
fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: textContent }), // Envoyer le texte sous forme JSON
  })
  .then(response => response.json())
  .then(data => {
    data.forEach((item) => {
		if (item.entity) {
			
			word = item.entity.slice(1, -1); // Supression des quotes
			console.log(word)
			
			let color = ""
			
			switch(item.entity_type) {
				case 'lieu':
					color = "yellow";
					break;
				case 'date':
					color = "orange";
					break;
				case 'personne':
					color = "red";
					break;
				default:
					color = "yellow";
			}

			if (!window.originalContent) {
				window.originalContent = document.body.innerHTML; // Sauvegarder l'état initial de la page
			}

			const regex = new RegExp(`(${word})`, "gi");

			// Fonction pour parcourir et modifier les nœuds texte uniquement
			function highlight(node) {
				if (node.nodeType === Node.TEXT_NODE) {
					const matches = node.textContent.match(regex);
					if (matches) {
						const span = document.createElement("span");
						span.innerHTML = node.textContent.replace(
						regex,
						'<mark style="background-color: ' + color + ';">$1</mark>'
						);
						node.replaceWith(span);
					}
				} else if (node.nodeType === Node.ELEMENT_NODE) {
					for (const child of [...node.childNodes]) {
						highlight(child);
				  }
				}
			  }

			highlight(document.body);
		}
	});
  })
  .catch(error => {
    console.error('Erreur:', error);
    alert(error);
  });
}