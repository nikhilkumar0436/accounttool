# Deployment Guide

This guide covers different deployment strategies for the AccountTool GST Management System.

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Production Deployment](#production-deployment)
4. [Cloud Deployment](#cloud-deployment)

---

## Local Development

See [QUICKSTART.md](QUICKSTART.md) for local development setup.

---

## Docker Deployment

Deploy the entire stack using Docker Compose.

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Steps

1. **Clone the repository:**
```bash
git clone https://github.com/nikhilkumar0436/accounttool.git
cd accounttool
```

2. **Start all services:**
```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Backend API on port 8080
- Frontend UI on port 4200

3. **Initialize database roles:**
```bash
docker exec -it accounttool-postgres psql -U postgres -d accounttool -c "
INSERT INTO roles (name, description) VALUES 
('ROLE_ADMIN', 'Administrator with full access'),
('ROLE_ACCOUNTANT', 'Accountant with accounting access'),
('ROLE_USER', 'Regular user with read access')
ON CONFLICT (name) DO NOTHING;
"
```

4. **Access the application:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5432

5. **View logs:**
```bash
docker-compose logs -f
```

6. **Stop services:**
```bash
docker-compose down
```

7. **Stop and remove volumes:**
```bash
docker-compose down -v
```

---

## Production Deployment

### Backend (Spring Boot)

#### Option 1: JAR Deployment

1. **Build the JAR:**
```bash
cd backend
mvn clean package -DskipTests
```

2. **Configure application.properties:**
Update production database credentials and JWT secret.

3. **Run the JAR:**
```bash
java -jar target/accounttool-backend-1.0.0.jar
```

4. **Run as systemd service (Linux):**

Create `/etc/systemd/system/accounttool.service`:
```ini
[Unit]
Description=AccountTool Backend
After=syslog.target

[Service]
User=accounttool
ExecStart=/usr/bin/java -jar /opt/accounttool/accounttool-backend-1.0.0.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable accounttool
sudo systemctl start accounttool
sudo systemctl status accounttool
```

#### Option 2: WAR Deployment to Tomcat

1. **Change packaging to WAR in pom.xml:**
```xml
<packaging>war</packaging>
```

2. **Add Tomcat dependency:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
    <scope>provided</scope>
</dependency>
```

3. **Build WAR:**
```bash
mvn clean package -DskipTests
```

4. **Deploy to Tomcat:**
Copy `target/accounttool-backend-1.0.0.war` to Tomcat's `webapps` directory.

### Frontend (Angular)

#### Option 1: Nginx Deployment

1. **Build for production:**
```bash
cd frontend
npm run build
```

2. **Configure Nginx:**

Create `/etc/nginx/sites-available/accounttool`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/accounttool;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Deploy files:**
```bash
sudo cp -r dist/frontend/* /var/www/accounttool/
sudo chown -R www-data:www-data /var/www/accounttool
```

4. **Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/accounttool /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Option 2: Apache Deployment

1. **Build for production:**
```bash
cd frontend
npm run build
```

2. **Configure Apache:**

Create `/etc/apache2/sites-available/accounttool.conf`:
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/accounttool

    <Directory /var/www/accounttool>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    ProxyPass /api http://localhost:8080/api
    ProxyPassReverse /api http://localhost:8080/api
</VirtualHost>
```

3. **Enable modules and site:**
```bash
sudo a2enmod rewrite proxy proxy_http
sudo a2ensite accounttool
sudo systemctl reload apache2
```

### Database (PostgreSQL)

#### Production Configuration

1. **Secure PostgreSQL:**
```bash
# Update postgresql.conf
listen_addresses = 'localhost'
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB

# Update pg_hba.conf
local   all             all                                     peer
host    accounttool     accounttool     127.0.0.1/32           md5
```

2. **Create backup script:**

Create `/opt/accounttool/backup.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/backup/accounttool"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U postgres accounttool > $BACKUP_DIR/accounttool_$DATE.sql
find $BACKUP_DIR -name "accounttool_*.sql" -mtime +7 -delete
```

3. **Schedule backups:**
```bash
crontab -e
# Add: 0 2 * * * /opt/accounttool/backup.sh
```

---

## Cloud Deployment

### AWS Deployment

#### Architecture:
- **RDS:** PostgreSQL database
- **EC2:** Spring Boot backend
- **S3 + CloudFront:** Angular frontend
- **ALB:** Load balancer

#### Steps:

1. **Create RDS PostgreSQL instance:**
```bash
aws rds create-db-instance \
    --db-instance-identifier accounttool-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username postgres \
    --master-user-password YOUR_PASSWORD \
    --allocated-storage 20
```

2. **Deploy backend to EC2:**
- Launch EC2 instance (t2.micro)
- Install Java 17
- Upload JAR file
- Configure as systemd service
- Set up security group to allow port 8080

3. **Deploy frontend to S3:**
```bash
# Build
cd frontend && npm run build

# Upload to S3
aws s3 sync dist/frontend/ s3://accounttool-frontend/

# Configure S3 for static website hosting
aws s3 website s3://accounttool-frontend/ \
    --index-document index.html \
    --error-document index.html

# Set up CloudFront distribution
```

### Heroku Deployment

#### Backend:

1. **Create Heroku app:**
```bash
heroku create accounttool-backend
heroku addons:create heroku-postgresql:hobby-dev
```

2. **Configure environment:**
```bash
heroku config:set JWT_SECRET=your-secret-key
```

3. **Deploy:**
```bash
cd backend
git push heroku main
```

#### Frontend:

1. **Update API URL in environment.prod.ts:**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://accounttool-backend.herokuapp.com'
};
```

2. **Deploy to Netlify/Vercel:**
```bash
# Build
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist/frontend
```

### Google Cloud Platform

#### Use Cloud Run for containerized deployment:

1. **Build Docker images:**
```bash
docker build -t gcr.io/PROJECT_ID/accounttool-backend ./backend
docker build -t gcr.io/PROJECT_ID/accounttool-frontend ./frontend
```

2. **Push to Container Registry:**
```bash
docker push gcr.io/PROJECT_ID/accounttool-backend
docker push gcr.io/PROJECT_ID/accounttool-frontend
```

3. **Deploy to Cloud Run:**
```bash
gcloud run deploy accounttool-backend \
    --image gcr.io/PROJECT_ID/accounttool-backend \
    --platform managed \
    --region us-central1

gcloud run deploy accounttool-frontend \
    --image gcr.io/PROJECT_ID/accounttool-frontend \
    --platform managed \
    --region us-central1
```

---

## Security Considerations

### Production Checklist:

- [ ] Change default JWT secret to a strong random string
- [ ] Use HTTPS for all endpoints
- [ ] Enable CORS only for trusted domains
- [ ] Use environment variables for sensitive data
- [ ] Enable database encryption at rest
- [ ] Set up database connection pooling
- [ ] Configure rate limiting
- [ ] Enable request logging
- [ ] Set up monitoring and alerts
- [ ] Configure firewall rules
- [ ] Use strong database passwords
- [ ] Enable database backups
- [ ] Set up SSL certificates
- [ ] Configure Content Security Policy
- [ ] Enable HSTS headers
- [ ] Implement API versioning
- [ ] Set up health check endpoints

### Environment Variables:

Create `.env` file (never commit to git):
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=accounttool
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-256-bit-secret-key
JWT_EXPIRATION=86400000

# CORS
CORS_ORIGINS=https://your-domain.com
```

---

## Monitoring

### Application Monitoring:

1. **Spring Boot Actuator:**
Add to pom.xml:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

2. **Health Check Endpoint:**
```
GET /actuator/health
```

3. **Metrics Endpoint:**
```
GET /actuator/metrics
```

### Log Management:

Configure logging in `application.properties`:
```properties
logging.level.root=INFO
logging.level.com.accounttool=DEBUG
logging.file.name=/var/log/accounttool/application.log
logging.file.max-size=10MB
logging.file.max-history=30
```

---

## Performance Optimization

### Backend:
- Enable database connection pooling
- Configure Hibernate second-level cache
- Use pagination for large result sets
- Enable GZIP compression
- Configure thread pool size

### Frontend:
- Enable lazy loading for Angular modules
- Use AOT compilation
- Enable production mode
- Optimize bundle size
- Enable service worker for caching
- Use CDN for static assets

### Database:
- Create appropriate indexes
- Optimize queries
- Use connection pooling
- Regular VACUUM and ANALYZE
- Monitor slow queries

---

## Troubleshooting

### Common Issues:

1. **Backend won't connect to database:**
   - Check database credentials
   - Verify database is running
   - Check firewall rules
   - Verify network connectivity

2. **Frontend can't reach backend:**
   - Check CORS configuration
   - Verify backend is running
   - Check API URL in environment files
   - Inspect browser console for errors

3. **Authentication issues:**
   - Verify JWT secret is same across restarts
   - Check token expiration time
   - Verify roles are properly initialized

---

## Support

For deployment issues, check:
- Application logs
- Database logs
- Web server logs
- System logs

For further assistance, create an issue in the repository.
