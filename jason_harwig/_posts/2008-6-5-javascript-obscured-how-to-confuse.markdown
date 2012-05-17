--- 
permalink: /blogs/jason_harwig/javascript_obscured_how_to_confuse.html
layout: blogs
title: JavaScript Obscured (How to confuse coworkers)
date: 2008-06-05 20:19:44 -04:00
tags: JavaScript
---
I was reading a blog entry at <a href="http://webreflection.blogspot.com/2008/06/two-simple-tricks-in-javascript-olds.html">Web Reflection</a> that outlined some obscure solutions to common JavaScript patterns.

I thought that entry was interesting, but I'm not sure I'd use them because of code readability and maintenance. It did get me thinking of some other ways to obscure simple tasks.

a better ternary?
=================

Have a co-worker that thinks ternary expressions are ugly?  Offer them this alternative:

{% highlight js %}
var saveFunc = isNew ? insert : update;

// becomes...

var saveFunc = [update, insert][+isNew];
{% endhighlight %}

Looks a little crazy, huh?  It works because a '+' or '-' before a boolean converts the boolean to a one or zero depending on its truthiness. The one or zero is accessing that element of the array. They'll be begging for ternary after that.

I think I might actually use that that syntax in situations where I need to add one depending on a boolean:

{% highlight js %}
var version = x + (+shouldIncrement);

var version = x + (-shouldNotIncrement);
{% endhighlight %}

throw out parseInt
==================

Converting a string to a number is often done with parseInt. There are some gotchas that many people fall into in that the second parameter to parseInt is not required, but should be. For instance:

{% highlight js %}
var x = parseInt("08");
// x is 0, because it assumes octal (base 8)
var x = parseInt("08", 10); // force base 10
// x is 8

// an alternative
var x = +"08";
// x is 8

// Negation works also
var x = -"08";
// x is -8
{% endhighlight %}

Use them wisely, or preferably never.
