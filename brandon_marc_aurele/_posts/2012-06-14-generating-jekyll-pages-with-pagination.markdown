---
title: Generating Jekyll Pages With Pagination
tags: jekyll ruby
layout: blogs
date: 2012-06-14 20:00:00 -04:00
---

We recently decided to migrate our blogs/website content off of Movable Type and over to [Jekyll](https://github.com/mojombo/jekyll). We were looking for a new technology stack that would give us both greater control over our content and provide us with a few powerful blogging tools. This led us to Jekyll.

Direct from Jekyll's github page, "Jekyll is a simple, blog aware, static site generator...This is also the engine behind GitHub Pages" Jekyll provided us with a set of [Liquid tools](https://github.com/mojombo/jekyll/wiki/liquid-extensions), [Ruby objects and methods](https://github.com/mojombo/jekyll/wiki/template-data) that aided in the creation of our new website. While this toolbox is quite useful it does not attempt to be an exhaustive set but instead provides a system for writing your own [plugins](https://github.com/mojombo/jekyll/wiki/Plugins).

One feature that I was expecting out of the box with Jekyll was a system for paging blogs and their sub-categories/tags, seeing as how there was already a [paging system](https://github.com/mojombo/jekyll/wiki/template-data) built into Jekyll. Unfortunately the [paginator](https://github.com/mojombo/jekyll/wiki/template-data) is "only available in index files, can be in subdirectory /blog/index.html" only allowing paging on the main index page and the main blog page. So in order to generate our paging system we have to turn to the plugin system.

I was interested in creating a set of plugins that would paginate the blogs page / any category page (tech talks, speaking, etc.), generate a list of all blogs by author (paginated), and generate a list of all blogs by tag (paginated). Part of this plugin was borrowed from and inspired by [this](https://github.com/pattex/jekyll-tagging/blob/master/lib/jekyll/tagging.rb) plugin from the Jekyll [plugin page](https://github.com/mojombo/jekyll/wiki/Plugins). This plugin does more than what I was looking for, such as creating a tag cloud. It did, however, teach me how to use the Jekyll "site" object to create new lists of filtered posts which could later be used to create specific "pages" in the Jekyll system.

Let's take a look at the code:

{% highlight ruby linenos %}
module Jekyll

  class Tagger < Generator
    safe true

    def generate(site)
      ['blogs', 'techtalks', 'speaking'].each do |type|
        site.tags.each do |tag, posts|
          filtered_posts = posts.reject{ |post| !post.categories.include? type }.sort.reverse
          next if filtered_posts.count <= 0
          total = (filtered_posts.length / 15.to_f).ceil
          first_page_posts = filtered_posts.shift(15)
          site.pages << new_tag(site, site.source, "tags/#{type}/#{tag}", tag, first_page_posts, 'tag_page', type, 1, total)
          site.pages << new_tag(site, site.source, "tags/#{type}/#{tag}/page_1", tag, first_page_posts, 'tag_page', type, 1, total)
          current_page = 2
          while filtered_posts.size > 0
            site.pages << new_tag(site, site.source, "tags/#{type}/#{tag}/page_#{current_page}", tag, filtered_posts.shift(15), 'tag_page', type, current_page, total)
            current_page += 1
          end
        end
      end
    end

    def new_tag(site, base, dir, tag, posts, layout, type, current, total)
      TagPage.new(site, base, dir, "index#{site.layouts[layout].ext}", {
        'layout' => layout,
        'posts'  => posts,
        'type'   => type,
        'tag_key'=> tag,
        'current_page' => current,
        'num_pages' => total
      })
    end
  end

  class TagPage < Page
    def initialize(site, base, dir, name, data = {})
      self.content = data.delete('content') || ''
      self.data    = data

      dir = dir[-1, 1] == '/' ? dir : '/' + dir

      super(site, base, dir, name)

      self.data['tag'] = basename
    end

    def read_yaml(_, __)
      # Do nothing
    end
  end
end
{% endhighlight %}


This code block grabs each set of posts organized by tag, it then splits each set of posts into their different categories (blogs, techtalks, and speaking engagments), and then creates a page for that subset of posts. This code generates the paging as seperate folders with index.html pages; the first page would be located at /tags/category/page\_1/index.html, the second page would be located at /tags/category/page\_2/index.html, etc. You can also use the Jekyll filter system to generate the links for the bottom of each page.

When creating pages in Jekyll you first create a page object and then push the page onto the page stack. This page will then be compiled after all other pages have been pushed onto the stack.

The techniques used in this example can be applied to a wide array of uses. For example, here is how we implemented our rss feeds:

{% highlight ruby linenos %}
module Jekyll
  class RssFeed < Page
    def initialize(site, base, dir, name, data)
      self.data = data.clone
      self.data['layout'] = 'rss_feed'
      super(site, base, dir, name)
    end

    def read_yaml(_, __)
      # Do nothing, Allows you to make pages that dont have pages at the location they are built in
    end
  end

  class AtomFeed < Page
    def initialize(site, base, dir, name, data)
      self.data = data.clone
      self.data['layout'] = 'atom_feed'
      super(site, base, dir, name)
    end

    def read_yaml(_, __)
      # Do nothing, Allows you to make pages that dont have pages at the location they are built in
    end
  end

  class RssFeedGenerator < Generator
    safe true

    def generate(site)
      allblogs = site.posts.reject{|post| post.categories[0] != 'blogs' }.sort.reverse
      sorted_blogs = {}

      allblogs.each do |post|
        selected_user = sorted_blogs[post.categories[1]] ||= []
        selected_user << post
      end

      create_feeds(site, site.source, '/blogs/', {
        'posts'  => allblogs,
        'title' => "Blogs at Near Infinity",
        'link' => "http://www.nearinfinity.com/blogs",
        'description' => 'Employee Blogs'
      })

      # Generate the Authors Feeds
      sorted_blogs.each do |author, author_posts|
        formatted_author = author.split('_').collect{|x| x.capitalize}.join(' ')
        create_feeds(site, site.source, "/blogs/#{author}/rss/", {
          'posts'  => author_posts,
          'title' => "#{formatted_author} - Blogs at Near Infinity",
          'link' => "http://www.nearinfinity.com/blogs/#{author}",
          'description' => "#{formatted_author}'s Blogs"
        })
      end

      # Generate the Tags Feeds
      site.tags.each do |tag, tag_posts|
        filtered_posts = tag_posts.reject{ |post| !post.categories.include? 'blogs' }.sort.reverse
        create_feeds(site, site.source, "/blogs/#{tag}/rss/", {
          'posts'  => filtered_posts,
          'title' => "#{tag.capitalize} Related Blogs - Blogs at Near Infinity",
          'link' => "http://www.nearinfinity.com/tags/blogs/#{tag}",
          'description' => "#{tag.capitalize} Blogs"
        })
      end
    end

    def create_feeds(site, base, dir, data)
      site.pages << RssFeed.new(site, base, dir, "blogs.xml", data)
      site.pages << RssFeed.new(site, base, dir, "index.xml", data)
      site.pages << AtomFeed.new(site, base, dir, "atom.xml", data)
    end
  end
end
{% endhighlight %}