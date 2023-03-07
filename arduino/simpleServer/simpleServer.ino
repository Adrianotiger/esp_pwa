#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ESP.h>

AsyncWebServer server(80);

// Set router SSID and Password
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
const String pwa_url = "https://adrianotiger.github.io/esp_pwa/web/";

void httpRequest(AsyncWebServerRequest *request);

void setup() 
{
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  if (WiFi.waitForConnectResult() != WL_CONNECTED) 
  {
      Serial.printf("WiFi Failed! Reload...\n");
      delay(5000);
      ESP.restart();
  }

  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  server.on("/", HTTP_GET, httpRequest);

  // Add default headers, to allow accessing the ESP from every page
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*"); 
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "content-type");
  server.begin();
}

void loop()
{

}

void httpRequest(AsyncWebServerRequest *request)
{
  // If the page was called without any params, load PWA dynamically from the web.
  // Address on the browser will remain the local IP and you can make any requests from your online page.
  if(request->params() == 0)
  {
    // Only 1 line, to load the entire PWA and control your ESP!
    String answer = "<!DOCTYPE html><html><head><script src='" + pwa_url + "loader.js' async></script></head><body></body></html>";
    // Hahah, just a joke... The other 1 milion lines are loaded dynamically by `https://adrianotiger.github.io/esp_pwa/web/loader.js`!
    request->send(200, "text/html",  answer);
    return;
  }
  // ... elaborate the parameters and give an answer. See ESP32 examples for more info.
}