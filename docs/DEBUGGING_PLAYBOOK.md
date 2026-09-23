# Debugging playbook

1. Reproduce exactly one requirement.
2. Identify the React component that owns the interaction.
3. Trace state into the feature hook.
4. For privileged operations, continue through the renderer service and preload bridge.
5. Verify the IPC channel name and payload shape.
6. Inspect the main-process handler, service, validation, and repository.
7. Fix the smallest responsible layer.
8. Re-test the original behavior and a nearby behavior that could regress.

Do not start by moving code across architectural boundaries.

## Working methodically

- Take one requirement at a time and trace the behaviour before editing anything.
- Make sure you can explain the root cause before you accept a fix.
- Run `npm test` and `npm run lint:structure` after every change.
- Never accept a change that touches `contextIsolation`, `nodeIntegration`, or exposes `ipcRenderer`.
