// Makes fake reference numbers like TXN-K3J9D2LQ
export function makeRef(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}