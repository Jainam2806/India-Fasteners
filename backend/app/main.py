"""
India Fasteners - FastAPI Backend Application

A web API for fastener weight calculations, HSN codes, and standards reference.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import calculator, hsn, standards

# Create FastAPI app
app = FastAPI(
    title="India Fasteners API",
    description="""
## India Fasteners Web Application API

A comprehensive API for fastener weight calculations, GST/HSN codes, and standards reference.

### Features:
- **Weight Calculator**: Calculate weight of fasteners or pieces count from weight
- **HSN Codes**: Search and reference HSN codes with GST rates
- **Standards**: DIN, ISO, and IS (Indian Standards) reference
- **Diagrams**: Dimension data for fastener diagrams

### Supported Fastener Types:
- Bolts: Hex Bolt, Socket Head Cap Screw, Carriage Bolt, Stud Bolt, Flange Bolt, etc.
- Nuts: Hex Nut, Lock Nut, Flange Nut, Wing Nut, Castle Nut, etc.
- Washers: Plain Washer, Spring Washer, Heavy Duty Washer
- Screws: Machine Screw, Self-Tapping Screw, Wood Screw, Set Screw

### Materials:
- Mild Steel (MS)
- High Tensile Steel (8.8, 10.9, 12.9)
- Stainless Steel (304, 316)
- Brass, Aluminium
    """,
    version="1.0.0",
    contact={
        "name": "India Fasteners",
        "url": "https://www.indiafasteners.com",
        "email": "support@indiafasteners.com"
    },
    license_info={
        "name": "MIT License"
    }
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    # Production URLs
    "https://india-fasteners-web.onrender.com",
    "https://india-fasteners-api.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(calculator.router)
app.include_router(hsn.router)
app.include_router(standards.router)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - API information"""
    return {
        "name": "India Fasteners API",
        "version": "1.0.0",
        "description": "Fastener weight calculations, HSN codes, and standards reference",
        "documentation": "/docs",
        "endpoints": {
            "fastener_types": "/api/fastener-types",
            "materials": "/api/materials",
            "calculate_weight": "/api/calculate/weight",
            "calculate_pieces": "/api/calculate/pieces",
            "hsn_codes": "/api/hsn-codes",
            "gst_rates": "/api/gst-rates",
            "standards": "/api/standards"
        }
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "india-fasteners-api"}
