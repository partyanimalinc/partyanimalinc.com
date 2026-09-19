---
description: Lint, build, commit, and push main so Vercel deploys.
---
Run the release sequence for partyanimalinc.com. Stop at the first failure.

1. `npm run lint`
2. `npx next build`
3. `git status` and `git diff --stat`. Confirm nothing scratch is staged.
4. Commit in the style of recent `git log`: one specific imperative line.
5. `git push origin main`.
6. Report the hash.

Context from the user: $ARGUMENTS
