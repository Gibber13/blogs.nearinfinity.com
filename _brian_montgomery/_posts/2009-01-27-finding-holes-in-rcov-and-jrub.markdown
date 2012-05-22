--- 
permalink: /blogs/brian_montgomery/finding_holes_in_rcov_and_jrub.html
layout: blogs
title: Finding Holes in Rcov and JRuby
date: 2009-01-27 17:40:42 -05:00
tags: JRuby Ruby Testing
---
## "We're missing some coverage..."

While creating coverage reports for a fairly new JRuby on Rails project, we noticed that our coverage numbers weren't _quite_ right: certain classes were missing from the coverage reports. Rcov doesn't know about classes unless they are required: not a problem for models, but we were missing tests for some controllers and libraries.

Oops.

To properly correct this problem, I wrote the `coverage_helper` (to live alongside the `test_helper`).  Basically, this causes all of the classes to be required so that rcov knows about them.

#### test\coverage_helper.rb

    require 'test/unit'
    require 'test_helper'

    class CoverageHelper < Test::Unit::TestCase
      def test_coverage
        ['app', 'lib'].each {|path| Dir.glob("#{path}/**/*.rb") {|file| 
          require File.expand_path(file.chomp('.rb'))
        }}
        assert true
      end
    end

Simply include this test in your rcov builds and the problem is solved.  

Because of how rcov counts lines and the way Ruby class loading works, you'll never see files with 0% coverage.  However, at least you *will* see all of your classes listed and those that aren't covered will have a low percentage.

#### Is this really necessary?

First, the `File.expand_path` makes sure that your files are only required once.  I hate random warning messages because constants are initialized twice (among other issues).

Second, no, I didn't need to make this a test, but it just seemed nicer to.  I added the  `assert true` simply because I didn't feel right about not asserting *something* in the test.  

Third, as long as one uses the Rails scripts to generate the skeletons for your code, this scenario *should* never happen (because Rails will create all of the appropriate tests).  However, there is the tendency not to use the generated scripts when they don't output what you want, which is what we have discovered (Rails and Legacy Database Schemas aren't a perfect fit).  Also, sometimes I just forget to use them.

## What if you can't run rcov?

One minor glitch of running JRuby on Windows is that the `File.separator` is technically incorrect (it's '`/`' instead of '`\`').  This usually isn't an issue... except when using rcov.  Since rcov executes from the shell, the arguments requiring file names and/or directories won't work because the separator is the wrong direction from what Windows is expecting.

The fix is to add a couple of methods to the File class to address the problem.

#### Windows Separator Fix

    class File
      @@is_windows = ENV['OS'] && 
        (not ENV['OS'].downcase.match(/^windows/).nil?)
    
      def self.fix_name(name)
        @@is_windows ? name.tr(File::SEPARATOR, File::ALT_SEPARATOR) : name
      end
      
      def self.fixed_join(*files)
        self.fix_name(self.join files)
      end
    end

The reason to do the `ENV['OS']` truth check first is that in JRuby on Solaris (where our CI is), that property doesn't exist. We couldn't use the `RUBY_PLATFORM` variable either, as in JRuby it's always assigned to '`java`'.

I should note that I've only use these fixed separator methods when necessary (in my rcov rake task).  The 'normal' separator has worked in every other situation I've run into.
 
