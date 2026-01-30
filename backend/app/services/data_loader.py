"""
Data loader service for loading JSON data files
"""
import json
import os
from pathlib import Path
from typing import Dict, List, Any, Optional
from functools import lru_cache


class DataLoader:
    """Service for loading and caching JSON data files"""
    
    def __init__(self):
        self.data_dir = Path(__file__).parent.parent / "data"
        self._cache: Dict[str, Any] = {}
    
    def _load_json(self, filename: str) -> Any:
        """Load JSON file from data directory"""
        if filename in self._cache:
            return self._cache[filename]
        
        filepath = self.data_dir / filename
        if not filepath.exists():
            raise FileNotFoundError(f"Data file not found: {filename}")
        
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            self._cache[filename] = data
            return data
    
    def get_fastener_types(self) -> List[Dict]:
        """Get all fastener types"""
        data = self._load_json("fastener_types.json")
        return data.get("fastener_types", [])
    
    def get_fastener_type_by_id(self, type_id: str) -> Optional[Dict]:
        """Get fastener type by ID"""
        types = self.get_fastener_types()
        for ft in types:
            if ft["id"] == type_id:
                return ft
        return None
    
    def get_materials(self) -> List[Dict]:
        """Get all materials"""
        data = self._load_json("materials.json")
        return data.get("materials", [])
    
    def get_material_by_id(self, material_id: str) -> Optional[Dict]:
        """Get material by ID"""
        materials = self.get_materials()
        for mat in materials:
            if mat["id"] == material_id:
                return mat
        return None
    
    def get_dimensions(self, fastener_type: str) -> List[Dict]:
        """Get dimensions for a fastener type"""
        data = self._load_json("dimensions.json")
        dimensions = data.get("dimensions", {})
        return dimensions.get(fastener_type, [])
    
    def get_dimension_for_diameter(self, fastener_type: str, diameter: str) -> Optional[Dict]:
        """Get dimension data for a specific diameter"""
        dimensions = self.get_dimensions(fastener_type)
        for dim in dimensions:
            if dim["diameter"] == diameter:
                return dim
        return None
    
    def get_standards(self, fastener_type: str = None) -> Dict:
        """Get standards information"""
        data = self._load_json("dimensions.json")
        standards = data.get("standards", {})
        if fastener_type:
            return standards.get(fastener_type, {})
        return standards
    
    def get_hsn_codes(self) -> List[Dict]:
        """Get all HSN codes"""
        data = self._load_json("hsn_codes.json")
        return data.get("hsn_codes", [])
    
    def search_hsn_codes(self, query: str) -> List[Dict]:
        """Search HSN codes by code or description"""
        hsn_codes = self.get_hsn_codes()
        query_lower = query.lower()
        results = []
        for hsn in hsn_codes:
            if (query_lower in hsn["code"].lower() or 
                query_lower in hsn["description"].lower()):
                results.append(hsn)
        return results
    
    def get_gst_info(self) -> Dict:
        """Get GST rate information"""
        data = self._load_json("hsn_codes.json")
        return data.get("gst_info", {})
    
    def get_all_diameters(self, fastener_type: str = "hex_bolt") -> List[str]:
        """Get list of all available diameters for a fastener type"""
        dimensions = self.get_dimensions(fastener_type)
        return [dim["diameter"] for dim in dimensions]


# Singleton instance
data_loader = DataLoader()


@lru_cache(maxsize=1)
def get_data_loader() -> DataLoader:
    """Get singleton data loader instance"""
    return data_loader
