# Judge0 Integration Setup Guide

This guide explains how to set up and configure Judge0 for code execution in the RCES (Remote Code Execution System).

## What is Judge0?

Judge0 is an open-source online code execution system that supports multiple programming languages. It provides a REST API for running code in a sandboxed environment.

## Setup Options

### Option 1: Self-Hosted Judge0 (Recommended)

#### Prerequisites
- Docker and Docker Compose
- At least 2GB RAM available
- Linux/macOS/Windows with Docker support

#### Installation Steps

1. **Clone Judge0 CE (Community Edition)**
   ```bash
   git clone https://github.com/judge0/judge0.git
   cd judge0
   ```

2. **Start Judge0 with Docker Compose**
   ```bash
   docker-compose up -d db redis
   sleep 10s
   docker-compose up -d
   ```

3. **Verify Installation**
   ```bash
   curl http://localhost:2358/about
   ```

4. **Configure Environment Variables**
   Add the following to your `.env` file:
   ```env
   JUDGE0_URL=http://localhost:2358
   JUDGE0_API_KEY=  # Leave empty for self-hosted
   ```

### Option 2: Judge0 Cloud (Paid Service)

1. **Sign up at [Judge0 Cloud](https://judge0.com/)**
2. **Get your API key from the dashboard**
3. **Configure environment variables:**
   ```env
   JUDGE0_URL=https://judge0-ce.p.rapidapi.com
   JUDGE0_API_KEY=your_api_key_here
   ```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JUDGE0_URL` | Judge0 API endpoint | `http://localhost:2358` | Yes |
| `JUDGE0_API_KEY` | API key for Judge0 Cloud | `null` | No (for self-hosted) |

### Supported Languages

The system currently supports the following languages:

| Language | Judge0 ID | File Extension | Time Limit | Memory Limit |
|----------|-----------|----------------|------------|--------------|
| C++ | 54 | .cpp | 2s | 256MB |
| Java | 62 | .java | 3s | 256MB |
| Python | 71 | .py | 5s | 128MB |
| JavaScript | 63 | .js | 3s | 128MB |
| C | 50 | .c | 2s | 256MB |

## Testing the Integration

### 1. Health Check
```bash
curl -X GET "http://localhost:4000/api/v1/code/health" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Test Submission
```bash
curl -X POST "http://localhost:4000/api/v1/code/test" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Get Available Languages
```bash
curl -X GET "http://localhost:4000/api/v1/code/languages" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### Common Issues

1. **Judge0 service not responding**
   - Check if Judge0 is running: `docker ps`
   - Check logs: `docker-compose logs judge0`
   - Verify port 2358 is accessible

2. **Code execution timeouts**
   - Increase timeout in Judge0 configuration
   - Check system resources (CPU, memory)
   - Verify network connectivity

3. **Language not supported**
   - Check if language ID is correct in `LANGUAGE_CONFIGS`
   - Verify Judge0 supports the language
   - Check Judge0 logs for errors

4. **Memory limit exceeded**
   - Reduce memory limit in language configuration
   - Check Judge0 memory settings
   - Monitor system memory usage

### Debug Commands

```bash
# Check Judge0 status
curl http://localhost:2358/about

# List supported languages
curl http://localhost:2358/languages

# Test simple submission
curl -X POST "http://localhost:2358/submissions/?base64_encoded=false&wait=true" \
  -H "Content-Type: application/json" \
  -d '{
    "language_id": 71,
    "source_code": "print(\"Hello, World!\")",
    "stdin": "",
    "cpu_time_limit": 1,
    "memory_limit": 128000
  }'
```

## Security Considerations

1. **Network Isolation**: Judge0 runs in isolated containers
2. **Resource Limits**: CPU and memory limits are enforced
3. **File System**: Read-only file system in containers
4. **Network Access**: Disabled by default
5. **Code Validation**: Input validation and sanitization

## Performance Optimization

1. **Resource Allocation**: Adjust CPU and memory limits based on usage
2. **Caching**: Consider Redis for caching frequent submissions
3. **Load Balancing**: Use multiple Judge0 instances for high traffic
4. **Monitoring**: Monitor resource usage and response times

## API Endpoints

### Backend Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/code/run` | POST | Run code on sample test cases |
| `/api/v1/code/submit` | POST | Submit code for evaluation |
| `/api/v1/code/health` | GET | Check Judge0 health |
| `/api/v1/code/languages` | GET | Get available languages |
| `/api/v1/code/test` | POST | Test Judge0 submission |
| `/api/v1/code/configuration` | GET | Get Judge0 configuration |

### Frontend Integration

The frontend includes:
- Real-time Judge0 status indicator
- Language selection with supported options
- Error handling and user feedback
- Test submission functionality
- Health monitoring dashboard

## Monitoring and Logs

### Judge0 Logs
```bash
docker-compose logs judge0
```

### Application Logs
Check your application logs for:
- Judge0 API errors
- Code execution results
- Performance metrics
- Error patterns

## Support

For issues with:
- **Judge0 Setup**: Check [Judge0 Documentation](https://judge0.com/docs)
- **Application Integration**: Check application logs and this guide
- **Performance**: Monitor resource usage and adjust limits

## Updates

To update Judge0:
```bash
cd judge0
git pull
docker-compose down
docker-compose up -d
```