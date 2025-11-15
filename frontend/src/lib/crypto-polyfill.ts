// Polyfill for crypto.randomUUID in browser environments where it's not available
if (typeof globalThis !== 'undefined' && globalThis.crypto && !globalThis.crypto.randomUUID) {
  (globalThis.crypto as any).randomUUID = function randomUUID(): string {
    // Generate 16 random bytes
    const bytes = new Uint8Array(16);
    
    if (globalThis.crypto.getRandomValues) {
      globalThis.crypto.getRandomValues(bytes);
    } else {
      // Fallback to Math.random if getRandomValues is not available
      for (let i = 0; i < 16; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }
    
    // Set version (4) and variant bits according to RFC 4122
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
    
    // Convert to hex string and format as UUID
    const hex = Array.from(bytes, byte => 
      byte.toString(16).padStart(2, '0')
    ).join('');
    
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32)
    ].join('-');
  };
}
