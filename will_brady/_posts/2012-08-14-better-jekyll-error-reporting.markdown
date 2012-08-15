---
title: Better Error Reporting of Liquid Exceptions in Jekyll
tags: jekyll liquid
---
The Problem
------------

We recently converted our website to [Jekyll](https://github.com/mojombo/jekyll). Along the way I occasionally ran into a very annoying problem. What would happen is (being new to Jekyll and [Liquid](https://github.com/Shopify/liquid)) I would occasionally misspell a Liquid tag and not be notified by Jekyll during the build process. So for example let's say instead of the correct include tag
 
{% highlight html %}
{{ "{% include sharing.html " }}%}
{% endhighlight %}

I accidently write it as

{% highlight html %}
{{ "{% inclde sharing.html " }}%}
{% endhighlight %}

When I build the site using the jekyll command, Jekyll will let me know that my site compiled successfully

{% highlight bash %}
> jekyll
Configuration from /blog/_config.yml
Building site: /blog -> /blog/_site
Successfully generated site: /blog -> /blog/_site
{% endhighlight %}

Why are you lying to me Jekyll? There's no way it could have successfully interpreted "inclde". It didn't. Liquid gives a nice error message "Liquid syntax error: Unknown tag 'inclde'". Unfortunately Jekyll takes the liberty of going ahead and dropping that error message in your rendered page and not letting you know about it. You get something like this:

!["Liquid syntax error: Unknown tag 'inclde'"](/blogs/will_brady/assets/jekyll-error.png "Jekyll Error")

The Solution
-------------

The solution is to call .render! rather than simply .render on the Liquid templates in Jekyll. Liquid doesn't say much about the .render! method in its documentation, but its obvious when you look at its [code](https://github.com/Shopify/liquid/blob/master/lib/liquid/template.rb). The .render! method does the same thing as the .render method except it actually raises an error rather than simply returning the error message. This is necessary for Jekyll who blindly passes the string results along. Jekyll's [Convertible](https://github.com/mojombo/jekyll/blob/master/lib/jekyll/convertible.rb) class already has the begin/rescue in place to catch the errors, its just not telling Liquid to throw them.

Simply changing the two lines which call .render on Liquid templates to .render! will solve the problem. In addition I added a backtrace dump and an abort of the build. This way Jekyll will no longer mislead you about its success.

{% highlight ruby %}
begin
  self.output = Liquid::Template.parse(layout.content).render!(payload, info)
rescue => e
  puts "Liquid Exception: #{e.message} in #{self.data["layout"]}"
  e.backtrace.each do |backtrace|
    puts backtrace
  end
  abort("Build Failed")
end
{% endhighlight %}

I've created a [gist](https://gist.github.com/3360478) of a monkey patch file to drop in your project's _plugins/ directory for a quick fix to this problem. This will overwrite the do_layout method only (not the entire Convertible module). I've also submitted a [pull request](https://github.com/mojombo/jekyll/pull/624) to Jekyll.