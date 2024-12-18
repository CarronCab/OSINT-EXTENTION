from flask import Flask, redirect, url_for, request, jsonify
import os
from flask_cors import CORS  # Importer Flask-CORS
import generate

app = Flask(__name__)
CORS(app)
    
@app.route('/api/endpoint',methods = ['POST'])
def receive_text():
    try:
        # Récupérer le texte envoyé dans le corps de la requête JSON
        data = request.get_json()

        # Vérifier si le texte est bien dans le JSON
        if 'text' not in data:
            return jsonify({'error': 'Aucun texte reçu'}), 400

        text = data['text']
        
        res = generate.find_entities(text)

        # Retourner une réponse JSON indiquant le succès
        return jsonify(res)
    except Exception as e:
        # En cas d'erreur, retourner une erreur
        return jsonify({'error': str(e)}), 500
      

    
def main():
	port = int(os.environ.get("port", 8001))
	app.run(debug=False, host='0.0.0.0', port=port)
    
if __name__ == "__main__":
	main()

