NIC Blogs
===========

This README describes a simple method to create a new blog post without having to install anything (except git). If you prefer to take the more involved route (installing the dependencies for the entire website and compiling the site locally), check out the [www.nearinfinity.com](https://github.com/nearinfinity/www.nearinfinity.com) project.

Setup Repository
----------------

```
# Clone the repo
git clone --recursive git@github.com:nearinfinity/blogs.nearinfinity.com.git
cd blogs.nearinfinity.com
```

Creating a blog
---------------

Run these commands from the blogs directory

```
# If this is your first blog
rake blog:directory

# Cd to your directory
cd {firstname}_{lastname}
# Follow the on screen instructions to create your new blog post
rake blog:create
# And begin Editting your new blog
```
A blog can be written in [Markdown](http://daringfireball.net/projects/markdown/), HTML, and [Textile](http://www.textism.com/tools/textile/). You can edit the generated front yaml to make any necessary changes.

Do not remove the date that is generated in the filename

Editing Your Profile
----------------

As part of Near Infinity's new site and blogging system you now have your own profile page. Your profile is located at /blogs/user_name/index.html. This is your personal space to professionally express yourself. Each profile has two sections: an about you section (the front yaml) and a bio section. The bio section is written in standard html. Your profile page can also be written as markdown but you must rename the file index.md. If you add a line to your about you section that contains a colon, you need to surround the entire string in quotes (otherwise it causes compile errors). For example:
```
title: A Great Title

title: "A Greater Title: Part 2"  # This title needs to be surrounded in quotes
```

Syntax Highlighting
-------------------

    {% highlight <language> %}
    def to_s
      "#{name}"
    end
    {% endhighlight %}

Highlighting with Line Numbers

    {% highlight <language> linenos %}

View list of [languages](http://pygments.org/docs/lexers/) or use the command:

    > pygmentize -L

Embed Videos
------------

    {% video_tag :vimeo => [video_id] %}
    {% video_tag :youtube => [unique_id] %}
    
If you have any questions or concerns email bmarcaur@nearinfinity.com or wbrady@nearinfinity.com
