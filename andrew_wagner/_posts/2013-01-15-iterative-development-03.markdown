---
title:  # Iterative software development, part 3
tags: # java eclipse 2d game development CES component entity system
---

Welcome to episode 3! Last time we got as far as rendering a cool-looking spaceship to the screen. We also talked a little bit about how we want to choose features: based on value. 

We talked about how it is essential to this game to be able to fly around a spaceship. Now that we have a spaceship, it's time to figure out how to animate it. Then, next time, we'll hook it up to the keyboard. After that, we'll take a little break and set up some automated testing infrastructure. After that, the sky is the limit...err, that doesn't work very well for a space game, does it?

Anyway, I also want to point out what I'll call "direct" and "indirect" value in these features. "Direct" value is something that the user would ask for - being able to see a spaceship, being able to fly the space ship, and so on. "Indirect" value is the *ability* to define features like that easily. So, as we write the feature to render a spaceship, we're mindful that we might want to render other images later. The key, here, is to have balance between the two. If you write a feature with all indirect value, the customer sees no change, and it seems like you're just wasting time. Add a feature with direct value, but without looking for indirect value, and the over-all organization of your codebase decreases. 

So, as we add features, watch for both the direct value, and the indirect value. We're accumulating both. Direct in the form of a playable game coming into existence. And indirect in the form of a flexible game engine with re-usable components. 

That said, we're not adding any value, direct or indirect, by talking about it, so let's get to coding!

{% video_tag :youtube => flUrQRCmsDg %} 