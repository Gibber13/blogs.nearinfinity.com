NIC Blogs
===========

This README describes a simple method to create a new blog post without having to install anything (except git). If you prefer to take the more involved route (installing the dependencies for the entire website and compiling the site locally), check out the [www.nearinfinity.com](https://github.com/nearinfinity/www.nearinfinity.com) project.

Gain Push Access
----------------

If you haven't already, create a Github account and add your username to the [Github Logins](https://mobius.nearinfinity.com/display/RD/Github+Logins) mobius page. We will have to manually add you to the Github group so it may take a couple days.

Clone Repository
----------------

```
git clone git@github.com:nearinfinity/blogs.nearinfinity.com.git
cd blogs.nearinfinity.com
```

Generating A Post Template
--------------------------

Go to the [blog previewer](http://nic-util02.nearinfinity.com/blog-previewer) (you must be on the NIC network to access) and click "Generate Blank Post".

Previewing A Post
----------------

Go to the [blog previewer](http://nic-util02.nearinfinity.com/blog-previewer) (you must be on the NIC network to access), paste the contents of your post in the text box, select the format of your file (Markdown, Textile or HTML) and click "Preview". You should see what your post would look like on the actual site. The previewer will also alert you of any errors in the header of your file.

Uploading Changes
-----------------

Once you're done writing your blog post and have tested that everything looks ok with the previewer, save your file in the _posts/ folder of your personal blogs directory.
The filename should be in the following format "{date}-{title}.{extension}"
+ {date} - The date of the post in the format "YYY-MM-DDD"
+ {title} - Shortened version of your title without spaces
+ {extension} - "html" or "md" for markdown

So if I was creating a post about CSS3 on July 23, 2012, the path of my post might be "will_brady/_posts/2012-07-23-css3.md"

Once you have your post in the right place, commit and push your changes. The changes will be pushed to the live site within about 2 minutes.

Limitations of the Previewer
----------------------------

The previewer does not currently support:
+ referencing local assets or pages - for example if you have an image to your assets/ folder and link to it from your blog post, the previewer will not recognize the image even though it will be recognized properly on the site when you push it
+ previewing profile pages

Syntax Highlighting
-------------------

    {% highlight <language> %}
    def to_s
      "#{name}"
    end
    {% endhighlight %}

Highlighting with Line Numbers

    {% highlight <language> linenos %}

[Languages supported](http://pygments.org/docs/lexers/)

Embed Videos
------------

    {% video_tag :vimeo => [video_id] %}
    {% video_tag :youtube => [unique_id] %}
    
Escaping Liquid Syntax
----------------------

Since Liquid is run on your blog (i.e. how the {% highlight %} tag works) you have to escape any Liquid syntax you actually want to display. That is anything that looks like {% %} or {{ }}. To escape

    {% include sharing.html %}
    
you have to say

    {{ "{% include sharing.html " }}%}
    
and to escape

    {{ content }}
    
you have to say

    {{ "{{ content " }}}}
    
Directory Structure / Profile
-----------------------------

If you do not have a user directory created already, create one with the following directory structure:

    first_last/
      _posts/          --> Holds all of your blog posts
      assets/          --> Local assets folders for any files you want to reference from your blog
      index.html       --> Your profile

If you have any questions or concerns email wbrady@nearinfinity.com
