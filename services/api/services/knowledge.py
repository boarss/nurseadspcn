import json
import os
from typing import List, Dict, Any

class KnowledgeService:
    """
    Manages access to the static medical/herbal knowledge base.
    In Phase 1, retrieves from local JSON.
    """
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
        self.herbal_catalog_path = os.path.join(self.data_dir, "herbal-remedies.json")
        self._herbal_cache = None

    def get_herbal_catalog(self) -> List[Dict[str, Any]]:
        """Retrieve the herbal remedies catalog"""
        if self._herbal_cache is not None:
            return self._herbal_cache
            
        try:
            if os.path.exists(self.herbal_catalog_path):
                with open(self.herbal_catalog_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self._herbal_cache = data.get("remedies", [])
                    return self._herbal_cache
        except Exception as e:
            print(f"Error loading herbal catalog: {e}")
            
        # Return fallback if file read fails
        return []

knowledge_service = KnowledgeService()
