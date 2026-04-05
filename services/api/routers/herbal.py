import json
import os
from fastapi import APIRouter
from models.schemas import HerbalCatalogResponse, HerbalRemedy, LocalNames

router = APIRouter()

# Load herbal remedies from the JSON data file
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "herbal-remedies.json")

def load_herbal_catalog():
    """Load remedies from the JSON file, falling back to empty list."""
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return [
                HerbalRemedy(
                    id=r["id"],
                    name=r["name"],
                    localNames=LocalNames(**r["localNames"]),
                    conditions=r["conditions"],
                    preparation=r["preparation"],
                    evidenceLevel=r["evidenceLevel"],
                    warnings=r["warnings"],
                )
                for r in data.get("remedies", [])
            ]
    except FileNotFoundError:
        return []

@router.get("/herbal/catalog", response_model=HerbalCatalogResponse)
async def get_herbal_catalog():
    """
    Get the catalog of herbal remedies.
    Loads from the curated JSON data file.
    """
    remedies = load_herbal_catalog()
    return HerbalCatalogResponse(remedies=remedies)
