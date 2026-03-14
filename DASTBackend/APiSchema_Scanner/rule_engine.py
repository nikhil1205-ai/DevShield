def run_rule_engine(schema):

    findings = []
    paths = schema.get("paths", {})

    for path, methods in paths.items():

        for method, details in methods.items():

            endpoint = f"{method.upper()} {path}"

            # 1️⃣ Missing Authentication
            if "security" not in details:
                findings.append({
                    "type": "Missing Authentication",
                    "severity": "HIGH",
                    "endpoint": endpoint
                })

            # 2️⃣ Sensitive Endpoint Exposure
            sensitive_keywords = ["admin", "internal", "debug", "config"]

            if any(word in path.lower() for word in sensitive_keywords):
                findings.append({
                    "type": "Sensitive Endpoint Exposure",
                    "severity": "HIGH",
                    "endpoint": endpoint
                })

            # 3️⃣ Dangerous HTTP Methods
            if method.lower() in ["delete", "put"]:
                findings.append({
                    "type": "Sensitive HTTP Method",
                    "severity": "MEDIUM",
                    "endpoint": endpoint
                })

            # 4️⃣ Parameter Validation
            parameters = details.get("parameters", [])

            for param in parameters:

                schema_info = param.get("schema", {})

                if schema_info.get("type") == "string":

                    if "maxLength" not in schema_info:
                        findings.append({
                            "type": "Weak Input Validation",
                            "severity": "MEDIUM",
                            "endpoint": endpoint,
                            "parameter": param.get("name")
                        })

            # 5️⃣ IDOR hints
            if "{id}" in path or "userId" in path:
                findings.append({
                    "type": "Possible IDOR Risk",
                    "severity": "MEDIUM",
                    "endpoint": endpoint
                })

    return findings