@echo on
cd %cd%
ngrok -config ittun.yml -subdomain weibiaojd 8022
pause
#ngrok 9090