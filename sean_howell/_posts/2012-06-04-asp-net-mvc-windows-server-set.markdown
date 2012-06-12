---
atom_id: tag:www.nearinfinity.com,2012:/blogs//7.1905 # This is for backwards compatibility do not change!
permalink: /blogs/sean_howell/asp_net_mvc_windows_server_set.html
title: ASP .NET MVC Windows Server Setup
date: 2012-06-04 15:53:00 -04:00
tags: .NET Web-Development
---

This is a collection of script I have used to setup a Windows 2008 R2 server for a ASP .NET MVC web application. The scripts setup IIS, SQL Server and Windows. 
The following code sets up the core features of Windows including IIS, the .NET framework and allows Remote Desktop connections.
{% highlight posh linenos %}
    import servermanager # Provides the Add-WindowsFeature cmdlet

    function wait-process($processName, $arguments)
    {
            start-process $processName -argumentlist $arguments -wait 
    }

    write-host "Adding core windows features"
    Add-WindowsFeature WAS,NET-Framework -includeAllSubFeature 

    write-host "Installing .NET Framework 4"
    wait-process ".\\dotNetFx40_Full_setup.exe" @("/install", "/q", "/norestart")

    write-host "Enabling Remote Desktop"
    $terminal = gwmi Win32_TerminalServiceSetting -Namespace ROOT\\CIMV2\\TerminalServices
    $settings = (Get-WmiObject -class "Win32_TSGeneralSetting" -Namespace root\\cimv2\\terminalservices -Filter "TerminalName='RDP-tcp'")
    $r = $terminal.SetAllowTSConnections(1)
    $settings.SetUserAuthenticationRequired(1)

    write-host "Configuring Windows Firewall to allow Remote Desktop connections"
    netsh advfirewall Firewall set rule group="Remote Desktop" new enable="yes" 
{% endhighlight %}

Next on the setup list is adding roles to IIS. The following cmd file will add all of the required roles to run a ASP .NET MVC application. However, this is by no means a the minimal set of Windows features required to run an ASP .NET MVC application.

{% highlight bat linenos %}
    roles.cmd

    start /w pkgmgr /iu:IIS-WebServerRole;IIS-WebServer;IIS-CommonHttpFeatures;IIS-StaticContent;IIS-DefaultDocument;IIS-DirectoryBrowsing;IIS-HttpErrors;
    IIS-ApplicationDevelopment;IIS-ASPNET;IIS-NetFxExtensibility;IIS-ISAPIExtensions;IIS-ISAPIFilter;IIS-HealthAndDiagnostics;IIS-HttpLogging;IIS-LoggingLibraries;
    IIS-RequestMonitor;IIS-HttpTracing;IIS-CustomLogging;IIS-ODBCLogging;IIS-Security;IIS-BasicAuthentication;IIS-WindowsAuthentication;IIS-DigestAuthentication;
    IIS-ClientCertificateMappingAuthentication;IIS-IISCertificateMappingAuthentication;IIS-URLAuthorization;IIS-RequestFiltering;IIS-IPSecurity;IIS-Performance;
    IIS-HttpCompressionStatic;IIS-HttpCompressionDynamic;IIS-WebServerManagementTools;IIS-ManagementConsole;IIS-ManagementService;IIS-Metabase;
    WAS-WindowsActivationService;WAS-ProcessModel;WAS-NetFxEnvironment;WAS-ConfigurationAPI /norestart
{% endhighlight %}

Now that the features for the MVC application are installed, it is time to add MsWebDeploy and register .NET with IIS.
[MS Web Deploy](http://go.microsoft.com/fwlink/?LinkId=209116)(5/30/2012)

{% highlight posh linenos %}
    write-host "Registering .NET with IIS"
    &"C:\\WINDOWS\\Microsoft.NET\\Framework64\\v4.0.30319\\aspnet_regiis" -i

    write-host "Installing MsWebDeploy"
    wait-process "msiexec" @("/i WebDeploy_2_10_amd64_en-US.msi", "ADDLOCAL=ALL", "/qn", "/norestart")
{% endhighlight %}

Next up is the install of SQL Server and the install of SQL Server CE. You can skip installing SQL Server CE if you don't use the Visual Studio's database project for database deployment. However, if you use the database project then SQL Server CE x86/x64 must be on the server the deploy is running from. 
[SQL Ce](http://download.microsoft.com/download/E/C/1/EC1B2340-67A0-4B87-85F0-74D987A27160/SSCERuntime-ENU.exe)(5/30/2012)

{% highlight posh linenos %}

    $admin = "" # Choose your administrator for SQL Server
    $path = (get-location).path
    write-host "Installing SQL Server"
    $configurations = @("/CONFIGURATIONFILE=$path\\Configuration.ini", "/QUIETSIMPLE", "/IACCEPTSQLSERVERLICENSETERMS", "/SQLSYSADMINACCOUNTS=$admin")
    $extraConfigurations | %{ $configurations += $_ } # Parameter to the file to add more configurations.
    wait-process ".\\SQLEXPR_x64_ENU.exe" $configurations

    write-host "Installing SQL Ce SP 2 x86"
    wait-process "msiexec" @("/i SSCERuntime_x86-ENU.msi", "/qn")

    write-host "Installing SQL Ce SP 2 x64"
    wait-process "msiexec" @("/i SSCERuntime_x64-ENU.msi", "/qn")
{% endhighlight %}

The basic web application will now run on the Windows server.