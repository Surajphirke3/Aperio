from src.shared.utils.json_parser import extract_json


def test_direct_json():
    result = extract_json('{"intent": "purchase"}')
    assert result == {"intent": "purchase"}


def test_json_in_code_block():
    raw = '```json\n{"intent": "query"}\n```'
    result = extract_json(raw)
    assert result == {"intent": "query"}


def test_json_with_surrounding_text():
    raw = 'Here is the result: {"material": "PET", "quantity_kg": 300} end.'
    result = extract_json(raw)
    assert result["material"] == "PET"
    assert result["quantity_kg"] == 300


def test_invalid_json_returns_empty():
    result = extract_json("not json at all")
    assert result == {}


def test_empty_string():
    result = extract_json("")
    assert result == {}
