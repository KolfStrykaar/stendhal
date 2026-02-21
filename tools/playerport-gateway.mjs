#!/usr/bin/env node

/**
 * Playerport gateway adapter (HTTP + SSE + TCP telnet)
 *
 * Endpoints:
 *   POST /session            { host, port }
 *   GET  /session/:id/stream (SSE)
 *   POST /session/:id/send   { command }
 *   POST /session/:id/close  {}
 */

import http from 'node:http';
import net from 'node:net';
import crypto from 'node:crypto';

const BIND_HOST = process.env.PLAYERPORT_GATEWAY_HOST || '127.0.0.1';
const BIND_PORT = Number(process.env.PLAYERPORT_GATEWAY_PORT || 8787);

const sessions = new Map();

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error('payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(new Error('invalid json'));
      }
    });
    req.on('error', reject);
  });
}

function sseWrite(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function createSession(host, port) {
  const id = crypto.randomUUID();
  const socket = net.createConnection({ host, port });
  const listeners = new Set();

  const session = {
    id,
    host,
    port,
    socket,
    listeners,
    connected: false,
    createdAt: Date.now(),
  };

  socket.on('connect', () => {
    session.connected = true;
    for (const res of listeners) sseWrite(res, 'status', { connected: true });
  });

  socket.on('data', chunk => {
    const text = chunk.toString('utf8');
    for (const res of listeners) sseWrite(res, 'data', { text });
  });

  socket.on('error', err => {
    for (const res of listeners) sseWrite(res, 'error', { message: err.message });
  });

  socket.on('close', hadError => {
    session.connected = false;
    for (const res of listeners) sseWrite(res, 'status', { connected: false, hadError });
  });

  sessions.set(id, session);
  return session;
}

function closeSession(session) {
  try { session.socket.end(); } catch {}
  try { session.socket.destroy(); } catch {}
  for (const res of session.listeners) {
    try { sseWrite(res, 'status', { closed: true }); } catch {}
    try { res.end(); } catch {}
  }
  sessions.delete(session.id);
}

function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = url;

  if (req.method === 'POST' && pathname === '/session') {
    return readJson(req)
      .then(body => {
        const host = String(body.host || '127.0.0.1');
        const port = Number(body.port || 6100);
        if (!Number.isInteger(port) || port < 1 || port > 65535) {
          return json(res, 400, { error: 'invalid port' });
        }
        const session = createSession(host, port);
        return json(res, 201, { id: session.id, host, port });
      })
      .catch(err => json(res, 400, { error: err.message }));
  }

  const mStream = pathname.match(/^\/session\/([^/]+)\/stream$/);
  if (req.method === 'GET' && mStream) {
    const id = mStream[1];
    const session = sessions.get(id);
    if (!session) return json(res, 404, { error: 'session not found' });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    session.listeners.add(res);
    sseWrite(res, 'status', { connected: session.connected, id: session.id });

    req.on('close', () => session.listeners.delete(res));
    return;
  }

  const mSend = pathname.match(/^\/session\/([^/]+)\/send$/);
  if (req.method === 'POST' && mSend) {
    const id = mSend[1];
    const session = sessions.get(id);
    if (!session) return json(res, 404, { error: 'session not found' });

    return readJson(req)
      .then(body => {
        const command = String(body.command || '');
        if (!command.length) return json(res, 400, { error: 'empty command' });
        session.socket.write(`${command}\n`);
        return json(res, 200, { ok: true });
      })
      .catch(err => json(res, 400, { error: err.message }));
  }

  const mClose = pathname.match(/^\/session\/([^/]+)\/close$/);
  if (req.method === 'POST' && mClose) {
    const id = mClose[1];
    const session = sessions.get(id);
    if (!session) return json(res, 404, { error: 'session not found' });
    closeSession(session);
    return json(res, 200, { ok: true });
  }

  if (req.method === 'GET' && pathname === '/healthz') {
    return json(res, 200, { ok: true, sessions: sessions.size });
  }

  return json(res, 404, { error: 'not found' });
}

const server = http.createServer(route);
server.listen(BIND_PORT, BIND_HOST, () => {
  console.log(`playerport-gateway listening on http://${BIND_HOST}:${BIND_PORT}`);
});
