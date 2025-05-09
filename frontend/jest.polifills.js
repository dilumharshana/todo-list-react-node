/**
 * @note The block below contains polyfills for Node.js globals
 * required for Jest to function when running JSDOM tests.
 * These HAVE to be require's and HAVE to be in this exact
 * order, since "undici" depends on the "TextEncoder" global API.
 *
 * Consider migrating to a more modern test runner if
 * you don't want to deal with this.
 */

const { TextDecoder, TextEncoder } = require("node:util");
const { ReadableStream } = require("node:stream/web");

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream }
});
const { TransformStream } = require("web-streams-polyfill");
global.TransformStream = TransformStream;
const { BroadcastChannel } = require("worker_threads");

// Add BroadcastChannel to globalThis
Reflect.set(globalThis, "BroadcastChannel", BroadcastChannel);

const { Blob, File } = require("node:buffer");
const { fetch, Headers, FormData, Request, Response } = require("undici");

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}

Object.defineProperties(globalThis, {
  Blob: { value: Blob },
  File: { value: File },
  FormData: { value: FormData }
});
