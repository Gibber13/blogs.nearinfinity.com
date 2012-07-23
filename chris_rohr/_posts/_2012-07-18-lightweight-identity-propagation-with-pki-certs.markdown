---
title: Lightweight Identity Propagation with PKI Certificates
tags: security web services
layout: blogs
---
When you are building web services you will inevitably run into the issue of propagating a user's identity especially if your services have to use PKI Certificates.  There are many ways to accomplish this, some that are very secure and some that aren't really secure at all.  Obviously on the non-secure side you can just pass around some sort of user identifier but this really doesn't enforce that any one user is really initiating the request.  Any point in the chain could simply hardcode a user id and get access to whatever it wanted.  On the other hand there are some good commercial products out there that essentially utilize tokens to verify the user's identity for the various points in the web service chain.

If you aren't in the market or don't have the time for one of the commercial solutions and you don't want to trust the calling system that they truly authenticated the user they are sending you, then this post will hopefully give you a very lightweight solution to keep your system secure with very little overhead.

> Note: I will be giving code examples in Ruby, however, none of the concepts are Ruby specific.  This should be implementable in any language.

# Step 1 - How to get a token

First thing that you will need to do is to add a call to your service so that a token can be retrieved.  This call will need to be made with the user's certificate.  This will ensure that the user made the initial call.

    # Pre-condition: Validate user's cert
    token = ::SecureRandom.urlsafe_base64
    data_hash = {:user_id => user.dn, :token => token}
    # Store the token, json form of data_hash and Time.now into the database

This will generate a token and assign it to the user.  The time piece is so that you can expire a ticket after a specified amount of time.

At this point there are 2 ways to get the token back to the requester.  The first is to simply send back the token in the response.  This is useful if the requesting application is a thick client that doesn't support cookies.  The second is to generate a javascript block that sets the token into a cookie.

    js_lines = []
    js_lines << "var expiresTime = new Date()"
    js_lines << "expiresTime.setTime(expiresTime.getTime()+(1000*60*55))"
    js_lines << "document.cookie = 'apptoken=#{token};expires=' + expiresTime.toGMTString() + ';path=/;secure=true'"
    js_lines << "window.setTimeout(function(){var scriptElem=document.getElementById('tokenElem');if(scriptElem && scriptElem.parentNode && scriptElem.parentNode.removeChild){scriptElem.parentNode.removeChild(scriptElem);} var script=document.createElement('script'); script.src='/tokenurl?ts' + new Date(); script.id='tokenElem'; document.body.appendChild(script);}, 300000)"
    js_lines.join('; ')

The above block of javascript will set the token into a cookie that expires in 55 minutes.  It will then set a timeout to reload the token in 5 minutes (if the user stays on the page).  This will continue to run every 5 minutes making it so your user will have a fresh token.

# Step 2 - Validate Token

When the server that the identity is being propagated from sends your service the request they will pass along both the identifier of the user (in our case the user's DN) and the token that was retrieved (in the case of another website contacting your service they will get the token from the cookie that is sent to them).  Your system then can validate that the user matches the token.

    # Request token created time and data_hash where token = provided value from database (might want to order on created date to get the newest one just to be safe)
    raise Invalid_User if token_info.count == 0
    token_info_json = nil
    token_created_on = nil
    row = token_info.first
    token_info_json = JSON.parse(row['data_hash'])
    token_created_on = row['created_on']
    raise Invalid_User if token_info_json['user_id'] != user_dn
    raise Invalid_User if token_created_on < Time.now - (60*60) # I've set mine to an hour but it can be any time you want
    # If we get here we have a valid token

Basically what happened there was we tried to find the existing token, if we found one, we compared the user_id that is associated with the token to the user_id that was given to us.  Finally we check to make sure the token isn't expired.  If all of this passes, then the token is valid and thus the user is valid.

# Conclusion

This is just a simple, lightweight way to accomplish identity propagation without investing a lot of time, money or resources.  This can be modified so that even if you aren't using certificates and have some sort of standard user identifier that too can be used.