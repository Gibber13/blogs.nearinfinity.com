---
title:  # Iterative software development, part 2
tags: # java eclipse 2d game development CES component entity system
---

Welcome back for episode 2! It's time to implement our first real feature. And with that, comes a decision: what feature should we implement? Some map to fly around in? A way of keeping track of all the entities in the application? A game loop? 

Well, I'm not going to say that these are wrong, and they'll all be needed eventually, but let me tell you how *I* would make the decision. That is, after all, the point of this series. I make decisions like this based on value for the user. 

What is it we're building? A space game. What is a space game? One in which you fly around a spaceship. Well, flying is a bit much to take on all at once, so I'll settle for being able to draw a spaceship. After all, that is the definition of a space game. If I were to show this empty window that we created last time to someone and say "here's my space game", the most obvious question would be "...well, where's the space ship?". So, that's what we'll do!

Now, I'm no artist at all. Fortunately, there's some awesome free art available on opengameart.org. In particular, I'll be using [this set of graphics](http://opengameart.org/content/space-shooter-art), done by kenney.nl. 

There's one other credit to give out. I did a bunch of research to figure out the absolute minimum java graphics programming I could get away with for this series. Many of the screencasts out there do lots of crazy copying around of bits of arrays. I may very well need to do that eventually, but I wanted something ultra-simple to start with. Ultimately, [this page](http://www3.ntu.edu.sg/home/ehchua/programming/java/J4b_CustomGraphics.html) was extremely useful in figuring that out, so props to them. 

Ok, enough talk, let's get coding!

{% video_tag :youtube => XAjcPKZM4t0 %} 