# Data contracts

## Process
```js
{ pid, parentPid, name, command, user, cpu, memory, memoryRss, state, started, path }
```
`cpu` and `memory` are percentages (0–100). `memoryRss` is the resident-memory value supplied by the process provider, **in kilobytes** — convert it with `kbToBytes` (`src/utils/memory.js`) before formatting it. The process table's columns, in order, are PID, Process, User, CPU, Memory, State.

## System summary
```js
{ hostname, platform, release, arch, cpuCount, uptime, memory: {total, used, free, percent}, disk: {size, used, available, percent} }
```
System memory and filesystem size values are represented in bytes after they reach the system-summary contract. `memory.percent` and `disk.percent` are numbers from 0 to 100 (`memory.percent` is `used / total`).

## Termination requests
`processes:kill` and `processes:force-kill` each take **one argument: the PID as a positive integer**. They resolve to `{ ok: true, pid }` or reject with an error whose message is shown to the user.
