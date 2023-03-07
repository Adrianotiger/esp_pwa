# ESP PWA
 An App for your smartphone or desktop to check if an ESP or Arduino is present on the local network, open the IP if available and launch a second PWA to control your device from a remote webpage.  
 ![image](https://user-images.githubusercontent.com/7373079/223377531-0f753896-e954-4347-83a6-d037c5d4050c.png) => redirect to ESP => ![image](https://user-images.githubusercontent.com/7373079/223378939-6d52cd5b-8d0f-4b6b-af8e-5a8720306700.png)


 
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
 ![image](https://user-images.githubusercontent.com/7373079/223396052-a07db029-e48f-4f0f-bfc1-464d3a946656.png)

 
 ## Why? 
 The main problem on the ESP32 as Server is the certificate. You can create one and the ESP can use it to connect to a secure server. But when the ESP is a server, it is more complicated.  
 Chrome is always more aggressive with its "security" rules, so you can't call any insecure page from a secure page anymore. **Even if it is a local page !**  
 There are some workarounds, works well for some months and then they stops to work. So, you can't make any request from a PWA to a local device anymore in future or already now.  
 With this project, you will be able to load any online PWA (https) directly from your ESP! This will allow you to control it even if it is on an insecure address.
 
## Setup
### Step 1 - PWA launcher
Just open this PWA: https://adrianotiger.github.io/esp_pwa/pwa/  
You can "install" it, adding it to your home screen.  

### Step 2 - ESP Server
Load Arduino IDE and upload this sketch to your ESP:  
https://github.com/Adrianotiger/esp_pwa/tree/main/arduino/  
Replace the lines:  
- const char* ssid = "YOUR_SSID";
- const char* password = "YOUR_PASSWORD";
- const String pwa_url = "https://adrianotiger.github.io/esp_pwa/web/";  
with your router SSID, password and your second PWA, if you have one.  

### Step 3 - destination PWA
The ESP PWA from example is hosted here: https://adrianotiger.github.io/esp_pwa/web/  
Edit it and upload it to your server.

### Step 4 - Enjoy
Now, you can open sockets and make GET requests from your webpage over insecure protocols.
