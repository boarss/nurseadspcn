from typing import List, Dict, Any
from services.llm_gateway import llm_gateway
import json
import logging

logger = logging.getLogger(__name__)

class CDSSService:
    """
    Clinical Decision Support System (CDSS).
    Uses structured LLM prompts to evaluate symptoms and drug interactions.
    """

    async def check_drug_interactions(self, drugs: List[str]) -> Dict[str, Any]:
        """
        Uses the LLM to analyze potential drug-drug interactions.
        Returns a structured risk assessment.
        """
        prompt = f"""You are a clinical pharmacology expert. Analyze the following list of drugs/substances for potential interactions.
Return your analysis ONLY as a valid JSON object (no markdown, no explanation outside the JSON).
Format:
{{
  "interactions": [
    {{
      "drug_pair": ["DrugA", "DrugB"],
      "severity": "mild|moderate|severe",
      "description": "Brief description of the interaction"
    }}
  ],
  "warning_level": "none|low|moderate|high|critical",
  "summary": "A single sentence summary for the patient."
}}

Drugs to analyze: {json.dumps(drugs)}

Important: If no significant interactions are found, return an empty interactions array with warning_level "none".
"""
        messages = [{"role": "user", "content": prompt}]

        try:
            response = await llm_gateway.generate_response(messages)

            # Try to parse the JSON from the LLM response
            # Strip markdown code fences if present
            cleaned = response.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
            if cleaned.startswith("json"):
                cleaned = cleaned[4:].strip()

            result = json.loads(cleaned)
            return result

        except (json.JSONDecodeError, Exception) as e:
            logger.error(f"CDSS drug interaction error: {e}")
            return {
                "interactions": [],
                "warning_level": "unknown",
                "summary": f"Could not fully analyze interactions for {', '.join(drugs)}. Please consult a pharmacist."
            }

    async def triage_symptoms(self, symptoms: str) -> Dict[str, Any]:
        """
        Uses the LLM to assess symptom severity and provide triage recommendations.
        """
        # Quick keyword check for obvious emergencies (before LLM call)
        emergency_keywords = ["chest pain", "difficulty breathing", "unconscious",
                              "severe bleeding", "heart attack", "stroke", "seizure",
                              "choking", "not breathing"]
        is_obvious_emergency = any(kw in symptoms.lower() for kw in emergency_keywords)

        if is_obvious_emergency:
            return {
                "severity": "emergency",
                "is_emergency": True,
                "recommended_action": "Call emergency services (112/199) or go to the nearest hospital IMMEDIATELY.",
                "confidence": 0.95,
                "reasoning": "Symptoms match critical emergency patterns."
            }

        prompt = f"""You are a medical triage nurse. Assess the following symptoms and provide a triage recommendation.
Return your analysis ONLY as a valid JSON object (no markdown, no explanation outside the JSON).
Format:
{{
  "severity": "low|moderate|high|emergency",
  "is_emergency": false,
  "recommended_action": "What the patient should do next",
  "confidence": 0.0-1.0,
  "reasoning": "Brief clinical reasoning"
}}

Patient symptoms: {symptoms}

Be conservative: if in doubt, recommend seeking professional care.
"""
        messages = [{"role": "user", "content": prompt}]

        try:
            response = await llm_gateway.generate_response(messages)

            cleaned = response.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
            if cleaned.startswith("json"):
                cleaned = cleaned[4:].strip()

            result = json.loads(cleaned)
            return result

        except (json.JSONDecodeError, Exception) as e:
            logger.error(f"CDSS triage error: {e}")
            return {
                "severity": "unknown",
                "is_emergency": False,
                "recommended_action": "Unable to assess symptoms accurately. Please visit a healthcare professional.",
                "confidence": 0.0,
                "reasoning": "System error during assessment."
            }

cdss_service = CDSSService()
