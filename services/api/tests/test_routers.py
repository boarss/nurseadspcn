from unittest.mock import patch

def test_chat_endpoint(client):
    with patch("services.llm_gateway.LLMGateway.generate_response") as mock_generate:
        mock_generate.return_value = "Mocked LLM Response for NurseAda"
        
        response = client.post("/chat", json={
            "message": "Hello Nurse Ada",
            "conversation_id": "test-id"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["conversation_id"] == "test-id"
        assert data["reply"] == "Mocked LLM Response for NurseAda"
        mock_generate.assert_called_once()

def test_herbal_catalog_endpoint(client):
    response = client.get("/herbal/catalog")
    assert response.status_code == 200
    data = response.json()
    assert "remedies" in data
    assert len(data["remedies"]) > 0
    assert data["remedies"][0]["name"] == "Bitter Leaf (Vernonia amygdalina)"

def test_get_medication_reminders(client):
    response = client.get("/medications/reminders")
    assert response.status_code == 200
    data = response.json()
    assert "reminders" in data

def test_create_medication_reminder(client):
    payload = {
        "drugName": "Paracetamol",
        "dosage": "500mg",
        "frequency": "Twice daily",
        "time": "08:00"
    }
    response = client.post("/medications/reminders", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["drugName"] == "Paracetamol"
    assert "id" in data
    assert data["isActive"] is True

def test_check_interactions_endpoint(client):
    payload = {
        "drugs": ["Aspirin", "Ibuprofen"]
    }
    response = client.post("/medications/check-interactions", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Scaffold simulation: Checked interactions for Aspirin, Ibuprofen" in data["summary"]

def test_check_interactions_insufficient_drugs(client):
    payload = {"drugs": ["Aspirin"]}
    response = client.post("/medications/check-interactions", json=payload)
    assert response.status_code == 400
    assert "Provide at least two drugs" in response.json()["detail"]

def test_get_appointments(client):
    response = client.get("/appointments")
    assert response.status_code == 200
    data = response.json()
    assert "appointments" in data

def test_get_clinics(client):
    response = client.get("/appointments/clinics")
    assert response.status_code == 200
    data = response.json()
    assert "clinics" in data
