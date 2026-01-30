"""
HSN Codes and GST API routes
"""
from fastapi import APIRouter, Query
from typing import Optional
from ..models.schemas import HSNCodeListResponse
from ..services.data_loader import get_data_loader

router = APIRouter(prefix="/api", tags=["HSN & GST"])


@router.get("/hsn-codes", response_model=HSNCodeListResponse)
async def get_hsn_codes():
    """Get all HSN codes for fasteners"""
    data_loader = get_data_loader()
    codes = data_loader.get_hsn_codes()
    return {"hsn_codes": codes}


@router.get("/hsn-codes/search")
async def search_hsn_codes(
    q: str = Query(..., min_length=1, description="Search query")
):
    """
    Search HSN codes by code number or description
    
    Examples:
    - Search by code: /api/hsn-codes/search?q=7318
    - Search by keyword: /api/hsn-codes/search?q=bolt
    """
    data_loader = get_data_loader()
    results = data_loader.search_hsn_codes(q)
    return {"query": q, "results": results, "count": len(results)}


@router.get("/hsn-codes/{code}")
async def get_hsn_code(code: str):
    """Get specific HSN code details"""
    data_loader = get_data_loader()
    hsn_codes = data_loader.get_hsn_codes()
    
    for hsn in hsn_codes:
        if hsn["code"] == code:
            return hsn
    
    return {"error": "HSN code not found", "code": code}


@router.get("/gst-rates")
async def get_gst_rates():
    """Get GST rate information for fasteners"""
    data_loader = get_data_loader()
    gst_info = data_loader.get_gst_info()
    return gst_info


@router.get("/gst-rates/{material_type}")
async def get_gst_rate_by_material(material_type: str):
    """
    Get GST rate for specific material type
    
    Material types: iron_steel, copper_brass, aluminium, stainless_steel
    """
    data_loader = get_data_loader()
    gst_info = data_loader.get_gst_info()
    categories = gst_info.get("categories", {})
    
    if material_type in categories:
        return categories[material_type]
    
    return {
        "error": "Material type not found",
        "material_type": material_type,
        "available_types": list(categories.keys())
    }
