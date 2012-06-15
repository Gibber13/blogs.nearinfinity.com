---
title: Scripting Amazon Web Services with the Ruby SDK
tags: ruby aws cloudcomputing
date: 2012-06-15 10:00:00 -04:00
---
Since launching in early 2006, [Amazon Web Services (AWS)](http://aws.amazon.com) has been the dominant entity in Cloud Computing. Their offering includes such services as EC2 for elastic computing, S3 for simple object storage, RDS for relational databases, and many more. Software companies are utilizing the cloud model to not only scale applications as demand increases, but also control expenses related to software deployment. Over the past year, I have found myself using AWS more and more across a variety of development projects. Amazon provides a graphical user interface called the AWS Management Console that provides full control over all its services. The AWS Management Console is suitable for many of the tasks involving setup and maintenance of your cloud infrastructure.

However, as I started to use more complex features in AWS, I quickly found myself requiring a more powerful and programmatic interface that I could script as part of my development workflow. There are [numerous SDKs](http://aws.amazon.com/code/) available for accessing AWS. The [command-line interface](http://aws.amazon.com/developertools/351) offers fully-scriptable functionality, but processing the text of the responses incurred a lot of overhead. The [Java SDK](http://aws.amazon.com/sdkforjava/) similarly has access to all the AWS features and the object-oriented library makes processing responses much easier. But, the verbosity of the code - having to instantiate and construct a separate request object for every invocation - caused the scripts to grow large, even for simple use cases. Finally, I came across the [Ruby SDK](http://aws.amazon.com/sdkforruby/) for AWS and haven't looked back since.

## Overview

AWS enforces a strict security model - an Access Key ID provides maps to your account number and a Secret Access Key used to sign all requests to the API. Therefore, the first steps to using the SDK are to configure the access keys. The Ruby SDK simplifies the process by accepting a YAML file in the following format:
{% highlight yaml %}
access_key_id: <access_key>
secret_access_key: <secret_key>
{% endhighlight %}
To complete the configuration, simply call `config`:
{% highlight ruby %}
AWS.config(YAML.load(File.read(path_to_config_file)))
{% endhighlight %}
One potential "gotcha" of this setup is that the configuration is required before each and every invocation of AWS features. So even if you drop into `irb` to test some functionality, remember to call `AWS.config`.

The SDK includes many services - IAM (identity and access control management), ELB (load balancing support), SES (email services), VPC (virtual private cloud), among others - exposed through classes in the `AWS` module. Instantiating an object to make requests is as easy as this:
{% highlight ruby %}
ec2 = AWS::EC2.new
{% endhighlight %}
The interface for the EC2 objects is one of the most intuitive and pleasant-to-use that I have experienced. It works just as you might expect, if you want to see all the instances running, simply execute:
{% highlight ruby %}
ec2.instances
{% endhighlight %}

A subtle caveat to the Ruby SDK is the lazy loading mechanism. When you request a collection, such as `instances`, all instances are not actually enumerated at method invocation. It is not until you iterate over the collection that an actual request is made to retrieve the instance's information. This can save on unnecessary network traffic by limiting the number of round-trip HTTP requests required. However it can also cause unexpected delays in the execution of your script, so beware.

Returning to the EC2 example, we can reference specified instances in EC2 by using the Amazon-provided instance ID:
{% highlight ruby %}
ec2.instances['i-23ab45cd']
{% endhighlight %}
Each instance, in turn, as its own set of methods we can call to retrieve information such as security group, Amazon Machine Image (AMI) ID, elastic IP address, launch time, and much more. The process for creating things in AWS (like instances) follows a factory pattern where the object's collection acts as the factory. To launch a new instance in EC2, we simply need to invoke the `create` method:
{% highlight ruby %}
ec2.instances.create([instance_options])
{% endhighlight %}

## Examples

I've assembled several examples of the scripts I've written to manage AWS and compiled them on my [Github](https://github.com/edstromj/aws-toolkit) page. Here's a sample script for launching an EC2 instance in a virtual private cloud. Here, `aws_config.rb` performs the configuration for us.

{% highlight ruby linenos %}
#!/usr/bin/env ruby

require '../config/aws_config'
require 'aws-sdk'

(private_ip, security_group_id, image_id, subnet_id) = ARGV

# Check for necessary parameters
unless private_ip && security_group_id && image_id && subnet_id
  puts "Usage #{$0} private_ip security_group_id image_id subnet_id"
  exit 1
end

# Instantiate EC2 object
ec2 = AWS::EC2.new

new_inst = ec2.instances.create(
  :image_id => image_id,
  :subnet => ec2.subnets[subnet_id],
  :instance_type => 'm1.large',
  :key_name => your_key_name,
  :private_ip => private_ip,
  :security_group_ids => { security_group_id })

puts "Waiting for new instance with id #{new_inst.id} to become available..."

sleep 1 while new_inst.status == :pending
new_inst.add_tag('Name', :value => private_ip)

puts '...ready'
{% endhighlight %}

One deployment strategy I've found helpful is to group EC2 instances into roles. Roles are logical groupings based on a node's functionality, like a web proxy, application server, database, monitoring system, or something else. Adding roles to instances is as easy as adding a tag to the EC2 instance with the key 'Role'. Here's another script that shows information about all running instances in a VPC, grouped by roles. 

{% highlight ruby linenos %}
#!/usr/bin/env ruby

require File.expand_path(File.dirname(__FILE__) + '/../config/aws_config')

vpc = AWS::EC2.new.vpcs.first

vpc.instances.group_by { |inst| inst.tags['Role'] }.each do |role, instances|
  if role == nil || role.length == 0 then next end 
  puts "#{role}:"
  instances.each do |inst|
    sec_groups = inst.security_groups.collect {|sg| sg.name }.join(', ')
    puts "  Name: #{inst.tags['Name']}"
    puts "  ID: #{inst.id}" 
    puts "  AMI: #{inst.image_id}"
    puts "  Private IP: #{inst.private_ip_address}"
    puts "  Elastic IP: #{inst.public_ip_address}" if inst.public_ip_address
    puts "  Security groups: #{sec_groups}"
    puts
  end 
  puts
end
{% endhighlight %}

