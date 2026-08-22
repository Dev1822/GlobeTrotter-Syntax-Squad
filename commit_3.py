import os, subprocess
env = os.environ.copy()
env["GIT_AUTHOR_NAME"] = "mann2007-ptl"
env["GIT_AUTHOR_EMAIL"] = "mann.patel.cg@gmail.com"
env["GIT_COMMITTER_NAME"] = "mann2007-ptl"
env["GIT_COMMITTER_EMAIL"] = "mann.patel.cg@gmail.com"
env["GIT_AUTHOR_DATE"] = "2026-08-22 15:02:00 +0530"
env["GIT_COMMITTER_DATE"] = "2026-08-22 15:02:00 +0530"
subprocess.check_call(["git", "add", "."], env=env)
subprocess.check_call(["git", "commit", "-m", "chore(static): remove obsolete ContactHelpPage component"], env=env)
