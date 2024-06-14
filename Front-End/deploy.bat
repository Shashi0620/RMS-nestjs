call npm run build
call del /s /q D:\apps\nginx-1.24.0\rms\frontend\rms
call xcopy D:\projects\RMS\codebase\Rack-Management\Front-End\dist\rackmanagement D:\apps\nginx-1.24.0\rms\frontend\rms /S /E /Y && @taskkill /f /im nginx.exe
call xcopy D:\projects\RMS\codebase\Rack-Management\Front-End\src\google7621a0056c630b14.html D:\apps\nginx-1.24.0\rms\frontend\rms /S /E /Y 
call xcopy D:\projects\RMS\codebase\Rack-Management\Front-End\src\sitemap.xml D:\apps\nginx-1.24.0\rms\frontend\rms /S /E /Y 
cd D:\apps\nginx-1.24.0
