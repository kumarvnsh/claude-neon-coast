import { expect, test } from 'claude-code/testing'

import { checkColors } from './make-colors.js'
import { SCENE } from './scene'

test('the look is set once, whole', async ($, on) => {
  const sets: any[] = []
  on('theme.set', (_, e) => {
    sets.push(e)
    return { value: { isDrawn: true, requestId: 'test' } }
  })
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
