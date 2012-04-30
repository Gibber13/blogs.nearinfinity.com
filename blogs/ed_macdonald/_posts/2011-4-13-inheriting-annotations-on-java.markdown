--- 
permalink: /blogs/inheriting_annotations_on_java.html
layout: blogs
title: Inheriting Annotations on Java Methods
date: 2011-04-13 13:20:25 -04:00
tags: Java
---
 As is clearly stated in the @Inherited meta annotation docs [here](http://download.oracle.com/javase/6/docs/api/java/lang/annotation/Inherited.html), you can't inherit annotations on anything other than classes. Or, stated differently, you can't expect [Method::isAnnotationPresent\(Class<? extends Annotation> annotationClass)](http://download.oracle.com/javase/6/docs/api/java/lang/reflect/AccessibleObject.html#isAnnotationPresent(java.lang.Class\))to return true unless the annotation you are querying for is on *the* Method instance you are querying (not on the interface method it may be implementing, for example).

Well, if you're like me, as soon as you hear that you can't inherit annotations on methods, you start thinking of cases where it would be useful. In my case, the scenario that created my need for it was a RESTful web service. Long story short, we had interfaces specifying our web services, and the services we were "publishing" were methods on those interfaces annotated with the [@Path](http://download.oracle.com/javaee/6/api/javax/ws/rs/Path.html) annotation. We also had an interceptor that intercepted service calls in order to provide an extra layer of error handling. The problem was that we didn't want to intercept *every* method on our service implementations (for example, we didn't want to intercept *private* methods); we only wanted to intercept those methods that were the result of a web service call. The most precise way to determine whether or not a method was a service call (from the interceptor's perspective) was to determine if it was an implementation of a method that was annotated with @Path.

This isn't a blog post about intercepting web service calls, though. To recreate that example would obscure the real problem being solved. To demonstrate, I've created a small [sample project](https://github.com/emacdona/InheritingMethodAnnotationsExample) on Github. It models the life of one of my favorite Scientist/Mathematician/Engineers, Sir Isaac Newton.

The code that solves the problem of interrogating a method for an annotation it may have "inherited" follows. I've added some inline comments. If you'd like to see it used in context, check out the Github project linked to above.

<pre class="prettyprint" style="border: 1px solid black">
package net.edmacdonald.javaPlayground.metaProgramming.util;

import org.apache.commons.lang.ArrayUtils;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Utils {

    /*
     * Check to see if a given method is annotated with the given annotation.
     * This is the method you call in your client code.
     */
    public static boolean isImplementedMethodAnnotatedWith(Method method, Class annotation) {

        //Find all interfaces/classes that are extended/implemented **explicitly** by the class
        //the given method belongs to. "Explicitly" in this context means the classes/interfaces
        //that are listed in an extends/implements clause. I.e. don't expect Object to show up.
        Class[] clazzes = getAllInterfaces(method.getDeclaringClass());

        //For each of these classes, see if there is a method that looks exactly like this one and
        //is annotated with the given annotation
        for(Class clazz : clazzes) {
            try {
                //Throws an exception if method not found.
                Method m = clazz.getDeclaredMethod(method.getName(), method.getParameterTypes());

                if(m.isAnnotationPresent(annotation)) {
                    return true;
                }
            }
            catch(Exception e) {
                /*Do nothing*/
            }
        }

        return false;
    }

    private static Class[] getAllInterfaces(Class clazz) {
        return getAllInterfaces(new Class[] { clazz } );
    }

    //This method walks up the inheritance hierarchy to make sure we get every class/interface that could
    //possibly contain the declaration of the annotated method we're looking for.
    private static Class[] getAllInterfaces(Class[] classes) {
        if(0 == classes.length ) {
            return classes;
        }
        else {
            List<Class> extendedClasses = new ArrayList<Class>();
            for (Class clazz: classes) {
                extendedClasses.addAll(Arrays.asList( clazz.getInterfaces() ) );
            }
            //Class::getInterfaces() gets only interfaces/classes implemented/extended directly by a given class.
            //We need to walk the whole way up the tree.
            return (Class[]) ArrayUtils.addAll( classes,
                                                getAllInterfaces(
                                                        extendedClasses.toArray(new Class[extendedClasses.size()]))
            );
        }
    }
}
</pre> 
