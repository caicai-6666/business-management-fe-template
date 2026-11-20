// 用户令牌由宿主传入，调用结束后不持久化。
export class SessionError extends Error {
  constructor(code, status = 0) {
    super(code)
    this.name = 'SessionError'
    this.code = code
    this.status = status
  }
}

export async function getSession(userToken, { signal } = {}) {
  if (typeof userToken !== 'string' || !/^[\x21-\x7e]+$/.test(userToken)) {
    throw new SessionError('login_required')
  }

  const endpoint = new URL(import.meta.env.BASE_URL, window.location.origin)
  endpoint.pathname = endpoint.pathname.replace(/\/?$/, '/api/v1/session')
  let response
  try {
    response = await fetch(endpoint, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${userToken}` },
      mode: 'same-origin', credentials: 'omit', redirect: 'error', cache: 'no-store', signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new SessionError('unavailable')
  }

  if (response.status === 401) throw new SessionError('login_required', 401)
  if (response.status === 403) throw new SessionError('forbidden', 403)
  if (response.status === 503) throw new SessionError('unavailable', 503)
  if (response.status !== 200) throw new SessionError('unexpected_response', response.status)
  if (response.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    throw new SessionError('unexpected_response', 200)
  }

  let body
  try {
    body = await response.json()
  } catch (error) {
    if (signal?.aborted) throw error
    throw new SessionError('unexpected_response', 200)
  }
  if (typeof body?.userid !== 'string' || !body.userid.trim() ||
      typeof body.username !== 'string' || !body.username.trim() ||
      !Number.isSafeInteger(body.ttl) || body.ttl <= 0) {
    throw new SessionError('unexpected_response', 200)
  }
  return { userid: body.userid, username: body.username, ttl: body.ttl }
}
