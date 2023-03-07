# ESP PWA
 An App for your smartphone or desktop to check if an ESP or Arduino is present on the local network, open the IP if available and launch a second PWA to control your device from a remote webpage.
 
 ## Description
 Every time, you make a Webpage or a simple project with your ESP/Arduino, you have to insert an IP on your browser (example 192.168.1.10).  
 Once it is not available anymore (maybe because you changed board or because it got another IP), you get an error and have to insert a new IP in the address.  
 It is even more complicated if you have a direct link on your home screen.  
 
 With this app, you can just insert the IP of your device and when you open it, the app will check if the device is available and will redirect you directly to the device page.  
 The device will then open a second PWA, to control the device over an insecure IP.
 
 ## Project Idea
 - The PWA will check if the ESP32 device is online and available.  
 - PWA will redirect you to the ESP32 webpage (see Arduino project example).  
 - The ESP will load a second PWA from the internet, so you can control your ESP over the web.  
 
 At the end, you have a shortcut on your phone that starts an online PWA to control your device.  
 
 ## Why? 
 The main problem on the ESP32 as Server is the certificate. You can create one and the ESP can use it to connect to a secure server. But when the ESP is a server, it is more complicated.  
 Chrome is always more aggressive with its "security" rules, so you can't call any unsecure page from a secure page anymore. **Even if it is a local page !** There are some workarounds, works well for some months and then they stops to work. So, you can't make any request from a PWA to a local device anymore in future or already now.  
 With this project, you will be able to load any online PWA (https) directly from your ESP! This will allow you to control it even if it is on an insecure address.
 
