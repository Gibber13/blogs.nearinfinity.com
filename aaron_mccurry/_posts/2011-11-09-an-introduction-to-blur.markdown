---
atom_id: tag:www.nearinfinity.com,2011:/blogs//7.1886 # This is for backwards compatibility do not change!
permalink: /blogs/aaron_mccurry/an_introduction_to_blur.html
layout: blogs
title: An Introduction to Blur
date: 2011-11-09 15:00:00 -05:00
tags: Hadoop Java Lucene
---
Blur is a new Apache 2.0 licensed software project that provides a search capability built on top of Hadoop and Lucene.  Elastic Search and Solr already exist so why build something new?  While these projects work well, they didn't have a solid integration with the Hadoop ecosystem.  Blur was built specifically for Big Data, taking scalability, redundancy, and performance into consideration from the very start, while leveraging all the goodness that already exists in the Hadoop stack.  

A year and a half ago, my project began using Hadoop for data processing.  Very early on, we were having networking issues that would make our HDFS cluster network connectivity spotty at best.  Over one weekend in particular, we steadily lost network connection to 47 of the 90 data nodes in the cluster.  When we came in on Monday morning, I noticed that the MapReduce system was a little sluggish but still working.  When I checked HDFS I saw that our capacity had dropped by about 50%.  After running an fsck on the cluster I was amazed to find that what seemed like a catastrophic failure over the weekend resulted in a still healthy file system.  This experience left a lasting impression on me.  It was then that I got the idea to somehow leverage the redundancy and fault tolerance of HDFS for the next version of a search system that I was just beginning to (re)write.  

I had already written a custom sharded Lucene server that had been in a production system for a couple of years.  Lucene worked really well and did everything that we needed for search.  The issue that we faced was that it  was running on big iron that was not redundant and could not be easily expanded.  After seeing the resilient characteristics of Hadoop first hand, I decided to look into marrying the already mature and impressive feature set of Lucene with the built in redundancy and scalability of the Hadoop platform.  From this experiment Blur was created.

The biggest technical issues/features that Blur solves:

* Rapid mass indexing of entire datasets
* Automatic Shard Server Failover
* Near Real-time update compatibility via Lucene NRT
* Compression of Lucene FDT files while maintaining random access performance
* Lucene WAL (Write Ahead Log) to provide data reliability
* Lucene R/W directly into HDFS (the seek on write problem)
* Random access performance with block caching of the Lucene Directory

Data Model
===========

Data in Blur is stored in Tables that contain Rows.  Rows must have a unique row id and contain one or more Records.  Records have a unique record id (unique within the Row) and a column family for grouping columns that logically make up a single record.  Columns contain a name and a value, and a Record can contain multiple columns with the same name.

<script src="https://gist.github.com/1349055.js?file=gistfile1.js"></script>

Architecture
===========

Blur uses Hadoop's MapReduce framework for indexing data, and Hadoop's HDFS filesystem for storing indexes.  Thrift is used for all inter-process communications and Zookeeper is used to know the state of the system and to store meta data.  The Blur architecture is made up of two types of server processes:

* Blur Controller Server
* Blur Shard Server

The shard server, serves 0 or more shards from all the currently online tables.  The calculation of the what shards are online in each shard server is done through the state information in Zookeeper.  If a shard server goes down, through interaction with Zookeeper the remaining shard servers detect the failure and determine which if any of the missing shards they need to serve from HDFS.  

The controller server provides a single point of entry (logically) to the cluster for spraying out queries, collecting the responses, and providing a single response.  Both the controller and shard servers expose the same Thrift API which helps to ease debugging.  It also allows developers to start a single shard server and interact with it the same way they would with a large cluster.  Many controller servers can be (and should be) run for redundancy. The controllers act as gateways to all of the data that is being served by the shard servers.

Updating / Loading Data
===========

Currently there are two ways to load and update data.  The first is through a bulk load in MapReduce and the second is through mutation calls in Thrift.

Bulk Load MapReduce Example
-----------------

<script src="https://gist.github.com/1348788.js?file=BlurMapReduce.java"></script>

Data Mutation Thrift Example
-----------------

<script src="https://gist.github.com/1348845.js?file=ThriftMutationExample.java"></script>

Searching Data
===========

Any element in the Blur data model is searchable through the normal Lucene semantics: analyzers. Analyzers are defined per Blur table.

The standard Lucene query syntax is the default way to search Blur.  If anything outside of the standard syntax is needed, you can create a Lucene query directly with Java objects, and submit them through the expert query API.

The column family grouping within Rows allows for results to be discovered across column families similar to what you would get with an inner join across two tables that share the same key (or in this case rowid).  For complicated data models that have multiple column families, this makes for a very powerful search capability.

The following example searches for "value" as a full text search.  If I had wanted to search for "value" in a single field like column "colA" in column family "famB" the query would look like "famB.colA:value".

<script src="https://gist.github.com/1348874.js?file=ThriftSearchExample.java"></script>

Fetching Data
===========

Fetches can be done by row or by record.  This is done by creating a selector object in which you specify the rowid or recordid, and the specific column families or columns that you would like returned.  When not specified, the entire Row or Record is returned.

<script src="https://gist.github.com/1348865.js?file=ThriftFetchExample.java"></script>

Current State
===========

Blur is nearing it's first release 0.1 and is relatively stable.  The first release candidate should be available for download within the next few weeks.  In the meantime you can check it out on github:

[https://github.com/nearinfinity/blur][blur_github]

[http://blur.io][blur_io]

[blur_github]: https://github.com/nearinfinity/blur
[blur_io]: http://blur.io
 
