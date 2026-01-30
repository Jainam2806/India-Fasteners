"""
Pydantic models for request/response schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class FastenerCategory(str, Enum):
    BOLT = "bolt"
    NUT = "nut"
    WASHER = "washer"
    SCREW = "screw"


class CalculationMode(str, Enum):
    WEIGHT_TO_PIECES = "weight_to_pieces"
    PIECES_TO_WEIGHT = "pieces_to_weight"


class FastenerType(BaseModel):
    """Fastener type definition"""
    id: str
    name: str
    category: FastenerCategory
    description: str
    has_length: bool = True
    has_thread_length: bool = False
    diagram_available: bool = True


class Material(BaseModel):
    """Material with density information"""
    id: str
    name: str
    density: float = Field(..., description="Density in g/cm³")
    grade: Optional[str] = None


class Dimension(BaseModel):
    """Standard dimension for a fastener"""
    diameter: str  # e.g., "M6", "M8"
    pitch: float  # Thread pitch in mm
    head_across_flats: Optional[float] = None  # 's' dimension
    head_height: Optional[float] = None  # 'k' dimension
    thread_length: Optional[float] = None
    washer_od: Optional[float] = None  # Outer diameter for washers
    washer_thickness: Optional[float] = None


class HSNCode(BaseModel):
    """HSN Code with GST information"""
    code: str
    description: str
    gst_rate: float
    material_type: Optional[str] = None


class Standard(BaseModel):
    """Fastener standard reference"""
    code: str
    name: str
    type: str  # "DIN", "ISO", "IS"
    description: str
    applicable_to: List[str]


# Request models
class WeightCalculationRequest(BaseModel):
    """Request for weight calculation"""
    fastener_type_id: str
    material_id: str
    diameter: str  # e.g., "M6", "M8", "M10"
    length: Optional[float] = Field(None, description="Length in mm")
    quantity: int = Field(..., gt=0, description="Number of pieces")


class PiecesCalculationRequest(BaseModel):
    """Request for pieces calculation from weight"""
    fastener_type_id: str
    material_id: str
    diameter: str
    length: Optional[float] = Field(None, description="Length in mm")
    weight: float = Field(..., gt=0, description="Weight in kg")


# Response models
class CalculationResult(BaseModel):
    """Result of weight/pieces calculation"""
    fastener_type: str
    material: str
    diameter: str
    length: Optional[float]
    unit_weight: float = Field(..., description="Weight per piece in grams")
    total_weight: Optional[float] = Field(None, description="Total weight in kg")
    total_pieces: Optional[int] = Field(None, description="Number of pieces")
    pieces_per_50kg: int = Field(..., description="Pieces per 50 kg")


class FastenerTypeListResponse(BaseModel):
    """List of fastener types"""
    fastener_types: List[FastenerType]


class MaterialListResponse(BaseModel):
    """List of materials"""
    materials: List[Material]


class HSNCodeListResponse(BaseModel):
    """List of HSN codes"""
    hsn_codes: List[HSNCode]


class StandardListResponse(BaseModel):
    """List of standards"""
    standards: List[Standard]


class DimensionResponse(BaseModel):
    """Dimension data for a fastener type"""
    fastener_type: str
    standard: str
    dimensions: List[Dimension]


class DiagramData(BaseModel):
    """Data for rendering a fastener diagram"""
    fastener_type_id: str
    fastener_type_name: str
    diameter: str
    dimensions: dict
    labels: List[dict]
