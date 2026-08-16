/**
 * Small, reusable `check()` predicates — every scenario module uses
 * these instead of writing its own inline object literal each time,
 * so a failed check always reads the same way in the k6 summary.
 */
import { check } from 'k6';

export function checkStatus(res, expected, label) {
  return check(res, {
    [`${label}: status is ${expected}`]: (r) => r.status === expected,
  });
}

export function checkStatusIn(res, expectedList, label) {
  return check(res, {
    [`${label}: status in [${expectedList.join(',')}]`]: (r) => expectedList.includes(r.status),
  });
}

export function checkHasBody(res, label) {
  return check(res, {
    [`${label}: has a body`]: (r) => !!r.body && r.body.length > 0,
  });
}

export function checkJsonField(res, field, label) {
  return check(res, {
    [`${label}: response has "${field}"`]: (r) => {
      try {
        const json = r.json();
        return json && Object.prototype.hasOwnProperty.call(json, field);
      } catch {
        return false;
      }
    },
  });
}

/** Parses the body once and returns `null` on malformed JSON instead
 *  of throwing — a scenario mid-load-test hitting a truncated/500
 *  response shouldn't abort the whole VU's iteration. */
export function safeJson(res) {
  try {
    return res.json();
  } catch {
    return null;
  }
}
