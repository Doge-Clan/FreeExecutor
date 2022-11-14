# FreeExecutor
This is the source code for a JavaScript web-based shell. It can be embedded in an HTML5 page, or can be used as a bookmarklet to run over any website you desire.

(C) 2021-2022 Doge Clan, Licensed under the LGPL 2.1 License

## Bookmarklet Source Code
Not Ready Yet for production. Please use 0.2.1 if you need something that works now.

## How to Use
Currently to see all commands, run `fepkg --list-commands` to see all currently installed commands.

## Limitations
- No Cross-Origin Scripts
- `exec` is not implemented yet and you need to install anonymous scripts via fepkg for now. (`eval` works though)
- No persistant packages akin to libnix (This will be added by 0.3 full release)
