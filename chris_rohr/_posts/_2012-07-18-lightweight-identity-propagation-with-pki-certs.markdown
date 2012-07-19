---
title: Lightweight Identity Propagation with PKI Certificates
tags: security web services
layout: blogs
---
When you are building web services you will inevitably run into the issue of propagating a user's identity especially if your services have to use PKI Certificates.  There are many ways to accomplish this, some that are very secure and some that aren't really secure at all.  Obviously on the non-secure side you can just pass around some sort of user identifier but this really doesn't enforce that any one user is really initiating the request.  Any point in the chain could simply hardcode a user id and get access to whatever it wanted.  On the other hand there are some good commercial products out there that essentially utilize tokens to verify the user's identity for the various points in the web service chain.

If you aren't in the market or don't have the time for one of the commercial solutions and you don't want to trust the calling system that they truly authenticated the user they are sending you, then this post will hopefully give you a very lightweight solution to keep your system secure with very little overhead.

> Note: I will be giving code examples in Ruby, however, none of the concepts are Ruby specific.  This should be implementable in any language.

# Step 1 - How to get a token

First thing that you will need to do is to add a call to your service so that a token can be retrieved.