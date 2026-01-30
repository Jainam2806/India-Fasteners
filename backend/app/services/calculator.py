"""
Weight calculation service for fasteners
"""
import math
from typing import Dict, Optional, Tuple
from .data_loader import get_data_loader


class WeightCalculator:
    """Service for calculating fastener weights"""
    
    def __init__(self):
        self.data_loader = get_data_loader()
    
    def _get_nominal_diameter(self, diameter_str: str) -> float:
        """Extract numeric diameter from string like 'M6', 'M10'"""
        if diameter_str.startswith('M') or diameter_str.startswith('m'):
            return float(diameter_str[1:])
        return float(diameter_str)
    
    def calculate_hex_bolt_weight(
        self, 
        diameter: str, 
        length: float, 
        density: float
    ) -> float:
        """
        Calculate weight of a hex bolt in grams
        
        Formula:
        Weight = (Shank Volume + Head Volume) × Density
        
        Shank Volume = π/4 × d² × L
        Head Volume ≈ 0.866 × s² × k (for regular hexagon)
        
        Where:
        - d = nominal diameter
        - L = total length
        - s = across flats
        - k = head height
        """
        dim = self.data_loader.get_dimension_for_diameter("hex_bolt", diameter)
        if not dim:
            # Fallback calculation if dimension not found
            d = self._get_nominal_diameter(diameter)
            s = d * 1.5  # Approximate across flats
            k = d * 0.7  # Approximate head height
        else:
            d = self._get_nominal_diameter(diameter)
            s = dim.get("head_across_flats", d * 1.5)
            k = dim.get("head_height", d * 0.7)
        
        # Shank volume (cylinder)
        shank_volume = (math.pi / 4) * (d ** 2) * length  # in mm³
        
        # Hex head volume (approximation for regular hexagon prism)
        # Area of hexagon = (3√3/2) × (s/2)² ≈ 0.866 × s²
        # But 's' in DIN is "across flats", so area = 0.866 × s²
        head_volume = 0.866 * (s ** 2) * k  # in mm³
        
        # Total volume in cm³ (1 cm³ = 1000 mm³)
        total_volume_cm3 = (shank_volume + head_volume) / 1000
        
        # Weight in grams
        weight_grams = total_volume_cm3 * density
        
        return weight_grams
    
    def calculate_hex_bolt_full_thread_weight(
        self,
        diameter: str,
        length: float,
        density: float
    ) -> float:
        """Calculate weight of fully threaded hex bolt"""
        # Same as partial thread hex bolt for weight purposes
        return self.calculate_hex_bolt_weight(diameter, length, density)
    
    def calculate_socket_head_cap_screw_weight(
        self,
        diameter: str,
        length: float,
        density: float
    ) -> float:
        """
        Calculate weight of socket head cap screw in grams
        
        Head is cylindrical, not hexagonal
        """
        dim = self.data_loader.get_dimension_for_diameter("socket_head_cap_screw", diameter)
        if not dim:
            d = self._get_nominal_diameter(diameter)
            head_d = d * 1.5
            head_h = d
        else:
            d = self._get_nominal_diameter(diameter)
            head_d = dim.get("head_diameter", d * 1.5)
            head_h = dim.get("head_height", d)
        
        # Shank volume
        shank_volume = (math.pi / 4) * (d ** 2) * length
        
        # Cylindrical head volume
        head_volume = (math.pi / 4) * (head_d ** 2) * head_h
        
        # Subtract socket cavity (approximate as cylinder, ~60% head diameter, 80% head height)
        socket_volume = (math.pi / 4) * ((head_d * 0.6) ** 2) * (head_h * 0.8)
        
        total_volume_cm3 = (shank_volume + head_volume - socket_volume) / 1000
        
        return total_volume_cm3 * density
    
    def calculate_stud_bolt_weight(
        self,
        diameter: str,
        length: float,
        density: float
    ) -> float:
        """Calculate weight of stud bolt (threaded rod)"""
        d = self._get_nominal_diameter(diameter)
        
        # Simple cylinder
        volume_mm3 = (math.pi / 4) * (d ** 2) * length
        volume_cm3 = volume_mm3 / 1000
        
        return volume_cm3 * density
    
    def calculate_carriage_bolt_weight(
        self,
        diameter: str,
        length: float,
        density: float
    ) -> float:
        """
        Calculate weight of carriage bolt
        Has dome head + square neck
        """
        d = self._get_nominal_diameter(diameter)
        
        # Approximate dome head as hemisphere
        head_radius = d * 1.2
        dome_volume = (2/3) * math.pi * (head_radius ** 3)
        
        # Square neck (cube section under head)
        neck_height = d * 0.5
        neck_side = d * 1.1
        neck_volume = (neck_side ** 2) * neck_height
        
        # Shank
        shank_length = length - neck_height
        shank_volume = (math.pi / 4) * (d ** 2) * max(shank_length, 0)
        
        total_volume_cm3 = (dome_volume + neck_volume + shank_volume) / 1000
        
        return total_volume_cm3 * density
    
    def calculate_eye_bolt_weight(
        self,
        diameter: str,
        length: float,
        density: float
    ) -> float:
        """Calculate weight of eye bolt"""
        d = self._get_nominal_diameter(diameter)
        
        # Shank
        shank_volume = (math.pi / 4) * (d ** 2) * length
        
        # Eye (torus approximation)
        eye_outer_d = d * 3
        eye_wire_d = d
        eye_volume = (math.pi ** 2 / 4) * (eye_wire_d ** 2) * eye_outer_d
        
        total_volume_cm3 = (shank_volume + eye_volume) / 1000
        
        return total_volume_cm3 * density
    
    def calculate_flange_bolt_weight(
        self,
        diameter: str,
        length: float,
        density: float
    ) -> float:
        """Calculate weight of flange bolt"""
        base_weight = self.calculate_hex_bolt_weight(diameter, length, density)
        
        d = self._get_nominal_diameter(diameter)
        
        # Add flange volume
        flange_od = d * 2.5
        flange_thickness = d * 0.15
        flange_volume = (math.pi / 4) * ((flange_od ** 2) - ((d * 1.5) ** 2)) * flange_thickness
        flange_weight = (flange_volume / 1000) * density
        
        return base_weight + flange_weight
    
    def calculate_anchor_bolt_weight(
        self,
        diameter: str,
        length: float,
        density: float
    ) -> float:
        """Calculate weight of anchor/foundation bolt (L-shaped or J-shaped)"""
        d = self._get_nominal_diameter(diameter)
        
        # Treat as bent rod - length is total length including bend
        volume_mm3 = (math.pi / 4) * (d ** 2) * length
        volume_cm3 = volume_mm3 / 1000
        
        return volume_cm3 * density
    
    def calculate_hex_nut_weight(
        self,
        diameter: str,
        density: float
    ) -> float:
        """
        Calculate weight of hex nut in grams
        
        Volume = Hex prism - Threaded hole
        """
        dim = self.data_loader.get_dimension_for_diameter("hex_nut", diameter)
        if not dim:
            d = self._get_nominal_diameter(diameter)
            s = d * 1.5
            h = d * 0.8
        else:
            d = self._get_nominal_diameter(diameter)
            s = dim.get("across_flats", d * 1.5)
            h = dim.get("height", d * 0.8)
        
        # Hex outer volume
        hex_volume = 0.866 * (s ** 2) * h
        
        # Threaded hole volume (cylinder)
        hole_volume = (math.pi / 4) * (d ** 2) * h
        
        total_volume_cm3 = (hex_volume - hole_volume) / 1000
        
        return total_volume_cm3 * density
    
    def calculate_lock_nut_weight(
        self,
        diameter: str,
        density: float
    ) -> float:
        """Calculate weight of lock nut (slightly heavier due to nylon insert)"""
        base_weight = self.calculate_hex_nut_weight(diameter, density)
        # Add ~10% for nylon insert
        return base_weight * 1.1
    
    def calculate_flange_nut_weight(
        self,
        diameter: str,
        density: float
    ) -> float:
        """Calculate weight of flange nut"""
        base_weight = self.calculate_hex_nut_weight(diameter, density)
        
        d = self._get_nominal_diameter(diameter)
        
        # Add flange
        flange_od = d * 2.2
        flange_thickness = d * 0.15
        flange_volume = (math.pi / 4) * ((flange_od ** 2) - ((d * 1.5) ** 2)) * flange_thickness
        flange_weight = (flange_volume / 1000) * density
        
        return base_weight + flange_weight
    
    def calculate_wing_nut_weight(
        self,
        diameter: str,
        density: float
    ) -> float:
        """Calculate weight of wing nut"""
        base_weight = self.calculate_hex_nut_weight(diameter, density)
        # Wings add approximately 50% more material
        return base_weight * 1.5
    
    def calculate_castle_nut_weight(
        self,
        diameter: str,
        density: float
    ) -> float:
        """Calculate weight of castle/slotted nut"""
        base_weight = self.calculate_hex_nut_weight(diameter, density)
        # Slots remove some material, but crown adds - net ~same
        return base_weight
    
    def calculate_thin_hex_nut_weight(
        self,
        diameter: str,
        density: float
    ) -> float:
        """Calculate weight of thin hex nut (jam nut)"""
        # About 60% height of regular nut
        return self.calculate_hex_nut_weight(diameter, density) * 0.6
    
    def calculate_plain_washer_weight(
        self,
        diameter: str,
        density: float
    ) -> float:
        """Calculate weight of plain/flat washer in grams"""
        dim = self.data_loader.get_dimension_for_diameter("plain_washer", diameter)
        if not dim:
            d = self._get_nominal_diameter(diameter)
            id_ = d * 1.05
            od = d * 2.0
            t = d * 0.15
        else:
            id_ = dim.get("inner_diameter", self._get_nominal_diameter(diameter) * 1.05)
            od = dim.get("outer_diameter", self._get_nominal_diameter(diameter) * 2.0)
            t = dim.get("thickness", self._get_nominal_diameter(diameter) * 0.15)
        
        # Annular disc volume
        volume_mm3 = (math.pi / 4) * ((od ** 2) - (id_ ** 2)) * t
        volume_cm3 = volume_mm3 / 1000
        
        return volume_cm3 * density
    
    def calculate_spring_washer_weight(
        self,
        diameter: str,
        density: float
    ) -> float:
        """Calculate weight of spring/lock washer"""
        dim = self.data_loader.get_dimension_for_diameter("spring_washer", diameter)
        if not dim:
            d = self._get_nominal_diameter(diameter)
            id_ = d * 1.02
            od = d * 1.8
            t = d * 0.25
        else:
            id_ = dim.get("inner_diameter", self._get_nominal_diameter(diameter) * 1.02)
            od = dim.get("outer_diameter", self._get_nominal_diameter(diameter) * 1.8)
            t = dim.get("thickness", self._get_nominal_diameter(diameter) * 0.25)
        
        # Approximate as split ring with rectangular cross-section
        mean_diameter = (od + id_) / 2
        width = (od - id_) / 2
        
        # Length of material in ring
        ring_length = math.pi * mean_diameter
        
        # Cross-section area
        cross_section = width * t
        
        volume_mm3 = ring_length * cross_section
        volume_cm3 = volume_mm3 / 1000
        
        return volume_cm3 * density
    
    def calculate_heavy_duty_washer_weight(
        self,
        diameter: str,
        density: float
    ) -> float:
        """Calculate weight of heavy duty washer"""
        # Heavy duty washers are ~1.5x thicker
        return self.calculate_plain_washer_weight(diameter, density) * 1.5
    
    def calculate_machine_screw_weight(
        self,
        diameter: str,
        length: float,
        density: float
    ) -> float:
        """Calculate weight of machine screw"""
        d = self._get_nominal_diameter(diameter)
        
        # Pan head or countersunk head
        head_d = d * 1.8
        head_h = d * 0.6
        
        # Shank
        shank_volume = (math.pi / 4) * (d ** 2) * length
        
        # Head (approximate as cone for countersunk, cylinder for pan)
        head_volume = (math.pi / 4) * (head_d ** 2) * head_h * 0.8
        
        total_volume_cm3 = (shank_volume + head_volume) / 1000
        
        return total_volume_cm3 * density
    
    def calculate_self_tapping_screw_weight(
        self,
        diameter: str,
        length: float,
        density: float
    ) -> float:
        """Calculate weight of self-tapping screw"""
        # Similar to machine screw
        return self.calculate_machine_screw_weight(diameter, length, density)
    
    def calculate_wood_screw_weight(
        self,
        diameter: str,
        length: float,
        density: float
    ) -> float:
        """Calculate weight of wood screw"""
        d = self._get_nominal_diameter(diameter)
        
        # Tapered shank - approximate as cone
        shank_volume = (math.pi / 12) * (d ** 2) * length
        
        # Countersunk head
        head_d = d * 2.0
        head_h = d * 0.5
        head_volume = (math.pi / 12) * (head_d ** 2) * head_h
        
        total_volume_cm3 = (shank_volume + head_volume) / 1000
        
        return total_volume_cm3 * density
    
    def calculate_set_screw_weight(
        self,
        diameter: str,
        length: float,
        density: float
    ) -> float:
        """Calculate weight of set screw (headless)"""
        d = self._get_nominal_diameter(diameter)
        
        # Simple cylinder (no head)
        volume_mm3 = (math.pi / 4) * (d ** 2) * length
        volume_cm3 = volume_mm3 / 1000
        
        return volume_cm3 * density
    
    def calculate_weight(
        self,
        fastener_type_id: str,
        material_id: str,
        diameter: str,
        length: Optional[float] = None,
        quantity: int = 1
    ) -> Dict:
        """
        Calculate weight for any fastener type
        
        Returns dict with unit_weight, total_weight, pieces_per_50kg
        """
        material = self.data_loader.get_material_by_id(material_id)
        if not material:
            raise ValueError(f"Unknown material: {material_id}")
        
        density = material["density"]
        
        fastener_type = self.data_loader.get_fastener_type_by_id(fastener_type_id)
        if not fastener_type:
            raise ValueError(f"Unknown fastener type: {fastener_type_id}")
        
        # Map fastener type to calculation method
        calc_methods = {
            "hex_bolt": self.calculate_hex_bolt_weight,
            "hex_bolt_full_thread": self.calculate_hex_bolt_full_thread_weight,
            "socket_head_cap_screw": self.calculate_socket_head_cap_screw_weight,
            "stud_bolt": self.calculate_stud_bolt_weight,
            "carriage_bolt": self.calculate_carriage_bolt_weight,
            "eye_bolt": self.calculate_eye_bolt_weight,
            "flange_bolt": self.calculate_flange_bolt_weight,
            "anchor_bolt": self.calculate_anchor_bolt_weight,
            "hex_nut": lambda d, dens: self.calculate_hex_nut_weight(d, dens),
            "lock_nut": lambda d, dens: self.calculate_lock_nut_weight(d, dens),
            "flange_nut": lambda d, dens: self.calculate_flange_nut_weight(d, dens),
            "wing_nut": lambda d, dens: self.calculate_wing_nut_weight(d, dens),
            "castle_nut": lambda d, dens: self.calculate_castle_nut_weight(d, dens),
            "thin_hex_nut": lambda d, dens: self.calculate_thin_hex_nut_weight(d, dens),
            "plain_washer": lambda d, dens: self.calculate_plain_washer_weight(d, dens),
            "spring_washer": lambda d, dens: self.calculate_spring_washer_weight(d, dens),
            "heavy_duty_washer": lambda d, dens: self.calculate_heavy_duty_washer_weight(d, dens),
            "machine_screw": self.calculate_machine_screw_weight,
            "self_tapping_screw": self.calculate_self_tapping_screw_weight,
            "wood_screw": self.calculate_wood_screw_weight,
            "set_screw": self.calculate_set_screw_weight,
        }
        
        calc_method = calc_methods.get(fastener_type_id)
        if not calc_method:
            raise ValueError(f"No calculation method for: {fastener_type_id}")
        
        # Calculate unit weight
        if fastener_type.get("has_length", True):
            if length is None:
                raise ValueError(f"Length required for {fastener_type_id}")
            unit_weight_grams = calc_method(diameter, length, density)
        else:
            unit_weight_grams = calc_method(diameter, density)
        
        # Calculate totals
        total_weight_kg = (unit_weight_grams * quantity) / 1000
        pieces_per_50kg = int(50000 / unit_weight_grams) if unit_weight_grams > 0 else 0
        
        return {
            "fastener_type": fastener_type["name"],
            "material": material["name"],
            "material_grade": material.get("grade"),
            "diameter": diameter,
            "length": length,
            "unit_weight_grams": round(unit_weight_grams, 3),
            "quantity": quantity,
            "total_weight_kg": round(total_weight_kg, 4),
            "pieces_per_50kg": pieces_per_50kg
        }
    
    def calculate_pieces_from_weight(
        self,
        fastener_type_id: str,
        material_id: str,
        diameter: str,
        length: Optional[float] = None,
        weight_kg: float = 50.0
    ) -> Dict:
        """
        Calculate number of pieces from given weight
        """
        # First get unit weight
        result = self.calculate_weight(
            fastener_type_id=fastener_type_id,
            material_id=material_id,
            diameter=diameter,
            length=length,
            quantity=1
        )
        
        unit_weight_grams = result["unit_weight_grams"]
        weight_grams = weight_kg * 1000
        
        pieces = int(weight_grams / unit_weight_grams) if unit_weight_grams > 0 else 0
        
        return {
            "fastener_type": result["fastener_type"],
            "material": result["material"],
            "material_grade": result.get("material_grade"),
            "diameter": diameter,
            "length": length,
            "unit_weight_grams": result["unit_weight_grams"],
            "input_weight_kg": weight_kg,
            "total_pieces": pieces,
            "pieces_per_50kg": result["pieces_per_50kg"]
        }


# Singleton instance
weight_calculator = WeightCalculator()


def get_weight_calculator() -> WeightCalculator:
    """Get singleton calculator instance"""
    return weight_calculator
