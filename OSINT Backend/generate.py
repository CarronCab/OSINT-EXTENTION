import os
from openai import OpenAI
from entity import Entity
import json

def find_entities(text):
    
    print("Analyse en cours")
    
    VLLM_MISTRAL_BASE_URL=os.getenv("VLLM_MISTRAL_BASE_URL")
    VLLM_MISTRAL_TOKEN=os.getenv("VLLM_MISTRAL_TOKEN")

    client_openai = OpenAI(
        api_key=VLLM_MISTRAL_TOKEN,
        base_url=VLLM_MISTRAL_BASE_URL
    )

    prompt = "Je vais te donner un texte, tu vas l'analyser et extraire les entités de type lieux, date et personne de celui-ci et leur position dans le texte. Je veux que tu m'affiche le résultat en csv au format suivant : type,entité,position avec un retour a la ligne entre chaque entité. Je ne veux que le résultat demandé et pas de texte supplémentaire. Voici le texte : " + text

    response = client_openai.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="llama-3-1-70b",
    )

    print("Analyse terminée")
        
    for choice in response.choices:
      print("Réponse :\n")
      #print(choice.message.content)
      print()
      
    entities = []
      
    for message in choice.message.content.splitlines( ):
        
        entity_type = message.split(",")[0]
        entity = message.split(",")[1]
        if entity_type != "type" and entity != "entité":
            entity_obj = Entity(entity_type,entity,0)
            entities.append(entity_obj)
              
    entities_dict = [entity.to_dict() for entity in entities]
    
    for ent in entities_dict:
        print(ent)
        
    return entities_dict
    #Note : La positioxn est indiquée en nombre de caractères depuis le début du texte. 
    #Il est possible que certaines entités soient manquantes si elles ne sont pas clairement identifiables comme un lieu, une date ou une personne. 
    #De plus, certaines entités pourraient être classées dans une catégorie différente en fonction du contexte (par exemple, "Barra" pourrait être à la fois un lieu et un nom de personne).