---
title: SVN Export in Git
tags: git svn
layout: blogs
---
Recently I had a need to get a copy of a Git repo onto another box but not have it tracked to the previous repo.  I actually wanted it to be a complete standalone snapshot of the repository without the .git folders.  This is very similar to doing an svn export.

While searching the web I found a lot of people asking this same question.  I found lots of people mention using the git archive method which creates a tarball of the repo without the git folder.  This is close, but I was trying to find a single command so that I didn't have to build the tarball, transfer it and untar it.

Finally after a lot of searching I found one response that looked like it would work.  Unfortunately I can't remember what the exact link was but I believe it was on [Stack Overflow](http://stackoverflow.com).  Here is the command I found:

		git archive --remote=user@host:/path branch | tar -x
		
Here is an explaination of the parts of that command:

+ --remote is the remote location of the git repo that you want to export
+ branch is the branch on that repo that you want to export
+ | tar -x sends the output of archive (a tarball) and pipes it to the tar command to extract in the location where you are.