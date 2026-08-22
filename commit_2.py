import os, subprocess
env = os.environ.copy()
env["GIT_AUTHOR_NAME"] = "Dev1822"
env["GIT_AUTHOR_EMAIL"] = "dev.d.patel.cg@gmail.com"
env["GIT_COMMITTER_NAME"] = "Dev1822"
env["GIT_COMMITTER_EMAIL"] = "dev.d.patel.cg@gmail.com"
env["GIT_AUTHOR_DATE"] = "2026-08-22 15:09:00 +0530"
env["GIT_COMMITTER_DATE"] = "2026-08-22 15:09:00 +0530"
subprocess.check_call(["git", "add", "client/src/features/trips/tabs/TripStopsTab.jsx"], env=env)
subprocess.check_call(["git", "commit", "-m", "fix(ui): normalize stop IDs and handle add city stop errors with user feedback"], env=env)
