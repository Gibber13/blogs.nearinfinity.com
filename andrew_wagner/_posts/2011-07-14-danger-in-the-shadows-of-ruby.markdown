--- 
permalink: /blogs/andrew_wagner/danger_in_the_shadows_of_ruby.html
layout: blogs
title: Danger in the shadows of ruby...
date: 2011-07-14 16:40:32 -04:00
---
Consider this seemingly innocuous bit of code, presumably on a User class somewhere:

<pre>
 def manager
    manager = User.ceo
    User.all_managers.each do |manager| 
        return manager if self.reports_to?(manager)
    end
    return manager
  end
</pre>

There are certainly other ways to write this code, but the idea is straightforward enough. This is a pretty small company, and if there are no manager-level employees to whom the user reports, then they report directly to the CEO.

However, as you might have guessed, it's not quite that simple. In fact, in ruby 1.8x, it will always return one of the managers, and **never** the CEO. The "manager" variable in the block overwrites the variable defined previously. Note, however, that both variables, in some sense, shadow the method name, yet that doesn't come into play at all.

Now in ruby 1.9.2, all is well. The "manager" variable in the block shadows the previous one, but doesn't interact with it. And, to boot, it warns you about what you're doing, if you turn warnings on [which of course you should](http://avdi.org/devblog/2011/06/23/how-ruby-helps-you-fix-your-broken-code/). 

However, this unfortunately doesn't help you in the slightest in ruby 1.8. And, in fact, it's worse than that. Here's [a more complete implementation of the class, with some tests](https://gist.github.com/1083428). These tests pass. Not only that, but they show 100% code coverage! **This is why you cannot trust code coverage in and of itself**.

So, this is a simple snippet, which behaves in mysteriously different ways between 1.8 and 1.9, gives you no warning in 1.8, and even deceives your code coverage numbers. Here be dragons! 
