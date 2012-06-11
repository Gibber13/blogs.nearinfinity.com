---
atom_id: tag:www.nearinfinity.com,2010:/blogs//7.1755 # This is for backwards compatibility do not change!
permalink: /blogs/chris_rohr/configuring_webrick_to_use_ssl.html
layout: blogs
title: Configuring WEBrick to use SSL in Rails 3
date: 2010-09-07 14:26:14 -04:00
tags: Ruby
---
The other day my project took on the task of upgrading our (fairly new) rails application from Rails 2.3.5 to Rails 3.  Everything was going great until we got to the part of actually trying to run our application under WEBrick. 

Our application has some services that it connects to that require secure connections so in order to comply and still develop we had modified the WEBrick configuration under 2.3.5 to make it run under SSL. This turned out to be very easy to accomplish with 2.3.5, we just cracked open the script/server file and added the appropriate SSL options that WEBrick already knows about.

Rails 3 proved to be a little bit more difficult to modify.  This is due to the fact that the script folder only contains a rails script now and all of the old scripts are now contained deep in the rails build.  I didn't really want to crack open rails and start modifying (especially not when it is only for development), so I was looking for another option.  I spent a few days searching the internet with no luck.  Today I came into work and after 6+ hours and some pair programming a solution was figured out.  You can find the solution that we came up with below, and if there is a more elegant solution out there I would love to hear about it.

All you have to do to get WEBrick running in SSL is modify the script/rails file and add the following lines (above the APP_PATH variable declaration):

    require 'rubygems'
    require 'rails/commands/server'
    require 'rack'
    require 'webrick'
    require 'webrick/https'
    
    module Rails
        class Server < ::Rack::Server
            def default_options
                super.merge({
                    :Port => 3000,
                    :environment => (ENV['RAILS_ENV'] || "development").dup,
                    :daemonize => false,
                    :debugger => false,
                    :pid => File.expand_path("tmp/pids/server.pid"),
                    :config => File.expand_path("config.ru"),
                    :SSLEnable => true,
                    :SSLVerifyClient => OpenSSL::SSL::VERIFY_NONE,
                    :SSLPrivateKey => OpenSSL::PKey::RSA.new(
                           File.open("path/to/key").read),
                    :SSLCertificate => OpenSSL::X509::Certificate.new(
                           File.open("/path/to/crt").read),
                    :SSLCertName => [["CN", WEBrick::Utils::getservername]]
                })
            end
        end
    end 
