from src.domain.chat.entity_extractor import extract_quantity, extract_material, validate_entry_completeness
from src.domain.chat.models import MaterialType


def test_extract_quantity_kg():
    assert extract_quantity("Bought 300kg PET") == 300.0


def test_extract_quantity_kilograms():
    assert extract_quantity("Received 150.5 kilograms") == 150.5


def test_extract_quantity_tons():
    assert extract_quantity("Processed 2 tons") == 2000.0


def test_extract_quantity_none():
    assert extract_quantity("some random text") is None


def test_extract_material_pet():
    assert extract_material("Bought PET from vendor") == MaterialType.PET


def test_extract_material_hdpe():
    assert extract_material("300kg HDPE received") == MaterialType.HDPE


def test_extract_material_none():
    assert extract_material("some random text") is None


def test_validate_completeness_missing_all():
    missing = validate_entry_completeness({})
    assert "material" in missing
    assert "quantity_kg" in missing


def test_validate_completeness_ok():
    missing = validate_entry_completeness({"material": "PET", "quantity_kg": 300})
    assert missing == []
