---
title: "Iterative software development, part 5"
tags: # java eclipse 2d game development CES component entity system
---

As promised, episode 5 is all about testing. I know, it's not always the most fun part of software development, but I would argue that it still brings some very tangible benefits. An awful lot has been written about software testing, so I'll just summarize a couple of points here about why I believe it's useful:

First, automated testing is automation. Ok, this is obvious, but it's important. You want to be able to know whether you've broken anything. And you want to know this very often. That's just inherent in software development. So why not automate it? Every time you get the itch to run your program to check something, stop and ask why. Is there a way you can automate that process? Surely that would save you time. Every time you think "hm, I wonder what would happen if I pass a negative value in here", write a test. Why not? It's cheap, easy, and accurate. 

Second, unit tests and acceptance tests give you feedback about the design of your code. If something is hard to test in isolation, that's telling you something about its dependencies. And dependencies are the single biggest thing that will come back to haunt you later on, when you want to make a change. Better to find out this information early on, and deal with it before it becomes a mess.

Third, and finally, tests are good documentation. That exploratory test you wrote earlier? Now it documents what happens when you pass a negative value in. Coming back to a class you haven't touched for a while? Go back and crack open its tests. They should give you a pretty clear idea of its usage. 

Honestly, the tools are at the point that, if you're not bothering to write tests, you're really being unprofessional, as a software developer. You're doing yourself and your customer a disservice. If you're new to testing, here are just a couple of resources to whet your appetite. I learned a lot about testing and OO design from [this fantastic book](http://www.amazon.com/Growing-Object-Oriented-Software-Guided-Tests/dp/0321503627). Also, [this book](http://pragprog.com/book/tpp/the-pragmatic-programmer) has a lot to say, not only about testing, but a variety of software development practices. It should be required reading for every software developer, in my opinion. In the ruby community, I've learned a lot from the talks and writings of [Sandi Metz](http://sandimetz.com/) and [Avdi Grimm](http://devblog.avdi.org/). 

Here's episode 5:

{% video_tag :youtube => njQiTvA3OeY %}


