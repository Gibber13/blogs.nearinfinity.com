---
title: Creating and Using Static Libraries for iPhone using Xcode 4.3
tags: iphone mobile
layout: blogs
---
Recently, after developing a collection of applications for iPhone that were intended to be used as libraries, I began looking into how to convert Xcode projects into static libraries. Most of what I found was vague, unclear, and outdated. Instructions were either for older versions of Xcode, or assumed that you were creating a blank library, and would be coding after creating a new project.

So, I read through several tutorials, and believe that I have come up with the best way to convert a finished, working project into a library for use.

#Creating a static library#


First, you need to create a new Xcode project. From the template selection screen, choose Cocoa Touch Static Library under Framework & Library for iOS. 

![Alt text](/blogs/tyler_vernon/assets/blogimages/CreateLibrary1.png)

You can give the project whatever descriptive name you would like, and you can change the name of the resulting .a (archive) file to whatever you want in the end. Select where you want to create the project and press create.

Next, remove the .m and .h file that were auto-created with the project. They should be named the same as the newly created project.

Next, select the files from your original project that you want included in the library, and move them to the library project. Be sure to include the .m and .h file for each file wanted, as well as any .plist or other resources, such as libraries, that the files need or reference. When copying the files, be sure to select the check box under Add to Targets to ensure that all the imported .m files will be included in the library.

![Alt text](/blogs/tyler_vernon/assets/blogimages/CreateLibrary2.png)

At this point, you should check that the prefix file of the library project has all of the necessary imports, to prevent build errors within your library.

Now, we want to build the library for both device and simulator, starting with the device.  To build the library for a device, either select a connected device from the device list or select iOS device from the list, as below.

![Alt text](/blogs/tyler_vernon/assets/blogimages/CreateLibrary3.png)

Then build the library. If the build was successful, the filename of the .a file in the Products folder should now be black.	

![Alt text](/blogs/tyler_vernon/assets/blogimages/CreateLibrary4.png)

To build the library for a simulator, select a valid simulator from the device list, and build the library again.

Next, we are going to locate our newly created libraries. You can right click the created library under Products and select show in finder to open the folder containing the device build.

![Alt text](/blogs/tyler_vernon/assets/blogimages/CreateLibrary5.png)

The enclosing folder is the Products folder of the library project, and contains two folders, one for device, and one for simulator.

The next step is to combine these two libraries into one “fat” library that can be used for device and simulator. The easiest way to do this is to copy the two libraries to another folder, renaming them to distinguish them. 

![Alt text](/blogs/tyler_vernon/assets/blogimages/CreateLibrary6.png)

From the terminal, navigate to the folder containing the libraries and run the following command, substituting the names of your libraries:

{% highlight bash %}
lipo -create libPictureTouchLibraryDevice.a libPictureTouchLibrarySimulator.a -output libPictureTouchLibrary.a{% endhighlight %}

This will create a new library in the same folder that can be used for either devices or simulators.

Finally, to distribute the library, we need to include the .h files and any resources, such as plists, that will be used in the library. These files, along with the “fat” .a file are allyou need to implement the library. 

![Alt text](/blogs/tyler_vernon/assets/blogimages/CreateLibrary7.png)

You now have a static library, ready to be added to any Xcode project.

#Adding a static library to a project#

First, if you created the library as mentioned above, and are adding the newly created library back to the project it originated from, be sure to remove any .h or .m files that are included in the library before adding it.

![Alt text](/blogs/tyler_vernon/assets/blogimages/CreateLibrary8.png)

Next, add the .a file and all resource files to the project. Be sure to select the check box under Add to targets to add it to the main target of the application. 

![Alt text](/blogs/tyler_vernon/assets/blogimages/CreateLibrary9.png)

Otherwise, you will have to add the library under the build settings of the project. The library should now be working! You can now reference it anywhere within your project.

