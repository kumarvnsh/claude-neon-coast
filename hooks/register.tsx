import type { EngineInterface, Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE } from './scene'

const { theme, problems } = makeColors({
  label: 'Neon coast',
  roles: { accent: '#e0358f', danger: '#e0424f', success: '#1f9e82', warning: '#d9862b', pro: '#7d5be0' },
  // Golden hour
  light: {
    gray: {
      anchors: {
        'surface-0': '#fbefec',
        'surface-1': '#fdf4f1',
        'surface-2': '#fff9f6',
        'text-primary': '#2c1230',
        'text-secondary': '#553756',
        'text-muted': '#6b4c6b',
      },
    },
  },
  // Dusk
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0d0716',
        'surface-1': '#130b1e',
        'surface-2': '#190f27',
        'surface-3': '#1f1430',
        'text-primary': '#f9eef6',
        'text-secondary': '#dcc9dc',
        'text-muted': '#b9a4bd',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'neon-coast', glass: { blur: 18, opacity: 0.8 } },
  // Always dusk. Remove this line to follow the app's own light or dark mode.
  overrideColorScheme: 'dark',
}

const STYLE: ThemeSetArgs['style'] = {
  Heading: { fontWeight: 'bold', letterSpacing: 0.4 },
  UserMessage: {
    color: '#ffffff',
    backgroundColor: '#a01a72',
    fill: { gradient: { angle: 100, stops: ['#b0196f', '#6f2bb8'] } },
    radius: [18, 18, 4, 18],
    paddingX: 16,
    paddingY: 10,
    shadow: { y: 2, blur: 14, color: '#ff4fa355' },
  },
  AssistantMessage: {
    color: 'text-primary',
    backgroundColor: 'surface-1',
    radius: 14,
    paddingX: 16,
    paddingY: 12,
  },
  ToolUse: { color: 'text-secondary', backgroundColor: 'surface-2', borderColor: '#ff4fa366', radius: 10, paddingX: 10, paddingY: 4 },
}

// On or off is kept across sessions; on until the person turns it off.
let isOn = true

async function apply($: EngineInterface) {
  if (!isOn) {
    await $.theme.clear()
    return
  }
  try {
    await $.theme.set({ ...LOOK, style: STYLE })
  } catch (error) {
    // An older build that takes no style still gets the colors and scene.
    $.ui.log(String(error))
    await $.theme.set(LOOK)
  }
}

async function flip($: EngineInterface) {
  isOn = !isOn
  await $.store.set('enabled', isOn)
  await apply($)
  $.ui.invalidate('ui.render')
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    isOn = (await $.store.get('enabled')) !== false
    await $.command.register({ name: 'neon', description: 'Turn the neon-coast theme on or off' })
    if (isOn) {
      await apply($)
    }

    return next(e)
  })

  on('command.run', { command: 'neon' }, async $ => {
    await flip($)

    return { text: isOn ? 'neon-coast theme on.' : 'neon-coast theme off.' }
  })

  on('ui.message', { component: 'BesidePrompt' }, async ($, e) => {
    const data = e.data as { toggle?: unknown } | null
    if (data?.toggle === true) {
      await flip($)
    }

    return { props: { isOn } }
  })

  on('ui.render', { component: 'BesidePrompt' }, ($, e, next) => {
    if (e.surface !== 'desktop') {
      return next(e)
    }
    const { Client } = $.ui.resolve(e)

    return <Client key="toggle" module="./toggle.tsx" props={{ isOn }} />
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    if (!isOn) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A neon sunset over a palm-lined coast and city skyline" isInteractive />
  })
}
