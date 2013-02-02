---
title: Sneakernet Solved with Git Bundle
tags: git
---

Recently I wanted to transfer a presentation from
one machine to another, and unfortunately I was
unable to connect to the Internet. Similar to life when it
was entirely offline or whenever Github is vexingly
down, I was in a classic _sneakernet_ scenario. If you
haven't heard the term, _sneakernet_ is slang for
walking media such as a disk or USB flash drive from
one machine to another in order to transfer files.
Bonus points if you bring a pedometer along.

Ordinarily I'd copy the presentation onto a USB stick,
transfer the presentation to the second computer, and
be done. In a feeble attempt at version control, maybe
I would have renamed the file "Presentation DRAFT1
FINAL". However, this time my presentation was in
HTML/JavaScript and already version controlled with
Git. While I could use git to create and apply patches
across to the unconnected machine, there's an easier
way - _git bundle_.

## Create the Git Bundle

Think of _git bundle_ as zipping or tarring up your
repository with benefits - namely that you can transfer
the exact git objects that store your commits, branches,
and tags. A git bundle mimics a remote, enabling
fetching, pulling, and diffing between machines that
aren't otherwise connected.

To create a bundle named "repo.bundle" containing
each and every commit in the master branch: 

{% highlight console %}
git bundle create repo.bundle master
{% endhighlight %}

Especially if you anticipate transferring more commits
in the future, tag the current commit on master.

## Clone the Bundle on the Second Machine

If the repository does not already exist on the
second machine, it's easiest to clone directly from
the bundle.

To clone into the directory "myRepo" and check out
the branch master:

{% highlight console %}
git clone repo.bundle myRepo -b master
{% endhighlight %}

Verify the master branch. My preferred method is
viewing a graph of the commits:

{% highlight console %}
git log --oneline --decorate --graph
{% endhighlight %}

## Transferring Additional Commits

We could once again bundle the entirety of the master
branch and do a git clone on the second machine, but
we'd sacrifice any additional work on that box.
Instead, bundle master starting from the previous
bundle's most recent commit:

{% highlight console %}
git bundle create more.bundle lastBundleTag..master
{% endhighlight %}

On the second machine, verify the bundle then pull
the contents into master:

{% highlight console %}
git bundle verify more.bundle
git pull more.bundle master
{% endhighlight %}

Once again, verify the master branch and the recently
transferred commits:

{% highlight console %}
git log --oneline --decorate --graph
{% endhighlight %}

## Conclusion

Using git bundle makes version controlling repositories
across unconnected machines simple. Additionally, all
the elements of the git workflow remain at your beck
and call. For example, consider creating a long
running branch for changes that are only applicable to
the second machine for reasons such as easy diffing
between machines.

