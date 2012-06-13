NIC Blogs
===========

Setup Repository
----------------

```
# Clone the repo
git clone --recursive git@github.com:nearinfinity/blogs.nearinfinity.com.git
cd blogs.nearinfinity.com
```

Creating a blog
---------------

```
# If this is your first blog
rake blog:directory

# Cd to your directory
cd {firstname}_{lastname}
# Follow the on screen instructions to create your new blog post
rake blog:create
# And begin Editting your new blog
```
A blog can be written in [Markdown](http://daringfireball.net/projects/markdown/), HTML, and [Textile](http://www.textism.com/tools/textile/). If there is a mistake in the generated metadata (front yaml) then make any necessary changes.

Editing Your Bio
----------------

As part of Near Infinity's new site and blogging system you now have your own bio page. This is your personal space to professionally express yourself. Each bio has two sections, an about you list (the front yaml) and the bio at the bottom. The bio portion is written in standard html. If you wish to edit the about you section and also wish to use a ':' then you need to surround the value with quotations (otherwise it causes compile errors). For example:
```
title: A Great Title
# This title with a colon would now become
title: "A Greater Title: Part 2"
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
    
If you have any questions or concerns email bmarcaur@nearinfinity.com
    