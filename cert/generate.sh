#!/bin/bash
mkdir -p /var/www/cert
sudo openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout /var/www/cert/default_key -out /var/www/cert/default_cert -config cert.conf

dns_cloudflare_email = **
dns_cloudflare_api_key = **

certbot certonly --dns-cloudflare --dns-cloudflare-credentials ~/.secrets/certbot/cloudflare.ini --dns-cloudflare-propagation-seconds 10 -d *.vampire.rip.*.vps.vampire.rip

cat <<EOT > /etc/nginx/ssl.conf
ssl_certificate     /etc/letsencrypt/live/vampire.rip/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/vampire.rip/privkey.pem;
EOT

nginx -s reload

echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew" | sudo tee -a /etc/crontab > /dev/null
