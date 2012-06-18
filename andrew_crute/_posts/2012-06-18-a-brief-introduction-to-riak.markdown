---
title: A Brief Introduction to Riak
tags: nosql riak ruby javascript
layout: blogs
---
<p>While researching NoSQL databases recently, I stumbled upon Riak, found myself intrigued, and decided to dive a little deeper. The quick and dirty: Riak is a key-value, distributed database made up of multiple independent nodes which can be joined together to form Riak clusters. Generally, when data is written into a Riak cluster, it will be written to multiple nodes so that even if a single node does go down, the data will still be reachable. One of Riak's trademarks is this focus on high availability.</p>

<p>Being a NoSQL database, Riak keeps things relatively simple. It doesn't get bogged down in complex, rigid schemas or intricate relationships between pieces of data which manifest as foreign keys, constraints, and the like in your typical RDBMS. Rather, data is stored in a series of labeled "buckets", and is classified by MIME type. Once you get a Riak cluster set up and bound to a port, you can use its RESTful API to interact with it. Send a PUT to create or update entries, a DELETE to remove them, and a GET to read their values. For most basic operations, the URL will be of the form:</p>
  
<p>http://SERVER:PORT/riak/BUCKET/KEY</p>

# Setting up a Riak Cluster

<p>The easiest way to set up a Riak cluster is to compile from source. I would recommend following the instructions at <a href="http://wiki.basho.com/Building-a-Development-Environment.html">Basho's wiki page</a> to do this. This three or four node development setup gives you more than enough to dig in and start experimenting with Riak.</p>
  
# A few examples...
  
<p>Why not start with a hello world? Use curl at the command line to craft an HTTP request:</p>

{% highlight html %}
curl -X PUT http://localhost:8091/riak/pages/hello.html -H "Content-type: text/html" -d "<html><head><title>Greeting</title></head><body>Hello from Riak!</body></html>"
{% endhighlight %}

<p>Simple enough. This stores a full HTML page in your "pages" bucket and classifies it appropriately so Riak knows how to serve it up when you access it. Now if I open up my browser and go to http://localhost:8091/riak/pages/hello.html, my hello world page comes back. Amazing! Well, not particularly, but it's a start.</p>

<p>Next, why don't we store some more meaningful data, like a JSON-encoded object representing some real-world data? Encoding objects as JSON is handy when using Riak via code, because when you retrieve the object's value, it will generally be stored in a key-value lookup (like a Ruby hash), which should make initializing objects in your code easy and painless. It also makes passing data to custom map and reduce functions easier, which we'll see later.</p>

<p>There's nothing wrong with using curl, but it gets a little tedious for anything but the most basic operations. Let's switch over to Ruby, using the Riak gem (run "gem install riak" to get it), and store an object representing a person. we'll put it in the people bucket.</p>

{% highlight ruby linenos %}
require "riak"

client = Riak::Client.new(:http_port => 8091)
bucket = client.bucket("people")

bruce = Riak::RObject.new(bucket, "Bruce")
bruce.content_type = "application/json"
bruce.data = { "name" => "Bruce Wayne", "quote" => "I'm Batman." }

bruce.store
{% endhighlight %}

<p>After initializing the Riak client object, all you have to do is get a reference to a bucket (it will be created if this is your first time accessing it), then I can create a new Riak object in that bucket, set its content type and data, and store it. Simple!</p>
<p>Now I have my very own JSON superhero alter ego.</p>

# Adding Links
<p>Riak maintains relationships between entries using simple link entries. A link is associated with a single entry and it has a single destination entry to which it links. Each link has a user-specified tag. When traversing links, this tag is optionally supplied as a search parameter which narrows down which links Riak will attempt to follow. For example, if we were using Riak in a social networking scenario, we could have entries for each individual person have links tagged "friend" leading to each of their individual friends. Or each entry could contain a link tagged "profile" which leads to the entry for the image they use as their profile picture. The possibilities are endless.</p>
<p>Let's give Bruce some company. Assuming we-re in the same irb session as the last code snippet and the client is already initialized, we can do the following:</p>

{% highlight ruby linenos %}
alfred = Riak::RObject.new("people", "Alfred")
alfred.content_type = "application.json"
alfred.data = { "name" => "Alfred Pennyworth", "quote" => "Good evening, sir." }

link = Riak::Link.new("people", "Bruce", "works_for")
alfred.links.add(link)

alfred.store
{% endhighlight %}

<p>We create a new Riak object in the people bucket just as before, then we create a link and add it to the new entry. The link constructor takes parameters for the bucket to which it links, the key under which the destination entry is stored, and the tag to be given to the link. So Alfred has a link tagged "works_for" which leads to the "Bruce" entry in the "people" bucket. Again, pretty self-explanatory.</p>
<p>Also note that an entry to which a link leads does not have to exist when the link is created. It is perfectly legitimate to create a link to an entry which does not yet contain data, but which might be populated in the future.</p>
<p>What do we do when we want to retrieve the entry to which the link leads? Again, in the same session:</p>

{% highlight ruby linenos %}
links = alfred.links.select { |x| x.tag == "works_for" }

links.each do |x|
	obj = client.bucket(link.bucket).get(link.key).data
	puts obj["name"]	# "Bruce Wayne"
	puts obj["quote"]	# "I'm Batman"
end
{% endhighlight %}

<p>A Riak link object is really just a tag and a destination, so once you've retrieved the links with the tags you're interested in, all that's left is to look at the bucket and key properties on the link (both are stored as simple strings) and go grab the destination entry.</p>
<p>Of course, this is a very simple example, but in the wild Riak's linking functionality can be used to create and traverse and very large and complex data sets just as easily as one would create and traverse a graph.</p>

# Map Reduce in Riak
<p>For my final trick, I'll demonstrate Riak's map reduce capabilities. Map reduce is a pretty hefty topic, but if you've never heard of it, it's a commonly used technique to extract data from large and distributed data sets via a two-step process. First, a "map" function is applied to all entries in the input set. This function returns some kind of data describing the individual entry. All the data returned from each individual map function is sent to a "reduce" function, which aggregates the data and uses it to answer some larger question.</p>
<p>Let's use Riak to create and store a bucket of 100 test scores, then use Riak's map reduce to pull back the number of times each letter grade occurs.</p>

## Step 1: Create the test scores

{% highlight ruby linenos %}
require 'riak'

client = Riak::Client.new(:http_port => 8091)
bucket = client.bucket("test_scores")
grades = ['A', 'B', 'C', 'D', 'F']

1.upto(100) do |num|
    score = Riak::RObject.new(bucket, num)
    score.content_type = "application/json"
    score.data = { "student_id" => num.to_s, "grade" => grades[rand(5)] }
    score.store
end
{% endhighlight %}

## Step 2: Use Riak's mapreduce to count the number of each letter grade

{% highlight ruby linenos %}
require 'riak'

client = Riak::Client.new(:http_port => 8091)
mapred = Riak::MapReduce.new(client)

# Here we're telling the mapreduce object to take the entire test_scores bucket as its input
# In production, you'd probably want to use Riak's key filters to choose specific elements in a bucket
# But since we know we only have 100 test scores, this is fine for us
mapred.add("test_scores")

# Map and reduce functions can be expressed in Erlang or JavaScript - we'll use JS here
# From each test score, return just its grade and 1, so the reduce function can count all the results
mapFunction = <<-EOF
function (v) {
    var parsed_data = JSON.parse(v.values[0].data);
    var data = {};
    data[parsed_data.grade] = 1;
    return [data];
    }
EOF

# Collect all the results, iterate over them, and find the sum for each key
reduceFunction = <<-EOF
function(v) {
    var totals = {};
    for (var i in v) {
        for (var grade in v[i]) {
            if (totals[grade]) {
                totals[grade] += v[i][grade];
            }
            else {
                totals[grade] = v[i][grade];
            }
        }
    }
    return [totals];
}
EOF

results = mapred.map(mapFunction).reduce(reduceFunction, :keep => true).run

puts results[0].sort # => {"A"=>25, "B"=>24, "C"=>15, "D"=>20, "F"=>16}
{% endhighlight %}

<p>That was pretty cool.</p>
<p>It doesn't take much to get a Riak cluster up and running quickly, and as it is really just a key-value store, there isn't too much to learn when you first begin. This could be great for people who don't need the complexity and overhead of a traditional RDBMS or who won't have any need for complicated SQL-like queries against their data, triggers, constraints, and the like.</p>
<p>However, Riak goes far deeper if you care to dig - with searching and mapreduce support as well as the ability to exert very fine-grained control over reads and writes, Riak should be especially intriguing to anyone who has an interest in distributed databases. If this sounds like you, but maybe you don't quite have the tens of gigabytes of data lying around that would necessitate a heavier-handed engine like HBase, or if you're just interested in exploring emerging NoSQL database engines, Riak might be a good fit for your next project.</p>

