@echo on
cd %cd%
ngrok -config ittun.yml -subdomain weibiaowx 6005
pause
#ngrok 9090