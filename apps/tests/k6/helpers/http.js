/**
 * Thin wrapper around k6/http — every scenario module calls these
 * instead of `http.get`/`http.post` directly, so the base URL,
 * default headers, timeout, and bearer-token attachment live in one
 * place instead of being copy-pasted into every scenario file.
 */
import http from 'k6/http';
import { BASE_URL, DEFAULT_HEADERS, HTTP_TIMEOUT } from '../config/environment.js';

function buildParams(token, extraHeaders, tags) {
  const headers = { ...DEFAULT_HEADERS, ...extraHeaders };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return { headers, timeout: HTTP_TIMEOUT, tags };
}

/** @param {string} path - e.g. "/categories" or "categories" (leading slash optional) */
function url(path) {
  return `${BASE_URL}/${String(path).replace(/^\//, '')}`;
}

export function apiGet(path, token, { headers, tags } = {}) {
  return http.get(url(path), buildParams(token, headers, tags));
}

export function apiPost(path, body, token, { headers, tags } = {}) {
  return http.post(url(path), JSON.stringify(body ?? {}), buildParams(token, headers, tags));
}

export function apiPut(path, body, token, { headers, tags } = {}) {
  return http.put(url(path), JSON.stringify(body ?? {}), buildParams(token, headers, tags));
}

export function apiDelete(path, token, { headers, tags } = {}) {
  return http.del(url(path), null, buildParams(token, headers, tags));
}

export { url as apiUrl };
