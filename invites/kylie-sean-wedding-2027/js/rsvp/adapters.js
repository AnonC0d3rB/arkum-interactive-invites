/**
 * RSVP persistence adapters.
 *
 * Every adapter implements:
 *   load(): Promise<Record | null>      — a previously submitted response
 *   submit(payload): Promise<Record>    — persist a response; reject with an Error on failure
 *   clear(): Promise<void>
 *
 * payload = { name, contact, attending: boolean, guests, diet: string[], dietNote, message }
 * Record  = payload + { id, submittedAt }
 *
 * The browser only ever keeps a minimal receipt (first name, attendance, guest
 * count) so a returning guest sees their confirmation. Contact details and
 * messages are never written to storage.
 */

function makeId() {
  return (crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);
}

/** What may be remembered on the guest's device. */
function receipt(record) {
  return {
    id: record.id,
    submittedAt: record.submittedAt,
    name: String(record.name || '').split(/\s+/)[0],
    attending: Boolean(record.attending),
    guests: record.attending ? record.guests : 0,
  };
}

/** Showcase adapter: keeps a minimal receipt in this browser only. No network. */
export function createLocalAdapter({ storageKey }) {
  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || 'null');
    } catch {
      return null;
    }
  };
  return {
    async load() {
      return read();
    },
    async submit(payload) {
      const previous = read();
      const record = { ...payload, id: previous?.id ?? makeId(), submittedAt: new Date().toISOString() };
      try {
        localStorage.setItem(storageKey, JSON.stringify(receipt(record)));
      } catch {
        // Private mode / storage disabled — the response is still accepted for this visit.
      }
      return record;
    },
    async clear() {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        /* ignore */
      }
    },
  };
}

/**
 * Production adapter: POSTs JSON to `endpoint`. The server should respond with
 * the stored record (or `{ id }`). Not used by the showcase build.
 */
export function createHttpAdapter({ endpoint, headers = {}, storageKey }) {
  const local = createLocalAdapter({ storageKey });
  return {
    load: local.load,
    clear: local.clear,
    async submit(payload) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`RSVP request failed (${res.status})`);
      const body = await res.json().catch(() => ({}));
      const record = { ...payload, ...body, submittedAt: body.submittedAt ?? new Date().toISOString() };
      await local.submit(record); // remember locally so the guest sees their confirmation
      return record;
    },
  };
}

export function createAdapter(rsvpConfig, storageKey) {
  if (rsvpConfig.adapter === 'http' && rsvpConfig.endpoint) {
    return createHttpAdapter({ endpoint: rsvpConfig.endpoint, storageKey });
  }
  return createLocalAdapter({ storageKey });
}
