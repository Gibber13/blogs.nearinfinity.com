---
permalink: /blogs/joe_ferner/micro-optimization.html
layout: blogs
title: !binary |-
  TWljcm8tb3B0aW1pemF0aW9u
date: 2009-01-30 09:34:35.000000000 -05:00
tags: !binary |-
  Lk5FVA==
---
<p>This is my attempt at micro-optimizing code that Jeff Atwood posted about <a href="http://www.codinghorror.com/blog/archives/001218.html#comments">micro-optimization</a>. To summarize Jeff talks about 5 ways to do string concatenation and how the difference between them is negligible compared to the readability trade-offs. I agree with him 100%, unless you are faced with the need to optimize to that level make it readable first and fast second. I did on the other hand want to know why string.Concat was the fastest.</p>

<p>I'm going to ignore samples 2 (String.Format) and 4 (String.Replace) because those are obviously going to be slow. They require parsing the string to find tokens.</p>

<p>Sample 5 (StringBuilder) is a little more interesting. Looking at the StringBuilder in <a href="http://www.red-gate.com/products/reflector/">Reflector</a> you'll see it's doing some tricks under the cover to handle multi-threaded access to the StringBuilder object. Which from what I can deduce causes performance degradations. Not to mention the need to make 10 method calls (Append) and one object allocation (StringBuilder) from my code.</p>

<p>Sample 1 (Simple Concatenation) and 3 (string.Concat) are actually identical when viewed in <a href="http://www.red-gate.com/products/reflector/">Reflector</a> (other than the minor difference of new lines, but that is caused by the difference in the code).

<table border="1">
	<tr>
		<td>
			1. Simple Concatenation
			<pre class="prettyprint" style="width: 250px;">
.maxstack 3
.locals init (
    [0] string s,
    [1] string CS$1$0000,
    [2] string[] CS$0$0001)
L_0000: nop 
L_0001: ldc.i4.s 10
L_0003: newarr string
L_0008: stloc.2 
L_0009: ldloc.2 
L_000a: ldc.i4.0 
L_000b: ldstr "&lt;div class=\"user-action-time\">"
L_0010: stelem.ref 
L_0011: ldloc.2 
L_0012: ldc.i4.1 
L_0013: call string perftest.Program::st()
L_0018: stelem.ref 
L_0019: ldloc.2 
L_001a: ldc.i4.2 
L_001b: call string perftest.Program::st()
L_0020: stelem.ref 
L_0021: ldloc.2 
L_0022: ldc.i4.3 
L_0023: ldstr "&lt;/div>\r\n&lt;div class=\"user-gravatar32\">"
L_0028: stelem.ref 
L_0029: ldloc.2 
L_002a: ldc.i4.4 
L_002b: call string perftest.Program::st()
L_0030: stelem.ref 
L_0031: ldloc.2 
L_0032: ldc.i4.5 
L_0033: ldstr "&lt;/div>\r\n&lt;div class=\"user-details\">"
L_0038: stelem.ref 
L_0039: ldloc.2 
L_003a: ldc.i4.6 
L_003b: call string perftest.Program::st()
L_0040: stelem.ref 
L_0041: ldloc.2 
L_0042: ldc.i4.7 
L_0043: ldstr "&lt;br/>"
L_0048: stelem.ref 
L_0049: ldloc.2 
L_004a: ldc.i4.8 
L_004b: call string perftest.Program::st()
L_0050: stelem.ref 
L_0051: ldloc.2 
L_0052: ldc.i4.s 9
L_0054: ldstr "&lt;/div>"
L_0059: stelem.ref 
L_005a: ldloc.2 
L_005b: call string [mscorlib]System.String::Concat(string[])
L_0060: stloc.0 
L_0061: ldloc.0 
L_0062: stloc.1 
L_0063: br.s L_0065
L_0065: ldloc.1 
L_0066: ret</pre>
			</td>
			<td>
				3. string.Concat
				<pre class="prettyprint" style="width: 250px;">.maxstack 3
.locals init (
    [0] string s,
    [1] string CS$1$0000,
    [2] string[] CS$0$0001)
L_0000: nop 
L_0001: ldc.i4.s 10
L_0003: newarr string
L_0008: stloc.2 
L_0009: ldloc.2 
L_000a: ldc.i4.0 
L_000b: ldstr "&lt;div class=\"user-action-time\">"
L_0010: stelem.ref 
L_0011: ldloc.2 
L_0012: ldc.i4.1 
L_0013: call string perftest.Program::st()
L_0018: stelem.ref 
L_0019: ldloc.2 
L_001a: ldc.i4.2 
L_001b: call string perftest.Program::st()
L_0020: stelem.ref 
L_0021: ldloc.2 
L_0022: ldc.i4.3 
L_0023: ldstr "&lt;/div>&lt;div class=\"user-gravatar32\">"
L_0028: stelem.ref 
L_0029: ldloc.2 
L_002a: ldc.i4.4 
L_002b: call string perftest.Program::st()
L_0030: stelem.ref 
L_0031: ldloc.2 
L_0032: ldc.i4.5 
L_0033: ldstr "&lt;/div>&lt;div class=\"user-details\">"
L_0038: stelem.ref 
L_0039: ldloc.2 
L_003a: ldc.i4.6 
L_003b: call string perftest.Program::st()
L_0040: stelem.ref 
L_0041: ldloc.2 
L_0042: ldc.i4.7 
L_0043: ldstr "&lt;br/>"
L_0048: stelem.ref 
L_0049: ldloc.2 
L_004a: ldc.i4.8 
L_004b: call string perftest.Program::st()
L_0050: stelem.ref 
L_0051: ldloc.2 
L_0052: ldc.i4.s 9
L_0054: ldstr "&lt;/div>"
L_0059: stelem.ref 
L_005a: ldloc.2 
L_005b: call string [mscorlib]System.String::Concat(string[])
L_0060: stloc.0 
L_0061: ldloc.0 
L_0062: stloc.1 
L_0063: br.s L_0065
L_0065: ldloc.1 
L_0066: ret</pre>
			</td>
		</tr>
	</table>
</p>

<p>	So now lets get to why I'm writing this post. Trying to micro-optimize code that is already micro-optimized. So lets start by looking at what string.Concat is doing inside.
<pre class="prettyprint">public static string Concat(params string[] values)
{
    int totalLength = 0;
    if (values == null)
    {
        throw new ArgumentNullException("values");
    }
    string[] strArray = new string[values.Length];
    for (int i = 0; i < values.Length; i++)
    {
        string str = values[i];
        strArray[i] = (str == null) ? Empty : str;
        totalLength += strArray[i].Length;
        if (totalLength < 0)
        {
            throw new OutOfMemoryException();
        }
    }
    return ConcatArray(strArray, totalLength);
}</pre>
Allocating a new array, that's got to take some time, and in fact it does, not much but it does take time. So do we have an alternative? Sure by using "string.Concat(string str0, string str1, string str2, string str3)". Looking at it's code it does essentially the same thing as "string.Concat(params string[] values)" but without the new array. So without further ado here is my over micro-optimized code.
<pre class="prettyprint">string s =
string.Concat(
    string.Concat(@"&lt;div class=""user-action-time"">", st(), st()),
    string.Concat(@"&lt;/div>&lt;div class=""user-gravatar32"">", st(), @"&lt;/div>&lt;div class=""user-details"">", st()),
    string.Concat("&lt;br/>", st(), "&lt;/div>"));
return s;</pre>
This code makes sure to only use the string.Concat that takes 4 arguments instead of the variable number of arguments. This speeds up the code by a whopping 2-3% on my machine. Sure it makes the code even more unreadable but if you are doing this 10 trillion times that might be necessary.
</p> 
