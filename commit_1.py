import os, subprocess
env = os.environ.copy()
env["GIT_AUTHOR_NAME"] = "Dev1822"
env["GIT_AUTHOR_EMAIL"] = "dev.d.patel.cg@gmail.com"
env["GIT_COMMITTER_NAME"] = "Dev1822"
env["GIT_COMMITTER_EMAIL"] = "dev.d.patel.cg@gmail.com"
env["GIT_AUTHOR_DATE"] = "2026-08-22 15:08:00 +0530"
env["GIT_COMMITTER_DATE"] = "2026-08-22 15:08:00 +0530"
subprocess.check_call(["git", "add", "server/controllers/tripController.js"], env=env)
subprocess.check_call(["git", "commit", "-m", "fix(api): sanitize empty date parameters in trip stop creation for MySQL compatibility"], env=env)
