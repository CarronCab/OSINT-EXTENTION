export function resetHighlights() {
  if (window.originalContent) {
    document.body.innerHTML = window.originalContent; // Restaurer le contenu original
    window.originalContent = null; // Réinitialiser	
  }
}

export function clearInputField() {
	document.getElementById("searchWord").value = "";
}

export function test () {
	console.log("test");
}