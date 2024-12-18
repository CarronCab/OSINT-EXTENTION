import json

class Entity:
    def __init__(self, entity_type, entity, position):
        self.entity_type = entity_type
        self.entity = entity
        self.position = position
        
    def to_dict(self):
        # Retourner un dictionnaire représentant l'objet
        
        return {
            "entity_type": self.entity_type,
            "entity": json.dumps(self.entity, ensure_ascii=False)
        }