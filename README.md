# neon-coast

A neon sunset-coast theme mod for Claude Code. Behind the chat it draws an animated night scene: swaying palm trees, a glowing sunset, a city skyline with neon windows, and sun glints on the water. Panels turn deep plum with hot-pink accents, your messages get a magenta-to-violet gradient bubble, and the theme always uses dark mode.

The look shows in the Claude desktop app's Code sessions and the Claude mobile app. The terminal and VS Code don't draw themes. All artwork is original vector art.

## Install

At the prompt of a terminal session:

```
/plugin install neon-coast --marketplace kumarvnsh/claude-neon-coast
```

Answer `y` to add the marketplace, then press Enter to install for your user account.

From a shell:

```
claude plugin install neon-coast --marketplace kumarvnsh/claude-neon-coast
```

In the desktop app: click + next to the prompt box, then Plugins, Add marketplace with `kumarvnsh/claude-neon-coast`, then Add plugin.

Restart the desktop app afterwards to see the theme in sessions that were already open.

## Turning it on and off

In the desktop app's Code tab, click **🌴 on** beside the message box to turn the theme off, and **🌴 off** to turn it back on. You can also type `/neon` in any session. Your choice is remembered for new sessions.

## Light mode

To follow the app's own light or dark mode, delete the `overrideColorScheme: 'dark'` line in `hooks/register.tsx`. Light mode is a pastel golden hour with a teal sea.

## Uninstall

```
claude plugin uninstall neon-coast
```
