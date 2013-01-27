---
title: Multiple ways to draw an image using CSS, HTML and Javascript
tags: html css canvas
---

I recently read an [article](http://webdesign.tutsplus.com/tutorials/htmlcss-tutorials/building-icons-with-a-single-html-element/)
by Vincent Durand on how to draw images using a single element. The article was very well laid out and I
definitely recommend you take a look. I thought I'd take this concept of drawing images
rather than linking to image files and apply it to our Near Infinity logo. In this post
I'll go over 4 different ways you can draw images using CSS, HTML and Javascript.

# Single Element with Multiple Backgrounds
This is basically the method described in the Vincent's article. To draw the Near
Infinity logo I took one div and gave it 4 backgrounds (one for each of the ovals).
Each background is a radial gradient which defines its color and shape. Each background
is then positioned and sized. The result scales easily with the font size.

HTML:
{% highlight html %}
<div id="logo">
</div>
{% endhighlight %}

CSS:
{% highlight css %}
#logo {
  position: relative;
  font-size: 60px;
  width: 4em;
  height: 2em;
  background: -moz-radial-gradient(center, ellipse, rgba(255, 255, 255, 1) 40%,transparent 41%,transparent 100%),
              -moz-radial-gradient(center, ellipse, rgba(0, 0, 0, 1) 40%,transparent 41%,transparent 100%),
              -moz-radial-gradient(center, ellipse, rgba(255, 255, 255, 1) 40%,transparent 41%,transparent 100%),
              -moz-radial-gradient(center, ellipse, rgba(237, 128, 39, 1) 40%,transparent 41%,transparent 100%);
  background: -webkit-radial-gradient(center, ellipse, rgba(255, 255, 255, 1) 40%,transparent 41%,transparent 100%),
              -webkit-radial-gradient(center, ellipse, rgba(0, 0, 0, 1) 40%,transparent 41%,transparent 100%),
              -webkit-radial-gradient(center, ellipse, rgba(255, 255, 255, 1) 40%,transparent 41%,transparent 100%),
              -webkit-radial-gradient(center, ellipse, rgba(237, 128, 39, 1) 40%,transparent 41%,transparent 100%);
  background: radial-gradient(center, ellipse, rgba(255, 255, 255, 1) 40%,transparent 41%,transparent 100%),
              radial-gradient(center, ellipse, rgba(0, 0, 0, 1) 40%,transparent 41%,transparent 100%),
              radial-gradient(center, ellipse, rgba(255, 255, 255, 1) 40%,transparent 41%,transparent 100%),
              radial-gradient(center, ellipse, rgba(237, 128, 39, 1) 40%,transparent 41%,transparent 100%);
  background-position: 0.3em 0.75em,
                       -0.6em 0.35em,
                       1.4em 0.6em,
                       1.05em 0.15em;
  background-size: 1.7em 1.0em,
                   3em 1.9em,
                   1.7em 1.0em,
                   3em 1.9em;
  background-repeat: no-repeat;
}
{% endhighlight %}

[View a demo](http://jsfiddle.net/z3NAS/1/)

In addition to using multiple backgrounds you could also you multiple box shadows.
Joshua Hibbert has a good [blog post](http://joshnh.com/2012/08/16/drawing-things-with-box-shadow/)
on this. Vincent Durand also creaed [one-div.com](http://one-div.com/) which is a
collection of various icons all created using one div element.


# Multiple Elements
In this case I create the structure of the logo in HTML and style each element
individually to how it looks. This seems to me like the most natural approach (one
element per geometric shape). When you look at the HTML and then the CSS it makes a
lot more sense off the bat then the first example with multiple backgrounds. This
method also makes it easier if you want to animate specific parts of your image.
Rather than redrawing all of the backgrounds in the first method, you could animate
an individual element here while keeping the rest intact.

HTML:
{% highlight html %}
<div id="logo">
  <div id="black" class="leaf">
    <div class="eye">
    </div>
  </div>
  <div id="orange" class="leaf">
    <div class="eye">
    </div>
  </div>
</div>
{% endhighlight %}

CSS:
{% highlight css %}
#logo {
  font-size: 60px;
  width: 3.5em;
  height: 2em;
}

#logo .leaf {
  width: 1.7em;
  height: 1em;
  border-radius: 0.85em / 0.5em;
  position: absolute;
}

#logo .leaf .eye {
  width: 1em;
  height: 0.6em;
  border-radius: 0.5em / 0.3em;
  background-color: white;
}

#logo #black {
  background-color: black;
  margin-top: 0.25em;
}

#logo #black .eye {
  float: right;
  margin-top: 0.15em;
  margin-right: 0.1em;
}

#logo #orange {
  background-color: rgba(237, 128, 39, 1);
  margin-left: 1.62em;
}

#logo #orange .eye {
  float: left;
  margin-top: 0.25em;
  margin-left: 0.1em;
}
{% endhighlight %}
[View a demo](http://jsfiddle.net/dMSuY/)

Jeff Batterton used this method to [draw an iPhone](http://lab.jeffbatterton.com/iphone-css3/).

# Canvas
Another method would be to use HTML5 canvas. A key difference here is that there's no
CSS. Therefore, you lose the ability to use CSS animations and media queries to
manipulate the images easily. You can always accomplish the same thing by going into
Javascript but now you're maininting the style of your page across two mediums.

HTML:
{% highlight html %}
<canvas id="logo-canvas" width="250" height="100">
</canvas>
{% endhighlight %}

Javascript:
{% highlight javascript %}
var canvas = document.getElementById('logo-canvas');
if (canvas.getContext) {
  var ctx = canvas.getContext("2d");

  // Draw black oval
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.scale(1.75, 1);
  ctx.beginPath();
  ctx.arc(35, 51, 30, 0, Math.PI*2, false);
  ctx.fill();
  ctx.closePath();
  ctx.restore();

  // Draw white oval inside black
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.scale(1.75, 1);
  ctx.beginPath();
  ctx.arc(42, 47, 17, 0, Math.PI*2, false);
  ctx.fill();
  ctx.closePath();
  ctx.restore();

  // Draw orange oval
  ctx.save();
  ctx.fillStyle = "rgba(237, 128, 39, 1)";
  ctx.scale(1.75, 1);
  ctx.beginPath();
  ctx.arc(92, 37, 30, 0, Math.PI*2, false);
  ctx.fill();
  ctx.closePath();
  ctx.restore();

  // Draw white oval inside orange
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.scale(1.75, 1);
  ctx.beginPath();
  ctx.arc(82, 40, 17, 0, Math.PI*2, false);
  ctx.fill();
  ctx.closePath();
  ctx.restore();
}
{% endhighlight %}
[View a demo](http://jsfiddle.net/ZrPZX/)


EDIT: SVG

# SVG
I originally forgot probably the coolest of all the methods: SVG.
SVG is awesome because it combines the best of both worlds. You
can draw very specific graphics the way you would in a graphics
program but each shape is also an HTML element so you can manipulate
and animate it with CSS.

HTML:
{% highlight html %}
<svg>
  <ellipse cx="50" cy="51" rx="50" ry="30" fill="rgb(0,0,0)"/>
  <ellipse cx="145" cy="37" rx="50" ry="30" fill="rgb(237, 128, 39)"/>
  <ellipse cx="60" cy="47" rx="30" ry="17" fill="rgb(255, 255, 255)"/>
  <ellipse cx="132" cy="40" rx="30" ry="17" fill="rgb(255, 255, 255)"/>
</svg>
{% endhighlight %}
[View a demo](http://jsfiddle.net/joeferner/jsYbt/) (Credit: [Joe Ferner](http://www.nearinfinity.com/blogs/joe_ferner/))
