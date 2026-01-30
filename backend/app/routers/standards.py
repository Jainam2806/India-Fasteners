"""
Standards API routes
"""
from fastapi import APIRouter, HTTPException
from ..services.data_loader import get_data_loader

router = APIRouter(prefix="/api", tags=["Standards"])


@router.get("/standards")
async def get_all_standards():
    """Get all fastener standards (DIN, ISO, IS)"""
    data_loader = get_data_loader()
    standards = data_loader.get_standards()
    
    # Format response
    formatted = []
    for fastener_type, std_data in standards.items():
        for std_type, codes in std_data.items():
            for code in codes:
                formatted.append({
                    "code": code,
                    "type": std_type.upper(),
                    "fastener_type": fastener_type,
                    "description": get_standard_description(code)
                })
    
    return {"standards": formatted}


@router.get("/standards/{fastener_type}")
async def get_standards_for_fastener(fastener_type: str):
    """Get standards applicable to a specific fastener type"""
    data_loader = get_data_loader()
    standards = data_loader.get_standards(fastener_type)
    
    if not standards:
        raise HTTPException(
            status_code=404,
            detail=f"No standards found for: {fastener_type}"
        )
    
    return {
        "fastener_type": fastener_type,
        "standards": standards
    }


@router.get("/standards/info/{code}")
async def get_standard_info(code: str):
    """Get detailed information about a specific standard"""
    info = get_standard_description(code, detailed=True)
    if info:
        return info
    
    raise HTTPException(
        status_code=404,
        detail=f"Standard not found: {code}"
    )


def get_standard_description(code: str, detailed: bool = False) -> dict | str:
    """Get description for a standard code"""
    standards_info = {
        # DIN Standards
        "DIN 931": {
            "code": "DIN 931",
            "name": "Hexagon Head Bolts - Partially Threaded",
            "type": "DIN",
            "description": "Hexagonal head bolts with partial threading, thread to head",
            "equivalent_iso": "ISO 4014",
            "material_grades": ["4.6", "4.8", "5.6", "5.8", "8.8", "10.9", "12.9"],
            "size_range": "M1.6 to M64"
        },
        "DIN 933": {
            "code": "DIN 933",
            "name": "Hexagon Head Bolts - Fully Threaded",
            "type": "DIN",
            "description": "Hexagonal head bolts with full threading along entire shank",
            "equivalent_iso": "ISO 4017",
            "material_grades": ["4.6", "4.8", "5.6", "5.8", "8.8", "10.9", "12.9"],
            "size_range": "M1.6 to M64"
        },
        "DIN 912": {
            "code": "DIN 912",
            "name": "Socket Head Cap Screws",
            "type": "DIN",
            "description": "Cylindrical head with internal hexagon (Allen) drive",
            "equivalent_iso": "ISO 4762",
            "material_grades": ["8.8", "10.9", "12.9"],
            "size_range": "M1.6 to M64"
        },
        "DIN 934": {
            "code": "DIN 934",
            "name": "Hexagon Nuts",
            "type": "DIN",
            "description": "Standard hexagonal nuts, style 1",
            "equivalent_iso": "ISO 4032",
            "material_grades": ["4", "5", "6", "8", "10", "12"],
            "size_range": "M1.6 to M64"
        },
        "DIN 125": {
            "code": "DIN 125",
            "name": "Plain Washers",
            "type": "DIN",
            "description": "Plain washers, Form A (without chamfer) and Form B (with chamfer)",
            "equivalent_iso": "ISO 7089, ISO 7090",
            "size_range": "M1.6 to M64"
        },
        "DIN 127": {
            "code": "DIN 127",
            "name": "Spring Lock Washers",
            "type": "DIN",
            "description": "Spring lock washers with square ends",
            "size_range": "M2 to M48"
        },
        "DIN 9021": {
            "code": "DIN 9021",
            "name": "Plain Washers - Large Series",
            "type": "DIN",
            "description": "Plain washers with larger outer diameter",
            "equivalent_iso": "ISO 7093",
            "size_range": "M3 to M36"
        },
        # ISO Standards
        "ISO 4014": {
            "code": "ISO 4014",
            "name": "Hexagon Head Bolts - Product Grades A and B",
            "type": "ISO",
            "description": "Partially threaded hexagon head bolts",
            "equivalent_din": "DIN 931",
            "size_range": "M1.6 to M64"
        },
        "ISO 4017": {
            "code": "ISO 4017",
            "name": "Hexagon Head Screws - Product Grades A and B",
            "type": "ISO",
            "description": "Fully threaded hexagon head screws",
            "equivalent_din": "DIN 933",
            "size_range": "M1.6 to M64"
        },
        "ISO 4762": {
            "code": "ISO 4762",
            "name": "Socket Head Cap Screws",
            "type": "ISO",
            "description": "Hexagon socket head cap screws",
            "equivalent_din": "DIN 912",
            "size_range": "M1.6 to M64"
        },
        "ISO 4032": {
            "code": "ISO 4032",
            "name": "Hexagon Nuts - Style 1",
            "type": "ISO",
            "description": "Hexagon nuts, style 1, product grades A and B",
            "equivalent_din": "DIN 934",
            "size_range": "M1.6 to M64"
        },
        "ISO 7089": {
            "code": "ISO 7089",
            "name": "Plain Washers - Normal Series",
            "type": "ISO",
            "description": "Plain washers, normal series, product grade A",
            "equivalent_din": "DIN 125 Form A",
            "size_range": "M1.6 to M64"
        },
        "ISO 7093": {
            "code": "ISO 7093",
            "name": "Plain Washers - Large Series",
            "type": "ISO",
            "description": "Plain washers, large series, product grade A",
            "equivalent_din": "DIN 9021",
            "size_range": "M3 to M36"
        },
        # Indian Standards (IS)
        "IS 1363-1": {
            "code": "IS 1363-1",
            "name": "Hexagon Head Bolts",
            "type": "IS",
            "description": "Hexagon head bolts, screws and nuts of product grade C - Part 1: Hexagon head bolts",
            "size_range": "M5 to M64"
        },
        "IS 1363-3": {
            "code": "IS 1363-3",
            "name": "Hexagon Nuts",
            "type": "IS",
            "description": "Hexagon head bolts, screws and nuts of product grade C - Part 3: Hexagon nuts",
            "size_range": "M5 to M64"
        },
        "IS 1364-1": {
            "code": "IS 1364-1",
            "name": "Hexagon Head Bolts - Product Grades A and B",
            "type": "IS",
            "description": "Hexagon head bolts, screws and nuts of product grades A and B - Part 1: Hexagon head bolts",
            "size_range": "M1.6 to M64"
        },
        "IS 1364-3": {
            "code": "IS 1364-3",
            "name": "Hexagon Nuts - Style 1",
            "type": "IS",
            "description": "Style 1 hexagon nuts of product grades A and B",
            "size_range": "M1.6 to M64"
        },
        "IS 2016": {
            "code": "IS 2016",
            "name": "Plain Washers",
            "type": "IS",
            "description": "Plain washers for metric fasteners",
            "size_range": "M1.6 to M64"
        },
        "IS 2269": {
            "code": "IS 2269",
            "name": "Socket Head Cap Screws",
            "type": "IS",
            "description": "Hexagon socket head cap screws",
            "size_range": "M1.6 to M64"
        },
        "IS 6735": {
            "code": "IS 6735",
            "name": "Spring Lock Washers",
            "type": "IS",
            "description": "Spring lock washers for screws with cylindrical heads",
            "size_range": "M2 to M48"
        }
    }
    
    info = standards_info.get(code)
    
    if detailed:
        return info
    
    if info:
        return info.get("description", code)
    
    return code
