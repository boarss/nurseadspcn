const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = {
  /**
   * Send a message to the NurseAda AI.
   */
  async chat(message: string, conversation_id?: string) {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, conversation_id }),
    });

    if (!res.ok) throw new Error("Failed to send message to AI");
    return res.json();
  },

  /**
   * Stream a message from NurseAda AI.
   */
  async *chatStream(message: string, token: string, conversation_id?: string) {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ message, conversation_id }),
    });

    if (!res.ok) throw new Error("Failed to start chat stream");
    if (!res.body) throw new Error("ReadableStream not supported");
    
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");
      
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.chunk) {
              yield data.chunk;
            }
          } catch (e) {
            console.error("Failed to parse SSE chunk", e);
          }
        }
      }
    }
  },

  /**
   * Fetch the catalog of herbal remedies.
   */
  async getHerbalCatalog() {
    const res = await fetch(`${API_BASE_URL}/herbal/catalog`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch herbal catalog");
    return res.json();
  },

  /**
   * Check for drug interactions between multiple drugs/herbs.
   */
  async checkInteractions(drugs: string[]) {
    const res = await fetch(`${API_BASE_URL}/medications/check-interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drugs }),
    });

    if (!res.ok) throw new Error("Failed to check drug interactions");
    return res.json();
  },

  /**
   * Create a medication reminder.
   */
  async createMedicationReminder(payload: {
    drugName: string;
    dosage: string;
    frequency: string;
    time: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/medications/reminders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create reminder");
    return res.json();
  },
};
