# India Fasteners Web Application

A comprehensive web application for the Indian fastener industry, featuring weight calculations, dimension diagrams, HSN/GST codes, and standards reference.

![India Fasteners](https://img.shields.io/badge/India-Fasteners-FF6B35?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjZCMzUiLz48L3N2Zz4=)

## Features

### 🧮 Weight Calculator
- Calculate weight from number of pieces
- Calculate pieces from weight (reverse calculation)
- Support for 20+ fastener types
- 10+ material options with accurate density values
- Real-time calculations with instant results

### 📐 Fastener Diagrams
- Interactive SVG diagrams with dimension labels
- Support for bolts, nuts, and washers
- DIN/ISO/IS standard dimensions
- Configurable diameter selection

### 📋 HSN Codes & GST
- Comprehensive HSN code database for fasteners
- Search by code or description
- GST rate information (18% standard rate)
- Material category breakdown

### 📚 Standards Reference
- DIN (German Standards)
- ISO (International Standards)
- IS (Indian Standards)
- Standards equivalence table

## Tech Stack

### Backend
- **Python 3.11+**
- **FastAPI** - Modern, fast web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

### DevOps
- **Docker & Docker Compose** - Containerization
- **Nginx** - Production web server

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose (optional)

### Development Setup

1. **Clone the repository**
```bash
cd nut_bolt_app
```

2. **Start the Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

3. **Start the Frontend** (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

## API Endpoints

### Calculator
- `GET /api/fastener-types` - List all fastener types
- `GET /api/materials` - List all materials
- `POST /api/calculate/weight` - Calculate weight from pieces
- `POST /api/calculate/pieces` - Calculate pieces from weight
- `GET /api/diagram/{type}/{diameter}` - Get diagram data

### HSN & GST
- `GET /api/hsn-codes` - List all HSN codes
- `GET /api/hsn-codes/search?q={query}` - Search HSN codes
- `GET /api/gst-rates` - Get GST rate information

### Standards
- `GET /api/standards` - List all standards
- `GET /api/standards/{fastener_type}` - Get standards for specific fastener
- `GET /api/standards/info/{code}` - Get detailed standard info

## Project Structure

```
nut_bolt_app/
├── backend/
│   ├── app/
│   │   ├── data/           # JSON data files
│   │   ├── models/         # Pydantic schemas
│   │   ├── routers/        # API routes
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI app
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   └── styles/         # CSS files
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Supported Fastener Types

### Bolts
- Hex Bolt (Partial Thread)
- Hex Bolt (Full Thread)
- Socket Head Cap Screw
- Carriage Bolt
- Flange Bolt
- Stud Bolt
- Eye Bolt

### Nuts
- Hex Nut
- Lock Nut (Nylon Insert)
- Flange Nut
- Wing Nut
- Castle Nut
- Thin Hex Nut

### Washers
- Plain Washer
- Spring Washer
- Heavy Duty Washer

### Screws
- Machine Screw
- Self-Tapping Screw
- Wood Screw
- Set Screw

## Materials

| Material | Density (g/cm³) |
|----------|-----------------|
| Mild Steel (MS) | 7.85 |
| High Tensile 8.8 | 7.85 |
| High Tensile 10.9 | 7.85 |
| High Tensile 12.9 | 7.85 |
| Stainless Steel 304 | 8.00 |
| Stainless Steel 316 | 8.00 |
| Brass | 8.50 |
| Aluminium | 2.70 |
| Galvanized Steel | 7.85 |
| Zinc Plated Steel | 7.85 |

## License

MIT License - feel free to use this project for learning and commercial purposes.

## Disclaimer

Weight calculations are approximate and based on standard DIN/ISO dimensions. Actual weights may vary ±5% based on manufacturing tolerances. Always verify with official specifications for critical applications.

---

Made with ❤️ for the Indian Fastener Industry
