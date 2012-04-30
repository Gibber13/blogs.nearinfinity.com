--- 
permalink: /blogs/why_i_dislike_tfs_-_team_found.html
layout: blogs
title: Why I dislike TFS - Team Foundation Server
date: 2009-09-09 18:43:05 -04:00
tags: .NET
---
<p>I don't usually blog about subjective things like my likes and dislikes, and I usually like (some will say I am in love with) Microsoft, but TFS is just horrible.</p>
<p>Here is a list of why I don't like it, in no particular order:</p>
<ul>
<li><strong>CodePlex</strong> -- First there was the SVN bridge (yes, someone hated TFS enough to make a product to make it look like something else) then Microsoft just caved and supported SVN directly. Not really a problem with TFS, it's just an indication that others feel the same way as I do.</li>
<li><strong>Size</strong> -- I guess Microsoft doesn't really like it either since they don't even ship it with Visual Studios, if you do need it, its a separate download and a big one at that -- 200MB+. Subversion, Tortoise SVN, and Ankh on the other hand combined are less than 15MB. How they filled up 200MB I have no idea, maybe they installed a client that doesn't suck somewhere I don't know about.</li>
<li><strong>Read-only Files</strong> -- Every file on your system is read-only. Why does everything need to be read-only. If I'm in another editor and I want to make a change to a file, I need to switch over to VS and check out a file for edit. This is rediculous.</li>
<li><strong>Identical Files</strong> -- I just want to see what changed. Why does TFS insist upon showing me all the files even if they are identical. Call me crazy but I like to see what files I actually changed when I check in. Someone told me there is some command line tool to see this but that's just silly.</li>
<li><strong>Code reviews/update</strong> -- On my current project I'm the project lead and I like to review the junior developers code when I update my code. Yeah, I can't do that, or I haven't found the button yet. Nor can I find the button to view a particular revision without finding a file that was part of that change and viewing it's history.</li>
<li><strong>Deleted files</strong> -- Team Explorer doesn't show them by default. This took me a while to figure this one out. You need to go into VS options then find TFS and then click show deleted files. Why is this not on by default and why isn't there a button to toggle this setting in Team Explorer.</li>
<li><strong>Project file modification</strong> -- We have some people working inside a VPN and some out, the TFS server name is different depending on where you sit. Since the solution file stores the connection string to TFS it's constantly getting checked in.</li>
<li><strong>Everything needs to be in the solution</strong> -- If you have a bunch of support files or non-.NET files, all of them need to be added to the solution or they don't get checked in or out. VS doesn't help you with this either because you can't have a solution folder map to a directory.</li>
<li><strong>Integrating with non-.NET developers</strong> -- If you have a mixed development environment (Java, Ruby, etc) like we do. You need to run TFS and something else because all the non-.NET developers can't use TFS especially if they are on a Mac. Usually the something else is much better anyway so you might as well use that instead.</li>
<li><strong>Working offline/Speed</strong> -- If you ever travel relax and take a nap because you won't be developing. Everything you do talks to the server and that in turn makes it slow. Open up a file and start making changes, to the server you go.  Move a file, to the server you go. Diff a change you made, to the server you go.</li>
<li><strong>Workspaces</strong> -- Who ever came up with the concept of workspaces at Microsoft should be ashamed of him/herself. They are just a stupid idea. If you want two copies of the same project checked out (I do it with SVN if I'm working on a quick bug fix and a big feature at the same time) good luck because I can't figure it out.</li>
<li><strong>Server isn't free</strong> -- 'Nuff said.</li>
</ul>

I'm sure there are other problems but this is all I could think of while writing this.

Sure there are some nice things about TFS, but honestly the cons far outweigh the pros. So if you have to decide which SCM to use and you run across this blog I think it's pretty obvious that I don't recommend it. I love SVN and as GIT (tools) mature I'm sure I will switch to that. 
