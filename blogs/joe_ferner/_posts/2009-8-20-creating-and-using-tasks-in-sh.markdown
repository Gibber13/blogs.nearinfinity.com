--- 
permalink: /blogs/creating_and_using_tasks_in_sh.html
layout: blogs
title: Creating and Using Tasks in SharePoint State Machine Workflow
date: 2009-08-20 22:23:49 -04:00
tags: .NET
---
<p>I had a problem with creating and using tasks in a SharePoint state machine workflow so I wanted to capture it in a blog so that others wouldn't need to. There isn't a lot of magic just a few gotchas which I'll point out.</p>
<p>Let me start by showing an overview of the workflow we are trying to create.<br>
<img class="mt-image-none" alt="workflow_overview.jpg" src="http://www.nearinfinity.com/blogs/2009/08/20/workflow_overview.jpg" width="435" height="338" /><br>
This is about as simple as it gets. Start -> Manager Approve -> Done.</p>
<p>If you look at "ManagerReview" you see we have three things.
<ul>
<li>ManagerReviewInit - This activity is responsible for creating the task<br>
<div class="gotcha"><span class="gotcha-title">Gotcha #1</span> - If we create the task here we encapsulate the ability that later in the workflow we can transition back to the ManagerReview state and it will know how to create a new task.</div></li>
<li>OnManagerReviewTaskCreatedEvent - This activity is going to initialize the task</li>
<li>OnManagerReviewTaskChangedEvent - This activity is going to perform the logic of when the task is completed</li>
</ul>
</p>
<p>
  <h3>ManagerReviewInit</h3>
  <img alt="manager_review_init.jpg" src="http://www.nearinfinity.com/blogs/2009/08/20/manager_review_init.jpg" width="215" height="267" class="mt-image-none" style="" /><br>
  No surprises here. Unless you take a look at the CorrelationToken on
  the create task.<br>
  <img alt="create_manager_review_task_props.jpg" src="http://www.nearinfinity.com/blogs/2009/08/20/create_manager_review_task_props.jpg" width="395" height="297" class="mt-image-none" style="" /><br>
  <div class="gotcha"><span class="gotcha-title">Gotcha #2</span> - 
  The OwnerActivityName needs to be scoped at the "State" level
  (in our case "ManagerReview"). This is important because later if
  you add a state that transitions back to "ManagerReview" you will
  get an exception stating that the correlation token was already
  initialized. Narrowing the scope will invalidate the correlation token
  when you leave the state.
  </div>
</p>
<p>
  <h3>OnManagerReviewTaskCreated</h3>
  <img alt="manager_review_on_create.jpg" src="http://www.nearinfinity.com/blogs/2009/08/20/manager_review_on_create.jpg" width="206" height="201" class="mt-image-none" style="" /><br>
  <div class="gotcha"><span class="gotcha-title">Gotcha #3</span> -
  At first I assumed that you needed to have a "set state" at the end
  of every event to loop back onto itself. Well you don't, there is an implied loop back. In fact if you do, the state initialization
  routine will be called causing a task to be created which will
  basically create an infinite recursion.
  </div>
</p>
<p>
  <h3>OnManagerReviewTaskChanged</h3>
  <img alt="manager_review_on_change.jpg" src="http://www.nearinfinity.com/blogs/2009/08/20/manager_review_on_change.jpg" width="432" height="514" class="mt-image-none" style="" /><br>
  If we take a closer look at the conditional you'll see I'm using
  a property I created, TaskComplete.<br>
  <img alt="complete_rule.jpg" src="http://www.nearinfinity.com/blogs/2009/08/20/complete_rule.jpg" width="334" height="140" class="mt-image-none" style="" /><br>
  <div class="gotcha"><span class="gotcha-title">Gotcha #4</span> -
  Microsoft doesn't expose the task status and since
  most users don't update percent complete when completing tasks you have to attach to the changed event
  and expose it to the workflow.
  </div>
  <pre class="prettyprint">
public bool TaskComplete { get; set; }
  
private void OnManagerReviewTaskChanged_Invoked(object sender, ExternalDataEventArgs e) {
  TaskComplete = AfterTaskProperties.ExtendedProperties[SPBuiltInFieldId.TaskStatus].ToString() == "Completed";
}
</pre>
</p>
<style type="text/css">
		    .gotcha {
  font-style: italic;
  border: 1px solid #888888;
  margin: 1em;
  padding: 1em;
}

.gotcha-title {
  font-weight: bold;
}
</style> 
