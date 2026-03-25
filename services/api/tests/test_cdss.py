from services.cdss import cdss_service
from services.knowledge import knowledge_service

def test_cdss_drug_interactions():
    drugs = ["Aspirin", "Ibuprofen"]
    result = cdss_service.check_drug_interactions(drugs)
    
    assert "interactions" in result
    assert result["warning_level"] == "none"
    assert "No known interactions found" in result["summary"]

def test_cdss_triage_symptoms_non_emergency():
    result = cdss_service.triage_symptoms("I have a mild headache")
    assert result["is_emergency"] is False
    assert "Monitor symptoms" in result["recommended_action"]

def test_cdss_triage_symptoms_emergency():
    result = cdss_service.triage_symptoms("I have severe chest pain and breathing issues")
    assert result["is_emergency"] is True
    assert "immediate medical attention" in result["recommended_action"]

def test_knowledge_service_fallback():
    # If the JSON file isn't found or seeded in test environment, it should return []
    catalog = knowledge_service.get_herbal_catalog()
    assert isinstance(catalog, list)
