ECHO OFF
ECHO.
ECHO generating desktop and TV version via Air...
CALL adt -package -storetype pkcs12 -keystore sampleCert.pfx -storepass password -tsa http://timestamp.geotrust.com/ ../../bin/native_apps/Air_desktop_and_tv.air Air_config.xml icons -C ../../bin app.swf app.css assets
ECHO.
ECHO generation complete
ECHO.
