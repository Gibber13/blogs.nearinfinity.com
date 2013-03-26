---
title: Capture a Signature on iOS
tags: ios opengl
---

The Square Engineering Blog has a great article on [Smoother Signatures](http://corner.squareup.com/2012/07/smoother-signatures.html) for Android, but I didn't find anything specifically about iOS. So, what is the best way to capture a users signature on an iOS device?

Although I didn't find any articles on signature capture, there are good implementations on the App Store. My target user experience was the iPad application [Paper by 53](http://fiftythree.com/paper), a drawing application with beautiful and responsive brushes.

All code is available in the Github repository: [SignatureDemo](https://www.github.com/jharwig/SignatureDemo).

Connecting the Dots
===================

<img src="/blogs/jason_harwig/assets/signature-diagram-lines.png" title="signature diagram lines"/>

The simplest approach is to capture the touches and connect them with straight lines.

In the initializer of a `UIView` subclass, create the path and gesture recognizer to capture touch events.

{% highlight objc %}
// Create a path to connect lines
path = [UIBezierPath bezierPath];

// Capture touches
UIPanGestureRecognizer *pan = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(pan:)];
pan.maximumNumberOfTouches = pan.minimumNumberOfTouches = 1;
[self addGestureRecognizer:pan];
{% endhighlight %}

Capture the pan events into a bézier path by connecting the points with lines.

{% highlight objc %}
- (void)pan:(UIPanGestureRecognizer *)pan {
    CGPoint currentPoint = [pan locationInView:self];

    if (pan.state == UIGestureRecognizerStateBegan) {
        [path moveToPoint:currentPoint];
    } else if (pan.state == UIGestureRecognizerStateChanged)
        [path addLineToPoint:currentPoint];

    [self setNeedsDisplay];
}
{% endhighlight %}

Stroke the path

{% highlight objc %}
- (void)drawRect:(CGRect)rect
{
    [[UIColor blackColor] setStroke];
    [path stroke];
}
{% endhighlight %}

<img src="/blogs/jason_harwig/assets/signature-letter-j.png" style="max-height:300px;" title="signature letter j"/>

An example "J" character rendered using this technique reveals some issues. At slow velocities iOS captures enough touch resolution that the lines aren't noticeable, but faster movement shows large gaps between touches that accentuates the lines.

The 2012 Apple Developer Conference included a session [Building Advanced Gesture Recognizers](https://developer.apple.com/videos/wwdc/2012/?id=233) that addresses this issue using math.


Quadratic Bézier Curves
=======================

<img src="/blogs/jason_harwig/assets/signature-diagram-quadratic.png" title="signature diagram quadratic" />

Instead of connected lines between the touch points, quadratic bézier curves connect the points using the technique discussed in the aforementioned WWDC session (Seek to 42:15.) Connect the touch points with a quadratic curve using the touch points as the control points and the mid points as start and end.

Adding quadratic curves to the previous code requires the storing the previous touch point, so add an instance variable for that.

{% highlight objc %}
CGPoint previousPoint;
{% endhighlight %}

Create a function to calculate the midpoint of two points.

{% highlight objc %}
static CGPoint midpoint(CGPoint p0, CGPoint p1) {
    return (CGPoint) {
        (p0.x + p1.x) / 2.0,
        (p0.y + p1.y) / 2.0
    };
}
{% endhighlight %}

Update the pan gesture handler to add quadratic curves instead of straight lines

{% highlight objc %}
- (void)pan:(UIPanGestureRecognizer *)pan {
    CGPoint currentPoint = [pan locationInView:self];
    CGPoint midPoint = midpoint(previousPoint, currentPoint);

    if (pan.state == UIGestureRecognizerStateBegan) {
        [path moveToPoint:currentPoint];
    } else if (pan.state == UIGestureRecognizerStateChanged) {
        [path addQuadCurveToPoint:midPoint controlPoint:previousPoint];
    }

    previousPoint = currentPoint;

    [self setNeedsDisplay];
}
{% endhighlight %}

<img src="/blogs/jason_harwig/assets/signature-letter-j-quadratic.png" style="max-height:300px;" title="signature letter j quadratic"/>

Not much code and already we see a big difference. The touch points are no longer visible, but it looks a little bland when drawing a signature. Every curve is the same width, which doesn't match the physics of a real pen.

Variable Stroke Width
=====================

The width can be varied based on the touch velocity to create a more natural stroke. The `UIPanGestureRecognizer` already includes a method called `velocityInView:` that returns the current touch velocity as a `CGPoint`.

To render a stroke of varying width, I switched to OpenGL ES and a technique called tesselation to convert the stroke into triangles – specifically, triangle strips (OpenGL has support for drawing lines, but iOS doesn't support variable line widths with smoothing.) The quadratic points along a curve also need to be calculated, but is beyond the scope of this article. Check the source on [github](https://www.github.com/jharwig/SignatureDemo) for details.

Given two points, a perpendicular vector is calculated and its magnitude set to half the current thickness. Given the nature of `GL_TRIANGLE_STRIP` only two points are needed to create the next rectangle segment with two triangles.

<img src="/blogs/jason_harwig/assets/signature-triangle-strip.png" title="triangle strip"/>

Here is an example of the final output using quadratic bézier curves, and velocity based stroke thickness creating a visually appealing and natural signature.

<img src="/blogs/jason_harwig/assets/signature-letter-j-opengl.png" style="max-height:400px;" title="signature letter j variable width"/>

