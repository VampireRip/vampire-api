#!/bin/bash
mkdir -p /var/www/cert
openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout /var/www/cert/key -out /var/www/cert/cert -config cert.conf -batch
yes | cp /var/www/cert/key /var/www/cert/oc_key
yes | cp /var/www/cert/cert /var/www/cert/oc_cert

mkdir -p ~/.secrets/certbot/
yes | cp cloudflare.ini ~/.secrets/certbot/cloudflare.ini
chmod 600 ~/.secrets/certbot/cloudflare.ini

certbot certonly --dns-cloudflare --dns-cloudflare-credentials ~/.secrets/certbot/cloudflare.ini --dns-cloudflare-propagation-seconds 10 -d *.vampire.rip,*.vps.vampire.rip

cat <<EOT > /etc/nginx/ssl.conf
ssl_certificate     /etc/letsencrypt/live/vampire.rip/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/vampire.rip/privkey.pem;
EOT

systemctl start nginx

nginx -s reload

echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew" | sudo tee -a /etc/crontab > /dev/null
