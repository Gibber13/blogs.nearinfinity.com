---
title: "Testing a Puppet Module"
tags: puppet ruby razor server-provisioning testing
---

We recently acquired some new (and old) hardware for a few of our internal big data projects. This encouraged us to research and implement an automated provisioning system. We decided to use [Razor](https://github.com/puppetlabs/Razor) because of its relative ease of use, but more importantly its native integration with [Puppet](https://github.com/puppetlabs/puppet). As a part of setting up our environment worked with a few different Puppet Modules and I also needed to write my own Module that would install [Blur](http://incubator.apache.org/blur). I am writing this blog to discuss how I went about iteratively testing my module.

Testing Modules
---------------
I needed to test that the module was being properly installed on any "new" machine that my Puppet Master was provisioning. I wanted to test the module locally (to the master) without having to load my module to the [Puppet Forge](http://forge.puppetlabs.com/); as this would likely be very slow and increase my development time. Unfortunately Puppet __really__ wants to install modules from the Forge.

To get around this issue I cloned my Module repository to the Puppet Master box, built the module, and then __forcably__ installed the module. This will cause Puppet to install the module even if it receives an error or a warning. You should now be able to add your Module to the sites.pp and it will be installed on the specified endpoints. You can edit the module in /etc/puppet/modules/YOUR_MODULE to see small changes immediately, but be careful as this will require you to also uninstall the module forcably.

{% highlight bash %}
  # Clone the repo
  git clone REPO
  cd REPO

  # Build the module
  puppet module build

  # Forcably Install
  puppet module install /pkg/YOUR_MODULE-VERSION.tar.gz --force

  # Forcably Uninstall (if you edit the module manually)
  puppet module install AUTHOR-YOUR_MODULE --force

{% endhighlight %}

These few commands, paired with a well configured [Vagrant](http://vagrantup.com/) environment, allowed me to rapidly deploy module changes to fresh machines and dramatically reduce my write, test, and repeat loop. It may also be possible to achieve this workflow using symlinks from your repo to the Modules folder, allowing for an even more rapid code to deploy loop, but I was not able to get it working properly (possibly a versioning/installation issue).