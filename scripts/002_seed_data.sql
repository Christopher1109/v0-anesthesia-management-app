-- Insert sample supplies/insumos
INSERT INTO insumos (codigo, nombre, categoria, unidad_medida, stock_actual, stock_minimo, stock_critico, ubicacion) VALUES
('PROP-001', 'Propofol 10mg/ml', 'Anestésicos', 'Ampolla', 150, 50, 20, 'Refrigerador A'),
('FEN-001', 'Fentanilo 50mcg/ml', 'Opioides', 'Ampolla', 200, 80, 30, 'Caja Fuerte 1'),
('ATR-001', 'Atracurio 10mg/ml', 'Relajantes Musculares', 'Ampolla', 100, 40, 15, 'Estante B'),
('MID-001', 'Midazolam 5mg/ml', 'Benzodiazepinas', 'Ampolla', 180, 60, 25, 'Estante C'),
('SUC-001', 'Succinilcolina 50mg', 'Relajantes Musculares', 'Frasco', 75, 30, 10, 'Estante B'),
('ISO-001', 'Isoflurano', 'Anestésicos Inhalatorios', 'Frasco', 50, 20, 8, 'Gabinete D'),
('SEV-001', 'Sevoflurano', 'Anestésicos Inhalatorios', 'Frasco', 60, 25, 10, 'Gabinete D'),
('LID-001', 'Lidocaína 2%', 'Anestésicos Locales', 'Ampolla', 300, 100, 40, 'Estante E'),
('BUP-001', 'Bupivacaína 0.5%', 'Anestésicos Locales', 'Ampolla', 250, 80, 30, 'Estante E'),
('ADR-001', 'Adrenalina 1mg/ml', 'Vasopresores', 'Ampolla', 120, 50, 20, 'Refrigerador B'),
('EFE-001', 'Efedrina 50mg/ml', 'Vasopresores', 'Ampolla', 90, 40, 15, 'Estante F'),
('ATR-002', 'Atropina 1mg/ml', 'Anticolinérgicos', 'Ampolla', 110, 45, 18, 'Estante F'),
('SUX-001', 'Suxametonio', 'Relajantes Musculares', 'Ampolla', 8, 25, 10, 'Estante B'),
('REM-001', 'Remifentanilo 1mg', 'Opioides', 'Frasco', 18, 30, 12, 'Caja Fuerte 1'),
('DES-001', 'Desflurano', 'Anestésicos Inhalatorios', 'Frasco', 6, 15, 5, 'Gabinete D');
