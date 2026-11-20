// 以真实 Vite base 编译客户端，再以临时响应验收 HTTP 契约。
import assert from 'node:assert/strict'
import { build } from 'vite'

globalThis.window = { location: new URL('https://workspace.example') }
for (const base of ['/', '/office/']) {
  const bundle = await build({
    base, configFile: false, logLevel: 'silent',
    build: { ssr: 'src/services/session.js', write: false },
  })
  const { code } = bundle.output.find(entry => entry.isEntry)
  const { getSession } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))
  const user = { userid: 'demo-01', username: '示例用户', ttl: 300 }
  globalThis.fetch = async (url, init) => {
    assert.equal(url.href, window.location.origin + base + 'api/v1/session')
    assert.equal(init.headers.Authorization, 'Bearer fixture')
    assert.equal(init.cache, 'no-store')
    return Response.json(user)
  }
  assert.deepEqual(await getSession('fixture'), user)
  await assert.rejects(getSession(''), { code: 'login_required' })
  for (const [status, expected] of [[401, 'login_required'], [403, 'forbidden'], [503, 'unavailable'], [404, 'unexpected_response']]) {
    globalThis.fetch = async () => new Response(null, { status })
    await assert.rejects(getSession('fixture'), { code: expected, status })
  }
  for (const response of [new Response('<html>'), Response.json({ ...user, ttl: 0 }), Response.json({})]) {
    globalThis.fetch = async () => response
    await assert.rejects(getSession('fixture'), { code: 'unexpected_response', status: 200 })
  }
  globalThis.fetch = async () => { throw new TypeError('offline') }
  await assert.rejects(getSession('fixture'), { code: 'unavailable' })
  const signal = AbortSignal.abort()
  globalThis.fetch = async (_, options) => options.signal.throwIfAborted()
  await assert.rejects(getSession('fixture', { signal }), { name: 'AbortError' })
  console.log(base, 'session contract OK')
}
