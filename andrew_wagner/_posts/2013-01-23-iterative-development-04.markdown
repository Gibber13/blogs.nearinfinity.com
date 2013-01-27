---
title: "Iterative software development, part 4"
tags: # java eclipse 2d game development CES component entity system
---

Whew! Episode 4 was a tough one to get recorded! I packed a lot of code in, and changed up my recording process along the way. I'm really excited about the result, though, a cool-looking spaceship that you can actually fly around the screen! I hope you enjoy! I thought for the blog portion of this episode, I would step back and talk about the bigger picture of what we've done so far, and where we're going.

At this stage, I would consider this a bare minimum proof of concept. We can fly a spaceship. That has to be the starting point of any space shooter. We've also sketched out the basic architecture of a CES application. We've got a couple of components, a couple of systems, a simple Entity class, and a basic game loop. 

The sketch is still pretty rough, though. There are some classes and methods that are a little longer than I'd like. There are some things hard-coded that really shouldn't be. The main game loop is up to the user to write. And we don't have any infrastructure for verifying in an automated fashion whether or not we've broken anything. 

So the next few episodes will still add features, but will really look to flesh some of these things out along the way. Here are a few of my ideas, which will likely show up in the next few episodes:

* Testing - we really need to take a time out episode to get some basic tests written. We'll need both unit-level tests for individual pieces, and higher-level acceptance tests
* Centering the display on the player - We'll add 2 new entities, and fix the render system to keep the player at the center of the screen. This gives us an opportunity to create a World object into which we can move the main loop.
* Firing weapons - This means generating bullets (a new Entity type) on the fly. 
* Explosions - A health component, and a new animation. I suspect that the focus of this episode will be on re-organizing our components.
* UI improvements - By now, it will be about time to make things look prettier. An actual space-like background, and simple HUD should do the trick
* Simple enemy evasion - A new system will give our enemies just enough sense to flee our mighty weapons, making things just a little more fun. 

I've got lots of other ideas - mining, shields, pirates, asteroids, planets, and so on. But I think this is plenty far ahead enough to plan. Stay tuned, though, it's going to be fun! In the meantime, here's episode 4:

{% video_tag :youtube => ID3DsH4KikQ %}


