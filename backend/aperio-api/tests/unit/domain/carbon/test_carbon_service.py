from src.domain.carbon.services import CarbonService


def test_calculate_pet():
    service = CarbonService()
    result = service.calculate(material="PET", quantity_kg=1000)
    assert result.total_co2_kg == 450.0  # 1000 * 0.45
    assert result.savings_vs_virgin_kg == 1700.0  # (2.15 - 0.45) * 1000
    assert result.savings_pct > 0


def test_calculate_unknown_material():
    service = CarbonService()
    result = service.calculate(material="UNKNOWN", quantity_kg=100)
    assert result.emission_factor == 0.43  # default factor
    assert result.total_co2_kg == 43.0


def test_get_material_factor():
    service = CarbonService()
    factor = service.get_material_factor("HDPE")
    assert factor.material == "HDPE"
    assert factor.co2_per_kg == 0.35
