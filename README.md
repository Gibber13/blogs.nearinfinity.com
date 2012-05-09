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
cd firstname_lastname
rake blog:create

# And begin Editting your new blog
```

Syntax Highlighting
-------------------

    {% highlight <language> [linenos] %}
    def to_s
      "#{name}"
    end
    {% endhighlight %}
    