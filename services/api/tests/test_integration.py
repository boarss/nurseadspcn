import pytest

def test_full_patient_workflow_integration(client):
    """
    Integration test simulating a patient using the NurseAda API:
    1. Starting a chat session.
    2. Reviewing the herbal catalog.
    3. Checking drug interactions between a herbal remedy and a medical drug.
    4. Creating a medication reminder.
    """
    # 1. Start a chat session
    chat_payload = {
        "message": "I have a headache and I am taking Ginger.",
        "conversation_id": "integration-test-id-123"
    }
    chat_response = client.post("/chat", json=chat_payload)
    assert chat_response.status_code == 200
    assert chat_response.json()["conversation_id"] == "integration-test-id-123"

    # 2. Review the herbal catalog
    catalog_response = client.get("/herbal/catalog")
    assert catalog_response.status_code == 200
    catalog = catalog_response.json()["remedies"]
    assert len(catalog) > 0
    
    # Verify that Ginger is in the catalog
    ginger_remedy = next((r for r in catalog if "Ginger" in r["name"]), None)
    assert ginger_remedy is not None

    # 3. Check drug interactions
    interaction_payload = {
        "drugs": ["Ginger", "Aspirin"]
    }
    interaction_response = client.post("/medications/check-interactions", json=interaction_payload)
    assert interaction_response.status_code == 200
    interaction_data = interaction_response.json()
    assert "Ginger" in interaction_data["summary"]
    assert "Aspirin" in interaction_data["summary"]

    # 4. Create a medication reminder
    reminder_payload = {
        "drugName": "Aspirin",
        "dosage": "100mg",
        "frequency": "Once daily",
        "time": "09:00"
    }
    reminder_response = client.post("/medications/reminders", json=reminder_payload)
    assert reminder_response.status_code == 200
    reminder_data = reminder_response.json()
    assert reminder_data["drugName"] == "Aspirin"
    assert reminder_data["isActive"] is True
    assert "id" in reminder_data
