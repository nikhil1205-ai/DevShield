from .rule_engine import run_rule_engine

def analyze_schema(schema):

    rule_results = run_rule_engine(schema)
    return {
        "total_vulnerabilities": len(rule_results),
        "rule_engine_findings": rule_results,
    }
