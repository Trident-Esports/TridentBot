# Branches

* `main`
  * Live branch. The goal of this branch is to reflect what's being served to the Discord server.

* `stable`
  * Stable branch. The goal of this branch is to always be in a state of working. It may not have full functionality, but it shouldn't crash. It'll gather up stuff to be pushed as a group to `main`.

* `unstable`
  * Unstable branch. Consolidate *`feature branches`* for testing. Push to `stable` when no bugs found.

* *`feature branches`*
  * Feature branches are for testing or in-development ideas that are unstable and are not guaranteed to be functional out of the box.
  Each feature branch will eventually be promoted to `stable` and deleted.

* *`src`*
  * Move source code to `src` folder.
  * Use `dotenv` for `SENSITIVE.json`.
  * Preparing for `discord.js` `v13`.
  * [`a-djs-handler`](https://www.npmjs.com/package/a-djs-handler) needs to be updated to `v13` for this to continue working.
    * Needs to use `Discord.Intents` declaration.
    * Alternatives include:
      * [`advanced-command-handler`](https://www.npmjs.com/package/advanced-command-handler)
        * `Discord.js` `v13` planned for module `v3.1`.

* *`vevent`*
  * Split classes/commands/events into category folders instead of all jumbled together.

* *`metadata-updates`*
  * Roster updates.
  * Workflow:
    1. Roster updates get committed.
    1. `stable` merges into `metadata-updates`.
    1. `metadata-updates` merges back with `stable`.

* *`buttons`*
  * Old; try to integrate buttons into messages.
