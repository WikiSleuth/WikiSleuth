Git Branching!

This is a simple write up on how to use branching in Git to develop while maintaining a stable product in the Master branch.

Summary:
git pull
git checkout -b <branch name>
Develop
git add <file(s)>
git commit <file(s)> -m 'Committing!'
git pull origin <branch name>
git push origin <branch name>
git checkout master
git pull
git merge <branch name>
git branch -d <branch name>
git push


Mini Tutorial:
0) git pull (make sure the branch you are checking out contains the newest content of that branch)
1) git checkout -b <your branch name>
    - ex: git checkout -b foo
    - This creates a new branch with a name of your choosing copying all elements from the current branch you are on. It also moves you to that branch.

2) Develop/test/do your thang. While developing in your branch you can checkout to any other branch using 'git checkout <branch name>' Git will copy the files of the branch you checked out to your folder. At any time you can hop between branches and Git will update your folder with the contents of whatever branch you are on. So in short you will never loose any work if you checkout to another branch. You just have to checkout back to the branch you were developing on to get your work back. 
    - ex: git checkout master (now I am on master branch)
    - git checkout foo (now I am back to foo)

3) When you are done developing on your new branch, push your new work to the branch you were working on
    - git add <filename(s)> (stages your files for commit)
    - git commit <filename(s)> -m 'Committing my changes!' (readys your files to be pushed)
    - git pull origin <branch name> (If this is a new branch you can skip this step because no one has pushed the branch yet)
    - git push origin <branch name> (Push up your changes!)

4) After you have gotten your work up in Git on your branch and it seems to be working well, you can merge it with master.
    - git checkout master (load the master branch)
    - git pull (pull any changes others could have made when you were in your branch)
    - git merge <branch name> (merges the branch you were working on with master)
    - Optional: git branch -d <branch name> (deletes the branch you had been working in)
    - git pull
    - git push

You should now have pushed your stable changes safely to master! Side note, don't be afraid of merge conflicts. They can seem bad at first but once you fix one they are not that bad.

Let me know if any of this is ambiguous, or feel free to add to it if you think something is wrong/not explained well.
