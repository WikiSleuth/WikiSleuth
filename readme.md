<h1>WikiSleuth</h1>
<h3>A Tool For The Avid Wikipedia Editor</h3>
<br>
<h2>Installation: </h2>
WikiSleuth is a Google Chrome browser extension. In order to install, navigate to your [Chrome extensions](chrome://extensions) page. [MongoCollection](http://php.net/manual/en/class.mongocollection.php)







<br>
<br>
<br>
<h2> Simple Branch Tutorial:</h2>
Please edit, this needs much work! 
<br>
This is a simple write up on how to use branching in Git to develop while maintaining a stable product in the Master branch.
<br>
<h3>Summary:</h3>
git pull <br>
git checkout -b branchName <br>
Develop <br>
git add files <br>
git commit <file(s)> -m 'Committing!' <br>
git pull origin branchName <br>
git push origin branchName <br>
git checkout master <br>
git pull <br>
git merge branchName <br>
git branch -d branchName <br>
git push <br>
<br>
<h3>Mini Tutorial:</h3>
0) git pull (make sure the branch you are checking out contains the newest content of that branch) <br>
1) git checkout -b branchName<br>
    - ex: git checkout -b foo <br>
    - This creates a new branch with a name of your choosing copying all elements from the current branch you are on. It also moves you to that branch. <br>

2) Develop/test/do your thang. While developing in your branch you can checkout to any other branch using 'git checkout branchName' Git will copy the files of the branch you checked out to your folder. At any time you can hop between branches and Git will update your folder with the contents of whatever branch you are on. So in short you will never loose any work if you checkout to another branch. You just have to checkout back to the branch you were developing on to get your work back. <br>
    - ex: git checkout master (now I am on master branch) <br>
    - git checkout foo (now I am back to foo) <br>

3) When you are done developing on your new branch, push your new work to the branch you were working on <br>
    - git add files (stages your files for commit) <br>
    - git commit files -m 'Committing my changes!' (readys your files to be pushed) <br>
    - git pull origin branchName (If this is a new branch you can skip this step because no one has pushed the branch yet) <br>
    - git push origin branchName (Push up your changes!) <br>

4) After you have gotten your work up in Git on your branch and it seems to be working well, you can merge it with master. <br>
    - git checkout master (load the master branch) <br>
    - git pull (pull any changes others could have made when you were in your branch) <br>
    - git merge branchName (merges the branch you were working on with master) <br>
    - Optional: git branch -d branchName (deletes the branch you had been working in) <br>
    - git pull <br>
    - git push <br>

You should now have pushed your stable changes safely to master! Side note, don't be afraid of merge conflicts. They can seem bad at first but once you fix one they are not that bad. <br>

Let me know if any of this is ambiguous, or feel free to add to it if you think something is wrong/not explained well. <br>

Here is the link Jadrian sent out for more documentation: http://nvie.com/posts/a-successful-git-branching-model/
