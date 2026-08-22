import os, subprocess
env = os.environ.copy()
env["GIT_AUTHOR_NAME"] = "Dev1822"
env["GIT_AUTHOR_EMAIL"] = "dev.d.patel.cg@gmail.com"
env["GIT_COMMITTER_NAME"] = "Dev1822"
env["GIT_COMMITTER_EMAIL"] = "dev.d.patel.cg@gmail.com"
subprocess.check_call(["git", "add", "."], env=env)
subprocess.check_call(["git", "commit", "-m", "fix(api): add missing addStop, reorderStops, and addActivity methods to tripsApi"], env=env)
