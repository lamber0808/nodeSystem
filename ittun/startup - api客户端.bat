@echo on
cd %cd%
ngrok -config ittun.yml -subdomain weibiaoapp 8021
pause
#ngrok 9090