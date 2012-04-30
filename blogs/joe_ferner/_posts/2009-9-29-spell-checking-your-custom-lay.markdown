--- 
permalink: /blogs/spell_checking_your_custom_lay.html
layout: blogs
title: Spell checking your SharePoint custom application pages
date: 2009-09-29 11:05:03 -04:00
tags: .NET
---
<p>I had a requirement to spell check some fields on a custom application page and I knew SharePoint had the ability because on the edit item page there is a "Spelling" button.  Come to find out this is one of the easiest things to do and there is really no excuse to not include it on all of your application pages.</p>

<p>First step is to include the javascript needed to run the spell checking. You'll need two includes form.js and SpellCheckEntirePage.js.
</p>
<pre class="prettyprint">
&lt;script type="text/javascript" language="javascript" 
  src="/_layouts/1033/form.js?rev=df60y6YolDjUVbi91%2BZw%2Fg%3D%3D"&gt;&lt;/script&gt;
&lt;script type="text/javascript" language="javascript"
  src="/_layouts/1033/SpellCheckEntirePage.js?rev=zYQ05cOj5Dk74UkTZzEIRw%3D%3D"&gt;&lt;/script&gt;
</pre>

<p>When I saw SpellCheckEntirePage.js for the first time I had to laugh because my initial estimate of the task was 3-4 days, I ended up doing it in less than 4 hours.</p>

<p>Next step is to add the button to actually check the spelling.</p>
<pre class="prettyprint">
&lt;input type="button" value="Spell Check"
  onclick="javascript:SpellCheckEntirePage('<%= SPContext.Current.Web.Url %>/_vti_bin/SpellCheck.asmx', '<%= SPContext.Current.Web.Url %>/_layouts/SpellChecker.aspx');" /&gt;
</pre>

<p>
<b>Done!</b>
</p>

<p>
Well almost. There were a couple of fields on the form which didn't make sense to spell check. But looking at the source of SpellCheckEntirePage.js you can quickly find the solution.  Just add excludeFromSpellCheck="true" to the fields you don't want to check.
</p>

<p>
OK, now I'm done.
</p>

<p>
Well not quite yet. The "excludeFromSpellCheck" doesn't work on People pickers. But SharePoint has this problem too.  If you edit a list item with a people picker and run the spell checker it will try to spell check people's login names which is never going to work. I went ahead and added a method to my master page which turns spell check off for people picker fields. It fixed the edit list item spell checking problem too :).  I do have to warn you I suck at javascript so if anyone can send me a better way of doing this I would appreciate it.
</p>

<pre class="prettyprint">
function disableSpellCheckOnPeoplePickers() {
  var elements = document.body.getElementsByTagName("*");
  for (index = 0; index &lt; elements.length; index++) {
    if (elements[index].tagName == "INPUT"
        && elements[index].parentNode
        && elements[index].parentNode.tagName == "SPAN") {
      var elem = elements[index];
      if (elem.parentNode.getAttribute("NoMatchesText") != "") {
        disableSpellCheckOnPeoplePickersAllChildren(elem.parentNode);
      }
    }
  }
}

function disableSpellCheckOnPeoplePickersAllChildren(elem) {
  try {
    elem.setAttribute("excludeFromSpellCheck", "true");
    for (var i = 0; i &lt; elem.childNodes.length; i++) {
      disableSpellCheckOnPeoplePickersAllChildren(elem.childNodes[i]);
    }
  } catch (e) {
  }
}
</pre> 
