/*
 * Playerport gateway client helper.
 *
 * Intended for a future "Playerport mode" in Stendhal web UI.
 */

class PlayerportClient {
  constructor(baseUrl = 'http://127.0.0.1:8787') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.sessionId = null;
    this.eventSource = null;
    this.onText = null;
    this.onStatus = null;
    this.onError = null;
  }

  async createSession(host = '127.0.0.1', port = 6100) {
    const res = await fetch(`${this.baseUrl}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host, port }),
    });

    if (!res.ok) throw new Error(`createSession failed (${res.status})`);
    const payload = await res.json();
    this.sessionId = payload.id;
    return payload;
  }

  connectStream() {
    if (!this.sessionId) throw new Error('session not created');
    this.eventSource = new EventSource(`${this.baseUrl}/session/${this.sessionId}/stream`);

    this.eventSource.addEventListener('data', ev => {
      const payload = JSON.parse(ev.data);
      if (this.onText) this.onText(payload.text);
    });

    this.eventSource.addEventListener('status', ev => {
      const payload = JSON.parse(ev.data);
      if (this.onStatus) this.onStatus(payload);
    });

    this.eventSource.addEventListener('error', ev => {
      if (this.onError) this.onError(ev);
    });
  }

  async send(command) {
    if (!this.sessionId) throw new Error('session not created');
    const res = await fetch(`${this.baseUrl}/session/${this.sessionId}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
    });
    if (!res.ok) throw new Error(`send failed (${res.status})`);
  }

  async close() {
    if (!this.sessionId) return;
    await fetch(`${this.baseUrl}/session/${this.sessionId}/close`, { method: 'POST' });
    if (this.eventSource) this.eventSource.close();
    this.eventSource = null;
    this.sessionId = null;
  }
}

if (typeof module !== 'undefined') {
  module.exports = { PlayerportClient };
}
