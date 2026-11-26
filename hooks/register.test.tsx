import { expect, test } from 'claude-code/testing'

import { checkColors } from './make-colors.js'
import { SCENE } from './scene'

test('the look is set once, whole', async ($, on) => {
  const sets: any[] = []
  on('theme.set', (_, e) => {
    sets.push(e)
    return { value: { isDrawn: true, requestId: 'test' } }
  })
  const stored: Record<string, unknown> = {}
  on('store.get', (_, e: any) => ({ value: stored[e.key] }))
  on('store.set', (_, e: any) => {
    stored[e.key] = e.value
    return { value: undefined }
  })
  on('command.register', () => ({ value: { command: 'neon' } as any }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect(sets.length).toBe(1)
  expect(sets[0].backdrop.scene).toBe('neon-coast')
  expect(checkColors(sets[0].colors).filter(l => l.startsWith("Desktop won't paint"))).toEqual([])
})

test('the scene stays inside the engine limits', () => {
  expect(SCENE.length < 131072).toBe(true)
  expect(/<image|href|NaN|undefined/.test(SCENE)).toBe(false)
})

test('/neon turns the theme off and on, and remembers', async ($, on) => {
  const calls: string[] = []
  on('theme.set', () => {
    calls.push('set')
    return { value: { isDrawn: true, requestId: 'test' } }
  })
  on('theme.clear', () => {
    calls.push('clear')
    return { value: { isDrawn: false, reason: 'cleared' } as any }
  })
  const stored: Record<string, unknown> = {}
  on('store.get', (_, e: any) => ({ value: stored[e.key] }))
  on('store.set', (_, e: any) => {
    stored[e.key] = e.value
    return { value: undefined }
  })
  on('command.register', () => ({ value: { command: 'neon' } as any }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const off = await $.command.run({ command: 'neon', args: '' } as any)
  expect(off.text).toBe('neon-coast theme off.')
  expect(calls).toEqual(['set', 'clear'])

  const on2 = await $.command.run({ command: 'neon', args: '' } as any)
  expect(on2.text).toBe('neon-coast theme on.')
  expect(calls).toEqual(['set', 'clear', 'set'])
  expect(stored.enabled).toBe(true)
})
