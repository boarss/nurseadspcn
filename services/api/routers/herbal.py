from fastapi import APIRouter
from models.schemas import HerbalCatalogResponse, HerbalRemedy, LocalNames

router = APIRouter()

@router.get("/herbal/catalog", response_model=HerbalCatalogResponse)
async def get_herbal_catalog():
    """
    Get the catalog of herbal remedies.
    In scaffold mode, returns a static list. Will later connect to Knowledge Service.
    """
    remedies = [
        HerbalRemedy(
            id="1",
            name="Bitter Leaf (Vernonia amygdalina)",
            localNames=LocalNames(yoruba="Ewuro", igbo="Onugbu", hausa="Shuwaka"),
            conditions=["Malaria prophylaxis", "Stomach ache", "Fever"],
            preparation="Squeeze fresh leaves in water, sieve, and drink.",
            evidenceLevel="Moderate",
            warnings="Not recommended during pregnancy."
        ),
        HerbalRemedy(
            id="2",
            name="Ginger (Zingiber officinale)",
            localNames=LocalNames(yoruba="Ata ile", igbo="Jinja", hausa="Citta"),
            conditions=["Nausea", "Cold & flu", "Digestive issues"],
            preparation="Steep grated ginger in hot water.",
            evidenceLevel="Strong",
            warnings="May interact with blood-thinning medications."
        )
    ]
    
    return HerbalCatalogResponse(remedies=remedies)
