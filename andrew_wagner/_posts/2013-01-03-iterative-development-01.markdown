---
title: "Iterative software development, part 1"
tags: # java eclipse 2d game development CES component entity system
---

With this blog post, I'm officially kicking off a new long-running screencast series! Yay! I really am excited about this, but first let me give a big shout-out to [Near Infinity](http://www.nearinfinity.com/), which is a great place to work. Awesome benefits, smart and talented people, and very interesting work.

So, what's this screencast series going to be about? The main theme is iterative software development - I'll be building a 2D game library iteratively, one feature per screencast. I won't be teaching Java syntax, but I will be teaching you how to keep your code organized and flexible so that you can go whatever direction you need to.

I'll be using an architecture called "Component, Entity, System" for this project. There's lots of great information out there about this, but I'll go ahead and define the terms here for convenience:

* Component - A chunk of related data, such as a point (with an x and y value). Little-to-no logic
* Entity - An ID list of components. Little-to-nothing else, including logic.
* System - Logic (finally!) that acts on a set of entities.

That's enough of an intro for now. You can find the [github repository here](https://github.com/arwagner/gameengine). Please [email me feedback](mailto:awagner@nearinfinity.com); I will be happy to take it into account. I'm hoping to release a video or two each week, so tell me what you want to see! Here's the first video:

{% video_tag :youtube => L23eqbZ8OcE %}
