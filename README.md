# FreeExecutor
[![forthebadge](https://forthebadge.com/images/badges/powered-by-coffee.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-js.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/you-didnt-ask-for-this.svg)](https://forthebadge.com)

This is the source code for a JavaScript web-based shell. It can be embedded in an HTML5 page, or can be used as a bookmarklet to run over any website you desire.

©️ 2021-2022 Doge Clan, Licensed under the LGPL 2.1 License

## How to Use
Currently to see all commands, run `fepkg --list-commands` to see all currently installed commands.

## Limitations
- No Cross-Origin Scripts (Cross-Website Storage can be done but that may take a bit)
- Some Websites fail to Execute because of strict security policies (Ex: Google Classroom)
- Text UI is not fully done and prompt/alert are still used and not patched (Full Release of 0.4 will fix `prompt()`)
- What you see is what you get. FreeExecutor has a K.I.S.S. philosophy and contains just the core and some standard utilities. You need to install various components if you want to do anything more. (Or, you can build your own!)
