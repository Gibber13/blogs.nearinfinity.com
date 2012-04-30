--- 
permalink: /blogs/frank_showalter/ruby_perl_and_mysql_55_on_snow.html
layout: blogs
title: Ruby, Perl and MySql 5.5 on Snow Leopard
date: 2011-01-20 09:25:46 -05:00
tags: Database Mac OS X Ruby
---
<h3>The Problem</h3>

<p>You downloaded and installed the latest 64-bit DMG from <a href="http://dev.mysql.com/downloads/mysql/">MySQL</a> and now you're getting "could not load driver" errors in DBI (Ruby or Perl) and Rails.</p>

<h3>The Cause</h3>

<p>In Ruby, the 'mysql' and 'mysql-2' gems were compiled against older version of the MySql library. Ditto DBD:Mysql module in Perl.</p>

<h3>The Solution</h3>

<p><strong>Update 6/6/2011</strong>: Google lead me to <a href="http://www.blog.bridgeutopiaweb.com/post/how-to-fix-mysql-load-issues-on-mac-os-x/">a better solution</a>:</p>

<pre>export DYLD_LIBRARY_PATH=/usr/local/mysql/lib/</pre>

<p>That should work for everything! But in case it doesn't, this will fix Rails:</p>

    sudo install_name_tool -change libmysqlclient.16.dylib \ 
    /usr/local/mysql/lib/libmysqlclient.16.dylib \
    /usr/local/lib/ruby/gems/1.9.1/gems/mysql2-0.2.6/lib/mysql2/mysql2.bundle

<p>And this will fix Ruby's DBI:</p>

    sudo install_name_tool -change libmysqlclient.16.dylib  \ 
    /usr/local/mysql/lib/libmysqlclient.16.dylib \
    /usr/local/lib/ruby/gems/1.9.1/gems/mysql-2.8.1/lib/mysql_api.bundle

<p><strong>Note:</strong> you'll need to substitute both the appropriate path to the gems, and the appropriate version of the MySQL library.</p>

<p>Fixing Perl's DBI is a little trickier. You need to download the MySql DBD source and run the install_name_tool on the bundle before you install. Something like:</p>

    sudo install_name_tool -change libmysqlclient.16.dylib \ 
    /usr/local/mysql/lib/libmysqlclient.16.dylib \
    /path-to-my-sql-dbd-source-folder-with-the-bundle-file/mysql.bundle

