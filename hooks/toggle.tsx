import type { ClientSurface } from 'claude-code'

// The switch beside the message box: shows the state, and a click asks the
// hooks module to flip it.
export default function Toggle(props: { isOn: boolean }, surface: ClientSurface<true>) {
  const { Text } = surface.elements

  if (surface.state === undefined) {
    surface.onPointer(event => {
      if (event.type === 'up' && event.button === 'left') {
        surface.post({ toggle: true })
      }
    })
    surface.setState(true)
  }

  return props.isOn ? <Text color="#ff4fa3">🌴 on</Text> : <Text dimColor>🌴 off</Text>
}
