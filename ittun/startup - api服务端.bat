@echo on
cd %cd%
ngrok -config ittun.yml -subdomain weibiao 6001
pause
#ngrok 9090