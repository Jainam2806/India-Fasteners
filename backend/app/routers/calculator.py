"""
Calculator API routes
"""
from fastapi import APIRouter, HTTPException
from typing import Optional
from ..models.schemas import (
    WeightCalculationRequest,
    PiecesCalculationRequest,
    CalculationResult,
    FastenerTypeListResponse,
    MaterialListResponse,
    DimensionResponse
)
from ..services.data_loader import get_data_loader
from ..services.calculator import get_weight_calculator

router = APIRouter(prefix="/api", tags=["Calculator"])


@router.get("/fastener-types", response_model=FastenerTypeListResponse)
async def get_fastener_types():
    """Get all available fastener types"""
    data_loader = get_data_loader()
    types = data_loader.get_fastener_types()
    return {"fastener_types": types}


@router.get("/fastener-types/{type_id}")
async def get_fastener_type(type_id: str):
    """Get specific fastener type by ID"""
    data_loader = get_data_loader()
    fastener_type = data_loader.get_fastener_type_by_id(type_id)
    if not fastener_type:
        raise HTTPException(status_code=404, detail=f"Fastener type not found: {type_id}")
    return fastener_type


@router.get("/materials", response_model=MaterialListResponse)
async def get_materials():
    """Get all available materials with density information"""
    data_loader = get_data_loader()
    materials = data_loader.get_materials()
    return {"materials": materials}


@router.get("/materials/{material_id}")
async def get_material(material_id: str):
    """Get specific material by ID"""
    data_loader = get_data_loader()
    material = data_loader.get_material_by_id(material_id)
    if not material:
        raise HTTPException(status_code=404, detail=f"Material not found: {material_id}")
    return material


@router.get("/dimensions/{fastener_type}")
async def get_dimensions(fastener_type: str):
    """Get standard dimensions for a fastener type"""
    data_loader = get_data_loader()
    dimensions = data_loader.get_dimensions(fastener_type)
    if not dimensions:
        raise HTTPException(
            status_code=404, 
            detail=f"Dimensions not found for: {fastener_type}"
        )
    standards = data_loader.get_standards(fastener_type)
    return {
        "fastener_type": fastener_type,
        "standards": standards,
        "dimensions": dimensions
    }


@router.get("/diameters/{fastener_type}")
async def get_available_diameters(fastener_type: str):
    """Get list of available diameters for a fastener type"""
    data_loader = get_data_loader()
    
    # Map fastener types to their base dimension types
    type_mapping = {
        # Bolts - use hex_bolt dimensions
        "hex_bolt_full_thread": "hex_bolt",
        "carriage_bolt": "hex_bolt",
        "stud_bolt": "hex_bolt",
        "flange_bolt": "hex_bolt",
        "eye_bolt": "hex_bolt",
        "anchor_bolt": "hex_bolt",
        # Nuts - use hex_nut dimensions
        "lock_nut": "hex_nut",
        "flange_nut": "hex_nut",
        "wing_nut": "hex_nut",
        "castle_nut": "hex_nut",
        "thin_hex_nut": "hex_nut",
        # Washers - use plain_washer dimensions
        "heavy_duty_washer": "plain_washer",
        # Screws - use socket_head_cap_screw dimensions
        "machine_screw": "socket_head_cap_screw",
        "self_tapping_screw": "socket_head_cap_screw",
        "wood_screw": "socket_head_cap_screw",
        "set_screw": "socket_head_cap_screw",
    }
    
    base_type = type_mapping.get(fastener_type, fastener_type)
    diameters = data_loader.get_all_diameters(base_type)
    return {"fastener_type": fastener_type, "diameters": diameters}


@router.post("/calculate/weight")
async def calculate_weight(request: WeightCalculationRequest):
    """
    Calculate total weight from number of pieces
    
    Parameters:
    - fastener_type_id: Type of fastener (hex_bolt, hex_nut, etc.)
    - material_id: Material type (mild_steel, stainless_steel_304, etc.)
    - diameter: Metric diameter (M6, M8, M10, etc.)
    - length: Length in mm (required for bolts/screws)
    - quantity: Number of pieces
    
    Returns:
    - unit_weight_grams: Weight per piece
    - total_weight_kg: Total weight in kg
    - pieces_per_50kg: How many pieces in 50 kg
    """
    calculator = get_weight_calculator()
    
    try:
        result = calculator.calculate_weight(
            fastener_type_id=request.fastener_type_id,
            material_id=request.material_id,
            diameter=request.diameter,
            length=request.length,
            quantity=request.quantity
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/calculate/pieces")
async def calculate_pieces(request: PiecesCalculationRequest):
    """
    Calculate number of pieces from weight
    
    Parameters:
    - fastener_type_id: Type of fastener
    - material_id: Material type
    - diameter: Metric diameter
    - length: Length in mm (required for bolts/screws)
    - weight: Weight in kg
    
    Returns:
    - total_pieces: Number of pieces
    - unit_weight_grams: Weight per piece
    - pieces_per_50kg: How many pieces in 50 kg
    """
    calculator = get_weight_calculator()
    
    try:
        result = calculator.calculate_pieces_from_weight(
            fastener_type_id=request.fastener_type_id,
            material_id=request.material_id,
            diameter=request.diameter,
            length=request.length,
            weight_kg=request.weight
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/diagram/{fastener_type}/{diameter}")
async def get_diagram_data(fastener_type: str, diameter: str):
    """
    Get dimension data for rendering a fastener diagram
    """
    data_loader = get_data_loader()
    
    fastener = data_loader.get_fastener_type_by_id(fastener_type)
    if not fastener:
        raise HTTPException(status_code=404, detail=f"Fastener type not found: {fastener_type}")
    
    dim = data_loader.get_dimension_for_diameter(fastener_type, diameter)
    if not dim:
        # Try to find dimensions under a related type
        # Many fastener types share the same base dimensions
        parent_types = {
            # Bolts - use hex_bolt dimensions
            "hex_bolt_full_thread": "hex_bolt",
            "carriage_bolt": "hex_bolt",
            "stud_bolt": "hex_bolt",
            "flange_bolt": "hex_bolt",
            "eye_bolt": "hex_bolt",
            "anchor_bolt": "hex_bolt",
            # Nuts - use hex_nut dimensions
            "lock_nut": "hex_nut",
            "flange_nut": "hex_nut",
            "wing_nut": "hex_nut",
            "castle_nut": "hex_nut",
            "thin_hex_nut": "hex_nut",
            # Washers - use plain_washer dimensions
            "heavy_duty_washer": "plain_washer",
            # Screws - use socket_head_cap_screw dimensions
            "machine_screw": "socket_head_cap_screw",
            "self_tapping_screw": "socket_head_cap_screw",
            "wood_screw": "socket_head_cap_screw",
            "set_screw": "socket_head_cap_screw",
        }
        parent = parent_types.get(fastener_type)
        if parent:
            dim = data_loader.get_dimension_for_diameter(parent, diameter)
    
    if not dim:
        raise HTTPException(
            status_code=404, 
            detail=f"Dimensions not found for {diameter}"
        )
    
    # Generate labels for diagram
    labels = []
    if "head_across_flats" in dim:
        labels.append({"key": "s", "name": "Across Flats", "value": dim["head_across_flats"], "unit": "mm"})
    if "head_height" in dim:
        labels.append({"key": "k", "name": "Head Height", "value": dim["head_height"], "unit": "mm"})
    if "across_flats" in dim:
        labels.append({"key": "s", "name": "Across Flats", "value": dim["across_flats"], "unit": "mm"})
    if "height" in dim:
        labels.append({"key": "m", "name": "Height", "value": dim["height"], "unit": "mm"})
    if "outer_diameter" in dim:
        labels.append({"key": "d2", "name": "Outer Diameter", "value": dim["outer_diameter"], "unit": "mm"})
    if "inner_diameter" in dim:
        labels.append({"key": "d1", "name": "Inner Diameter", "value": dim["inner_diameter"], "unit": "mm"})
    if "thickness" in dim:
        labels.append({"key": "h", "name": "Thickness", "value": dim["thickness"], "unit": "mm"})
    if "head_diameter" in dim:
        labels.append({"key": "dk", "name": "Head Diameter", "value": dim["head_diameter"], "unit": "mm"})
    
    labels.append({"key": "d", "name": "Thread Diameter", "value": diameter, "unit": ""})
    labels.append({"key": "P", "name": "Pitch", "value": dim.get("pitch", ""), "unit": "mm"})
    
    return {
        "fastener_type_id": fastener_type,
        "fastener_type_name": fastener["name"],
        "diameter": diameter,
        "dimensions": dim,
        "labels": labels
    }
