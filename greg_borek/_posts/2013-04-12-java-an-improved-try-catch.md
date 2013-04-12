---
title: "Java: An Improved try-catch-finally Idiom"
tags: java
---

In Java, exceptional problems not normally part of program logic are handled by using [Exceptions](http://docs.oracle.com/javase/tutorial/essential/exceptions/).  The definition of an Exception is “… an event that occurs during the execution of a program that disrupts the normal flow of instructions. “   This allows a developer to use software that may have a problem outside the developer’s control without having to implement convoluted logic to handle the issue.

The Java idiom for handling Exceptions is  a **try-catch** block.  A **try-catch** block surrounds the code that might throw an exception and an optional ‘**finally**‘ block allows for cleaning up resources.

The way this is usually written is something like this:

{% highlight java %}
public void perform() {
   SometimesBadConnection sbc = new SometimesBadConnection();

   try {
      sbc.connect();
      sbc.doSomething();

      //more code

   } catch (BadConnectionException bce) {
      System.out.println("Bad Connection Exception(" + bce.getMessage() + ")");
      //recover from a bad connection logic
   } catch (AnotherException ae) {
      //Handle AnotherException
   } finally {
      try {
         sbc.close();
      } catch (BadConnectionException bce) {
        System.out.println("Bad Connection Exception(" + bce.getMessage() + ")");
         //recover from a bad connection logic
      }
   }
}
{% endhighlight %}

In the above example, the sbc.connect() method may throw a BadConnectionException so a **try-catch** block is required.  The **finally** block is after the **catch** to make sure the sbc.close() method is called even if an exception is thrown.  The code is slightly awkward because the sbc.close() method may also throw a BadConnectionException which requires another **try-catch** block.  The nested **catch** blocks can lead to convoluted logic and code that is harder to read, especially if there is substantial code that must be repeated for both BadConnectionException **catch** blocks.

There is a better idiom as described by David Geary and Cay Horstmann in their JavaServer Faces book:

{% highlight java %}
public void perform() {
   SometimesBadConnection sbc = new SometimesBadConnection();

   try {
      sbc.connect();

      try {
         sbc.doSomething();

         //more code

      } finally {
         sbc.close();
      }
   } catch (BadConnectionException bce) {
      System.out.println("Bad Connection Exception(" + bce.getMessage() + ")");
      //recover from a bad connection logic
   } catch (AnotherException ae) {
      //Handle AnotherException
   }
}
{% endhighlight %}

In this format an internal **try–finally** block surrounds the method logic.  The **finally** block cannot be bypassed and will be called even if an exception is thrown.  The **finally** block cannot even be bypassed if the method logic contains a **return** statement (yikes!).  The exceptions are caught by the surrounding **catch** blocks at the top level, outdented to the left, and not repeated.

The advantages of the **try -try -finally-catch** idiom are:

* The **catch** blocks are not repeated, e.g. the BadConnectionException **catch** block is not repeated in the example
* The **catch** blocks are at the top level making the code more organized and understandable
* This organization is twice as fast!  The JVM does not have to collect up two stacktraces to be able to report the exceptions
